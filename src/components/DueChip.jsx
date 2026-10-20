import { CalendarCheck, CalendarClock, Clock, TriangleAlert } from 'lucide-react';
import { daysUntil, dueState, formatShortDate } from '../lib/dates';

// How each due state looks (DESIGN §2, M8). The tint and icon carry the colour;
// the text stays dark for contrast and says the state in words, so colour is
// never the only signal.
const DUE_STATES = {
  safe: { Icon: CalendarClock, chip: 'bg-due-safe/10 ring-due-safe/40', icon: 'text-due-safe' },
  warning: { Icon: Clock, chip: 'bg-due-warning/15 ring-due-warning/60', icon: 'text-due-warning' },
  overdue: { Icon: TriangleAlert, chip: 'bg-due-overdue/10 ring-due-overdue/50', icon: 'text-due-overdue' },
  neutral: { Icon: CalendarCheck, chip: 'bg-slate-100 ring-due-neutral/40', icon: 'text-due-neutral' },
};

function label(task, state) {
  const days = daysUntil(task.dueDate);
  if (state === 'neutral') return `Due ${formatShortDate(task.dueDate)}`;
  if (state === 'overdue') return days === -1 ? '1 day overdue' : `${-days} days overdue`;
  if (days === 0) return 'Due today';
  if (days === 1) return 'Due tomorrow';
  if (days <= 13) return `Due in ${days} days`;
  return `Due ${formatShortDate(task.dueDate)}`;
}

export default function DueChip({ task }) {
  const state = dueState(task);
  if (!state) return null;
  const style = DUE_STATES[state];

  return (
    <span
      title={`Due ${formatShortDate(task.dueDate)}`}
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ${style.chip} ${
        state === 'neutral' ? 'text-text-muted' : 'text-text-primary'
      }`}
    >
      <style.Icon size={12} className={style.icon} aria-hidden="true" />
      {label(task, state)}
    </span>
  );
}
