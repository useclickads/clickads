import { describe, it, expect } from 'vitest';

type HistoryState<T> = { past: T[]; present: T; future: T[] };

function push<T>(state: HistoryState<T>, newPresent: T, maxHistory = 50): HistoryState<T> {
  const past = [...state.past, state.present];
  if (past.length > maxHistory) past.shift();
  return { past, present: newPresent, future: [] };
}

function undo<T>(state: HistoryState<T>): HistoryState<T> {
  if (state.past.length === 0) return state;
  const newPast = [...state.past];
  const previous = newPast.pop()!;
  return { past: newPast, present: previous, future: [state.present, ...state.future] };
}

function redo<T>(state: HistoryState<T>): HistoryState<T> {
  if (state.future.length === 0) return state;
  const newFuture = [...state.future];
  const next = newFuture.shift()!;
  return { past: [...state.past, state.present], present: next, future: newFuture };
}

describe('useHistory', () => {
  it('tracks state changes', () => {
    let s: HistoryState<string> = { past: [], present: 'A', future: [] };
    s = push(s, 'B');
    s = push(s, 'C');
    expect(s.present).toBe('C');
    expect(s.past).toEqual(['A', 'B']);
  });

  it('undoes last change', () => {
    let s: HistoryState<string> = { past: [], present: 'A', future: [] };
    s = push(s, 'B');
    s = push(s, 'C');
    s = undo(s);
    expect(s.present).toBe('B');
    expect(s.future).toEqual(['C']);
  });

  it('redoes after undo', () => {
    let s: HistoryState<string> = { past: [], present: 'A', future: [] };
    s = push(s, 'B');
    s = undo(s);
    s = redo(s);
    expect(s.present).toBe('B');
    expect(s.future).toEqual([]);
  });

  it('clears future on new push after undo', () => {
    let s: HistoryState<string> = { past: [], present: 'A', future: [] };
    s = push(s, 'B');
    s = push(s, 'C');
    s = undo(s);
    s = push(s, 'D');
    expect(s.present).toBe('D');
    expect(s.future).toEqual([]);
    expect(s.past).toEqual(['A', 'B']);
  });

  it('does not undo past empty history', () => {
    const s: HistoryState<string> = { past: [], present: 'A', future: [] };
    const result = undo(s);
    expect(result).toBe(s);
  });

  it('does not redo past empty future', () => {
    const s: HistoryState<string> = { past: ['A'], present: 'B', future: [] };
    const result = redo(s);
    expect(result).toBe(s);
  });

  it('respects max history limit', () => {
    let s: HistoryState<number> = { past: [], present: 0, future: [] };
    for (let i = 1; i <= 60; i++) s = push(s, i, 50);
    expect(s.past.length).toBe(50);
    expect(s.past[0]).toBe(10);
  });

  it('supports multiple undo/redo', () => {
    let s: HistoryState<string> = { past: [], present: 'A', future: [] };
    s = push(s, 'B');
    s = push(s, 'C');
    s = push(s, 'D');
    s = undo(s);
    s = undo(s);
    expect(s.present).toBe('B');
    s = redo(s);
    expect(s.present).toBe('C');
  });
});
