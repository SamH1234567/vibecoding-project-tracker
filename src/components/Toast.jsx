import { useEffect, useState } from 'react';
import { Check, X } from 'lucide-react';

// Short confirmation message, bottom centre. Fades in over 200 ms (DESIGN §7)
// and dismisses itself. Announced politely to screen readers. It stays for 6 s
// and pauses while the pointer is over it, so there is time to read it (WCAG 2.2.1).
export default function Toast({ toast, onDone }) {
  // Pause is tied to one toast, so a new toast always starts its own timer.
  const [pausedId, setPausedId] = useState(null);
  const paused = toast != null && pausedId === toast.id;

  useEffect(() => {
    if (!toast || paused) return undefined;
    const timer = setTimeout(onDone, 6000);
    return () => clearTimeout(timer);
  }, [toast, paused, onDone]);

  return (
    <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
      {toast && (
        <div
          key={toast.id}
          onMouseEnter={() => setPausedId(toast.id)}
          onMouseLeave={() => setPausedId(null)}
          className="pointer-events-auto flex animate-fade-in items-center gap-2 rounded-full bg-text-primary px-4 py-2 text-sm text-white shadow-lg"
        >
          {toast.error ? <X size={15} aria-hidden="true" /> : <Check size={15} aria-hidden="true" />}
          {toast.message}
        </div>
      )}
    </div>
  );
}
