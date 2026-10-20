import { useState } from 'react';
import { STAGES } from '../constants';
import ContextField from './ContextField';
import Drawer, { Field, inputClass, primaryButtonClass, secondaryButtonClass } from './Drawer';
import { TASK_TYPES } from './taskTypes';

// The same drawer is used for creating and editing a task (M5).
export default function TaskDrawer({ task, isNew, team, onSave, onDelete, onClose }) {
  const [draft, setDraft] = useState(task);

  const set = (field) => (e) => setDraft({ ...draft, [field]: e.target.value });
  const canSave = draft.title.trim() !== '';

  function handleSubmit() {
    if (!canSave) return;
    // contextUpdatedAt is set automatically whenever the AI context changes.
    const contextChanged =
      draft.context !== task.context || draft.contextTool !== task.contextTool || draft.outcome !== task.outcome;
    onSave({
      ...draft,
      title: draft.title.trim(),
      contextUpdatedAt: contextChanged ? new Date().toISOString() : draft.contextUpdatedAt,
    });
  }

  function handleDelete() {
    if (window.confirm(`Delete "${task.title}"? This can't be undone.`)) onDelete(task);
  }

  const footer = (
    <>
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
        <button type="button" onClick={onClose} className={secondaryButtonClass}>
          Cancel
        </button>
        <button type="submit" disabled={!canSave} className={primaryButtonClass}>
          {isNew ? 'Add task' : 'Save'}
        </button>
      </div>
    </>
  );

  return (
    <Drawer title={isNew ? 'New task' : 'Edit task'} onClose={onClose} onSubmit={handleSubmit} footer={footer}>
      <Field label="Title" htmlFor="task-title">
        <input id="task-title" value={draft.title} onChange={set('title')} required className={inputClass} />
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
            {team.map((m) => (
              <option key={m.id} value={m.name}>
                {m.name}
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

      <ContextField draft={draft} setDraft={setDraft} />
    </Drawer>
  );
}
