import { useEffect, useRef } from 'react';
import { TriangleAlert, X } from 'lucide-react';

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

// Right-hand drawer shell shared by every edit form (DESIGN §4).
// It is a modal dialog: focus is trapped inside, Esc or the backdrop closes it,
// and focus returns to whatever opened it.
export default function Drawer({ title, onClose, onSubmit, footer, children }) {
  const panelRef = useRef(null);

  useEffect(() => {
    const opener = document.activeElement;
    const panel = panelRef.current;
    (panel.querySelector('input, select, textarea') ?? panel.querySelector(FOCUSABLE))?.focus();
    return () => opener?.focus?.();
  }, []);

  function handleKeyDown(e) {
    if (e.key === 'Escape') {
      onClose();
      return;
    }
    if (e.key !== 'Tab') return;
    const items = [...panelRef.current.querySelectorAll(FOCUSABLE)].filter((el) => !el.disabled);
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit();
  }

  return (
    <div className="fixed inset-0 z-40 flex justify-end" onKeyDown={handleKeyDown}>
      <div className="absolute inset-0 bg-slate-900/40" onClick={onClose} aria-hidden="true" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        className="relative flex h-full w-full max-w-lg flex-col bg-surface-card shadow-xl"
      >
        <form onSubmit={handleSubmit} className="flex h-full flex-col">
          <header className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
            <h2 id="drawer-title" className="text-base font-semibold">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="rounded-full p-1.5 text-text-muted hover:bg-slate-100 hover:text-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </header>

          <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-6 py-5">{children}</div>

          <footer className="flex items-center gap-2 border-t border-slate-200 px-6 py-4">{footer}</footer>
        </form>
      </div>
    </div>
  );
}

export const inputClass =
  'w-full rounded-lg border border-line-control bg-surface-card px-3 py-2 text-sm text-text-primary placeholder:text-slate-500 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/30 aria-[invalid=true]:border-due-overdue';

export const primaryButtonClass =
  'rounded-full bg-brand-primary px-5 py-2 text-sm font-medium text-white hover:bg-brand-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';

export const secondaryButtonClass =
  'rounded-full border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary';

export function Field({ label, htmlFor, required, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={htmlFor} className="text-xs font-medium text-text-muted">
        {label}
        {required && <span className="font-normal"> (required)</span>}
      </label>
      {children}
    </div>
  );
}

// Form error in a drawer footer. The live region is always rendered so screen
// readers announce the message when it appears (WCAG 3.3.1, 4.1.3).
export function FormError({ message }) {
  return (
    <p aria-live="polite" className="flex items-center gap-1 text-xs text-text-primary">
      {message && (
        <>
          <TriangleAlert size={13} className="shrink-0 text-due-overdue" aria-hidden="true" />
          {message}
        </>
      )}
    </p>
  );
}
