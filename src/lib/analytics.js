import { doneColumnId, firstColumnId, taskPoints } from './board';
import { addDaysISO, dueState, parseISODate, toISODate, todayISO } from './dates';

const DAY = 86_400_000;

// Headline numbers and chart series for the Insights drawer, computed from the
// current board's tasks plus its activity log.
export function computeInsights(tasks, team, activity, board) {
  const doneId = doneColumnId(board);
  const open = tasks.filter((t) => t.status !== doneId);
  const overdue = tasks.filter((t) => dueState(t, t.status === doneId) === 'overdue');

  // When each task last reached the done column, from the log.
  const doneAt = new Map();
  for (const e of activity) {
    if (e.type === 'moved' && e.to === doneId) doneAt.set(e.taskId, e.at);
  }
  const createdAt = new Map(activity.filter((e) => e.type === 'created').map((e) => [e.taskId, e.at]));

  const weekAgo = Date.now() - 7 * DAY;
  const doneThisWeek = tasks.filter((t) => t.status === doneId && doneAt.has(t.id) && new Date(doneAt.get(t.id)) >= weekAgo);

  // Average days from created to done, for finished tasks with a full history.
  const cycleTimes = tasks
    .filter((t) => t.status === doneId && doneAt.has(t.id) && createdAt.has(t.id))
    .map((t) => (new Date(doneAt.get(t.id)) - new Date(createdAt.get(t.id))) / DAY);
  const avgCycleDays = cycleTimes.length ? cycleTimes.reduce((a, b) => a + b, 0) / cycleTimes.length : null;

  // Tasks moved to done per day over the last 14 days (oldest first).
  const completions = [];
  for (let i = 13; i >= 0; i -= 1) completions.push({ date: addDaysISO(-i), count: 0 });
  const byDate = new Map(completions.map((c) => [c.date, c]));
  for (const e of activity) {
    if (e.type === 'moved' && e.to === doneId) {
      const bucket = byDate.get(toISODate(new Date(e.at)));
      if (bucket) bucket.count += 1;
    }
  }

  const workload = team.map((m) => ({ label: m.name, value: open.filter((t) => t.assignee === m.name).length }));

  // How often each AI tool was used when saving context.
  const toolCounts = new Map();
  for (const e of activity) {
    if (e.type === 'context' && e.tool) toolCounts.set(e.tool, (toolCounts.get(e.tool) ?? 0) + 1);
  }
  const tools = [...toolCounts].map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);

  return {
    openCount: open.length,
    overdueCount: overdue.length,
    doneThisWeek: doneThisWeek.length,
    avgCycleDays,
    completions,
    workload,
    tools,
    recent: [...activity].reverse().slice(0, 12),
  };
}

/**
 * Burndown for one milestone: remaining points at the end of each day, from
 * the first task's creation to the later of the due date and today, plus the
 * ideal straight line to zero on the due date. Rebuilt from the activity log,
 * so it reflects what actually happened each day. Unweighted tasks count as 1.
 */
export function computeBurndown(tasks, activity, board, milestone) {
  const scope = tasks.filter((t) => t.milestoneId === milestone.id);
  if (scope.length === 0) return null;
  const doneId = doneColumnId(board);
  const ids = new Set(scope.map((t) => t.id));
  const events = activity.filter((e) => ids.has(e.taskId)).sort((a, b) => a.at.localeCompare(b.at));

  const createdOn = new Map(scope.map((t) => [t.id, t.createdDate]));
  for (const e of events) {
    if (e.type === 'created') createdOn.set(e.taskId, toISODate(new Date(e.at)));
  }

  const today = todayISO();
  const start = [...createdOn.values()].sort()[0];
  const end = milestone.dueDate > today ? milestone.dueDate : today;
  const total = scope.reduce((sum, t) => sum + taskPoints(t), 0);

  const days = [];
  for (let d = parseISODate(start); toISODate(d) <= end; d.setDate(d.getDate() + 1)) days.push(toISODate(d));
  const dueIndex = days.indexOf(milestone.dueDate);

  // Where a task was at the end of a given day, from its last move by then.
  const statusAt = (task, date) => {
    if (date >= today) return task.status;
    const endOfDay = new Date(parseISODate(date).getTime() + DAY);
    let status = firstColumnId(board);
    for (const e of events) {
      if (e.taskId !== task.id || new Date(e.at) >= endOfDay) continue;
      if (e.type === 'created' || e.type === 'moved') status = e.to;
    }
    return status;
  };

  const points = days.map((date, i) => {
    const remaining =
      date > today
        ? null
        : scope
            .filter((t) => createdOn.get(t.id) <= date && statusAt(t, date) !== doneId)
            .reduce((sum, t) => sum + taskPoints(t), 0);
    const ideal = dueIndex <= 0 ? 0 : Math.max(0, total - (total * i) / dueIndex);
    return { date, remaining, ideal };
  });

  const remainingNow = scope.filter((t) => t.status !== doneId).reduce((sum, t) => sum + taskPoints(t), 0);
  return { points, total, remainingNow, dueDate: milestone.dueDate, taskCount: scope.length };
}
