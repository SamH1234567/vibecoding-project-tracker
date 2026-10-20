import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { inputClass } from './Drawer';

// Sub-requirements inside a task: a checklist edited as part of the draft.
export default function SubtaskList({ subtasks, onChange }) {
  const [text, setText] = useState('');
  const doneCount = subtasks.filter((s) => s.done).length;

  function add() {
    const title = text.trim();
    if (!title) return;
    onChange([...subtasks, { id: crypto.randomUUID(), title, done: false }]);
    setText('');
  }

  const toggle = (id) => onChange(subtasks.map((s) => (s.id === id ? { ...s, done: !s.done } : s)));
  const remove = (id) => onChange(subtasks.filter((s) => s.id !== id));

  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-1 flex w-full justify-between text-xs font-medium text-text-muted">
        Sub-requirements
        {subtasks.length > 0 && (
          <span className="font-normal">
            {doneCount} of {subtasks.length} done
          </span>
        )}
      </legend>

      {subtasks.length > 0 && (
        <ul className="flex flex-col gap-1">
          {subtasks.map((s) => (
            <li key={s.id} className="group flex items-center gap-2 rounded-lg px-1 py-0.5 hover:bg-slate-50">
              <input
                type="checkbox"
                id={`subtask-${s.id}`}
                checked={s.done}
                onChange={() => toggle(s.id)}
                className="h-4 w-4 rounded border-slate-300 accent-brand-primary"
              />
              <label htmlFor={`subtask-${s.id}`} className={`flex-1 text-sm ${s.done ? 'text-text-muted line-through' : ''}`}>
                {s.title}
              </label>
              <button
                type="button"
                onClick={() => remove(s.id)}
                aria-label={`Remove "${s.title}"`}
                className="rounded-full p-1 text-text-muted opacity-0 hover:bg-slate-100 hover:text-text-primary focus:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary group-hover:opacity-100"
              >
                <X size={13} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            // Enter adds an item instead of submitting the whole task form.
            if (e.key === 'Enter') {
              e.preventDefault();
              add();
            }
          }}
          placeholder="Add a sub-requirement"
          aria-label="New sub-requirement"
          className={inputClass}
        />
        <button
          type="button"
          onClick={add}
          disabled={!text.trim()}
          aria-label="Add sub-requirement"
          className="shrink-0 rounded-full border border-slate-300 p-2 text-text-muted hover:bg-slate-50 hover:text-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary disabled:opacity-40"
        >
          <Plus size={15} aria-hidden="true" />
        </button>
      </div>
    </fieldset>
  );
}
