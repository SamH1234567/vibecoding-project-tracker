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
