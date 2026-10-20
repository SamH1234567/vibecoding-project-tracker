import Avatar from './Avatar';
import DueChip from './DueChip';
import { TASK_TYPES } from './taskTypes';

export default function TaskCard({ task, team, onOpen, onHandOff }) {
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
        <span className="min-w-0 flex-1 truncate text-xs text-text-muted" title={task.assignee}>
          {task.assignee}
        </span>
        {others.length > 0 && (
          <select
            value=""
            onChange={(e) => onHandOff(task, e.target.value)}
            aria-label={`Hand off "${task.title}" to…`}
            className="relative z-10 shrink-0 cursor-pointer rounded-full border border-slate-200 bg-surface-card py-0.5 pl-2 pr-6 text-xs text-text-muted hover:border-slate-300 hover:text-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          >
            <option value="" disabled>
              Hand off to…
            </option>
            {others.map((m) => (
              <option key={m.id} value={m.name}>
                {m.name}
              </option>
            ))}
          </select>
        )}
      </div>
    </article>
  );
}
