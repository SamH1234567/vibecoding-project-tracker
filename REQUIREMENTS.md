# Sprint — Requirements

Every requirement has a unique ID. **MVP** marks the minimum viable product; everything else is still built in the prototype. Every feature in the prototype maps to at least one ID (see Traceability).

## Functional requirements

| ID | MVP? | Requirement | Source | Built in |
|---|---|---|---|---|
|FR-01| No | A user can see all active tasks assigned to each team member, grouped by task status | Client slides (M7 optional "who's driving what") + design decision | M7 – team strip, click a member (TeamStrip.jsx) |

## Non-functional requirements

| ID | MVP? | Category | Requirement | Source | Built in |
|---|---|---|---|---|---|
| | | | | | |

## Data requirements

| ID | MVP? | Data | Requirement | Where the data comes from | Built in |
|---|---|---|---|---|---|
| | | | | | |

## Traceability: built features → requirement IDs

| Feature | Milestone | Code | Requirement ID(s) |
|---|---|---|---|
| Four-column board (To Do / In Progress / Review / Done) | M4 `data-model` | `src/components/Board.jsx` | |
| Seed demo tasks, team and anchors | M4 `data-model` | `src/seed.js` | |
| localStorage persistence via a single data layer | M4 `data-model` | `src/lib/store.js` | |
| "Reset demo data" button | M4 `data-model` | `src/App.jsx`, `src/lib/store.js` | |
| Task count in each column header | M4 `data-model` | `src/components/Board.jsx` | |
| "New task" button + create drawer | M5 `crud-modal` | `src/components/TaskDrawer.jsx` | |
| Click card to edit in the same drawer | M5 `crud-modal` | `src/components/TaskCard.jsx`, `TaskDrawer.jsx` | |
| Delete task with confirmation | M5 `crud-modal` | `src/components/TaskDrawer.jsx` | |
| Status dropdown | M5 `crud-modal` | `src/components/TaskDrawer.jsx` | |
| Empty-column ghost card opens new task in that column | M5 `crud-modal` | `src/components/Board.jsx` | |
| Drawer is an accessible modal (focus trap, Esc, focus return) | M5 `crud-modal` | `src/components/Drawer.jsx` | |
| Feature / bug colour stripe + corner icon, shared everywhere | M6 `tag-style` | `src/components/taskTypes.js` | |
| Initials avatar on each card | M7 `task-owner` | `src/components/Avatar.jsx`, `TaskCard.jsx` | |
| "Hand off to…" menu on each card (a dropdown until the accessibility pass) | M7 `task-owner` | `src/components/TaskCard.jsx` | |
| "Handed off to {name}." confirmation toast | M7 `task-owner` | `src/components/Toast.jsx` | |
| "Who's driving what" team strip | M7 `task-owner` | `src/components/TeamStrip.jsx` | |
| Click a member to see their open tasks (Doing / Reviewing / Up next) | M7 `task-owner` | `src/components/TeamStrip.jsx` | |
| Manage team: add / rename / remove members, email, GitHub | M7 `task-owner` | `src/components/TeamDrawer.jsx`, `src/lib/store.js` | |
| Renaming a member updates their tasks; can't remove a member who owns tasks | M7 `task-owner` | `src/lib/store.js`, `TeamDrawer.jsx` | |
| Due-date chip on cards: green >2 days, amber 0–2 days, red overdue, grey when Done; text label + icon, not colour alone | M8 `due-tint` | `src/components/DueChip.jsx`, `src/lib/dates.js` | |
| AI context section in the task drawer: Markdown context, AI tool, outcome | M9 `task-context` | `src/components/ContextField.jsx` | |
| "Last updated … ago" hint; contextUpdatedAt set automatically on save | M9 `task-context` | `ContextField.jsx`, `TaskDrawer.jsx`, `src/lib/dates.js` | |
| New tasks pre-filled with Background / Constraints / Tried so far / Pick up template | M9 `task-context` | `src/seed.js`, `src/lib/store.js` | |
| Write / Preview toggle with rendered Markdown | M9 `task-context` | `ContextField.jsx` (react-markdown) | |
| "Copy context" button on every card (labelled since the accessibility pass) and in the task drawer | M10 `copy-context` | `TaskCard.jsx`, `TaskDrawer.jsx`, `App.jsx` | |
| Markdown briefing: title, description, type/status/owner/due/tool, filled context sections, outcome | M10 `copy-context` | `src/lib/briefing.js` | |
| "Context copied, ready to paste." toast (error toast if the clipboard is blocked) | M10 `copy-context` | `src/components/Toast.jsx`, `App.jsx` | |
| Pinned deliverables above the board: Presentation / Demo / Report / Documentation | M11 `project-deliverables` | `src/components/AnchorBoard.jsx` | |
| Link box per deliverable, saved on Enter / leaving the field; bare domains get https://; non-web links rejected | M11 `project-deliverables` | `AnchorBoard.jsx`, `src/lib/store.js` | |
| Filled / empty status dot with "Linked" / "No link yet" text; open-in-new-tab button | M11 `project-deliverables` | `AnchorBoard.jsx` | |
| Deliverables and Team sections collapse to a one-line summary (dots / initials + in-progress count); open on first visit, choice remembered | M11 `project-deliverables` | `src/components/CollapsibleSection.jsx`, `AnchorBoard.jsx`, `TeamStrip.jsx`, `src/lib/store.js` | |
| Drag a card to another column to change its status; target column highlighted, dragged card faded; status dropdown kept as keyboard alternative | M12 `secret-sauce` | `src/components/Board.jsx`, `TaskCard.jsx` | |
| Activity log: every create, move, hand-off, context save and delete is recorded (with a context snapshot); seeded demo history; capped at 500 entries | M12 `secret-sauce` | `src/lib/store.js`, `src/seed.js` | |
| Insights drawer from the header: open / overdue / done this week / avg time to done, completions per day (14 days), open tasks per person, AI tool usage, recent activity | M12 `secret-sauce` | `src/components/InsightsDrawer.jsx`, `src/lib/analytics.js` | |
| Filter bar above the board: text search (title, description, context), assignee, type, due state; hidden cards, "shown/total" column counts, "Showing N of M", Clear filters; resets each visit | M12 `secret-sauce` | `src/components/FilterBar.jsx`, `src/lib/filters.js`, `Board.jsx` | |
| Multiple boards: switcher, New board, delete board; each board has its own tasks, columns, team, deliverables and milestones; older saved data migrated into one board | Post-hackathon | `src/lib/store.js`, `src/seed.js`, `App.jsx`, `BoardSettingsDrawer.jsx` | |
| Customisable columns: add, rename, reorder, remove (only when empty, min 2); last column counts as done everywhere | Post-hackathon | `BoardSettingsDrawer.jsx`, `src/lib/board.js`, `Board.jsx` | |
| Sub-requirements: checklist inside a task; progress shown on the card; included in the copied briefing | Post-hackathon | `src/components/SubtaskList.jsx`, `TaskDrawer.jsx`, `TaskCard.jsx`, `src/lib/briefing.js` | |
| Weighting: optional story points 1/2/3/5/8 per task (unweighted counts as 1) | Post-hackathon | `TaskDrawer.jsx`, `TaskCard.jsx`, `src/lib/board.js` | |
| Milestones: named, dated, per board; tasks belong to one; shown on cards | Post-hackathon | `BoardSettingsDrawer.jsx`, `TaskDrawer.jsx`, `TaskCard.jsx` | |
| Burndown chart per milestone: remaining points per day (rebuilt from the activity log) vs ideal line to the due date; hover tooltip; table view | Post-hackathon | `src/components/BurndownChart.jsx`, `src/lib/analytics.js`, `InsightsDrawer.jsx` | |
| Link tasks to deliverables; deliverable cards show linked / open task counts | Post-hackathon | `TaskDrawer.jsx`, `AnchorBoard.jsx` | |
| "Who are you?" sign-in (prototype, no passwords) with "Continue as demo user"; Switch user; "My tasks" filter; activity log records who did what | Post-hackathon | `src/components/SignIn.jsx`, `App.jsx`, `FilterBar.jsx`, `src/lib/store.js` | |
| See tasks linked to a deliverable: click the count on its card, or the Deliverable filter; cards show a link label | Post-hackathon | `AnchorBoard.jsx`, `FilterBar.jsx`, `src/lib/filters.js`, `TaskCard.jsx` | |
| Accessibility pass to WCAG 2.2 AA: contrast tokens, input borders, skip link, reflow to one column on narrow screens, 24 px targets, live regions for errors and filter counts, `aria-invalid` on bad fields, toast pause on hover, reduced-motion support (details in ACCESSIBILITY.md) | Post-hackathon | `tailwind.config.js`, `src/index.css`, all components, `ACCESSIBILITY.md` | |
