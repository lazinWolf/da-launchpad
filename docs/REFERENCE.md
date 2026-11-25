# DA Launchpad: Course Reference

Last updated: 2026-11-26

Counts come from `reports/counts.json` (refreshed by `npm run audit` on this date). Anything not checked this session is marked as such.

## Contents

1. Purpose and goals
2. Course features
3. Curriculum and learning path
4. Core definitions and how they relate
5. Tech stack
6. Content storage, URLs and datasets
7. Quality standards
8. Deployment
9. Status versus spec
10. Glossary

---

## 1. Purpose and goals

DA Launchpad is a personal, static, offline-capable study, practice and job-prep website. It is meant to be the only resource a fresher needs to go from zero to a job-ready Data Analyst in India. All teaching text is simple English.

**Learner.**
- 2027 B.Tech CSE (Core) graduate with basic coding skills.
- Studies 5 to 6 hours a day.
- Wants a Data Analyst job as fast as possible.
- Long-term path: Data Engineer or Analytics Engineer within 2 to 3 years.
- Target: any city in India, or remote.
- Industry priority: fintech, then health, then consulting, then others.

The learner's profile is stored in `src/data/profile.json` and in the browser (Profile page). The HR module uses it to personalise answers.

**What "done" means (spec section 10).**
- `npm run build` works, and `npm run dev` runs the site.
- The site deploys to GitHub Pages with documented steps.
- All modules reach the required depth and counts.
- Every SQL and Python solution passes validation.
- Dashboard, tracker, mock interview, resume builder, flashcards and search work offline on mobile and desktop.
- A new learner can finish the site alone and reach interview-ready.

---

## 2. Course features

Status key: **Built** = code exists and was checked at least by the gates. **Partly** = code exists, but a part is missing or not yet checked in a browser. **Not built** = no page or UI yet.

| Feature | Status | Notes |
|---|---|---|
| Home dashboard | Built | Today's task from the 12-week plan, progress ring, per-module bars, weekly hours chart, upcoming revision cards, quick links. |
| Progress tracking | Built | Per-lesson and per-question completion with timestamps. Stored in localStorage. |
| Study streak and hours | Built | Streak counter and daily hours. Weekly goal shown on the chart. |
| Notes | Built | Notes box on each lesson. Exported with progress. |
| Bookmarks | Built | Bookmark page at `/bookmarks/`. |
| Search (Ctrl/Cmd+K) | Built | Pagefind index built at `npm run build`. |
| SQL playground | Built | Run, hint, solution and compare. sql.js (SQLite in WebAssembly). |
| Python runner | Built, not browser-tested | Pyodide 0.27.7 with pandas, loaded lazily from a CDN on Python pages. |
| Practice hub | Built | Filter by module and difficulty at `/practice/`. |
| Mini quiz per lesson | Built | Five MCQs with explanations. |
| Weak-topic detector | Partly | The logic exists in the progress store. No dedicated UI found. |
| Spaced repetition | Partly | Leitner logic exists in the progress store. No flashcard review page yet. |
| Profile page | Built | Stores profile values locally. Study start date. |
| Progress export and import | Built | JSON export and import buttons. |
| Dark and light mode | Built | Follows the system setting by default. |
| Print styles | Built (CSS) | Print rules exist. No printable cheat sheets written yet. |
| PWA and offline | Built, offline not checked | Service worker and manifest. Precache built at `npm run build`. |
| Dataset pages | Built | Data dictionary, relationships and ER diagram per dataset, with downloads. |
| SQL screening tests | Built | 10 timed tests, 5 questions each, 45 minutes. At `/tools/sql-tests/`. |
| Aptitude practice | Built | 320 timed MCQs across quant, logic, data and verbal. At `/tools/aptitude/`. |
| Statistics MCQs | Built | Timed practice. At `/tools/mcq/`. |
| Mock interview | Built, not browser-checked | Timer, self-rating, score history. At `/tools/mock-interview/`. |
| Interview question banks | Built | 475 items in 8 categories at `/interview/banks/`. |
| Flashcards (500+) | Not built | One sample item only. |
| Glossary (300+) | Not built | One sample item only. |
| Application tracker | Not built | Planned: add, edit, status, reminders, CSV export. |
| Resume builder | Not built | Planned: printable one-page output from the profile. |
| Personalised HR answers | Built | 60 HR and behavioural answers built from the learner profile, each with an "Adapt:" tip. |
| Business case pages | Partly | Route exists. No real cases yet. |
| Project pages | Partly | Route exists. One sample project only. |

Tool pages appear in `src/data/tools.json` only when enabled. Five are enabled. Nothing links to a tool page until it is listed there.

---

## 3. Curriculum and learning path

### 3.1 Modules (11, in order)

Module list: `src/lib/modules.ts`. Lesson routes drop the `NN-` prefix (see section 6.2).

| # | Module | Route | Published lessons | Practice items | Status |
|---|---|---|---|---|---|
| 0 | Start Here | `/start-here/` | 6 | 33 | Built |
| 1 | Excel | `/excel/` | 16 | 58 | Built, 6 practice workbooks |
| 2 | SQL | `/sql/` | 42 | 209 | Built, 10 screening tests |
| 3 | Power BI | `/power-bi/` | 19 | 83 | Built, 3 walkthroughs, practical test |
| 4 | Python | `/python/` | 20 | 130 | Built, 8 notebooks |
| 5 | Statistics | `/statistics/` | 17 | 170 | Built, 136 MCQs |
| 6 | Business Thinking | `/business/` | 0 | 0 | Planned: 14 lessons, 25 case studies |
| 7 | Interview Prep | `/interview/` | 0 hub lessons | 0 hub items | Banks built. Hub lessons and 10 mock cases planned. |
| 8 | Projects | `/projects/` | 0 | n/a | Planned: 8 projects |
| 9 | Job Search | `/job-search/` | 0 | 0 | Planned |
| 10 | Cheat Sheets | `/cheat-sheets/` | 0 | n/a | Planned: printable one-pagers, glossary, flashcards |

Lesson totals: 121 files, 120 published, 1 draft. Practice total: 683 items. Interview bank items: 475 real (plus 1 sample). MCQs: 456 real (plus 1 sample).

Practice difficulty by module (from `reports/quality.json`, generated 2026-11-24, so start-here may differ by 3 items from counts.json):

| Module | Easy | Medium | Hard |
|---|---|---|---|
| start-here | 12 | 12 | 6 |
| excel | 20 | 27 | 11 |
| sql | 71 | 81 | 57 |
| power-bi | 27 | 38 | 18 |
| python | 42 | 49 | 39 |
| statistics | 46 | 85 | 39 |

Practice language mix (counts.json): SQL 205, Python 230, Excel 59, text 139, DAX 50. Only SQL and Python items are run by the validator (435 items). Text, Excel and DAX items are checked by review.

Interview bank categories (counts.json): SQL 100, Python 80, Excel 60, Power BI 60, Statistics 60, HR 60, Data warehousing 30, Hybrid 25.

### 3.2 The 12-week plan

- Source: `src/data/plan.json`. 36 entries, one per day in weeks 1 to 4 (28 entries) and one per week in weeks 5 to 12 (8 entries). This split is derived from the count.
- Each entry has `week`, `day`, `title`, `tasks`, `links` and `hours`. Hours are a range matched to the learner's 5 to 6 hour day.
- The dashboard shows today's entry.
- Week 1 starts with the role, tool setup and first SQL queries. Later weeks cover SQL depth, Excel, Power BI, Python, statistics, interview preparation, project polish and applications. Week 12 is a final mock week.

### 3.3 Learning path

The intended order of study follows the module order above, with SQL as the deepest module:

1. **Start Here.** Role, job market, plan and study method.
2. **SQL, then Excel.** Core skills for the first job. SQL is built first because it is the most tested skill.
3. **Power BI.** Turn analysis into dashboards.
4. **Python and Statistics.** Deeper analysis and A/B testing.
5. **Business Thinking.** Metrics and case studies.
6. **Interview Prep.** Each round in one place.
7. **Projects and Job Search.** Portfolio, resume, applications.
8. **Cheat Sheets.** Revision.

Each lesson is designed to be practised right away. Practice, quizzes and the SQL playground appear inside the lesson.

### 3.4 Lesson template (10 sections)

Every non-draft lesson has these H2 headings, in this order. The audit checks them.

1. Learning objectives
2. Why this matters for a Data Analyst job
3. Concept
4. Worked examples
5. Common mistakes
6. Practice questions
7. Mini quiz
8. Interview angle
9. Key takeaways
10. Further reading

How a lesson teaches:
- Objectives set the goal (from frontmatter).
- "Why this matters" links the topic to a real job task.
- Concept explains the idea with an analogy. Tips and formulas are shown in callouts.
- Worked examples run on the fictional datasets, with output shown.
- Common mistakes name the error and its effect.
- Practice uses a practice set with hint, solution and "mark as done".
- The mini quiz checks the main points, with explanations.
- Interview angle shows real questions with model answers.
- Takeaways restate the five key points.
- Further reading links to official pages from `links.json`.

### 3.5 Content types

| Type | What it is |
|---|---|
| Lesson | Teaching page with the 10-section template. |
| Practice item | A question with a solution, expected output, hint and explanation. |
| Interview item | A question with what the interviewer tests, a model answer, follow-ups and common mistakes. |
| MCQ | A multiple-choice question with an answer index and explanation. Used by aptitude, statistics and mock tools. |
| Test | A timed set of item ids, used by the SQL screening tests. |
| Flashcard | A front and back card for spaced review. |
| Glossary term | A term, definition, optional example and related terms. |
| Case | A business or mock case study with a type (case-study, mock-case or take-home). |
| Project | A portfolio build guide with business problem, steps, deliverables and interview talking points. |

---

## 4. Core definitions and how they relate

### 4.1 Entities

- **Module.** One of 11 sections. Has a slug, title and blurb. Owns lessons, and its practice is grouped under it.
- **Lesson.** A page in one module. Fields: title, description, module, order, estimated minutes, objectives, tags, and an optional draft flag.
- **Practice item.** One question with an id, module, topic, difficulty (easy, medium or hard), language (sql, python, excel, dax or text), question text, dataset id or `none`, hint, solution, optional expected output, explanation, common mistake, interview frequency, estimated minutes and tags.
- **PracticeSet.** The block inside a lesson that lists practice items. It selects items by topic and module, or by an explicit id list. Every id must exist.
- **Dataset.** One of 7 fictional databases. Each comes as SQLite (for the playground and validation), CSV (for Excel and Power BI), and a zip.
- **Interview item.** A question with what the interviewer is testing, a model answer, follow-ups and common mistakes.
- **MCQ.** Question, options, the index of the right option, and an explanation.
- **Test.** Title, duration and a list of item ids. The ids must point to existing practice, MCQ or interview items.
- **Flashcard and glossary term.** Simple text records for revision.
- **Project.** Problem, dataset description, skills, steps, deliverables, README template, interview talking points and extensions.
- **Link.** An id, title, URL and note. Only stable official or home pages. Lessons refer to links by id only.

### 4.2 Relationships

```
Module
 ├── Lesson
 │     ├── PracticeSet  ──►  Practice items  ──►  Dataset (SQLite or CSV)
 │     ├── Quiz (inline MCQs)
 │     ├── Interview angle (inline questions)
 │     └── Further reading  ──►  Link (by id)
 └── Practice items (grouped by topic)

Test  ──►  Practice items, MCQs or interview items (by id)
Interview bank  ──►  Interview hub and banks page (by category)
Plan day  ──►  Dashboard "today" card (by week and day)
Progress store (in the browser)  ──►  completion, notes, bookmarks,
                                      streak, hours, mock history, profile
```

Rules:
- Ids are unique across all content types. A duplicate id breaks links and tests.
- Tests and practice sets only reference ids that exist.

### 4.3 Progress data

All learner data stays in the browser (localStorage). It holds lesson and practice completion, notes, bookmarks, streak and hours, mock-test history and profile values. It can be exported to a JSON file and imported again. Nothing is sent to a server.

---

## 5. Tech stack

| Layer | Tool | Why |
|---|---|---|
| Site generator | Astro 7, static output | Fast pages with no server. Free to host on GitHub Pages. |
| Lesson content | MDX | Prose with interactive components inside. |
| Structured content | JSON collections, validated by schemas | Practice and banks stay as data, checked by schemas in `src/content.config.ts`. |
| Interactive widgets | React 19 islands | Only the widgets ship JavaScript. |
| Styling | Tailwind CSS v4 | Consistent design, dark mode through CSS variables. |
| Search | Pagefind | Full-text search built after the site. No server. |
| SQL in the browser | sql.js (SQLite in WebAssembly) | Real SQLite queries in the learner's browser. |
| Python in the browser | Pyodide 0.27.7, lazy-loaded from a CDN | Real pandas, only on pages that need it. |
| Offline use | Hand-written service worker and web manifest | Works on a phone after the first visit. |
| Diagrams | Mermaid | ER diagrams and flows in lessons. |
| Datasets | Python generators with a fixed seed | The same data every build. |
| Hosting | GitHub Pages through GitHub Actions | Free. Deploys on each push to the main branch. |

### 5.1 SQL dialect

The course teaches and runs SQLite. Where MySQL or PostgreSQL differ, the lesson says so. Examples:
- No `ILIKE`. Use `LIKE` or `LOWER(col) LIKE`.
- No `DATE_TRUNC`. Use `strftime('%Y-%m', date_col)`.
- Dates are text in the form `YYYY-MM-DD`.
- Booleans are 0 and 1.
- Lesson 12 of the SQL module covers the full comparison table.

---

## 6. Content storage, URLs and datasets

### 6.1 Repo map (course-facing)

| Location | What it holds |
|---|---|
| `src/content/lessons/<module>/` | Lessons, one MDX file each, named `NN-slug.mdx`. |
| `src/content/practice/<module>/` | Practice items as JSON arrays, one file per topic. |
| `src/content/interview/` | Interview banks as JSON arrays, by category. |
| `src/content/mcq/` | MCQ sets for aptitude and statistics. |
| `src/content/tests/` | Timed test definitions. |
| `src/content/cases/`, `src/content/projects/` | Case and project pages. |
| `src/content/flashcards/`, `src/content/glossary/` | Revision content (sample only so far). |
| `src/data/` | Plan, profile, links, tools and dataset metadata. |
| `src/components/mdx/` | Lesson components: Tip, Warning, InterviewAlert, RealWorld, CommonMistake, PracticeSet, Quiz, InterviewQ, FurtherReading, SqlPlayground, FormulaCard, Mermaid, Download. |
| `src/components/react/` | Interactive widgets: dashboard, playground, practice hub, quizzes, mock interview, SQL tests, profile and progress tools. |
| `src/pages/` | Site routes. |
| `src/lib/` | Progress store, SQL and Python runners, module list, content loaders. |
| `public/data/` | Datasets as SQLite, CSV, zip, and 6 Excel workbooks. |
| `public/downloads/` | Starter notebooks (8 `.ipynb`) and the EDA checklist. |
| `docs/` | Project documents, including this file. |

### 6.2 URL rules

- Lesson routes drop the `NN-` prefix. `sql/13-joins-inner-left.mdx` becomes `/sql/joins-inner-left/`.
- Internal links are root-relative with a trailing slash, for example `/sql/select/`.
- The base path is added by the site from the build setting. Content never hardcodes it.
- External links come only from `src/data/links.json` (40 entries).

### 6.3 Datasets

Seven fictional, India-flavoured datasets. Money is in INR. Names are invented.

| Id | Title | Tables | What it covers |
|---|---|---|---|
| `ecommerce` | DesiCart Marketplace | 6 | Customers, orders, items, payments, returns. Two years, with Diwali spikes. |
| `food_delivery` | ThaliDash | 5 | Restaurants, partners, deliveries, ratings, promos. Delays and ratings. |
| `hr` | Nirmaan Technologies | 5 | Employees, departments, salaries, attrition, reviews. Attrition and pay. |
| `fintech` | UPI-style payments | 4 | Users, merchants, transactions, failed transactions. Failure rates and outages. |
| `subscription` | Kahani+ Streaming | 3 | Users, subscriptions, events. Funnel, retention and churn. |
| `marketing` | ShopSetu Campaigns | 5 | Campaigns, spend, clicks, conversions, A/B test. ROAS and test results. |
| `retail` | Vasudha Retail | 4 | Stores, sales, inventory, targets. Trends and stockouts. |

Total: 32 tables.

**Deliberate messiness.** The data has real-world problems for cleaning practice:
- Exact duplicate rows, so ids are not unique keys.
- Inconsistent text case and spaces in cities, device names and codes.
- NULLs, some by design (for example, P2P payments have no merchant) and some by error.
- 100x outliers in money columns.
- Mixed date formats and rupee-symbol text in the CSV files. The SQLite files hold the clean values.

Each dataset's data dictionary page lists the exact issues and their rates.

---

## 7. Quality standards

The course promises these things to the learner:

- **Every SQL and Python solution runs.** `npm run validate` runs each solution against the SQLite files and compares the result with the expected output.
- **Every number is computed.** Counts, outputs and percentages in content come from running code or from a data query. None are typed by hand.
- **Every lesson has the full template.** The audit checks the 10 headings.
- **No placeholder text.** Lorem, TODO, TBD, "coming soon" and `[FILL]` are flagged.
- **Every link is vetted.** Links come only from `links.json`.
- **Every practice id exists.** Lessons and tests reference only ids that exist.
- **MDX compiles.** Each lesson compiles on its own.

### Quality checks

| Check | What it does |
|---|---|
| `npm run validate` | Runs all runnable SQL and Python solutions against the datasets. Options: `--file`, `--only sql\|python`, `--fill`. |
| `npm run audit` | Checks headings, placeholders, duplicate ids, references and internal links. Writes counts. |
| `npm run check:mdx` | Compiles each lesson file to catch bad markup. |
| `npx astro sync` | Checks all content against its schema. |
| `npm run build` | Builds the site, the search index and the offline cache. |

Other scripts exist for maintenance and are not part of the learner-facing product.

---

## 8. Deployment

- **Live site:** https://lazinwolf.github.io/da-launchpad/
- **Trigger:** every push to the main branch, or a manual run.
- **Steps:** install, run the audit, build the site with the repo name as the base path, upload the build, deploy to GitHub Pages.
- **Base path:** `SITE_BASE` sets it (for example `/da-launchpad/`). The default is `/` for local use.
- **Local preview:** `npm run build && npx astro preview`. Set `SITE_BASE=/da-launchpad/` to match the live path.
- **Development:** `npm run dev`.
- **Offline cache:** built with the site. Large data files and the Python runtime are cached on first use.

---

## 9. Status versus spec

Modules 0 to 5 have content and checks passing. Modules 6 to 10 and the interview hub lessons are still to be written.

| Spec target | Current | Status |
|---|---|---|
| SQL practice 200+ (about 70 easy, 80 medium, 50 hard) | 209 (71, 81, 57) | Met |
| SQL screening tests: 10 | 10 | Met |
| Excel practice 40+ | 58 | Met |
| Power BI DAX practice 40+ | 50 DAX items | Met |
| Python practice 120+ | 130 | Met |
| Statistics MCQs 100+ | 136 real | Met |
| Statistics practice (10 per concept) | 170 | Met |
| Interview SQL 100+, Excel 60+, Power BI 60+, Python 80+, Statistics 60+, data warehousing 30+, HR 60+ | 100, 60, 60, 80, 60, 30, 60 | Met |
| Aptitude 300+ | 320 | Met |
| Interview hub lessons (8) | 0 | Open |
| Mock cases (10) | 0 | Open |
| Business case studies (25) and lessons (14) | 0 | Open |
| Projects (8) | 0 | Open |
| Glossary (300+) and flashcards (500+) | 0 (one sample each) | Open |
| Cheat sheets (9) | 0 | Open |
| Job search toolkit (resume, LinkedIn, GitHub, tracker, roadmap) | 0 | Open |
| Lighthouse 90+ on key pages | Not run | Open |
| Browser checks of tool pages, Python runner and offline mode | Not run | Open |

---

## 10. Glossary

| Term | Meaning |
|---|---|
| Module | One of the 11 course sections, for example SQL or Power BI. |
| Lesson | A teaching page with the 10-section template. |
| Practice item | A question with a solution that the course checks by running it. |
| PracticeSet | The block in a lesson that lists practice items. |
| Dataset | One of 7 fictional databases used for practice. |
| Playground | The in-browser SQL editor that runs SQLite queries. |
| Test | A timed set of questions with a score and review. |
| Interview bank | A searchable set of interview questions with model answers. |
| Mock interview | A timed practice session with self-rating and score history. |
| Progress | The learner's completion, streak and hours, stored in the browser. |
| Link (links.json) | A stable official page used in "Further reading". |
| Offline mode | The site works without a network after the first visit. |
| Pagefind | The search engine built with the site. |
| Leitner | A revision method that moves cards between review boxes. |
