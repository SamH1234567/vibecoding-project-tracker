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
| "Hand off to…" dropdown on each card | M7 `task-owner` | `src/components/TaskCard.jsx` | |
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
