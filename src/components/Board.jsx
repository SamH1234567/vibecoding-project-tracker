import { useState } from 'react';
import TaskCard from './TaskCard';

// Drag a card onto another column to change its status (M12). The status
// dropdown in the task drawer stays as the keyboard-accessible alternative.
export default function Board({ board, tasks, team, isVisible, onOpenTask, onAddTask, onHandOff, onCopy, onMove }) {
  const [draggingId, setDraggingId] = useState(null);
  const [overStage, setOverStage] = useState(null);

  const dragging = tasks.find((t) => t.id === draggingId);

  function endDrag() {
    setDraggingId(null);
    setOverStage(null);
  }

  function handleDragOver(e, stageId) {
    if (!dragging) return;
    e.preventDefault(); // allows the drop
    e.dataTransfer.dropEffect = 'move';
    if (overStage !== stageId) setOverStage(stageId);
  }

  function handleDragLeave(e) {
    // Ignore leaving into a child element of the same column.
    if (!e.currentTarget.contains(e.relatedTarget)) setOverStage(null);
  }

  function handleDrop(e, stageId) {
    e.preventDefault();
    if (dragging && dragging.status !== stageId) onMove(dragging, stageId);
    endDrag();
  }

  return (
    // Columns stack on narrow screens so nothing scrolls sideways (WCAG 1.4.10).
    <main
      id="board"
      tabIndex={-1}
      aria-label="Board"
      className="grid grid-cols-1 gap-4 focus:outline-none md:[grid-template-columns:var(--board-cols)]"
      style={{ '--board-cols': `repeat(${board.columns.length}, minmax(0, 1fr))` }}
    >
      {board.columns.map((stage, index) => {
        const isDoneColumn = index === board.columns.length - 1;
        const stageTasks = tasks.filter((t) => t.status === stage.id);
        const shownTasks = stageTasks.filter(isVisible);
        const filtered = shownTasks.length !== stageTasks.length;
        const isTarget = overStage === stage.id && dragging?.status !== stage.id;
        return (
          <section
            key={stage.id}
            aria-labelledby={`column-${stage.id}`}
            onDragOver={(e) => handleDragOver(e, stage.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, stage.id)}
            className={`flex flex-col gap-3 rounded-xl p-3 ${
              isTarget ? 'bg-brand-primary/5 ring-2 ring-inset ring-brand-primary/40' : 'bg-slate-100/70'
            }`}
          >
            <h2
              id={`column-${stage.id}`}
              className="flex items-center justify-between px-1 text-xs font-semibold uppercase tracking-wide text-text-muted"
            >
              {stage.label}
              <span className="font-mono">
                <span aria-hidden="true">{filtered ? `${shownTasks.length}/${stageTasks.length}` : stageTasks.length}</span>
                <span className="sr-only">
                  {filtered
                    ? `, ${shownTasks.length} of ${stageTasks.length} tasks shown`
                    : `, ${stageTasks.length} task${stageTasks.length === 1 ? '' : 's'}`}
                </span>
              </span>
            </h2>
            {stageTasks.length > 0 && shownTasks.length === 0 ? (
              <p className="rounded-xl border-2 border-dashed border-slate-200 p-4 text-center text-xs text-text-muted">
                No matching tasks.
              </p>
            ) : stageTasks.length === 0 ? (
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
              shownTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  team={team}
                  done={isDoneColumn}
                  milestone={board.milestones.find((m) => m.id === task.milestoneId)}
                  deliverable={board.anchors.find((a) => a.id === task.deliverableId)}
                  isDragging={task.id === draggingId}
                  onDragStart={() => setDraggingId(task.id)}
                  onDragEnd={endDrag}
                  onOpen={onOpenTask}
                  onHandOff={onHandOff}
                  onCopy={onCopy}
                />
              ))
            )}
          </section>
        );
      })}
    </main>
  );
}
