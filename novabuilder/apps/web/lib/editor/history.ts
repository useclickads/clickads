import type { Block } from './types';

export type HistoryState = {
  past: Block[][];
  present: Block[];
  future: Block[][];
};

export function createHistory(initial: Block[]): HistoryState {
  return { past: [], present: initial, future: [] };
}

export function pushHistory(history: HistoryState, newPresent: Block[]): HistoryState {
  if (JSON.stringify(history.present) === JSON.stringify(newPresent)) return history;
  return {
    past: [...history.past.slice(-49), history.present],
    present: newPresent,
    future: [],
  };
}

export function undo(history: HistoryState): HistoryState {
  if (history.past.length === 0) return history;
  const previous = history.past[history.past.length - 1];
  return {
    past: history.past.slice(0, -1),
    present: previous,
    future: [history.present, ...history.future],
  };
}

export function redo(history: HistoryState): HistoryState {
  if (history.future.length === 0) return history;
  const next = history.future[0];
  return {
    past: [...history.past, history.present],
    present: next,
    future: history.future.slice(1),
  };
}
