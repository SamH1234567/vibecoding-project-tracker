import { useCallback, useState } from 'react';
import { ChartColumn, Layers, LogOut, Pin, Plus, Settings, Users } from 'lucide-react';
import AnchorBoard, { AnchorSummary } from './components/AnchorBoard';
import Avatar from './components/Avatar';
import Board from './components/Board';
import BoardSettingsDrawer from './components/BoardSettingsDrawer';
import CollapsibleSection from './components/CollapsibleSection';
import FilterBar from './components/FilterBar';
import InsightsDrawer from './components/InsightsDrawer';
import SignIn from './components/SignIn';
import TaskDrawer from './components/TaskDrawer';
import TeamDrawer from './components/TeamDrawer';
import TeamStrip, { TeamSummary } from './components/TeamStrip';
import Toast from './components/Toast';
import { doneColumnId, firstColumnId } from './lib/board';
import { copyText, toBriefing } from './lib/briefing';
import { NO_FILTERS, matchesFilters } from './lib/filters';
import { createTask, useStore } from './lib/store';

/**
 * Sprint — vibecoding project tracker.
 *
 * Built on the hackathon starter (Vite, React, Tailwind, localStorage).
 * All data goes through `lib/store.js`; demo data lives in `seed.js`.
 * REQUIREMENTS.md maps each feature to the code that builds it.
 */

/**
 * @typedef {Object} Task
 * @property {string} id
 * @property {string} boardId
 * @property {string} title
 * @property {string} description
 * @property {'feature'|'bug'} type
 * @property {string} status                one of the board's column IDs; the last means done
 * @property {string} assignee              a member name from the board's team
 * @property {string|null} dueDate          ISO 'YYYY-MM-DD'
 * @property {string} createdDate           ISO 'YYYY-MM-DD'
 * @property {string} context               Markdown briefing (M9)
 * @property {string|null} contextTool      one of CONTEXT_TOOLS (M9)
 * @property {string|null} contextUpdatedAt ISO timestamp (M9)
 * @property {string} outcome               what the AI produced (client requirement)
 * @property {number|null} points           story points 1/2/3/5/8; null counts as 1
 * @property {string|null} milestoneId      one of the board's milestones
 * @property {string|null} deliverableId    one of the board's anchors
 * @property {{id: string, title: string, done: boolean}[]} subtasks  sub-requirements
 */

const headerButton =
  'flex items-center gap-1.5 rounded-full border border-slate-300 bg-surface-card px-4 py-2 text-sm text-text-muted hover:text-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary';

const quietButton =
  'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-text-muted hover:bg-slate-100 hover:text-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary';

export default function App() {
  const {
    boards,
    board,
    switchBoard,
    addBoard,
    deleteBoard,
    saveBoardSettings,
    tasks,
    addTask,
    updateTask,
    deleteTask,
    activity,
    team,
    saveTeam,
    anchors,
    updateAnchor,
    me,
    signIn,
    signOut,
    resetDemoData,
  } = useStore();

  // The task open in the drawer, or null when it is closed.
  const [editing, setEditing] = useState(null);
  const [managingTeam, setManagingTeam] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [filters, setFilters] = useState(NO_FILTERS);
  const [toast, setToast] = useState(null);

  const showToast = (message, error = false) => setToast({ message, error, id: crypto.randomUUID() });
  const clearToast = useCallback(() => setToast(null), []);

  if (!me) return <SignIn board={board} team={team} onSignIn={signIn} />;

  const doneId = doneColumnId(board);
  const isVisible = (task) => matchesFilters(task, filters, task.status === doneId);

  const openNew = (status = firstColumnId(board)) =>
    setEditing({ task: createTask({ boardId: board.id, status, assignee: me.name }), isNew: true });
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
      await copyText(toBriefing(task, board));
      showToast('Context copied, ready to paste.');
    } catch {
      showToast("Couldn't copy. Check clipboard permissions.", true);
    }
  }

  function handleMove(task, status) {
    updateTask({ ...task, status });
  }

  function handleSaveTeam(nextTeam) {
    saveTeam(nextTeam);
    setManagingTeam(false);
  }

  function handleDelete(task) {
    deleteTask(task.id);
    closeDrawer();
  }

  // Filters belong to the board you're looking at, so they reset on a switch.
  function handleSwitchBoard(id) {
    setFilters(NO_FILTERS);
    switchBoard(id);
  }

  function handleNewBoard() {
    const name = window.prompt('Name for the new board');
    if (!name?.trim()) return;
    setFilters(NO_FILTERS);
    addBoard(name.trim());
    showToast(`Created "${name.trim()}".`);
  }

  function handleSaveSettings(settings) {
    saveBoardSettings(settings);
    setShowSettings(false);
  }

  function handleDeleteBoard() {
    setFilters(NO_FILTERS);
    deleteBoard();
    setShowSettings(false);
  }

  function handleReset() {
    if (window.confirm('Reset to the demo data? Your changes will be lost.')) {
      setFilters(NO_FILTERS);
      resetDemoData();
    }
  }

  return (
    <div className="min-h-screen bg-surface-page p-4 font-sans text-text-primary sm:p-6">
      {/* Skip link (WCAG 2.4.1): jumps past the header, deliverables, team and filters. */}
      <a
        href="#board"
        className="sr-only rounded-full bg-brand-primary px-4 py-2 text-sm font-medium text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
      >
        Skip to board
      </a>
      <header className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-brand-primary">Sprint</h1>
          <p className="text-sm text-text-muted">
            Pick up any task right where the last person — or AI — left off.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => setShowInsights(true)} className={headerButton}>
            <ChartColumn size={15} aria-hidden="true" />
            Insights
          </button>
          <button type="button" onClick={handleReset} className={headerButton}>
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

      <nav aria-label="Boards" className="mb-6 flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4">
        <Layers size={15} className="text-text-muted" aria-hidden="true" />
        <select
          value={board.id}
          onChange={(e) => handleSwitchBoard(e.target.value)}
          aria-label="Board"
          className="rounded-full border border-line-control bg-surface-card py-1.5 pl-3 pr-8 text-sm font-medium focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
        >
          {boards.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
        <button type="button" onClick={() => setShowSettings(true)} className={quietButton}>
          <Settings size={14} aria-hidden="true" />
          Board settings
        </button>
        <button type="button" onClick={handleNewBoard} className={quietButton}>
          <Plus size={14} aria-hidden="true" />
          New board
        </button>

        <div className="flex items-center gap-2 text-sm sm:ml-auto">
          <Avatar name={me.name} />
          <span>{me.name}</span>
          <button type="button" onClick={signOut} className={quietButton}>
            <LogOut size={14} aria-hidden="true" />
            Switch user
          </button>
        </div>
      </nav>

      <CollapsibleSection id="deliverables" icon={Pin} title="Deliverables" summary={<AnchorSummary anchors={anchors} />}>
        <AnchorBoard
          anchors={anchors}
          tasks={tasks}
          board={board}
          onSave={updateAnchor}
          onShowTasks={(id) => setFilters({ ...NO_FILTERS, deliverable: id })}
        />
      </CollapsibleSection>

      <CollapsibleSection
        id="team"
        icon={Users}
        title="Team"
        summary={<TeamSummary board={board} team={team} tasks={tasks} />}
        actions={
          <button type="button" onClick={() => setManagingTeam(true)} className={quietButton}>
            <Users size={14} aria-hidden="true" />
            Manage team
          </button>
        }
      >
        <TeamStrip board={board} team={team} tasks={tasks} onOpenTask={openEdit} />
      </CollapsibleSection>

      <FilterBar
        filters={filters}
        setFilters={setFilters}
        team={team}
        anchors={anchors}
        me={me}
        shown={tasks.filter(isVisible).length}
        total={tasks.length}
      />

      <Board
        key={board.id}
        board={board}
        tasks={tasks}
        team={team}
        isVisible={isVisible}
        onOpenTask={openEdit}
        onAddTask={openNew}
        onHandOff={handleHandOff}
        onCopy={handleCopy}
        onMove={handleMove}
      />

      {editing && (
        <TaskDrawer
          key={editing.task.id}
          task={editing.task}
          isNew={editing.isNew}
          board={board}
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

      {showSettings && (
        <BoardSettingsDrawer
          key={board.id}
          board={board}
          tasks={tasks}
          canDelete={boards.length > 1}
          onSave={handleSaveSettings}
          onDelete={handleDeleteBoard}
          onClose={() => setShowSettings(false)}
        />
      )}

      {showInsights && (
        <InsightsDrawer board={board} tasks={tasks} team={team} activity={activity} onClose={() => setShowInsights(false)} />
      )}

      <Toast toast={toast} onDone={clearToast} />
    </div>
  );
}
