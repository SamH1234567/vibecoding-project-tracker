import { ChevronRight } from 'lucide-react';
import { usePanelOpen } from '../lib/store';

// A section above the board that folds down to a one-line summary, so the
// board stays in view. Open on first visit; the choice is remembered.
export default function CollapsibleSection({ id, icon: Icon, title, summary, actions, children }) {
  const [open, setOpen] = usePanelOpen(id);
  const bodyId = `section-${id}`;

  return (
    <section className="mb-4">
      <div className="flex min-h-[2.25rem] items-center gap-3">
        <h2>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls={bodyId}
            className="flex items-center gap-1.5 rounded-full py-1 pl-1 pr-3 text-xs font-semibold uppercase tracking-wide text-text-muted hover:bg-slate-100 hover:text-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          >
            <ChevronRight size={14} className={`${open ? 'rotate-90' : ''}`} aria-hidden="true" />
            <Icon size={13} aria-hidden="true" />
            {title}
          </button>
        </h2>
        {!open && <div className="min-w-0 truncate">{summary}</div>}
        {actions && <div className="ml-auto">{actions}</div>}
      </div>
      <div id={bodyId} hidden={!open} className="pt-2">
        {children}
      </div>
    </section>
  );
}
