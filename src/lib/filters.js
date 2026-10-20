import { dueState } from './dates';

// Filters start empty on every visit (not saved), so a forgotten filter can
// never make tasks look missing.
export const NO_FILTERS = { search: '', assignee: '', type: '', due: '', deliverable: '' };

export const DUE_FILTERS = [
  { value: 'overdue', label: 'Overdue' },
  { value: 'warning', label: 'Due in 0–2 days' },
  { value: 'safe', label: 'Due later' },
  { value: 'none', label: 'No due date' },
];

export function isFiltering(filters) {
  return Object.values(filters).some(Boolean);
}

export function matchesFilters(task, filters, done) {
  if (filters.assignee && task.assignee !== filters.assignee) return false;
  if (filters.type && task.type !== filters.type) return false;
  if (filters.deliverable && task.deliverableId !== filters.deliverable) return false;
  if (filters.due) {
    const state = task.dueDate ? dueState(task, done) : 'none';
    if (state !== filters.due) return false;
  }
  const query = filters.search.trim().toLowerCase();
  if (query) {
    const haystack = `${task.title}\n${task.description}\n${task.context ?? ''}`.toLowerCase();
    if (!haystack.includes(query)) return false;
  }
  return true;
}
