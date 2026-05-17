'use client';

import { createContext, useCallback, useContext, useRef, useState } from 'react';
import type { Block, BlockProps, BlockType, EditorState } from './types';
import { editorReducer, generateId, initialEditorState } from './reducer';
import { getBlockDefinition } from './blocks';
import { createHistory, pushHistory, undo as historyUndo, redo as historyRedo, type HistoryState } from './history';

export type Viewport = 'desktop' | 'tablet' | 'mobile';

type EditorContextValue = {
  state: EditorState;
  addBlock: (type: BlockType, index?: number) => void;
  removeBlock: (id: string) => void;
  moveBlock: (fromIndex: number, toIndex: number) => void;
  updateBlockProps: (id: string, props: Partial<BlockProps>) => void;
  selectBlock: (id: string | null) => void;
  duplicateBlock: (id: string) => void;
  setDragging: (isDragging: boolean) => void;
  setDragOver: (index: number | null) => void;
  setBlocks: (blocks: Block[]) => void;
  getSelectedBlock: () => Block | null;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  viewport: Viewport;
  setViewport: (v: Viewport) => void;
};

const EditorContext = createContext<EditorContextValue | undefined>(undefined);

export function EditorProvider({ children, initialBlocks }: { children: React.ReactNode; initialBlocks?: Block[] }) {
  const blocks = initialBlocks ?? [];
  const historyRef = useRef<HistoryState>(createHistory(blocks));
  const [state, setState] = useState<EditorState>({ ...initialEditorState, blocks });
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [viewport, setViewport] = useState<Viewport>('desktop');

  const applyAction = useCallback((action: Parameters<typeof editorReducer>[1]) => {
    setState((prev) => {
      const next = editorReducer(prev, action);
      const blocksChanged = prev.blocks !== next.blocks;
      if (blocksChanged) {
        historyRef.current = pushHistory(historyRef.current, next.blocks);
        setCanUndo(historyRef.current.past.length > 0);
        setCanRedo(historyRef.current.future.length > 0);
      }
      return next;
    });
  }, []);

  const addBlock = useCallback((type: BlockType, index?: number) => {
    const def = getBlockDefinition(type);
    if (!def) return;
    const block: Block = { id: generateId(), type, props: { ...def.defaultProps } };
    applyAction({ type: 'ADD_BLOCK', block, index });
  }, [applyAction]);

  const removeBlock = useCallback((id: string) => applyAction({ type: 'REMOVE_BLOCK', id }), [applyAction]);
  const moveBlock = useCallback((from: number, to: number) => applyAction({ type: 'MOVE_BLOCK', fromIndex: from, toIndex: to }), [applyAction]);
  const updateBlockProps = useCallback((id: string, props: Partial<BlockProps>) => applyAction({ type: 'UPDATE_BLOCK_PROPS', id, props }), [applyAction]);
  const selectBlock = useCallback((id: string | null) => applyAction({ type: 'SELECT_BLOCK', id }), [applyAction]);
  const duplicateBlock = useCallback((id: string) => applyAction({ type: 'DUPLICATE_BLOCK', id }), [applyAction]);
  const setDragging = useCallback((isDragging: boolean) => applyAction({ type: 'SET_DRAGGING', isDragging }), [applyAction]);
  const setDragOver = useCallback((index: number | null) => applyAction({ type: 'SET_DRAG_OVER', index }), [applyAction]);

  const setBlocks = useCallback((newBlocks: Block[]) => {
    applyAction({ type: 'SET_BLOCKS', blocks: newBlocks });
  }, [applyAction]);

  const undo = useCallback(() => {
    historyRef.current = historyUndo(historyRef.current);
    setState((prev) => ({ ...prev, blocks: historyRef.current.present, selectedBlockId: null }));
    setCanUndo(historyRef.current.past.length > 0);
    setCanRedo(historyRef.current.future.length > 0);
  }, []);

  const redo = useCallback(() => {
    historyRef.current = historyRedo(historyRef.current);
    setState((prev) => ({ ...prev, blocks: historyRef.current.present, selectedBlockId: null }));
    setCanUndo(historyRef.current.past.length > 0);
    setCanRedo(historyRef.current.future.length > 0);
  }, []);

  const getSelectedBlock = useCallback(() => {
    return state.blocks.find((b) => b.id === state.selectedBlockId) ?? null;
  }, [state.blocks, state.selectedBlockId]);

  return (
    <EditorContext.Provider
      value={{ state, addBlock, removeBlock, moveBlock, updateBlockProps, selectBlock, duplicateBlock, setDragging, setDragOver, setBlocks, getSelectedBlock, undo, redo, canUndo, canRedo, viewport, setViewport }}
    >
      {children}
    </EditorContext.Provider>
  );
}

export function useEditor() {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error('useEditor must be used within EditorProvider');
  return ctx;
}
