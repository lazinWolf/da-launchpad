#!/usr/bin/env node
// Content audit: lesson structure, placeholders, duplicate ids, references, internal links, counts.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, MODULES, walk, rel, readJsonCollection, readMdx } from './lib.mjs';

const HEADINGS = ['Learning objectives', 'Why this matters for a Data Analyst job', 'Concept', 'Worked examples', 'Common mistakes', 'Practice questions', 'Mini quiz', 'Interview angle', 'Key takeaways', 'Further reading'];
const PLACEHOLDER = /\b(lorem ipsum|lorem|TODO|coming soon|TBD)\b|\[FILL\]/i;
const problems = [];
const warn = (where, msg) => problems.push(`${where}: ${msg}`);

const links = JSON.parse(readFileSync(join(ROOT, 'src/data/links.json'), 'utf8'));
const linkIds = new Set(links.map((l) => l.id));

// ---- JSON collections
const jsonNames = ['practice', 'interview', 'flashcards', 'glossary', 'mcq', 'tests'];
const col = {};
const idOwner = new Map();
for (const n of jsonNames) {
  col[n] = [];
  for (const f of readJsonCollection(n)) {
    if (!f.isArray) warn(rel(f.file), 'must be a JSON array');
    for (const it of f.items) {
      col[n].push({ ...it, _file: rel(f.file) });
      const key = it.id;
      if (!key) { warn(rel(f.file), 'item without id'); continue; }
      const prev = idOwner.get(`${n}:${key}`);
      if (prev) warn(rel(f.file), `duplicate id "${key}" in ${n} (also ${prev})`);
      else idOwner.set(`${n}:${key}`, rel(f.file));
      if (PLACEHOLDER.test(JSON.stringify(it)) && !/sample/i.test(rel(f.file))) warn(rel(f.file), `placeholder text in "${key}"`);
    }
  }
}
// ids must also be unique across all collections (except tests referencing others)
const global = new Map();
for (const n of ['practice', 'interview', 'flashcards', 'glossary', 'mcq']) {
  for (const it of col[n]) {
    if (global.has(it.id) && global.get(it.id) !== n) warn(it._file, `id "${it.id}" is used in both ${global.get(it.id)} and ${n}`);
    global.set(it.id, n);
  }
}
const qIds = new Set([...col.practice, ...col.mcq, ...col.interview].map((q) => q.id));
for (const t of col.tests) for (const id of t.questionIds ?? []) if (!qIds.has(id)) warn(t._file, `test "${t.id}" references unknown question "${id}"`);
for (const g of col.glossary) for (const r of g.related ?? []) if (!col.glossary.some((x) => x.id === r || x.term === r)) warn(g._file, `glossary "${g.id}" related "${r}" not found`);

// ---- MDX collections
const lessons = walk(join(ROOT, 'src/content/lessons'), '.mdx');
const lessonRoutes = new Set();
const lessonData = lessons.map((file) => {
  const m = readMdx(file);
  const module = m.fm.module ?? file.split('/').slice(-2)[0];
  const slug = file.split('/').pop().replace(/\.mdx$/, '');
  lessonRoutes.add(`/${module}/${slug.replace(/^\d+-/, "")}/`);
  return { file, ...m, module, slug };
});
const other = [...walk(join(ROOT, 'src/content/projects'), '.mdx'), ...walk(join(ROOT, 'src/content/cases'), '.mdx')].map((file) => ({ file, ...readMdx(file) }));
const projectIds = other.filter((o) => o.file.includes('/projects/')).map((o) => o.fm.id).filter(Boolean);
for (const o of other) if (PLACEHOLDER.test(o.raw) && !/sample/i.test(o.file)) warn(rel(o.file), 'placeholder text');

const staticRoutes = new Set(['/', '/profile/', '/practice/', '/bookmarks/', '/playground/', '/datasets/', '/404/']);
for (const m of MODULES) staticRoutes.add(`/${m}/`);
for (const p of projectIds) staticRoutes.add(`/projects/${p}/`);
for (const o of other.filter((x) => x.file.includes('/cases/'))) staticRoutes.add(`/business/cases/${o.file.split('/').pop().replace(/\.mdx$/, '')}/`);
try {
  const ds = JSON.parse(readFileSync(join(ROOT, existsSync(join(ROOT, 'src/data/datasets.json')) ? 'src/data/datasets.json' : 'src/data/datasets.test.json'), 'utf8'));
  for (const d of ds) staticRoutes.add(`/datasets/${d.id}/`);
} catch { /* datasets optional */ }
try { for (const t of JSON.parse(readFileSync(join(ROOT, 'src/data/tools.json'), 'utf8'))) if (t.enabled) staticRoutes.add(`/tools/${t.slug ?? t.id}/`); } catch { /* optional */ }

const allMdx = [...lessonData, ...other];
const practiceByTopic = (topic, module) => col.practice.filter((q) => q.topic === topic && (!module || q.module === module));
for (const l of lessonData) {
  const w = rel(l.file);
  const draft = /^draft:\s*true/m.test(l.raw.split('\n---')[0]);
  if (!draft) {
    const h2 = [...l.body.replace(/```[\s\S]*?```/g, '').matchAll(/^## (.+?)\s*$/gm)].map((x) => x[1]);
    if (h2.join('|') !== HEADINGS.join('|')) warn(w, `H2 headings must be exactly, in order: ${HEADINGS.join(' / ')}. Found: ${h2.join(' / ') || '(none)'}`);
    if (PLACEHOLDER.test(l.body)) warn(w, 'placeholder text');
    if (l.fm.module && l.fm.module !== l.file.split('/').slice(-2)[0]) warn(w, `frontmatter module "${l.fm.module}" does not match folder`);
  }
}
for (const f of allMdx) {
  const w = rel(f.file);
  const body = f.body;
  for (const m of body.matchAll(/<FurtherReading[^>]*ids=\{\[([^\]]*)\]\}/g)) {
    for (const id of [...m[1].matchAll(/["']([^"']+)["']/g)].map((x) => x[1])) if (!linkIds.has(id)) warn(w, `FurtherReading id "${id}" not in src/data/links.json`);
  }
  for (const m of body.matchAll(/<PracticeSet\b([^>]*)\/?>/g)) {
    const a = m[1];
    const ids = a.match(/ids=\{\[([^\]]*)\]\}/);
    const topic = a.match(/topic=["']([^"']+)["']/);
    const mod = a.match(/module=["']([^"']+)["']/);
    if (ids) {
      for (const id of [...ids[1].matchAll(/["']([^"']+)["']/g)].map((x) => x[1])) if (!col.practice.some((q) => q.id === id)) warn(w, `PracticeSet id "${id}" not found`);
    } else if (topic) {
      if (!practiceByTopic(topic[1], mod?.[1]).length) warn(w, `PracticeSet topic "${topic[1]}"${mod ? ` (module ${mod[1]})` : ''} has no questions`);
    } else warn(w, 'PracticeSet needs topic or ids');
  }
  const targets = [...body.matchAll(/\]\((\/[^)\s]*)\)/g)].map((x) => x[1]).concat([...body.matchAll(/href=["'](\/[^"']*)["']/g)].map((x) => x[1]));
  for (const t of targets) {
    let p = t.split('#')[0].split('?')[0];
    if (!p || /\.[a-z0-9]+$/i.test(p)) continue; // files (downloads) are not routes
    if (!p.endsWith('/')) p += '/';
    if (!staticRoutes.has(p) && !lessonRoutes.has(p)) warn(w, `broken internal link ${t}`);
  }
}

// ---- counts
const tally = (arr, k) => arr.reduce((o, x) => ((o[x[k]] = (o[x[k]] ?? 0) + 1), o), {});
const counts = {
  collections: {
    lessons: lessonData.length, lessonsPublished: lessonData.filter((l) => !/^draft:\s*true/m.test(l.raw.split('\n---')[0])).length,
    practice: col.practice.length, interview: col.interview.length, flashcards: col.flashcards.length, glossary: col.glossary.length,
    mcq: col.mcq.length, tests: col.tests.length, projects: projectIds.length, cases: other.length - projectIds.length,
  },
  lessonsByModule: tally(lessonData.map((l) => ({ module: l.module })), 'module'),
  practiceByModule: tally(col.practice, 'module'),
  practiceByDifficulty: tally(col.practice, 'difficulty'),
  practiceByLanguage: tally(col.practice, 'language'),
  mcqByModule: tally(col.mcq, 'module'),
  interviewByCategory: tally(col.interview, 'category'),
};
mkdirSync(join(ROOT, 'reports'), { recursive: true });
writeFileSync(join(ROOT, 'reports/counts.json'), JSON.stringify(counts, null, 2) + '\n');
console.log(JSON.stringify(counts, null, 2));

if (problems.length) {
  console.error(`\n${problems.length} problem(s):`);
  for (const p of problems) console.error(' - ' + p);
  process.exit(1);
}
console.log('\nAudit passed.');
