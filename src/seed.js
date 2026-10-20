import { addDaysISO, todayISO } from './lib/dates';

// Pre-fill for the Context field on new tasks (M9).
export const CONTEXT_TEMPLATE = `## Background

## Constraints

## Tried so far

## Pick up
`;

// Demo tasks shown on first load and after "Reset demo data".
// Due dates are relative to today so every due-date state is always on show.
export function seedTasks() {
  const now = new Date().toISOString();
  return [
    {
      id: crypto.randomUUID(),
      title: 'Board columns and seed data',
      description: 'Render the four stage columns with demo tasks so the board is never empty.',
      type: 'feature',
      status: 'done',
      assignee: 'Sam Hancock',
      dueDate: addDaysISO(-1),
      createdDate: addDaysISO(-3),
      context: `## Background
First visible milestone (M4). Data lives in localStorage, seeded from seed.js.

## Constraints
No backend. Column IDs must match STAGES.

## Tried so far
Single App.jsx got crowded, so split into Board + TaskCard.

## Pick up
Done. Next is the add/edit modal (M5).
`,
      contextTool: 'Claude',
      contextUpdatedAt: now,
      outcome: 'Worked first time after splitting components.',
    },
    {
      id: crypto.randomUUID(),
      title: 'Copy Context button',
      description: 'One click copies the task and its context as a Markdown briefing for an AI chat.',
      type: 'feature',
      status: 'in-progress',
      assignee: 'Jo Smith',
      dueDate: addDaysISO(1),
      createdDate: addDaysISO(-2),
      context: `## Background
Teammates lose the prompt that produced working code.

## Constraints
Output must paste cleanly into Claude, ChatGPT and Cursor.

## Tried so far
Plain text loses headings, so switched to Markdown.

## Pick up
Wire up the "Copied" toast.
`,
      contextTool: 'ChatGPT',
      contextUpdatedAt: now,
      outcome: '',
    },
    {
      id: crypto.randomUUID(),
      title: 'Due date shows a day early in BST',
      description: 'Cards show the due date one day early for UK users during summer time.',
      type: 'bug',
      status: 'review',
      assignee: 'Alex Smith',
      dueDate: addDaysISO(-2),
      createdDate: addDaysISO(-4),
      context: `## Background
new Date('YYYY-MM-DD') parses as UTC midnight.

## Constraints
Keep storing plain 'YYYY-MM-DD' strings.

## Tried so far
Compare local calendar days instead of timestamps.

## Pick up
Check the fix around midnight before approving.
`,
      contextTool: 'Cursor',
      contextUpdatedAt: now,
      outcome: 'Fix proposed; awaiting review.',
    },
    {
      id: crypto.randomUUID(),
      title: 'Deliverable anchor board',
      description: 'Pinned cards for Presentation, Demo, Report and Documentation links.',
      type: 'feature',
      status: 'todo',
      assignee: 'Sam Hancock',
      dueDate: addDaysISO(5),
      createdDate: todayISO(),
      context: CONTEXT_TEMPLATE,
      contextTool: null,
      contextUpdatedAt: null,
      outcome: '',
    },
  ];
}

export function seedAnchors() {
  return [
    { id: 'presentation',  label: 'Presentation',  url: null },
    { id: 'demo',          label: 'Demo',          url: null },
    { id: 'report',        label: 'Report',        url: null },
    { id: 'documentation', label: 'Documentation', url: 'https://github.com/SamH1234567/vibecoding-project-tracker' },
  ];
}
