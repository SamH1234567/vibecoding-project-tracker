import { columnLabel } from './board';
import { formatShortDate } from './dates';

// Drop template headings that were never filled in, so the briefing only
// carries what someone actually wrote.
function stripEmptySections(markdown) {
  const sections = markdown.split(/^(?=#{1,6} )/m);
  return sections
    .filter((section) => {
      const [heading, ...body] = section.split('\n');
      return !/^#{1,6} /.test(heading) || body.join('\n').trim() !== '';
    })
    .join('')
    .trim();
}

// A task as a clean Markdown briefing to paste into an AI chat (M10).
export function toBriefing(task, board) {
  const stage = columnLabel(board, task.status);
  const milestone = board.milestones.find((m) => m.id === task.milestoneId);
  const deliverable = board.anchors.find((a) => a.id === task.deliverableId);
  const details = [
    `- **Type:** ${task.type === 'bug' ? 'Bug' : 'Feature'}`,
    `- **Status:** ${stage}`,
    `- **Owner:** ${task.assignee}`,
    task.dueDate && `- **Due:** ${formatShortDate(task.dueDate)}`,
    task.points && `- **Points:** ${task.points}`,
    milestone && `- **Milestone:** ${milestone.name}`,
    deliverable && `- **For deliverable:** ${deliverable.label}`,
    task.contextTool && `- **Last AI tool:** ${task.contextTool}`,
  ].filter(Boolean);

  const parts = [`# ${task.title}`];
  if (task.description.trim()) parts.push(task.description.trim());
  parts.push(details.join('\n'));
  if (task.subtasks?.length) {
    parts.push(`## Sub-requirements\n\n${task.subtasks.map((s) => `- [${s.done ? 'x' : ' '}] ${s.title}`).join('\n')}`);
  }

  const context = stripEmptySections(task.context ?? '');
  if (context) parts.push(`## Context\n\n${context.replace(/^(#{1,5}) /gm, '#$1 ')}`);
  if (task.outcome?.trim()) parts.push(`## Outcome so far\n\n${task.outcome.trim()}`);

  return `${parts.join('\n\n')}\n`;
}

// Clipboard API where available, with a fallback for non-secure (http) pages.
export async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const area = document.createElement('textarea');
  area.value = text;
  area.setAttribute('readonly', '');
  area.style.position = 'fixed';
  area.style.opacity = '0';
  document.body.appendChild(area);
  area.select();
  const ok = document.execCommand('copy');
  area.remove();
  if (!ok) throw new Error('Copy failed');
}
