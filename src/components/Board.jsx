import { STAGES } from '../constants';
import TaskCard from './TaskCard';

export default function Board({ tasks, onOpenTask, onAddTask }) {
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
              // Ghost card (DESIGN §4): opens a new task already set to this column.
              <button
                type="button"
                onClick={() => onAddTask(stage.id)}
                aria-label={`Add a task to ${stage.label}`}
                className="rounded-xl border-2 border-dashed border-slate-300 p-4 text-center text-sm text-text-muted hover:border-brand-primary/50 hover:text-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              >
                Nothing here yet.
                <span className="mt-1 block text-xs">Add a task</span>
              </button>
            ) : (
              stageTasks.map((task) => <TaskCard key={task.id} task={task} onOpen={onOpenTask} />)
            )}
          </section>
        );
      })}
    </main>
  );
}
