import { DEFAULT_COLUMNS } from './constants';
import { addDaysISO, todayISO } from './lib/dates';

export const MAIN_BOARD_ID = 'main';
const PORTFOLIO_BOARD_ID = 'portfolio';

const subtask = (title, done = false) => ({ id: crypto.randomUUID(), title, done });

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
  // Weighting, milestone, deliverable link and sub-requirements for each main-board task.
  const extras = [
    { points: 3, milestoneId: 'mvp', deliverableId: 'demo', subtasks: [subtask('Four columns', true), subtask('Seed tasks', true)] },
    {
      points: 5,
      milestoneId: 'mvp',
      deliverableId: 'demo',
      subtasks: [subtask('Markdown briefing', true), subtask('Clipboard fallback', true), subtask('"Copied" toast')],
    },
    { points: 2, milestoneId: 'mvp', deliverableId: 'documentation', subtasks: [] },
    { points: 3, milestoneId: 'final', deliverableId: 'presentation', subtasks: [subtask('URL input'), subtask('Status dot')] },
  ];
  return [
    ...mainBoardTasks(now).map((task, i) => ({ boardId: MAIN_BOARD_ID, ...extras[i], ...task })),
    ...historyTasks(),
    ...portfolioTasks(),
  ];
}

// Extra main-board tasks spread over the last two weeks, so Insights has a
// realistic history: completions on different days, every AI tool, two milestones.
function historyTasks() {
  const task = (title, type, status, assignee, created, due, points, milestoneId, tool, deliverableId, pickUp) => {
    const contextAt = new Date();
    contextAt.setDate(contextAt.getDate() + created + 1);
    return {
      id: crypto.randomUUID(),
      boardId: MAIN_BOARD_ID,
      title,
      description: '',
      type,
      status,
      assignee,
      dueDate: due === null ? null : addDaysISO(due),
      createdDate: addDaysISO(created),
      context: `## Background
${title}.

## Pick up
${pickUp}
`,
      contextTool: tool,
      contextUpdatedAt: tool && created + 1 <= 0 ? contextAt.toISOString() : null,
      outcome: status === 'done' ? 'Worked after one or two follow-up prompts.' : '',
      points,
      milestoneId,
      deliverableId,
      subtasks: [],
    };
  };
  return [
    task('Feature and bug colour coding', 'feature', 'done', 'Alex Smith', -13, -10, 2, 'mvp', 'Cursor', 'demo', 'Done.'),
    task('Assignee avatars', 'feature', 'done', 'Jo Smith', -12, -9, 2, 'mvp', 'Claude', 'demo', 'Done.'),
    task('Hand-off toast', 'feature', 'done', 'Sam Hancock', -11, -8, 1, 'mvp', 'Lovable', 'demo', 'Done.'),
    task('Due-date chip', 'feature', 'done', 'Alex Smith', -10, -6, 3, 'mvp', 'Claude', 'demo', 'Done.'),
    task('Focus escapes the drawer on Tab', 'bug', 'done', 'Jo Smith', -9, -7, 2, 'mvp', 'ChatGPT', 'documentation', 'Done.'),
    task('Markdown preview', 'feature', 'done', 'Sam Hancock', -8, -4, 3, 'final', 'Replit', 'demo', 'Done.'),
    task('Drag cards between columns', 'feature', 'review', 'Alex Smith', -6, 3, 5, 'final', 'Claude', 'demo', 'Check the drop highlight.'),
    task('Filter bar', 'feature', 'in-progress', 'Sam Hancock', -4, 6, 3, 'final', 'Cursor', 'demo', 'Add a deliverable filter.'),
    task('Deploy to Vercel', 'feature', 'todo', 'Jo Smith', -1, 9, 2, 'final', null, 'presentation', 'Connect the GitHub repo.'),
    task('Toast hidden behind the drawer', 'bug', 'todo', 'Alex Smith', 0, 1, 1, 'final', 'Other', 'documentation', 'Raise the toast z-index.'),
  ];
}

// A second, smaller board with its own columns, to show multiple boards.
function portfolioTasks() {
  const base = {
    boardId: PORTFOLIO_BOARD_ID,
    context: CONTEXT_TEMPLATE,
    contextTool: null,
    contextUpdatedAt: null,
    outcome: '',
    milestoneId: 'launch',
    deliverableId: null,
  };
  return [
    {
      ...base,
      id: crypto.randomUUID(),
      title: 'Landing page hero',
      description: 'Headline, intro and a link to the CV.',
      type: 'feature',
      status: 'building',
      assignee: 'Sam Hancock',
      dueDate: addDaysISO(4),
      createdDate: addDaysISO(-1),
      points: 3,
      subtasks: [subtask('Copy', true), subtask('Layout')],
    },
    {
      ...base,
      id: crypto.randomUUID(),
      title: 'Contact form gets spam',
      description: 'Bots submit the form several times a day.',
      type: 'bug',
      status: 'backlog',
      assignee: 'Jo Smith',
      dueDate: null,
      createdDate: todayISO(),
      points: 2,
      subtasks: [],
    },
  ];
}

function mainBoardTasks(now) {
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
No backend. Status IDs must match the board's columns.

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

// Demo boards. Each board has its own columns, team, deliverables and
// milestones; the last column always counts as done.
export function seedBoards() {
  return [
    {
      id: MAIN_BOARD_ID,
      name: 'Vibecoding hackathon',
      columns: DEFAULT_COLUMNS.map((c) => ({ ...c })),
      team: seedTeam(),
      anchors: seedAnchors(),
      milestones: [
        { id: 'mvp', name: 'MVP demo', dueDate: addDaysISO(2) },
        { id: 'final', name: 'Final hand-in', dueDate: addDaysISO(14) },
      ],
    },
    {
      id: PORTFOLIO_BOARD_ID,
      name: 'Portfolio site',
      columns: [
        { id: 'backlog', label: 'Backlog' },
        { id: 'building', label: 'Building' },
        { id: 'live', label: 'Live' },
      ],
      team: seedTeam().filter((m) => m.name !== 'Alex Smith'),
      anchors: seedAnchors().map((a) => ({ ...a, url: null })),
      milestones: [{ id: 'launch', name: 'Launch', dueDate: addDaysISO(10) }],
    },
  ];
}

// Starting team from PRD §8. Member names are the values used in `Task.assignee`.
export function seedTeam() {
  return [
    { id: crypto.randomUUID(), name: 'Sam Hancock', email: '', github: 'SamH1234567' },
    { id: crypto.randomUUID(), name: 'Alex Smith', email: 'alex.smith@example.com', github: '' },
    { id: crypto.randomUUID(), name: 'Jo Smith', email: 'jo.smith@example.com', github: '' },
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

// Plausible history for a set of tasks, so the activity log and Insights have
// something to show on first load: created, moved column by column at varying
// speeds, some hand-offs, and an earlier prompt version before the latest one.
export function seedActivity(tasks, boards) {
  const latest = Date.now() - 30 * 60_000; // nothing in the future
  const clamp = (date) => new Date(Math.min(date.getTime(), latest)).toISOString();
  const atDay = (isoDate, hour) => {
    const [y, m, d] = isoDate.split('-').map(Number);
    return new Date(y, m - 1, d, hour).toISOString();
  };
  const events = [];
  tasks.forEach((task, index) => {
    const board = boards.find((b) => b.id === task.boardId) ?? boards[0];
    const stageOrder = board.columns.map((c) => c.id);
    const base = { boardId: board.id, taskId: task.id, title: task.title, by: task.assignee };
    events.push({ ...base, id: crypto.randomUUID(), type: 'created', at: atDay(task.createdDate, 9), to: stageOrder[0] });
    const steps = stageOrder.indexOf(task.status);
    const daysPerStep = 1 + (index % 2);
    for (let i = 1; i <= steps; i += 1) {
      const at = new Date(atDay(task.createdDate, 9 + i * 2));
      at.setDate(at.getDate() + (i - 1) * daysPerStep);
      events.push({ ...base, id: crypto.randomUUID(), type: 'moved', at: clamp(at), from: stageOrder[i - 1], to: stageOrder[i] });
    }
    // Every third task changed hands once, early on.
    const previous = board.team.find((m) => m.name !== task.assignee);
    if (index % 3 === 0 && previous) {
      const at = new Date(atDay(task.createdDate, 10));
      events.push({ ...base, id: crypto.randomUUID(), type: 'handed-off', at: clamp(at), from: previous.name, to: task.assignee, by: previous.name });
    }
    // Every other task with context had an earlier attempt with a different tool.
    if (task.contextUpdatedAt && index % 2 === 0) {
      const at = new Date(atDay(task.createdDate, 15));
      events.push({
        ...base,
        id: crypto.randomUUID(),
        type: 'context',
        at: clamp(at),
        tool: task.contextTool === 'ChatGPT' ? 'Claude' : 'ChatGPT',
        context: `## Background
${task.title}.

## Tried so far
First attempt.
`,
        outcome: 'Partly worked; needed a second prompt.',
      });
    }
    if (task.contextUpdatedAt) {
      events.push({
        ...base,
        id: crypto.randomUUID(),
        type: 'context',
        at: task.contextUpdatedAt,
        tool: task.contextTool,
        context: task.context,
        outcome: task.outcome,
      });
    }
  });
  return events.sort((a, b) => a.at.localeCompare(b.at));
}
