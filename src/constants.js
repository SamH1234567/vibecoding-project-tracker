// The four columns of the board, in render order (PRD §7).
// Use these IDs everywhere — do not invent new ones.
export const STAGES = [
  { id: 'todo',        label: 'To Do' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'review',      label: 'Review' },
  { id: 'done',        label: 'Done' },
];

// Starting team from PRD §8. These are the valid values for `Task.assignee`.
export const TEAM = ['Sam Hancock', 'Alex Smith', 'Jo Smith'];

// Tools offered for `Task.contextTool` (PRD §5).
export const CONTEXT_TOOLS = ['Claude', 'ChatGPT', 'Cursor', 'Lovable', 'Replit', 'Other'];
