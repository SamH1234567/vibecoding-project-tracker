import { useEffect, useState } from 'react';
import { DEFAULT_COLUMNS } from '../constants';
import { CONTEXT_TEMPLATE, MAIN_BOARD_ID, seedActivity, seedAnchors, seedBoards, seedTasks, seedTeam } from '../seed';
import { todayISO } from './dates';

// The single data-access layer. Components read and write boards, tasks and
// the activity log only through `useStore()`; nothing else touches localStorage.

// Oldest entries are dropped past this, to stay well inside localStorage limits.
const MAX_ACTIVITY = 500;

const KEYS = {
  boards: 'vibetracker.boards',
  currentBoard: 'vibetracker.currentBoard',
  tasks: 'vibetracker.tasks',
  activity: 'vibetracker.activity',
  me: 'vibetracker.me',
  // Before multiple boards, team and deliverables were stored on their own.
  legacyTeam: 'vibetracker.team',
  legacyAnchors: 'vibetracker.anchors',
};

/**
 * A tiny localStorage hook — survives reloads, no library needed.
 * `initialValue` may be a function, called only when nothing is stored yet.
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const stored = readJSON(key);
    if (stored !== undefined) return stored;
    return typeof initialValue === 'function' ? initialValue() : initialValue;
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* quota or private-mode error — silently ignore for hackathon */
    }
  }, [key, value]);

  return [value, setValue];
}

function readJSON(key) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw != null ? JSON.parse(raw) : undefined;
  } catch {
    return undefined; // corrupt or unavailable storage
  }
}

// First run after the multiple-boards update: wrap any saved team and
// deliverables into a single board so nothing is lost.
function initialBoards() {
  const legacyTeam = readJSON(KEYS.legacyTeam);
  const legacyAnchors = readJSON(KEYS.legacyAnchors);
  if (!legacyTeam && !legacyAnchors) return seedBoards();
  return [
    {
      id: MAIN_BOARD_ID,
      name: 'Vibecoding hackathon',
      columns: DEFAULT_COLUMNS.map((c) => ({ ...c })),
      team: legacyTeam ?? seedTeam(),
      anchors: legacyAnchors ?? seedAnchors(),
      milestones: [],
    },
  ];
}

// Fill in fields added after a task or log entry was first saved.
const normaliseTask = (t) => ({
  boardId: MAIN_BOARD_ID,
  points: null,
  milestoneId: null,
  deliverableId: null,
  subtasks: [],
  ...t,
});
const normaliseEvent = (e) => ({ boardId: MAIN_BOARD_ID, ...e });

export function newBoard(name, team) {
  return {
    id: crypto.randomUUID(),
    name,
    columns: DEFAULT_COLUMNS.map((c) => ({ ...c })),
    team,
    anchors: seedAnchors().map((a) => ({ ...a, url: null })),
    milestones: [],
  };
}

export function useStore() {
  const [boards, setBoards] = useLocalStorage(KEYS.boards, initialBoards);
  const [currentId, setCurrentId] = useLocalStorage(KEYS.currentBoard, MAIN_BOARD_ID);
  const [rawTasks, setTasks] = useLocalStorage(KEYS.tasks, seedTasks);
  // If tasks were saved before the log existed, backfill a history for them.
  const [rawActivity, setActivity] = useLocalStorage(KEYS.activity, () =>
    seedActivity(rawTasks.map(normaliseTask), boards),
  );
  // Who is signed in on each board: { [boardId]: memberId }.
  const [signedIn, setSignedIn] = useLocalStorage(KEYS.me, {});

  const board = boards.find((b) => b.id === currentId) ?? boards[0];
  const allTasks = rawTasks.map(normaliseTask);
  const tasks = allTasks.filter((t) => t.boardId === board.id);
  const activity = rawActivity.map(normaliseEvent).filter((e) => e.boardId === board.id);
  const me = board.team.find((m) => m.id === signedIn[board.id]) ?? null;

  function updateBoard(patch) {
    setBoards((prev) => prev.map((b) => (b.id === board.id ? { ...b, ...patch } : b)));
  }

  // Every change to a task is recorded here; Insights is built from this log.
  function log(task, events) {
    if (events.length === 0) return;
    const at = new Date().toISOString();
    const entries = events.map((e) => ({
      id: crypto.randomUUID(),
      at,
      boardId: task.boardId,
      taskId: task.id,
      title: task.title,
      by: me?.name ?? null,
      ...e,
    }));
    setActivity((prev) => [...prev, ...entries].slice(-MAX_ACTIVITY));
  }

  const contextEvent = (task) => ({
    type: 'context',
    tool: task.contextTool,
    context: task.context,
    outcome: task.outcome,
  });

  function addTask(task) {
    setTasks((prev) => [...prev, task]);
    log(task, [{ type: 'created', to: task.status }, ...(task.contextUpdatedAt ? [contextEvent(task)] : [])]);
  }

  function updateTask(task) {
    const before = allTasks.find((t) => t.id === task.id);
    setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));
    if (!before) return;
    const events = [];
    if (before.status !== task.status) events.push({ type: 'moved', from: before.status, to: task.status });
    if (before.assignee !== task.assignee) events.push({ type: 'handed-off', from: before.assignee, to: task.assignee });
    if (before.contextUpdatedAt !== task.contextUpdatedAt) events.push(contextEvent(task));
    log(task, events);
  }

  function deleteTask(id) {
    const task = allTasks.find((t) => t.id === id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (task) log(task, [{ type: 'deleted' }]);
  }

  function updateAnchor(id, url) {
    updateBoard({ anchors: board.anchors.map((a) => (a.id === id ? { ...a, url } : a)) });
  }

  // Tasks store the assignee by name, so a rename is carried across to them.
  function saveTeam(nextTeam) {
    const renames = new Map();
    for (const member of nextTeam) {
      const before = board.team.find((m) => m.id === member.id);
      if (before && before.name !== member.name) renames.set(before.name, member.name);
    }
    if (renames.size > 0) {
      setTasks((prev) =>
        prev.map((t) =>
          (t.boardId ?? MAIN_BOARD_ID) === board.id && renames.has(t.assignee)
            ? { ...t, assignee: renames.get(t.assignee) }
            : t,
        ),
      );
    }
    updateBoard({ team: nextTeam });
  }

  // Columns and milestones. Removing a milestone unlinks its tasks; columns
  // can only be removed once empty (enforced in the settings drawer).
  function saveBoardSettings({ name, columns, milestones }) {
    const kept = new Set(milestones.map((m) => m.id));
    setTasks((prev) =>
      prev.map((t) =>
        (t.boardId ?? MAIN_BOARD_ID) === board.id && t.milestoneId && !kept.has(t.milestoneId)
          ? { ...t, milestoneId: null }
          : t,
      ),
    );
    updateBoard({ name, columns, milestones });
  }

  // A new board starts with the current team so it is usable straight away.
  function addBoard(name) {
    const created = newBoard(name, board.team.map((m) => ({ ...m })));
    setBoards((prev) => [...prev, created]);
    if (me) setSignedIn((prev) => ({ ...prev, [created.id]: me.id }));
    setCurrentId(created.id);
  }

  function deleteBoard() {
    if (boards.length === 1) return;
    setBoards((prev) => prev.filter((b) => b.id !== board.id));
    setTasks((prev) => prev.filter((t) => (t.boardId ?? MAIN_BOARD_ID) !== board.id));
    setActivity((prev) => prev.filter((e) => (e.boardId ?? MAIN_BOARD_ID) !== board.id));
    setCurrentId(boards.find((b) => b.id !== board.id).id);
  }

  const signIn = (memberId) => setSignedIn((prev) => ({ ...prev, [board.id]: memberId }));
  const signOut = () => setSignedIn((prev) => ({ ...prev, [board.id]: undefined }));

  // Saved data always wins over the seed, so this is the only way back to it.
  function resetDemoData() {
    const nextBoards = seedBoards();
    const nextTasks = seedTasks();
    setBoards(nextBoards);
    setTasks(nextTasks);
    setActivity(seedActivity(nextTasks, nextBoards));
    setCurrentId(MAIN_BOARD_ID);
    // Seeded members get new IDs, so stay signed in as the same name.
    const nextSignedIn = {};
    for (const b of nextBoards) {
      const name = boards.find((x) => x.id === b.id)?.team.find((m) => m.id === signedIn[b.id])?.name;
      const match = name && b.team.find((m) => m.name === name);
      if (match) nextSignedIn[b.id] = match.id;
    }
    setSignedIn(nextSignedIn);
  }

  return {
    boards,
    board,
    switchBoard: setCurrentId,
    addBoard,
    deleteBoard,
    saveBoardSettings,
    tasks,
    addTask,
    updateTask,
    deleteTask,
    activity,
    team: board.team,
    saveTeam,
    anchors: board.anchors,
    updateAnchor,
    me,
    signIn,
    signOut,
    resetDemoData,
  };
}

// Whether a collapsible section above the board is open. Open by default.
export function usePanelOpen(id) {
  return useLocalStorage(`vibetracker.ui.${id}`, true);
}

// A blank task with every field set, ready for the "New task" drawer.
export function createTask(overrides = {}) {
  return {
    id: crypto.randomUUID(),
    boardId: MAIN_BOARD_ID,
    title: '',
    description: '',
    type: 'feature',
    status: DEFAULT_COLUMNS[0].id,
    assignee: '',
    dueDate: null,
    createdDate: todayISO(),
    context: CONTEXT_TEMPLATE,
    contextTool: null,
    contextUpdatedAt: null,
    outcome: '',
    points: null,
    milestoneId: null,
    deliverableId: null,
    subtasks: [],
    ...overrides,
  };
}
