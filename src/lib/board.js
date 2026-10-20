// Helpers for a board's columns. Columns are customisable, so nothing may
// assume fixed IDs: the first column is where new work starts and the last
// column always means "finished".

export const firstColumnId = (board) => board.columns[0].id;

export const doneColumnId = (board) => board.columns[board.columns.length - 1].id;

export const isDone = (task, board) => task.status === doneColumnId(board);

export const columnLabel = (board, id) => board.columns.find((c) => c.id === id)?.label ?? 'Removed column';

// Story points for burndown; an unweighted task counts as 1.
export const POINTS = [1, 2, 3, 5, 8];
export const taskPoints = (task) => task.points ?? 1;
