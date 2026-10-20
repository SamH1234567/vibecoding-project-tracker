import { useEffect, useState } from 'react';
import { CONTEXT_TEMPLATE, seedAnchors, seedTasks, seedTeam } from '../seed';
import { todayISO } from './dates';

// The single data-access layer. Components read and write tasks, team and anchors
// only through `useStore()`; nothing else touches localStorage.

const KEYS = {
  tasks: 'vibetracker.tasks',
  anchors: 'vibetracker.anchors',
  team: 'vibetracker.team',
};

/**
 * A tiny localStorage hook — survives reloads, no library needed.
 * `initialValue` may be a function, called only when nothing is stored yet.
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw != null) return JSON.parse(raw);
    } catch {
      /* corrupt or unavailable storage — fall back to the initial value */
    }
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

export function useStore() {
  const [tasks, setTasks] = useLocalStorage(KEYS.tasks, seedTasks);
  const [anchors, setAnchors] = useLocalStorage(KEYS.anchors, seedAnchors);
  const [team, setTeam] = useLocalStorage(KEYS.team, seedTeam);

  function addTask(task) {
    setTasks((prev) => [...prev, task]);
  }

  function updateTask(task) {
    setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));
  }

  function deleteTask(id) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  function updateAnchor(id, url) {
    setAnchors((prev) => prev.map((a) => (a.id === id ? { ...a, url } : a)));
  }

  // Tasks store the assignee by name, so a rename is carried across to them.
  function saveTeam(nextTeam) {
    const renames = new Map();
    for (const member of nextTeam) {
      const before = team.find((m) => m.id === member.id);
      if (before && before.name !== member.name) renames.set(before.name, member.name);
    }
    if (renames.size > 0) {
      setTasks((prev) => prev.map((t) => (renames.has(t.assignee) ? { ...t, assignee: renames.get(t.assignee) } : t)));
    }
    setTeam(nextTeam);
  }

  // Saved data always wins over the seed, so this is the only way back to it.
  function resetDemoData() {
    setTasks(seedTasks());
    setAnchors(seedAnchors());
    setTeam(seedTeam());
  }

  return { tasks, addTask, updateTask, deleteTask, team, saveTeam, anchors, updateAnchor, resetDemoData };
}

// Whether a collapsible section above the board is open. Open by default.
export function usePanelOpen(id) {
  return useLocalStorage(`vibetracker.ui.${id}`, true);
}

// A blank task with every field set, ready for the "New task" drawer.
export function createTask(overrides = {}) {
  return {
    id: crypto.randomUUID(),
    title: '',
    description: '',
    type: 'feature',
    status: 'todo',
    assignee: '',
    dueDate: null,
    createdDate: todayISO(),
    context: CONTEXT_TEMPLATE,
    contextTool: null,
    contextUpdatedAt: null,
    outcome: '',
    ...overrides,
  };
}
