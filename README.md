# Sprint

**Pick up any task right where the last person — or AI — left off.**

Sprint is a Kanban tracker for vibecoding projects. Each task keeps the AI prompt context that produced it, so anyone can copy a clean briefing back into Claude, ChatGPT or Cursor and carry on.

**Live prototype:** https://vibecoding-project-tracker-alpha.vercel.app/ · no sign-up needed: choose **Continue as demo user**.

Built for CM6312 (Cardiff University) from the [UXD Vibecoding Hackathon starter](https://github.com/ignacioalvmar/vibecoding-project-tracker).

## Try it in two minutes

1. Open the link and choose **Continue as demo user**.
2. **Board:** drag a card to another column, or click it to edit every field in the side drawer.
3. **Copy context** (⧉ on any card): paste into an AI chat to get a Markdown briefing with the task, its sub-requirements and its prompt context.
4. **Hand off:** click the owner's name on a card and pick a teammate.
5. **Insights** (header): burndown for a milestone, completions per day, workload, AI tool use and recent activity.
6. **Deliverables:** click "N tasks linked" on a deliverable card to filter the board to its tasks.
7. **Boards:** switch to *Portfolio site* to see a board with its own columns and team; **Board settings** edits columns and milestones.

**Reset demo data** (header) restores the demo at any time.

## Features

| Area | What it does |
|---|---|
| Board | Customisable columns (the last one counts as done), drag-and-drop, status dropdown as the keyboard alternative |
| Tasks | Feature / bug styling, assignee, due-date colours, story points, milestone, linked deliverable, sub-requirements |
| AI context | Markdown context with live preview, AI tool, outcome, "last updated" hint, starter template |
| Copy context | One-click Markdown briefing for an AI chat |
| Team | Avatars, hand-off with confirmation, who's driving what, editable team (name, email, GitHub) |
| Deliverables | Presentation / Demo / Report / Documentation links with status, linked task counts |
| Insights | Burndown, completions, workload, AI tool usage, activity log |
| Boards | Multiple boards, each with its own columns, team, deliverables and milestones |
| Filters | Search (including context), My tasks, assignee, type, due state, deliverable |
| Sign-in | Prototype "Who are you?" picker; no passwords, nothing leaves the browser |

[REQUIREMENTS.md](REQUIREMENTS.md) maps every feature to the code that builds it.

## Run locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`). `npm run build` produces the production build in `dist/`.

## How it's built

- **Vite + React 18 + Tailwind 3**, icons from Lucide, Markdown preview via react-markdown.
- **No backend:** data is saved in the browser's localStorage through a single data layer, [`src/lib/store.js`](src/lib/store.js). Demo data lives in [`src/seed.js`](src/seed.js).
- Design decisions are in [DESIGN.md](DESIGN.md); the client brief is in [PRD.md](PRD.md).
- Deployed on Vercel; every push to `main` redeploys.

## Repo map

```
.
├── PRD.md · DESIGN.md · REQUIREMENTS.md
└── src/
    ├── App.jsx            page layout and actions
    ├── seed.js            demo boards, tasks and history
    ├── constants.js       default columns, AI tools
    ├── lib/               store, dates, board rules, filters, briefing, analytics
    └── components/        board, cards, drawers, charts, sign-in
```
