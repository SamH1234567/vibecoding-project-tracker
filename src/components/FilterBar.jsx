import { Check, Search, X } from 'lucide-react';
import { DUE_FILTERS, NO_FILTERS, isFiltering } from '../lib/filters';
import { TASK_TYPES } from './taskTypes';

const controlClass =
  'min-h-[2rem] rounded-full border border-line-control bg-surface-card py-1.5 text-xs text-text-primary placeholder:text-slate-500 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/30';

// Narrow the board by assignee, type, due state, deliverable or text (M12).
export default function FilterBar({ filters, setFilters, team, anchors, me, shown, total }) {
  const set = (field) => (e) => setFilters({ ...filters, [field]: e.target.value });
  const active = isFiltering(filters);

  return (
    <div role="search" aria-label="Filter tasks" className="mb-4 flex flex-wrap items-center gap-2">
      <div className="relative w-full sm:w-auto">
        <Search size={13} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" aria-hidden="true" />
        <input
          type="search"
          value={filters.search}
          onChange={set('search')}
          placeholder="Search tasks and context"
          aria-label="Search tasks and context"
          className={`${controlClass} w-full pl-8 pr-3 sm:w-60`}
        />
      </div>

      {me && (
        <button
          type="button"
          onClick={() => setFilters({ ...filters, assignee: filters.assignee === me.name ? '' : me.name })}
          aria-pressed={filters.assignee === me.name}
          className={`flex min-h-[2rem] items-center gap-1 rounded-full border px-3 py-1.5 text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary ${
            filters.assignee === me.name
              ? 'border-brand-primary bg-brand-primary/10 font-medium text-brand-primary'
              : 'border-line-control bg-surface-card text-text-muted hover:text-text-primary'
          }`}
        >
          {/* A tick as well as colour shows the toggle is on (WCAG 1.4.1). */}
          {filters.assignee === me.name && <Check size={13} aria-hidden="true" />}
          My tasks
        </button>
      )}

      <select value={filters.assignee} onChange={set('assignee')} aria-label="Filter by assignee" className={`${controlClass} pl-3 pr-8`}>
        <option value="">Anyone</option>
        {team.map((m) => (
          <option key={m.id} value={m.name}>
            {m.name}
          </option>
        ))}
      </select>

      <select value={filters.type} onChange={set('type')} aria-label="Filter by type" className={`${controlClass} pl-3 pr-8`}>
        <option value="">Any type</option>
        {Object.entries(TASK_TYPES).map(([value, type]) => (
          <option key={value} value={value}>
            {type.label}
          </option>
        ))}
      </select>

      <select value={filters.due} onChange={set('due')} aria-label="Filter by due date" className={`${controlClass} pl-3 pr-8`}>
        <option value="">Any due date</option>
        {DUE_FILTERS.map((d) => (
          <option key={d.value} value={d.value}>
            {d.label}
          </option>
        ))}
      </select>

      <select
        value={filters.deliverable}
        onChange={set('deliverable')}
        aria-label="Filter by deliverable"
        className={`${controlClass} pl-3 pr-8`}
      >
        <option value="">Any deliverable</option>
        {anchors.map((a) => (
          <option key={a.id} value={a.id}>
            {a.label}
          </option>
        ))}
      </select>

      {active && (
        <button
          type="button"
          onClick={() => setFilters(NO_FILTERS)}
          className="flex min-h-[2rem] items-center gap-1 rounded-full px-3 py-1.5 text-xs text-text-muted hover:bg-slate-100 hover:text-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
        >
          <X size={13} aria-hidden="true" />
          Clear filters
        </button>
      )}
      {/* Always rendered so the count is announced as filters change (WCAG 4.1.3). */}
      <p className="text-xs text-text-muted" aria-live="polite">
        {active && `Showing ${shown} of ${total} tasks`}
      </p>
    </div>
  );
}
