import { useState } from 'react';
import { formatShortDate, todayISO } from '../lib/dates';

const W = 440;
const H = 160;
const PAD = { top: 12, right: 36, bottom: 22, left: 28 };

// Remaining points per day (indigo) against the ideal line to zero on the due
// date (dashed grey, context only). Hover a day for its numbers; a table view
// gives the same data without the chart.
export default function BurndownChart({ data }) {
  const [hover, setHover] = useState(null);
  const [asTable, setAsTable] = useState(false);
  const { points, total, dueDate } = data;

  const max = Math.max(1, total, ...points.map((p) => p.remaining ?? 0));
  const n = points.length;
  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;
  const x = (i) => PAD.left + (n === 1 ? plotW / 2 : (i * plotW) / (n - 1));
  const y = (v) => PAD.top + plotH - (v / max) * plotH;

  const path = (key) =>
    points
      .map((p, i) => (p[key] == null ? null : `${x(i)},${y(p[key])}`))
      .filter(Boolean)
      .map((pt, i) => `${i === 0 ? 'M' : 'L'}${pt}`)
      .join(' ');

  const today = todayISO();
  const dueIndex = points.findIndex((p) => p.date === dueDate);
  const lastActual = points.reduce((last, p, i) => (p.remaining == null ? last : i), 0);
  const hovered = hover == null ? null : points[hover];

  return (
    <figure className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-[11px] text-text-muted">
        <span className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="h-0.5 w-4 rounded bg-brand-primary" aria-hidden="true" />
            Remaining points
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-4 border-t-2 border-dashed border-slate-400" aria-hidden="true" />
            Ideal
          </span>
        </span>
        <button
          type="button"
          onClick={() => setAsTable(!asTable)}
          className="rounded-full px-2 py-0.5 hover:bg-slate-100 hover:text-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
        >
          {asTable ? 'Show chart' : 'Show table'}
        </button>
      </div>

      {asTable ? (
        <div className="max-h-48 overflow-y-auto rounded-lg border border-slate-200">
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-slate-50 text-left text-text-muted">
              <tr>
                <th className="px-2 py-1 font-medium">Day</th>
                <th className="px-2 py-1 text-right font-medium">Remaining</th>
                <th className="px-2 py-1 text-right font-medium">Ideal</th>
              </tr>
            </thead>
            <tbody className="font-mono tabular-nums">
              {points.map((p) => (
                <tr key={p.date} className="border-t border-slate-100">
                  <td className="px-2 py-1 font-sans">
                    {formatShortDate(p.date)}
                    {p.date === dueDate ? ' (due)' : ''}
                  </td>
                  <td className="px-2 py-1 text-right">{p.remaining ?? '–'}</td>
                  <td className="px-2 py-1 text-right">{p.ideal.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="relative">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={`Burndown: ${data.remainingNow} of ${total} points remaining, due ${formatShortDate(dueDate)}`}>
            {/* Recessive axes: baseline, top value, due-date marker. */}
            <line x1={PAD.left} x2={W - PAD.right} y1={y(0)} y2={y(0)} className="stroke-slate-300" />
            <text x={PAD.left - 6} y={y(max) + 3} textAnchor="end" className="fill-text-muted text-[9px]">
              {max}
            </text>
            <text x={PAD.left - 6} y={y(0) + 3} textAnchor="end" className="fill-text-muted text-[9px]">
              0
            </text>
            {dueIndex >= 0 && (
              <g>
                <line x1={x(dueIndex)} x2={x(dueIndex)} y1={PAD.top} y2={y(0)} className="stroke-slate-300" strokeDasharray="2 3" />
                <text x={x(dueIndex)} y={H - 6} textAnchor="middle" className="fill-text-muted text-[9px]">
                  Due {formatShortDate(dueDate)}
                </text>
              </g>
            )}
            <text x={x(0)} y={H - 6} textAnchor="start" className="fill-text-muted text-[9px]">
              {formatShortDate(points[0].date)}
            </text>

            <path d={path('ideal')} fill="none" className="stroke-slate-400" strokeWidth="2" strokeDasharray="4 4" />
            <path d={path('remaining')} fill="none" className="stroke-brand-primary" strokeWidth="2" strokeLinejoin="round" />

            {/* Direct label at the end of the actual line. */}
            <circle cx={x(lastActual)} cy={y(points[lastActual].remaining)} r="4" className="fill-brand-primary stroke-surface-card" strokeWidth="2" />
            <text x={x(lastActual) + 7} y={y(points[lastActual].remaining) + 3} className="fill-text-primary text-[10px] font-semibold">
              {points[lastActual].remaining}
            </text>

            {hovered && (
              <line x1={x(hover)} x2={x(hover)} y1={PAD.top} y2={y(0)} className="stroke-slate-400" strokeWidth="1" />
            )}
            {hovered?.remaining != null && (
              <circle cx={x(hover)} cy={y(hovered.remaining)} r="4" className="fill-brand-primary stroke-surface-card" strokeWidth="2" />
            )}

            {/* Hit areas wider than the marks, one per day. */}
            {points.map((p, i) => (
              <rect
                key={p.date}
                x={x(i) - plotW / Math.max(1, n - 1) / 2}
                y={PAD.top}
                width={plotW / Math.max(1, n - 1)}
                height={plotH}
                fill="transparent"
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
              />
            ))}
          </svg>

          {hovered && (
            <div
              className="pointer-events-none absolute top-0 rounded-lg bg-text-primary px-2 py-1 text-[11px] text-white shadow"
              style={{ left: `${(x(hover) / W) * 100}%`, transform: `translateX(${hover > n / 2 ? '-105%' : '5%'})` }}
            >
              <div className="font-medium">
                {formatShortDate(hovered.date)}
                {hovered.date === today ? ' (today)' : ''}
              </div>
              <div>Remaining: {hovered.remaining ?? '–'}</div>
              <div>Ideal: {hovered.ideal.toFixed(1)}</div>
            </div>
          )}
        </div>
      )}
      {dueDate < today && (
        <figcaption className="text-[11px] text-text-muted">This milestone's due date has passed.</figcaption>
      )}
    </figure>
  );
}
