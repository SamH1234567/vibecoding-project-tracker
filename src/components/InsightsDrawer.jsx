import { useState } from 'react';
import { TriangleAlert } from 'lucide-react';
import { computeBurndown, computeInsights } from '../lib/analytics';
import { columnLabel } from '../lib/board';
import { formatShortDate, timeAgo } from '../lib/dates';
import BurndownChart from './BurndownChart';
import Drawer, { inputClass, secondaryButtonClass } from './Drawer';

function StatTile({ label, value, hint, alert }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <div className="flex items-center gap-1 text-xs text-text-muted">
        {alert && <TriangleAlert size={12} className="text-due-overdue" aria-hidden="true" />}
        {label}
      </div>
      <div className="mt-1 text-2xl font-semibold tabular-nums">{value}</div>
      {hint && <div className="text-xs text-text-muted">{hint}</div>}
    </div>
  );
}

function ChartSection({ title, children }) {
  return (
    <section className="flex flex-col gap-2">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-text-muted">{title}</h3>
      {children}
    </section>
  );
}

// Horizontal bars, one series in the brand hue. Values are written beside each
// bar, so the numbers never depend on reading the bar length or colour.
function BarList({ data, empty }) {
  if (data.length === 0) return <p className="text-sm text-text-muted">{empty}</p>;
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <ul className="flex flex-col gap-1.5">
      {data.map((d) => (
        <li key={d.label} className="grid grid-cols-[7rem_1fr_2rem] items-center gap-2 text-xs" title={`${d.label}: ${d.value}`}>
          <span className="truncate">{d.label}</span>
          <span className="h-3 rounded-r bg-slate-100">
            {d.value > 0 && (
              <span className="block h-full rounded-r bg-brand-primary" style={{ width: `${(d.value / max) * 100}%` }} />
            )}
          </span>
          <span className="text-right font-mono tabular-nums text-text-muted">{d.value}</span>
        </li>
      ))}
    </ul>
  );
}

// Columns for the last 14 days. Hover a day for its count; the busiest day is labelled.
function CompletionChart({ data }) {
  const max = Math.max(1, ...data.map((d) => d.count));
  const total = data.reduce((a, d) => a + d.count, 0);
  return (
    <figure>
      <div className="flex h-24 items-end gap-0.5 border-b border-slate-300" aria-hidden="true">
        {data.map((d) => (
          <div key={d.date} className="group flex h-full flex-1 flex-col justify-end" title={`${formatShortDate(d.date)}: ${d.count} done`}>
            {d.count === max && d.count > 0 && (
              <span className="mb-0.5 text-center font-mono text-xs text-text-muted">{d.count}</span>
            )}
            <div
              className="rounded-t bg-brand-primary group-hover:bg-brand-primary/80"
              style={{ height: `${(d.count / max) * 100}%`, minHeight: d.count ? '4px' : 0 }}
            />
          </div>
        ))}
      </div>
      <figcaption className="mt-1 flex justify-between text-xs text-text-muted">
        <span>{formatShortDate(data[0].date)}</span>
        <span>Today</span>
        <span className="sr-only">{total} tasks completed in the last 14 days.</span>
      </figcaption>
      {/* The same numbers as text, since the bars are visual only (WCAG 1.1.1). */}
      <ul className="sr-only">
        {data.map((d) => (
          <li key={d.date}>
            {formatShortDate(d.date)}: {d.count} done
          </li>
        ))}
      </ul>
    </figure>
  );
}

function describe(e, board) {
  switch (e.type) {
    case 'created':
      return `Created “${e.title}”`;
    case 'moved':
      return `Moved “${e.title}” to ${columnLabel(board, e.to)}`;
    case 'handed-off':
      return `Handed “${e.title}” to ${e.to}`;
    case 'context':
      return `Updated context on “${e.title}”${e.tool ? ` (${e.tool})` : ''}`;
    case 'deleted':
      return `Deleted “${e.title}”`;
    default:
      return e.title;
  }
}

// Analytics over the activity log (client requirement), opened from the header.
export default function InsightsDrawer({ board, tasks, team, activity, onClose }) {
  const s = computeInsights(tasks, team, activity, board);
  const [milestoneId, setMilestoneId] = useState(board.milestones[0]?.id ?? '');
  const milestone = board.milestones.find((m) => m.id === milestoneId);
  const burndown = milestone ? computeBurndown(tasks, activity, board, milestone) : null;

  const footer = (
    <button type="button" onClick={onClose} className={`${secondaryButtonClass} ml-auto`}>
      Close
    </button>
  );

  return (
    <Drawer title="Insights" onClose={onClose} onSubmit={onClose} footer={footer}>
      <div className="grid grid-cols-2 gap-3">
        <StatTile label="Open tasks" value={s.openCount} />
        <StatTile label="Overdue" value={s.overdueCount} alert={s.overdueCount > 0} />
        <StatTile label="Done this week" value={s.doneThisWeek} />
        <StatTile
          label="Avg. time to done"
          value={s.avgCycleDays === null ? '–' : `${s.avgCycleDays.toFixed(1)} d`}
          hint="Created → Done"
        />
      </div>

      <ChartSection title="Burndown">
        {board.milestones.length === 0 ? (
          <p className="text-sm text-text-muted">Add a milestone in Board settings to see a burndown.</p>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <label htmlFor="burndown-milestone" className="text-xs text-text-muted">
                Milestone
              </label>
              <select
                id="burndown-milestone"
                value={milestoneId}
                onChange={(e) => setMilestoneId(e.target.value)}
                className={`${inputClass} w-auto py-1 text-xs`}
              >
                {board.milestones.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} (due {formatShortDate(m.dueDate)})
                  </option>
                ))}
              </select>
              {burndown && (
                <span className="ml-auto text-xs text-text-muted">
                  {burndown.remainingNow} of {burndown.total} pts left · {burndown.taskCount} tasks
                </span>
              )}
            </div>
            {burndown ? (
              <BurndownChart data={burndown} />
            ) : (
              <p className="text-sm text-text-muted">No tasks in this milestone yet.</p>
            )}
          </>
        )}
      </ChartSection>

      <ChartSection title="Completed per day · last 14 days">
        <CompletionChart data={s.completions} />
      </ChartSection>

      <ChartSection title="Open tasks per person">
        <BarList data={s.workload} empty="No team members." />
      </ChartSection>

      <ChartSection title="AI tool used when saving context">
        <BarList data={s.tools} empty="No context saved with an AI tool yet." />
      </ChartSection>

      <ChartSection title="Recent activity">
        {s.recent.length === 0 ? (
          <p className="text-sm text-text-muted">Nothing yet.</p>
        ) : (
          <ol className="flex flex-col gap-1.5">
            {s.recent.map((e) => (
              <li key={e.id} className="flex items-baseline justify-between gap-3 text-xs">
                <span className="min-w-0 truncate">
                  {describe(e, board)}
                  {e.by && <span className="text-text-muted"> · {e.by}</span>}
                </span>
                <span className="shrink-0 text-text-muted">{timeAgo(e.at)}</span>
              </li>
            ))}
          </ol>
        )}
      </ChartSection>
    </Drawer>
  );
}
