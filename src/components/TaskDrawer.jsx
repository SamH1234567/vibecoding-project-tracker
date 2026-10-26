import { useState } from 'react';
import { Copy } from 'lucide-react';
import { POINTS } from '../lib/board';
import ContextField from './ContextField';
import Drawer, { Field, inputClass, primaryButtonClass, secondaryButtonClass } from './Drawer';
import SubtaskList from './SubtaskList';
import { TASK_TYPES } from './taskTypes';

// The same drawer is used for creating and editing a task (M5).
export default function TaskDrawer({ task, isNew, board, team, onSave, onDelete, onCopy, onClose }) {
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
        {/* Copies what is on screen, including unsaved edits. */}
        <button
          type="button"
          onClick={() => onCopy(draft)}
          disabled={!canSave}
          className={`${secondaryButtonClass} flex items-center gap-1.5 disabled:cursor-not-allowed disabled:opacity-50`}
        >
          <Copy size={14} aria-hidden="true" />
          Copy context
        </button>
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
      <Field label="Title" htmlFor="task-title" required>
        <input
          id="task-title"
          value={draft.title}
          onChange={set('title')}
          required
          aria-describedby="task-title-hint"
          className={inputClass}
        />
        {/* Says why Save is unavailable instead of only disabling it (WCAG 3.3.2). */}
        <p id="task-title-hint" className="text-xs text-text-muted">
          {canSave ? '' : 'Add a title to save the task.'}
        </p>
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <fieldset className="flex flex-col gap-1">
          <legend className="mb-1 text-xs font-medium text-text-muted">Type</legend>
          <div className="flex gap-2">
            {Object.entries(TASK_TYPES).map(([value, type]) => (
              <label
                key={value}
                className={`flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-sm has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand-primary ${
                  draft.type === value ? type.selected : 'border-line-control text-text-muted hover:bg-slate-50'
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
            {board.columns.map((s) => (
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

        <Field label="Points" htmlFor="task-points">
          <select
            id="task-points"
            value={draft.points ?? ''}
            onChange={(e) => setDraft({ ...draft, points: e.target.value ? Number(e.target.value) : null })}
            className={inputClass}
          >
            <option value="">Not estimated (counts as 1)</option>
            {POINTS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Milestone" htmlFor="task-milestone">
          <select
            id="task-milestone"
            value={draft.milestoneId ?? ''}
            onChange={(e) => setDraft({ ...draft, milestoneId: e.target.value || null })}
            className={inputClass}
          >
            <option value="">None</option>
            {board.milestones.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="For deliverable" htmlFor="task-deliverable">
          <select
            id="task-deliverable"
            value={draft.deliverableId ?? ''}
            onChange={(e) => setDraft({ ...draft, deliverableId: e.target.value || null })}
            className={inputClass}
          >
            <option value="">None</option>
            {board.anchors.map((a) => (
              <option key={a.id} value={a.id}>
                {a.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <SubtaskList subtasks={draft.subtasks} onChange={(subtasks) => setDraft({ ...draft, subtasks })} />

      <ContextField draft={draft} setDraft={setDraft} />
    </Drawer>
  );
}
