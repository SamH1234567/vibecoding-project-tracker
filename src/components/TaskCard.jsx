import { ChevronDown, Copy } from 'lucide-react';
import Avatar from './Avatar';
import DueChip from './DueChip';
import { TASK_TYPES } from './taskTypes';

export default function TaskCard({ task, team, onOpen, onHandOff, onCopy }) {
  const type = TASK_TYPES[task.type];
  const others = team.filter((m) => m.name !== task.assignee);

  return (
    // The title button is stretched over the whole card so a click anywhere
    // opens it, while the hand-off dropdown sits above it as its own control.
    <article className="relative overflow-hidden rounded-xl bg-surface-card p-4 pl-5 shadow-sm transition-shadow focus-within:ring-2 focus-within:ring-brand-primary hover:shadow-md">
      <span className={`absolute inset-y-0 left-0 w-1 ${type.stripe}`} aria-hidden="true" />
      <type.Icon size={16} className={`absolute right-3 top-3 ${type.text}`} aria-hidden="true" />

      <h3 className="pr-6 text-sm font-medium text-text-primary">
        <button
          type="button"
          onClick={() => onOpen(task)}
          className="text-left after:absolute after:inset-0 focus:outline-none"
        >
          <span className="sr-only">{type.label}: </span>
          {task.title}
        </button>
      </h3>

      {task.dueDate && (
        <div className="mt-2">
          <DueChip task={task} />
        </div>
      )}

      <div className="mt-3 flex items-center gap-2">
        <Avatar name={task.assignee} />
        {/* The owner's name is the "Hand off to…" dropdown (M7). */}
        {others.length > 0 ? (
          <div className="relative z-10 min-w-0">
            <select
              value={task.assignee}
              onChange={(e) => onHandOff(task, e.target.value)}
              aria-label={`Owner of "${task.title}". Hand off to…`}
              title="Hand off to…"
              className="w-full cursor-pointer appearance-none truncate rounded-full bg-transparent py-0.5 pl-1 pr-5 text-xs text-text-muted hover:bg-slate-100 hover:text-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
            >
              <option value={task.assignee}>{task.assignee}</option>
              <optgroup label="Hand off to…">
                {others.map((m) => (
                  <option key={m.id} value={m.name}>
                    {m.name}
                  </option>
                ))}
              </optgroup>
            </select>
            <ChevronDown
              size={12}
              className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-text-muted"
              aria-hidden="true"
            />
          </div>
        ) : (
          <span className="min-w-0 truncate text-xs text-text-muted">{task.assignee}</span>
        )}
        <button
          type="button"
          onClick={() => onCopy(task)}
          aria-label={`Copy context for "${task.title}"`}
          title="Copy context"
          className="relative z-10 ml-auto shrink-0 rounded-full p-1.5 text-text-muted hover:bg-slate-100 hover:text-brand-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
        >
          <Copy size={14} aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}
