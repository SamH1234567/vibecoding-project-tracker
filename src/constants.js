// Columns for a new board, in render order (PRD §7). Boards can customise
// their columns, so code must read a board's own `columns`, not this list.
export const DEFAULT_COLUMNS = [
  { id: 'todo',        label: 'To Do' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'review',      label: 'Review' },
  { id: 'done',        label: 'Done' },
];

// Tools offered for `Task.contextTool` (PRD §5).
export const CONTEXT_TOOLS = ['Claude', 'ChatGPT', 'Cursor', 'Lovable', 'Replit', 'Other'];
