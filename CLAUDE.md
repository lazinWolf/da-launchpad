# DA Launchpad: content and framework guide

Product spec: `master_prompt.md`. Stack: Astro static, MDX, React islands, Tailwind v4, Pagefind, sql.js (wasm in `public/`), Pyodide (lazy, CDN), hand-written service worker.

## Rules
- Original content only. Simple English, short sentences. India-flavored fictional data (names, cities, INR). No placeholders: lorem, TODO, TBD, coming soon, [FILL] are flagged by audit.
- Parallel agents edit ONLY their assigned files. Never touch `scripts/generate_data/**`, `public/data/**`, `src/data/datasets.json` unless assigned.
- Sample files (names contain `sample`, ids start `sample-`) are deletable.
- Internal links are root-relative with trailing slash (`/sql/select/`); the site adds the base path. Never hardcode a base.

## Folder map
- `src/content/lessons/<module>/<NN-slug>.mdx` lessons (route `/<module>/<slug>/`; the NN- prefix is stripped from the URL, e.g. 13-joins-inner-left.mdx → `/sql/joins-inner-left/`)
- `src/content/practice/<module>/<topic>.json`, `interview/<category>.json`, `flashcards/*.json`, `glossary/*.json`, `mcq/*.json`, `tests/*.json` (JSON arrays)
- `src/content/projects/*.mdx`, `src/content/cases/*.mdx`
- `src/data/` plan.json, profile.json, links.json, tools.json, datasets.json
- `src/components/mdx/` MDX components; `src/components/react/` islands; `src/lib/` progress store, runners, comparator
- `scripts/` validate.mjs, audit.mjs, py_harness.py, gen-sw.mjs
- Modules in order: start-here, excel, sql, power-bi, python, statistics, business, interview, projects, job-search, cheat-sheets

## Schemas (see `_sample*.json` / sample mdx for working examples)
Lesson frontmatter: title, description, module, order, estimatedMinutes, objectives[], tags[], draft?
```
---
title: "Filtering rows with WHERE"
description: "Pick only the rows you need."
module: sql
order: 3
estimatedMinutes: 25
objectives: ["Filter with WHERE", "Combine conditions"]
tags: ["sql", "filtering"]
---
```
Practice entry (array element):
```
{ "id": "sql-where-001", "module": "sql", "topic": "where", "difficulty": "easy", "language": "sql",
  "question": "List customers from Pune. Return `name`, `city`.", "dataset": "ecommerce",
  "hint": "Filter with WHERE.", "solutionSql": "SELECT name, city FROM customers WHERE city='Pune'",
  "expectedOutput": { "columns": ["name","city"], "rows": [["Asha","Pune"]] }, "orderMatters": false,
  "explanation": "WHERE keeps matching rows.", "commonMistake": "Using double quotes for text.",
  "interviewFrequency": "high", "estimatedMinutes": 3, "tags": ["where"] }
```
language: sql (needs solutionSql), python (needs solutionCode, assigns `result`), excel/dax/text (need `solution` md; expectedOutput optional, `{value}` allowed). dataset is a dataset id or "none". Ids are globally unique.
Interview: `{id, category, question, whatInterviewerIsTesting, modelAnswer, followUps[], commonMistakes[], difficulty}`.
Flashcard: `{id, topic, front, back}`. Glossary: `{id, term, definition, example?, related?[]}`.
MCQ: `{id, module, topic, section?, difficulty, question, options[], answerIndex, explanation, shortcut?}`.
Test: `{id, title, durationMinutes, questionIds[]}` (ids from practice/mcq/interview).
Project MDX frontmatter: id, title, businessProblem, datasetDescription, skillsUsed[], steps[], deliverables[], readmeTemplate, interviewTalkingPoints[], extensions[], estimatedHours, order?, draft?; body is the build guide.
Case MDX: title, industry, difficulty, type (case-study|mock-case|take-home), estimatedMinutes, draft?.
Datasets: `src/data/datasets.json` (falls back to datasets.test.json). Links for FurtherReading: `src/data/links.json` `{id,title,url,note}` (stable official/home pages only).

## MDX components (no imports needed)
`<Tip>`, `<Warning>`, `<InterviewAlert>`, `<RealWorld>`, `<CommonMistake>` (body markdown);
`<PracticeSet topic="where" module="sql" />` or `<PracticeSet ids={["a","b"]} />` (optional `difficulty`);
`<Quiz questions={[{ q, options: [...], answer: 0, explanation }]} />`;
`<InterviewQ q="Question text">markdown answer</InterviewQ>`;
`<FurtherReading ids={["sqlbolt"]} />`; `<SqlPlayground dataset="ecommerce" query="SELECT 1;" title? />`;
`<FormulaCard title="Mean">body</FormulaCard>`; `<Mermaid chart={`...`} caption? />`; `<Download href="/data/x.zip" label="Get zip" />`.
Notes box and "Mark lesson complete" are appended automatically.

## Lesson template
Non-draft lessons need exactly these H2s in order:
Learning objectives; Why this matters for a Data Analyst job; Concept; Worked examples; Common mistakes; Practice questions; Mini quiz; Interview angle; Key takeaways; Further reading.
Skeleton: objectives bullets; `<RealWorld>` in "Why"; `<Tip>`/`<FormulaCard>` in Concept; `<SqlPlayground>` in Worked examples; `<CommonMistake>`; `<PracticeSet topic module />`; `<Quiz>`; `<InterviewAlert>` plus `<InterviewQ>`; takeaways bullets; `<FurtherReading ids />`. See `src/content/lessons/start-here/00-sample.mdx`.

## Practice conventions
- SQL runs in SQLite (sql.js). Flag differences from MySQL/Postgres in the explanation (e.g. no ILIKE, no DATE_TRUNC; use strftime).
- Keep results at most 50 rows (use LIMIT). Use a deterministic ORDER BY whenever orderMatters is true.
- Python: pandas; `load("ecommerce", "orders")` returns a DataFrame; assign the answer to `result` (DataFrame, Series, scalar, list or dict).
- Numeric comparison tolerance 1e-6; rows compared order-insensitively unless orderMatters.

## Commands
- `npm run validate` runs all SQL/Python solutions against `public/data/sqlite`. Flags: `--file <path>`, `--only sql|python`, `--fill` (writes missing expectedOutput, prints what was filled; review it). Python uses `.venv/bin/python` if present.
- `npm run audit` checks headings, placeholders, duplicate ids, FurtherReading and PracticeSet refs, internal links; writes `reports/counts.json`.
- `npm run build` = astro build + pagefind + service-worker precache. `INCLUDE_DRAFTS=1` includes draft pages. `SITE_BASE=/x/` sets base.
- Tool pages (flashcards, tracker, resume, mock interview, aptitude, glossary, sql tests) will live at `/tools/<name>/`; list them in `src/data/tools.json` with `enabled: true` only when built. Nothing links to them until then.

## Quality checklist
Headings exact; every PracticeSet resolves; validate passes; audit passes; explanations simple; mistakes realistic; Indian context; no copied text; links only from links.json.
