import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { STAGES, TEAM } from '../constants';
import { TASK_TYPES } from './taskTypes';

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

const inputClass =
  'w-full rounded-lg border border-slate-300 bg-surface-card px-3 py-2 text-sm text-text-primary focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/30';

function Field({ label, htmlFor, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={htmlFor} className="text-xs font-medium text-text-muted">
        {label}
      </label>
      {children}
    </div>
  );
}

// Right-hand drawer used for both creating and editing a task (DESIGN §4).
// It is a modal dialog: focus is trapped inside, Esc or the backdrop closes it.
export default function TaskDrawer({ task, isNew, onSave, onDelete, onClose }) {
  const [draft, setDraft] = useState(task);
  const panelRef = useRef(null);
  const titleRef = useRef(null);

  // Focus the title on open and hand focus back to whatever opened the drawer.
  useEffect(() => {
    const opener = document.activeElement;
    titleRef.current?.focus();
    return () => opener?.focus?.();
  }, []);

  const set = (field) => (e) => setDraft({ ...draft, [field]: e.target.value });
  const canSave = draft.title.trim() !== '';

  function handleKeyDown(e) {
    if (e.key === 'Escape') {
      onClose();
      return;
    }
    if (e.key !== 'Tab') return;
    const items = [...panelRef.current.querySelectorAll(FOCUSABLE)].filter((el) => !el.disabled);
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (canSave) onSave({ ...draft, title: draft.title.trim() });
  }

  function handleDelete() {
    if (window.confirm(`Delete "${task.title}"? This can't be undone.`)) onDelete(task);
  }

  return (
    <div className="fixed inset-0 z-40 flex justify-end" onKeyDown={handleKeyDown}>
      <div className="absolute inset-0 bg-slate-900/40" onClick={onClose} aria-hidden="true" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        className="relative flex h-full w-full max-w-lg flex-col bg-surface-card shadow-xl"
      >
        <form onSubmit={handleSubmit} className="flex h-full flex-col">
          <header className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
            <h2 id="drawer-title" className="text-base font-semibold">
              {isNew ? 'New task' : 'Edit task'}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="rounded-full p-1.5 text-text-muted hover:bg-slate-100 hover:text-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
            >
              <X size={18} />
            </button>
          </header>

          <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-6 py-5">
            <Field label="Title" htmlFor="task-title">
              <input
                id="task-title"
                ref={titleRef}
                value={draft.title}
                onChange={set('title')}
                required
                className={inputClass}
              />
            </Field>

            <Field label="Description" htmlFor="task-description">
              <textarea
                id="task-description"
                value={draft.description}
                onChange={set('description')}
                rows={3}
                className={inputClass}
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <fieldset className="flex flex-col gap-1">
                <legend className="mb-1 text-xs font-medium text-text-muted">Type</legend>
                <div className="flex gap-2">
                  {Object.entries(TASK_TYPES).map(([value, type]) => (
                    <label
                      key={value}
                      className={`flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-sm has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand-primary ${
                        draft.type === value ? type.selected : 'border-slate-300 text-text-muted hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="task-type"
                        value={value}
                        checked={draft.type === value}
                        onChange={set('type')}
                        className="sr-only"
                      />
                      <type.Icon size={15} aria-hidden="true" />
                      {type.label}
                    </label>
                  ))}
                </div>
              </fieldset>

              <Field label="Status" htmlFor="task-status">
                <select id="task-status" value={draft.status} onChange={set('status')} className={inputClass}>
                  {STAGES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Assignee" htmlFor="task-assignee">
                <select id="task-assignee" value={draft.assignee} onChange={set('assignee')} className={inputClass}>
                  {TEAM.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Due date" htmlFor="task-due">
                <input
                  id="task-due"
                  type="date"
                  value={draft.dueDate ?? ''}
                  onChange={(e) => setDraft({ ...draft, dueDate: e.target.value || null })}
                  className={inputClass}
                />
              </Field>
            </div>

            {/* TODO M9 task-context: Context (Markdown), AI tool, outcome, "last updated" hint. */}
          </div>

          <footer className="flex items-center gap-2 border-t border-slate-200 px-6 py-4">
            {!isNew && (
              <button
                type="button"
                onClick={handleDelete}
                className="rounded-full px-4 py-2 text-sm text-text-muted hover:bg-slate-100 hover:text-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              >
                Delete
              </button>
            )}
            <div className="ml-auto flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!canSave}
                className="rounded-full bg-brand-primary px-5 py-2 text-sm font-medium text-white hover:bg-brand-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isNew ? 'Add task' : 'Save'}
              </button>
            </div>
          </footer>
        </form>
      </div>
    </div>
  );
}
