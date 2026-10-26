import { useState } from 'react';
import Markdown from 'react-markdown';
import { CONTEXT_TOOLS } from '../constants';
import { timeAgo } from '../lib/dates';
import { Field, inputClass } from './Drawer';

// Styles for the rendered preview (no typography plugin, so set per element).
// react-markdown never renders raw HTML, so pasted prompts can't inject markup.
// Headings sit below the drawer's h2 and the section's h3, so the outline stays in order (WCAG 1.3.1).
const markdownComponents = {
  h1: (props) => <h4 className="mb-1 mt-3 text-sm font-semibold first:mt-0" {...props} />,
  h2: (props) => <h5 className="mb-1 mt-3 text-xs font-semibold uppercase tracking-wide text-text-muted first:mt-0" {...props} />,
  h3: (props) => <h6 className="mb-1 mt-2 text-sm font-medium first:mt-0" {...props} />,
  p: (props) => <p className="mb-2 last:mb-0" {...props} />,
  ul: (props) => <ul className="mb-2 list-disc pl-5" {...props} />,
  ol: (props) => <ol className="mb-2 list-decimal pl-5" {...props} />,
  code: (props) => <code className="rounded bg-slate-100 px-1 font-mono text-xs" {...props} />,
  pre: (props) => <pre className="mb-2 overflow-x-auto rounded-lg bg-slate-100 p-3 font-mono text-xs [&_code]:bg-transparent [&_code]:p-0" {...props} />,
  // eslint-disable-next-line no-unused-vars
  a: ({ node, children, ...props }) => (
    <a className="text-brand-primary underline" target="_blank" rel="noreferrer" {...props}>
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  ),
};

const tabClass = (active) =>
  `rounded-full px-3 py-1 text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary ${
    active ? 'bg-brand-primary/10 font-medium text-brand-primary' : 'text-text-muted hover:text-text-primary'
  }`;

// The AI context section of the task drawer (M9): Markdown briefing with a
// live preview, the tool it was used with, and what came out of it.
export default function ContextField({ draft, setDraft }) {
  const [preview, setPreview] = useState(false);
  const set = (field) => (e) => setDraft({ ...draft, [field]: e.target.value });

  return (
    <section aria-labelledby="context-heading" className="flex flex-col gap-4 border-t border-slate-200 pt-4">
      <div className="flex items-baseline justify-between">
        <h3 id="context-heading" className="text-sm font-semibold">
          AI context
        </h3>
        <p className="text-xs text-text-muted">
          {draft.contextUpdatedAt
            ? `Last updated ${timeAgo(draft.contextUpdatedAt)}${draft.contextTool ? ` · ${draft.contextTool}` : ''}`
            : 'Not updated yet'}
        </p>
      </div>

      <Field label="AI tool" htmlFor="task-tool">
        <select
          id="task-tool"
          value={draft.contextTool ?? ''}
          onChange={(e) => setDraft({ ...draft, contextTool: e.target.value || null })}
          className={inputClass}
        >
          <option value="">None yet</option>
          {CONTEXT_TOOLS.map((tool) => (
            <option key={tool} value={tool}>
              {tool}
            </option>
          ))}
        </select>
      </Field>

      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <label htmlFor="task-context" className="text-xs font-medium text-text-muted">
            Context <span className="font-normal">(Markdown)</span>
          </label>
          <div className="flex gap-1" role="group" aria-label="Context view">
            <button type="button" onClick={() => setPreview(false)} aria-pressed={!preview} className={tabClass(!preview)}>
              Write
            </button>
            <button type="button" onClick={() => setPreview(true)} aria-pressed={preview} className={tabClass(preview)}>
              Preview
            </button>
          </div>
        </div>
        {preview ? (
          <div className="min-h-[15rem] rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
            {draft.context.trim() ? (
              <Markdown components={markdownComponents}>{draft.context}</Markdown>
            ) : (
              <p className="text-text-muted">Nothing to preview yet.</p>
            )}
          </div>
        ) : (
          <textarea
            id="task-context"
            value={draft.context}
            onChange={set('context')}
            rows={10}
            className={`${inputClass} font-mono text-xs leading-relaxed`}
          />
        )}
      </div>

      <Field label="Outcome" htmlFor="task-outcome">
        <textarea
          id="task-outcome"
          value={draft.outcome}
          onChange={set('outcome')}
          rows={2}
          placeholder="What did the AI produce? Did it work?"
          className={inputClass}
        />
      </Field>
    </section>
  );
}
