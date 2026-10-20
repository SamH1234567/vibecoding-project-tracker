import { useEffect } from 'react';
import { Check } from 'lucide-react';

// Short confirmation message, bottom centre. Fades in over 200 ms (DESIGN §7)
// and dismisses itself. Announced politely to screen readers.
export default function Toast({ toast, onDone }) {
  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(onDone, 3000);
    return () => clearTimeout(timer);
  }, [toast, onDone]);

  return (
    <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center">
      {toast && (
        <div
          key={toast.id}
          className="flex animate-fade-in items-center gap-2 rounded-full bg-text-primary px-4 py-2 text-sm text-white shadow-lg"
        >
          <Check size={15} aria-hidden="true" />
          {toast.message}
        </div>
      )}
    </div>
  );
}
