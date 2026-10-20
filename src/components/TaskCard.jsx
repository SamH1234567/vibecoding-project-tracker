export default function TaskCard({ task, onOpen }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(task)}
      className="w-full rounded-xl bg-surface-card p-4 text-left shadow-sm transition-shadow hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
    >
      <h3 className="text-sm font-medium text-text-primary">{task.title}</h3>
      <p className="mt-2 text-xs text-text-muted">{task.assignee}</p>
    </button>
  );
}
