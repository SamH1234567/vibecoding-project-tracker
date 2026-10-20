import { STAGES } from '../constants';
import TaskCard from './TaskCard';

export default function Board({ tasks }) {
  return (
    <main className="grid grid-cols-4 gap-4">
      {STAGES.map((stage) => {
        const stageTasks = tasks.filter((t) => t.status === stage.id);
        return (
          <section key={stage.id} className="flex flex-col gap-3 rounded-xl bg-slate-100/70 p-3">
            <h2 className="flex items-center justify-between px-1 text-xs font-semibold uppercase tracking-wide text-text-muted">
              {stage.label}
              <span className="font-mono">{stageTasks.length}</span>
            </h2>
            {stageTasks.length === 0 ? (
              <div className="rounded-xl border-2 border-dashed border-slate-300 p-4 text-center text-sm text-text-muted">
                Nothing here yet.
              </div>
            ) : (
              stageTasks.map((task) => <TaskCard key={task.id} task={task} />)
            )}
          </section>
        );
      })}
    </main>
  );
}
