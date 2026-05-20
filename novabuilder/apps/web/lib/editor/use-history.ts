'use client';

import { useCallback, useRef, useState } from 'react';

type HistoryState<T> = {
  past: T[];
  present: T;
  future: T[];
};

export function useHistory<T>(initialState: T, maxHistory = 50) {
  const [state, setState] = useState<HistoryState<T>>({
    past: [],
    present: initialState,
    future: [],
  });

  const batchRef = useRef(false);

  const push = useCallback((newState: T) => {
    setState((prev) => {
      const past = [...prev.past, prev.present];
      if (past.length > maxHistory) past.shift();
      return { past, present: newState, future: [] };
    });
  }, [maxHistory]);

  const undo = useCallback(() => {
    setState((prev) => {
      if (prev.past.length === 0) return prev;
      const newPast = [...prev.past];
      const previous = newPast.pop()!;
      return {
        past: newPast,
        present: previous,
        future: [prev.present, ...prev.future],
      };
    });
  }, []);

  const redo = useCallback(() => {
    setState((prev) => {
      if (prev.future.length === 0) return prev;
      const newFuture = [...prev.future];
      const next = newFuture.shift()!;
      return {
        past: [...prev.past, prev.present],
        present: next,
        future: newFuture,
      };
    });
  }, []);

  const reset = useCallback((newState: T) => {
    setState({ past: [], present: newState, future: [] });
  }, []);

  const startBatch = useCallback(() => {
    batchRef.current = true;
  }, []);

  const endBatch = useCallback((finalState: T) => {
    batchRef.current = false;
    push(finalState);
  }, [push]);

  return {
    state: state.present,
    push,
    undo,
    redo,
    reset,
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0,
    historyLength: state.past.length,
    futureLength: state.future.length,
    startBatch,
    endBatch,
  };
}
