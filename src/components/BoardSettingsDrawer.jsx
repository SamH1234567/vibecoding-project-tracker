import { useState } from 'react';
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import Drawer, { Field, FormError, inputClass, primaryButtonClass, secondaryButtonClass } from './Drawer';

const iconButton =
  'rounded-full p-1.5 text-text-muted hover:bg-slate-100 hover:text-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent';

const addButton =
  'flex items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-slate-300 p-2 text-sm text-text-muted hover:border-brand-primary/50 hover:text-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary';

// Board name, customisable columns and dated milestones.
export default function BoardSettingsDrawer({ board, tasks, canDelete, onSave, onDelete, onClose }) {
  const [name, setName] = useState(board.name);
  const [columns, setColumns] = useState(board.columns);
  const [milestones, setMilestones] = useState(board.milestones);

  const taskCount = (columnId) => tasks.filter((t) => t.status === columnId).length;

  const renameColumn = (id, label) => setColumns(columns.map((c) => (c.id === id ? { ...c, label } : c)));
  const moveColumn = (index, delta) => {
    const next = [...columns];
    [next[index], next[index + delta]] = [next[index + delta], next[index]];
    setColumns(next);
  };
  const addColumn = () => setColumns([...columns, { id: crypto.randomUUID(), label: '' }]);

  const updateMilestone = (id, field, value) =>
    setMilestones(milestones.map((m) => (m.id === id ? { ...m, [field]: value } : m)));
  const addMilestone = () => setMilestones([...milestones, { id: crypto.randomUUID(), name: '', dueDate: '' }]);

  const error = !name.trim()
    ? 'The board needs a name.'
    : columns.some((c) => !c.label.trim())
      ? 'Every column needs a name.'
      : milestones.some((m) => !m.name.trim() || !m.dueDate)
        ? 'Every milestone needs a name and a due date.'
        : null;

  function handleSubmit() {
    if (error) return;
    onSave({
      name: name.trim(),
      columns: columns.map((c) => ({ ...c, label: c.label.trim() })),
      milestones: milestones.map((m) => ({ ...m, name: m.name.trim() })),
    });
  }

  function handleDelete() {
    if (window.confirm(`Delete the "${board.name}" board and all its tasks? This can't be undone.`)) onDelete();
  }

  const footer = (
    <>
      {canDelete && (
        <button
          type="button"
          onClick={handleDelete}
          className="rounded-full px-4 py-2 text-sm text-text-muted hover:bg-slate-100 hover:text-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
        >
          Delete board
        </button>
      )}
      <FormError message={error} />
      <div className="ml-auto flex gap-2">
        <button type="button" onClick={onClose} className={secondaryButtonClass}>
          Cancel
        </button>
        <button type="submit" disabled={Boolean(error)} className={primaryButtonClass}>
          Save
        </button>
      </div>
    </>
  );

  return (
    <Drawer title="Board settings" onClose={onClose} onSubmit={handleSubmit} footer={footer}>
      <Field label="Board name" htmlFor="board-name">
        <input
          id="board-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-invalid={!name.trim()}
          className={inputClass}
        />
      </Field>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1 text-xs font-medium text-text-muted">Columns</legend>
        <p className="text-xs text-text-muted">
          The last column counts as done. A column can only be removed once it's empty.
        </p>
        {columns.map((column, index) => {
          const count = taskCount(column.id);
          const isLast = index === columns.length - 1;
          return (
            <div key={column.id} className="flex items-center gap-1">
              <input
                value={column.label}
                onChange={(e) => renameColumn(column.id, e.target.value)}
                aria-label={`Column ${index + 1} name`}
                aria-invalid={!column.label.trim()}
                className={inputClass}
              />
              <span className="w-16 shrink-0 text-center text-xs text-text-muted">
                {isLast ? 'Done' : `${count} task${count === 1 ? '' : 's'}`}
              </span>
              <button type="button" onClick={() => moveColumn(index, -1)} disabled={index === 0} aria-label={`Move ${column.label || "column"} earlier`} className={iconButton}>
                <ArrowUp size={14} aria-hidden="true" />
              </button>
              <button type="button" onClick={() => moveColumn(index, 1)} disabled={isLast} aria-label={`Move ${column.label || "column"} later`} className={iconButton}>
                <ArrowDown size={14} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => setColumns(columns.filter((c) => c.id !== column.id))}
                disabled={count > 0 || columns.length <= 2}
                aria-label={`Remove ${column.label || 'column'}`}
                title={count > 0 ? 'Move its tasks first' : columns.length <= 2 ? 'A board needs at least 2 columns' : 'Remove'}
                className={iconButton}
              >
                <Trash2 size={14} aria-hidden="true" />
              </button>
            </div>
          );
        })}
        <button type="button" onClick={addColumn} className={addButton}>
          <Plus size={15} aria-hidden="true" />
          Add column
        </button>
      </fieldset>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1 text-xs font-medium text-text-muted">Milestones</legend>
        <p className="text-xs text-text-muted">Tasks can be added to a milestone; Insights shows its burndown.</p>
        {milestones.map((m, index) => (
          <div key={m.id} className="flex flex-wrap items-center gap-2 sm:flex-nowrap">
            <input
              value={m.name}
              onChange={(e) => updateMilestone(m.id, 'name', e.target.value)}
              aria-label={`Milestone ${index + 1} name`}
              aria-invalid={!m.name.trim()}
              placeholder="Name"
              className={`${inputClass} min-w-0 flex-1`}
            />
            <input
              type="date"
              value={m.dueDate}
              onChange={(e) => updateMilestone(m.id, 'dueDate', e.target.value)}
              aria-label={`Milestone ${index + 1} due date`}
              aria-invalid={!m.dueDate}
              className={`${inputClass} w-40 shrink-0`}
            />
            <button
              type="button"
              onClick={() => setMilestones(milestones.filter((x) => x.id !== m.id))}
              aria-label={`Remove ${m.name || 'milestone'}`}
              title="Remove (its tasks stay, without a milestone)"
              className={iconButton}
            >
              <Trash2 size={14} aria-hidden="true" />
            </button>
          </div>
        ))}
        <button type="button" onClick={addMilestone} className={addButton}>
          <Plus size={15} aria-hidden="true" />
          Add milestone
        </button>
      </fieldset>
    </Drawer>
  );
}
