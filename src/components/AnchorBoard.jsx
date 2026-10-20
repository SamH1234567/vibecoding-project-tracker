import { useState } from 'react';
import { BookOpen, ExternalLink, FileText, MonitorPlay, Presentation } from 'lucide-react';

const ICONS = {
  presentation: Presentation,
  demo: MonitorPlay,
  report: FileText,
  documentation: BookOpen,
};

// Accepts "example.com/x" as well as full links; returns null if it isn't a web link.
function normaliseUrl(text) {
  const trimmed = text.trim();
  if (!trimmed) return '';
  const withScheme = /^[a-z][a-z0-9+.-]*:/i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const url = new URL(withScheme);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : null;
  } catch {
    return null;
  }
}

function AnchorCard({ anchor, onSave }) {
  const [text, setText] = useState(anchor.url ?? '');
  const [invalid, setInvalid] = useState(false);
  const Icon = ICONS[anchor.id];
  const filled = Boolean(anchor.url);
  const inputId = `anchor-${anchor.id}`;

  // Saved when the field loses focus or on Enter; an empty field clears the link.
  function commit() {
    const url = normaliseUrl(text);
    if (url === null) {
      setInvalid(true);
      return;
    }
    setInvalid(false);
    setText(url);
    if (url !== (anchor.url ?? '')) onSave(anchor.id, url || null);
  }

  return (
    <div className="flex flex-col gap-2 rounded-xl bg-surface-card p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <Icon size={16} className="text-brand-primary" aria-hidden="true" />
        <label htmlFor={inputId} className="text-sm font-medium">
          {anchor.label}
        </label>
        <span className="ml-auto flex items-center gap-1.5 text-xs text-text-muted">
          <span
            className={`h-2 w-2 rounded-full ${filled ? 'bg-brand-primary' : 'ring-1 ring-inset ring-slate-400'}`}
            aria-hidden="true"
          />
          {filled ? 'Linked' : 'No link yet'}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <input
          id={inputId}
          type="url"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
          placeholder="Paste a link"
          aria-invalid={invalid}
          aria-describedby={invalid ? `${inputId}-error` : undefined}
          className={`min-w-0 flex-1 rounded-lg border bg-surface-card px-2.5 py-1.5 font-mono text-xs text-text-primary focus:outline-none focus:ring-2 ${
            invalid
              ? 'border-slate-500 focus:ring-slate-400/40'
              : 'border-slate-200 focus:border-brand-primary focus:ring-brand-primary/30'
          }`}
        />
        {filled && (
          <a
            href={anchor.url}
            target="_blank"
            rel="noreferrer"
            aria-label={`Open ${anchor.label} (new tab)`}
            title="Open in a new tab"
            className="shrink-0 rounded-full p-1.5 text-text-muted hover:bg-slate-100 hover:text-brand-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          >
            <ExternalLink size={14} aria-hidden="true" />
          </a>
        )}
      </div>
      {invalid && (
        <p id={`${inputId}-error`} className="text-xs text-text-muted">
          That doesn't look like a web link.
        </p>
      )}
    </div>
  );
}

// The four pinned final-project deliverables (M11), above the board.
export default function AnchorBoard({ anchors, onSave }) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {anchors.map((anchor) => (
        <AnchorCard key={`${anchor.id}:${anchor.url ?? ''}`} anchor={anchor} onSave={onSave} />
      ))}
    </div>
  );
}

// One-line summary shown when the section is collapsed: a dot per deliverable.
export function AnchorSummary({ anchors }) {
  const linked = anchors.filter((a) => a.url).length;
  return (
    <span className="flex items-center gap-2 text-xs text-text-muted">
      <span className="flex gap-1" aria-hidden="true">
        {anchors.map((a) => (
          <span
            key={a.id}
            title={a.label}
            className={`h-2 w-2 rounded-full ${a.url ? 'bg-brand-primary' : 'ring-1 ring-inset ring-slate-400'}`}
          />
        ))}
      </span>
      {linked} of {anchors.length} linked
    </span>
  );
}
