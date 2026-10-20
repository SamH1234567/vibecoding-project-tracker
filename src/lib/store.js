import { useEffect, useState } from 'react';
import { TEAM } from '../constants';
import { CONTEXT_TEMPLATE, seedAnchors, seedTasks } from '../seed';
import { todayISO } from './dates';

// The single data-access layer. Components read and write tasks and anchors
// only through `useStore()`; nothing else touches localStorage.

const KEYS = {
  tasks: 'vibetracker.tasks',
  anchors: 'vibetracker.anchors',
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

  function addTask(task) {
    setTasks((prev) => [...prev, task]);
  }

  function updateTask(task) {
    setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));
  }

  function deleteTask(id) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  // Saved data always wins over the seed, so this is the only way back to it.
  function resetDemoData() {
    setTasks(seedTasks());
    setAnchors(seedAnchors());
  }

  return { tasks, addTask, updateTask, deleteTask, anchors, setAnchors, resetDemoData };
}

// A blank task with every field set, ready for the "New task" drawer.
export function createTask(overrides = {}) {
  return {
    id: crypto.randomUUID(),
    title: '',
    description: '',
    type: 'feature',
    status: 'todo',
    assignee: TEAM[0],
    dueDate: null,
    createdDate: todayISO(),
    context: CONTEXT_TEMPLATE,
    contextTool: null,
    contextUpdatedAt: null,
    outcome: '',
    ...overrides,
  };
}
