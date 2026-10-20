export default function TaskCard({ task }) {
  return (
    <article className="rounded-xl bg-surface-card p-4 shadow-sm transition-shadow hover:shadow-md">
      <h3 className="text-sm font-medium text-text-primary">{task.title}</h3>
      <p className="mt-2 text-xs text-text-muted">{task.assignee}</p>
    </article>
  );
}
