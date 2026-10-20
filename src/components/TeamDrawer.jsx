import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import Avatar from './Avatar';
import Drawer, { Field, inputClass, primaryButtonClass, secondaryButtonClass } from './Drawer';

// Edit team members: name, email and GitHub account (client requirement).
export default function TeamDrawer({ team, tasks, onSave, onClose }) {
  const [draft, setDraft] = useState(team);

  const update = (id, field) => (e) =>
    setDraft(draft.map((m) => (m.id === id ? { ...m, [field]: e.target.value } : m)));

  const addMember = () => setDraft([...draft, { id: crypto.randomUUID(), name: '', email: '', github: '' }]);
  const removeMember = (id) => setDraft(draft.filter((m) => m.id !== id));

  // A member who still owns tasks can't be removed, or those tasks would be orphaned.
  const taskCount = (member) => {
    const original = team.find((m) => m.id === member.id);
    return original ? tasks.filter((t) => t.assignee === original.name).length : 0;
  };

  const names = draft.map((m) => m.name.trim());
  const hasBlank = names.some((n) => n === '');
  const hasDuplicate = new Set(names.map((n) => n.toLowerCase())).size !== names.length;
  const error = hasBlank ? 'Every member needs a name.' : hasDuplicate ? 'Names must be different.' : null;

  function handleSubmit() {
    if (!error) onSave(draft.map((m) => ({ ...m, name: m.name.trim(), email: m.email.trim(), github: m.github.trim() })));
  }

  const footer = (
    <>
      {error && <p className="text-xs text-text-muted">{error}</p>}
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
    <Drawer title="Team" onClose={onClose} onSubmit={handleSubmit} footer={footer}>
      {draft.map((member) => {
        const owned = taskCount(member);
        return (
          <fieldset key={member.id} className="rounded-xl border border-slate-200 p-4">
            <legend className="flex items-center gap-2 px-1 text-sm font-medium">
              <Avatar name={member.name || '?'} />
              {member.name || 'New member'}
            </legend>
            <div className="flex flex-col gap-3">
              <Field label="Name" htmlFor={`name-${member.id}`}>
                <input id={`name-${member.id}`} value={member.name} onChange={update(member.id, 'name')} className={inputClass} />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Email" htmlFor={`email-${member.id}`}>
                  <input
                    id={`email-${member.id}`}
                    type="email"
                    value={member.email}
                    onChange={update(member.id, 'email')}
                    className={inputClass}
                  />
                </Field>
                <Field label="GitHub account" htmlFor={`github-${member.id}`}>
                  <input
                    id={`github-${member.id}`}
                    value={member.github}
                    onChange={update(member.id, 'github')}
                    className={`${inputClass} font-mono`}
                  />
                </Field>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-muted">
                  {owned > 0 ? `Owns ${owned} task${owned === 1 ? '' : 's'}. Hand them off before removing.` : ''}
                </span>
                <button
                  type="button"
                  onClick={() => removeMember(member.id)}
                  disabled={owned > 0 || draft.length === 1}
                  className="flex items-center gap-1 rounded-full px-3 py-1 text-xs text-text-muted hover:bg-slate-100 hover:text-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
                >
                  <Trash2 size={13} aria-hidden="true" />
                  Remove
                </button>
              </div>
            </div>
          </fieldset>
        );
      })}

      <button
        type="button"
        onClick={addMember}
        className="flex items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-slate-300 p-3 text-sm text-text-muted hover:border-brand-primary/50 hover:text-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
      >
        <Plus size={15} aria-hidden="true" />
        Add member
      </button>
    </Drawer>
  );
}
