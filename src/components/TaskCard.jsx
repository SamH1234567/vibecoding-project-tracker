import { ChevronDown, Copy, Flag, Link2, ListChecks } from 'lucide-react';
import Avatar from './Avatar';
import DueChip from './DueChip';
import { TASK_TYPES } from './taskTypes';

export default function TaskCard({ task, team, done, milestone, deliverable, isDragging, onDragStart, onDragEnd, onOpen, onHandOff, onCopy }) {
  const type = TASK_TYPES[task.type];
  const others = team.filter((m) => m.name !== task.assignee);

  return (
    // The title button is stretched over the whole card so a click anywhere
    // opens it, while the hand-off dropdown sits above it as its own control.
    <article
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', task.id);
        onDragStart();
      }}
      onDragEnd={onDragEnd}
      className={`relative overflow-hidden rounded-xl bg-surface-card p-4 pl-5 shadow-sm transition-shadow focus-within:ring-2 focus-within:ring-brand-primary hover:shadow-md ${
        isDragging ? 'opacity-40' : ''
      }`}
    >
      <span className={`absolute inset-y-0 left-0 w-1 ${type.stripe}`} aria-hidden="true" />
      <type.Icon size={16} className={`absolute right-3 top-3 ${type.text}`} aria-hidden="true" />

      <h3 className="pr-6 text-sm font-medium text-text-primary">
        <button
          type="button"
          onClick={() => onOpen(task)}
          className="cursor-grab text-left after:absolute after:inset-0 focus:outline-none active:cursor-grabbing"
        >
          <span className="sr-only">{type.label}: </span>
          {task.title}
        </button>
      </h3>

      {(task.dueDate || task.points || task.subtasks.length > 0 || milestone || deliverable) && (
        <div className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] text-text-muted">
          {task.dueDate && <DueChip task={task} done={done} />}
          {task.points && (
            <span className="font-mono" title="Story points">
              {task.points} pt{task.points === 1 ? '' : 's'}
            </span>
          )}
          {task.subtasks.length > 0 && (
            <span className="flex items-center gap-1" title="Sub-requirements done">
              <ListChecks size={12} aria-hidden="true" />
              <span className="sr-only">Sub-requirements:</span>
              {task.subtasks.filter((s) => s.done).length}/{task.subtasks.length}
            </span>
          )}
          {milestone && (
            <span className="flex min-w-0 items-center gap-1" title="Milestone">
              <Flag size={12} aria-hidden="true" />
              <span className="sr-only">Milestone:</span>
              <span className="truncate">{milestone.name}</span>
            </span>
          )}
          {deliverable && (
            <span className="flex items-center gap-1" title="For deliverable">
              <Link2 size={12} aria-hidden="true" />
              <span className="sr-only">For deliverable:</span>
              {deliverable.label}
            </span>
          )}
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
