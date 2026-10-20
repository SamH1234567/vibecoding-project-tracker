import { TASK_TYPES } from './taskTypes';

export default function TaskCard({ task, onOpen }) {
  const type = TASK_TYPES[task.type];

  return (
    <button
      type="button"
      onClick={() => onOpen(task)}
      className="relative w-full overflow-hidden rounded-xl bg-surface-card p-4 pl-5 text-left shadow-sm transition-shadow hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
    >
      <span className={`absolute inset-y-0 left-0 w-1 ${type.stripe}`} aria-hidden="true" />
      <type.Icon size={16} className={`absolute right-3 top-3 ${type.text}`} aria-hidden="true" />
      <span className="sr-only">{type.label}:</span>
      <h3 className="pr-6 text-sm font-medium text-text-primary">{task.title}</h3>
      <p className="mt-2 text-xs text-text-muted">{task.assignee}</p>
    </button>
  );
}
