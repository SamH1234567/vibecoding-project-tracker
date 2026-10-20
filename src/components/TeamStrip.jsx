import { useCallback, useEffect, useRef, useState } from 'react';
import { isDone } from '../lib/board';
import Avatar from './Avatar';
import { TASK_TYPES } from './taskTypes';

// Open work is grouped by column, furthest along first. The last (done)
// column is left out. "Driving" means anything started: past the first column.
const openColumns = (board) => board.columns.slice(0, -1).reverse();
const isDriving = (task, board) => task.status !== board.columns[0].id;

function summarise(owned, board) {
  const driving = owned.filter((t) => isDriving(t, board));
  if (driving.length > 0) return `Driving: ${driving.map((t) => t.title).join(', ')}`;
  if (owned.length > 0) return `Nothing in progress · ${owned.length} open task${owned.length === 1 ? '' : 's'}`;
  return 'No open tasks';
}

function MemberPill({ board, member, owned, isOpen, onToggle, onClose, onOpenTask }) {
  const wrapperRef = useRef(null);
  const buttonRef = useRef(null);
  const summary = summarise(owned, board);
  const listId = `member-tasks-${member.id}`;

  // Close on Esc or a click anywhere outside this pill and its list.
  useEffect(() => {
    if (!isOpen) return undefined;
    function handlePointer(e) {
      if (!wrapperRef.current.contains(e.target)) onClose();
    }
    function handleKey(e) {
      if (e.key === 'Escape') {
        onClose();
        buttonRef.current.focus();
      }
    }
    document.addEventListener('mousedown', handlePointer);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handlePointer);
      document.removeEventListener('keydown', handleKey);
    };
  }, [isOpen, onClose]);

  function openTask(task) {
    // Park focus on the pill first so the drawer hands it back here on close.
    buttonRef.current.focus();
    onClose();
    onOpenTask(task);
  }

  return (
    <div ref={wrapperRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={listId}
        className={`flex items-center gap-2 rounded-full bg-surface-card py-1 pl-1 pr-4 text-left shadow-sm transition-shadow hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary ${
          isOpen ? 'ring-2 ring-brand-primary/30' : ''
        }`}
      >
        <Avatar name={member.name} size="md" />
        <span className="text-xs leading-tight">
          <span className="block font-medium">{member.name}</span>
          <span className="block max-w-[14rem] truncate text-text-muted" title={summary}>
            {summary}
          </span>
        </span>
      </button>

      {isOpen && (
        <div
          id={listId}
          className="absolute left-0 top-full z-30 mt-2 w-72 rounded-xl bg-surface-card p-3 shadow-lg ring-1 ring-slate-200"
        >
          {owned.length === 0 ? (
            <p className="px-1 py-2 text-sm text-text-muted">No open tasks.</p>
          ) : (
            openColumns(board).map((group) => {
              const groupTasks = owned.filter((t) => t.status === group.id);
              if (groupTasks.length === 0) return null;
              return (
                <div key={group.id} className="mb-2 last:mb-0">
                  <h3 className="px-1 pb-1 text-[11px] font-semibold uppercase tracking-wide text-text-muted">
                    {group.label}
                  </h3>
                  <ul>
                    {groupTasks.map((task) => {
                      const type = TASK_TYPES[task.type];
                      return (
                        <li key={task.id}>
                          <button
                            type="button"
                            onClick={() => openTask(task)}
                            className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                          >
                            <type.Icon size={14} className={`shrink-0 ${type.text}`} aria-hidden="true" />
                            <span className="sr-only">{type.label}: </span>
                            <span className="truncate">{task.title}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

// "Who's driving what" (M7): each member, a summary of their open work, and
// a click-to-expand list of it grouped by stage.
export default function TeamStrip({ board, team, tasks, onOpenTask }) {
  const [openId, setOpenId] = useState(null);
  const close = useCallback(() => setOpenId(null), []);

  return (
    <div className="flex flex-wrap items-center gap-3">
      {team.map((member) => (
        <MemberPill
          key={member.id}
          board={board}
          member={member}
          owned={tasks.filter((t) => t.assignee === member.name && !isDone(t, board))}
          isOpen={openId === member.id}
          onToggle={() => setOpenId(openId === member.id ? null : member.id)}
          onClose={close}
          onOpenTask={onOpenTask}
        />
      ))}
    </div>
  );
}

// One-line summary shown when the section is collapsed: initials and how many
// tasks each person has in progress.
export function TeamSummary({ board, team, tasks }) {
  return (
    <span className="flex items-center gap-3 text-xs text-text-muted">
      {team.map((member) => {
        const driving = tasks.filter((t) => t.assignee === member.name && isDriving(t, board) && !isDone(t, board)).length;
        return (
          <span key={member.id} className="flex items-center gap-1" title={`${member.name}: ${driving} in progress`}>
            <Avatar name={member.name} />
            {driving > 0 && <span className="font-mono">{driving}</span>}
          </span>
        );
      })}
    </span>
  );
}
