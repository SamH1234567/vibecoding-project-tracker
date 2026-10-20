// Dates are handled as local calendar days ('YYYY-MM-DD').
// Never use `new Date('YYYY-MM-DD')`: it parses as UTC midnight, which is
// the previous evening in BST and shifts the day by one.

const pad = (n) => String(n).padStart(2, '0');

export function toISODate(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function todayISO() {
  return toISODate(new Date());
}

// Today shifted by `days` (negative for the past), as 'YYYY-MM-DD'.
export function addDaysISO(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return toISODate(d);
}

// 'YYYY-MM-DD' as a local-midnight Date (safe, unlike `new Date(iso)`).
export function parseISODate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

// Whole calendar days from today to `iso`: 0 today, 1 tomorrow, -1 yesterday.
// Rounded because a BST/GMT change makes one day 23 or 25 hours long.
export function daysUntil(iso) {
  return Math.round((parseISODate(iso) - parseISODate(todayISO())) / 86_400_000);
}

export function formatShortDate(iso) {
  return parseISODate(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

/**
 * Due-date state for a task (DESIGN §2, M8), or null when it has no due date.
 *   neutral  – task is Done (overrides the date)
 *   overdue  – the due date has passed
 *   warning  – due today or within the next 2 days
 *   safe     – more than 2 days away
 */
export function dueState(task) {
  if (!task.dueDate) return null;
  if (task.status === 'done') return 'neutral';
  const days = daysUntil(task.dueDate);
  if (days < 0) return 'overdue';
  if (days <= 2) return 'warning';
  return 'safe';
}

// "just now", "5 min ago", "2 h ago", "3 days ago", or a date after a week.
export function timeAgo(isoTimestamp) {
  const minutes = Math.floor((Date.now() - new Date(isoTimestamp)) / 60_000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return days === 1 ? '1 day ago' : `${days} days ago`;
  return `on ${formatShortDate(toISODate(new Date(isoTimestamp)))}`;
}
