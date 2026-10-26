import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Copy, Flag, Link2, ListChecks } from 'lucide-react';
import Avatar from './Avatar';
import DueChip from './DueChip';
import { TASK_TYPES } from './taskTypes';

// "Hand off to…" (M7) as a menu button rather than a <select>: a select fires
// a change on every arrow key in some browsers, which would hand the task off
// repeatedly while a keyboard user is only browsing the names.
function HandOffMenu({ task, others, onHandOff }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  const buttonRef = useRef(null);
  const menuId = `handoff-${task.id}`;

  useEffect(() => {
    if (!open) return undefined;
    function handlePointer(e) {
      if (!wrapperRef.current.contains(e.target)) setOpen(false);
    }
    function handleKey(e) {
      if (e.key === 'Escape') {
        setOpen(false);
        buttonRef.current.focus();
      }
    }
    document.addEventListener('mousedown', handlePointer);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handlePointer);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  function handOff(name) {
    setOpen(false);
    buttonRef.current.focus();
    onHandOff(task, name);
  }

  return (
    <div ref={wrapperRef} className="relative z-10 min-w-0">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={`${task.assignee}, owner. Hand off to…`}
        title="Hand off to…"
        className="flex min-h-[1.5rem] max-w-full items-center gap-0.5 rounded-full py-1 pl-1 pr-1.5 text-xs text-text-muted hover:bg-slate-100 hover:text-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
      >
        <span className="truncate">{task.assignee}</span>
        <ChevronDown size={12} className="shrink-0" aria-hidden="true" />
      </button>
      {open && (
        <div
          id={menuId}
          className="absolute left-0 top-full z-20 mt-1 w-48 max-w-[calc(100vw-2rem)] rounded-xl bg-surface-card p-1.5 shadow-lg ring-1 ring-slate-200"
        >
          <p className="px-2 pb-1 pt-0.5 text-xs font-medium text-text-muted">Hand off to…</p>
          <ul>
            {others.map((m) => (
              <li key={m.id}>
                <button
                  type="button"
                  onClick={() => handOff(m.name)}
                  className="flex min-h-[2rem] w-full items-center gap-2 rounded-lg px-2 text-left text-sm hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                >
                  <Avatar name={m.name} />
                  {m.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function TaskCard({ task, team, done, milestone, deliverable, isDragging, onDragStart, onDragEnd, onOpen, onHandOff, onCopy }) {
  const type = TASK_TYPES[task.type];
  const others = team.filter((m) => m.name !== task.assignee);

  return (
    // The title button is stretched over the whole card so a click anywhere
    // opens it, while the hand-off menu and copy button sit above it as their own controls.
    <article
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', task.id);
        onDragStart();
      }}
      onDragEnd={onDragEnd}
      className={`relative rounded-xl bg-surface-card p-4 pl-5 shadow-sm transition-shadow focus-within:ring-2 focus-within:ring-brand-primary hover:shadow-md ${
        isDragging ? 'opacity-40' : ''
      }`}
    >
      <span className={`absolute inset-y-0 left-0 w-1 rounded-l-xl ${type.stripe}`} aria-hidden="true" />
      <type.Icon size={16} className={`absolute right-3 top-3 ${type.text}`} aria-hidden="true" />

      <h3 className="pr-6 text-sm font-medium text-text-primary">
        <button
          type="button"
          onClick={() => onOpen(task)}
          className="cursor-grab text-left after:absolute after:inset-0 after:rounded-xl focus:outline-none active:cursor-grabbing"
        >
          <span className="sr-only">{type.label}: </span>
          {task.title}
        </button>
      </h3>

      {(task.dueDate || task.points || task.subtasks.length > 0 || milestone || deliverable) && (
        <div className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-text-muted">
          {task.dueDate && <DueChip task={task} done={done} />}
          {task.points && (
            <span className="font-mono" title="Story points">
              {task.points} pt{task.points === 1 ? '' : 's'}
            </span>
          )}
          {task.subtasks.length > 0 && (
            <span className="flex items-center gap-1" title="Sub-requirements done">
              <ListChecks size={12} aria-hidden="true" />
              <span className="sr-only">Sub-requirements done:</span>
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

      <div className="mt-3 flex items-center gap-1.5">
        <Avatar name={task.assignee} />
        {others.length > 0 ? (
          <HandOffMenu task={task} others={others} onHandOff={onHandOff} />
        ) : (
          <span className="min-w-0 truncate text-xs text-text-muted">{task.assignee}</span>
        )}
        <button
          type="button"
          onClick={() => onCopy(task)}
          aria-label={`Copy context for "${task.title}"`}
          className="relative z-10 ml-auto flex min-h-[1.5rem] shrink-0 items-center gap-1 rounded-full px-2 py-1 text-xs text-text-muted hover:bg-slate-100 hover:text-brand-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
        >
          <Copy size={13} aria-hidden="true" />
          Copy context
        </button>
      </div>
    </article>
  );
}
