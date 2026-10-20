import { useCallback, useState } from 'react';
import { Pin, Plus, Users } from 'lucide-react';
import AnchorBoard, { AnchorSummary } from './components/AnchorBoard';
import Board from './components/Board';
import CollapsibleSection from './components/CollapsibleSection';
import TaskDrawer from './components/TaskDrawer';
import TeamDrawer from './components/TeamDrawer';
import TeamStrip, { TeamSummary } from './components/TeamStrip';
import Toast from './components/Toast';
import { copyText, toBriefing } from './lib/briefing';
import { createTask, useStore } from './lib/store';

/**
 * Vibecoding Project Tracker — starter scaffold.
 *
 * This file is intentionally almost empty. The boilerplate (Vite, React,
 * Tailwind) is configured for you, plus a few shared constants and a
 * localStorage helper. Everything visible on screen, you build.
 *
 * Where to start (build sequence in Phase 3):
 *   - M4  data-model    : render the four columns and the task cards below.
 *   - M5  crud-modal    : add the "+" button modal and the edit-on-click modal.
 *   - M6  tag-style     : feature vs. bug color coding (uses DESIGN.md §2 colors).
 *   - M7  task-owner    : assignee badge + "Hand off to..." dropdown.
 *   - M8  due-tint      : color cards by due date (uses DESIGN.md §2 due-state colors).
 *   - M9  context       : a curated Context briefing field on the modal.
 *   - M10 copy-prompt   : a "Copy as Prompt Context" button that serializes the task + context.
 *   - M11 anchors       : the Anchor Board above the Kanban.
 *   - M12 secret-sauce  : the one open-ended thing that makes your tracker yours.
 *
 * Search the file for `TODO M<n>` to find the right hook for each milestone.
 */

/**
 * @typedef {Object} Task
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {'feature'|'bug'} type
 * @property {'todo'|'in-progress'|'review'|'done'} status
 * @property {string} assignee
 * @property {string|null} dueDate          ISO 'YYYY-MM-DD'
 * @property {string} createdDate           ISO 'YYYY-MM-DD'
 * @property {string} context               Markdown briefing (M9)
 * @property {string|null} contextTool      one of CONTEXT_TOOLS (M9)
 * @property {string|null} contextUpdatedAt ISO timestamp (M9)
 * @property {string} outcome               what the AI produced (client requirement)
 */

export default function App() {
  const { tasks, addTask, updateTask, deleteTask, team, saveTeam, anchors, updateAnchor, resetDemoData } = useStore();

  // The task open in the drawer, or null when it is closed.
  const [editing, setEditing] = useState(null);
  const [managingTeam, setManagingTeam] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, error = false) => setToast({ message, error, id: crypto.randomUUID() });
  const clearToast = useCallback(() => setToast(null), []);

  const openNew = (status = 'todo') =>
    setEditing({ task: createTask({ status, assignee: team[0]?.name ?? '' }), isNew: true });
  const openEdit = (task) => setEditing({ task, isNew: false });
  const closeDrawer = () => setEditing(null);

  function handleSave(task) {
    if (editing.isNew) {
      addTask(task);
    } else {
      updateTask(task);
      if (task.assignee !== editing.task.assignee) showToast(`Handed off to ${task.assignee}.`);
    }
    closeDrawer();
  }

  function handleHandOff(task, assignee) {
    updateTask({ ...task, assignee });
    showToast(`Handed off to ${assignee}.`);
  }

  async function handleCopy(task) {
    try {
      await copyText(toBriefing(task));
      showToast('Context copied, ready to paste.');
    } catch {
      showToast("Couldn't copy. Check clipboard permissions.", true);
    }
  }

  function handleSaveTeam(nextTeam) {
    saveTeam(nextTeam);
    setManagingTeam(false);
  }

  function handleDelete(task) {
    deleteTask(task.id);
    closeDrawer();
  }

  function handleReset() {
    if (window.confirm('Reset to the demo data? Your changes will be lost.')) resetDemoData();
  }

  return (
    <div className="min-h-screen bg-surface-page p-6 font-sans text-text-primary">
      <header className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-brand-primary">Sprint</h1>
          <p className="text-sm text-text-muted">
            Pick up any task right where the last person — or AI — left off.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="rounded-full border border-slate-300 bg-surface-card px-4 py-2 text-sm text-text-muted hover:text-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          >
            Reset demo data
          </button>
          <button
            type="button"
            onClick={() => openNew()}
            className="flex items-center gap-1.5 rounded-full bg-brand-primary px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
          >
            <Plus size={16} aria-hidden="true" />
            New task
          </button>
        </div>
      </header>

      <CollapsibleSection id="deliverables" icon={Pin} title="Deliverables" summary={<AnchorSummary anchors={anchors} />}>
        <AnchorBoard anchors={anchors} onSave={updateAnchor} />
      </CollapsibleSection>

      <CollapsibleSection
        id="team"
        icon={Users}
        title="Team"
        summary={<TeamSummary team={team} tasks={tasks} />}
        actions={
          <button
            type="button"
            onClick={() => setManagingTeam(true)}
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-text-muted hover:bg-slate-100 hover:text-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          >
            <Users size={14} aria-hidden="true" />
            Manage team
          </button>
        }
      >
        <TeamStrip team={team} tasks={tasks} onOpenTask={openEdit} />
      </CollapsibleSection>

      <Board tasks={tasks} team={team} onOpenTask={openEdit} onAddTask={openNew} onHandOff={handleHandOff} onCopy={handleCopy} />

      {editing && (
        <TaskDrawer
          key={editing.task.id}
          task={editing.task}
          isNew={editing.isNew}
          team={team}
          onSave={handleSave}
          onDelete={handleDelete}
          onCopy={handleCopy}
          onClose={closeDrawer}
        />
      )}

      {managingTeam && (
        <TeamDrawer team={team} tasks={tasks} onSave={handleSaveTeam} onClose={() => setManagingTeam(false)} />
      )}

      <Toast toast={toast} onDone={clearToast} />
    </div>
  );
}
