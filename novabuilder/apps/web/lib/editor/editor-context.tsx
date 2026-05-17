'use client';

import { createContext, useCallback, useContext, useReducer } from 'react';
import type { Block, BlockProps, BlockType, EditorState } from './types';
import { editorReducer, generateId, initialEditorState } from './reducer';
import { getBlockDefinition } from './blocks';

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
};

const EditorContext = createContext<EditorContextValue | undefined>(undefined);

export function EditorProvider({ children, initialBlocks }: { children: React.ReactNode; initialBlocks?: Block[] }) {
  const [state, dispatch] = useReducer(editorReducer, {
    ...initialEditorState,
    blocks: initialBlocks ?? [],
  });

  const addBlock = useCallback((type: BlockType, index?: number) => {
    const def = getBlockDefinition(type);
    if (!def) return;
    const block: Block = { id: generateId(), type, props: { ...def.defaultProps } };
    dispatch({ type: 'ADD_BLOCK', block, index });
  }, []);

  const removeBlock = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_BLOCK', id });
  }, []);

  const moveBlock = useCallback((fromIndex: number, toIndex: number) => {
    dispatch({ type: 'MOVE_BLOCK', fromIndex, toIndex });
  }, []);

  const updateBlockProps = useCallback((id: string, props: Partial<BlockProps>) => {
    dispatch({ type: 'UPDATE_BLOCK_PROPS', id, props });
  }, []);

  const selectBlock = useCallback((id: string | null) => {
    dispatch({ type: 'SELECT_BLOCK', id });
  }, []);

  const duplicateBlock = useCallback((id: string) => {
    dispatch({ type: 'DUPLICATE_BLOCK', id });
  }, []);

  const setDragging = useCallback((isDragging: boolean) => {
    dispatch({ type: 'SET_DRAGGING', isDragging });
  }, []);

  const setDragOver = useCallback((index: number | null) => {
    dispatch({ type: 'SET_DRAG_OVER', index });
  }, []);

  const setBlocks = useCallback((blocks: Block[]) => {
    dispatch({ type: 'SET_BLOCKS', blocks });
  }, []);

  const getSelectedBlock = useCallback(() => {
    return state.blocks.find((b) => b.id === state.selectedBlockId) ?? null;
  }, [state.blocks, state.selectedBlockId]);

  return (
    <EditorContext.Provider
      value={{ state, addBlock, removeBlock, moveBlock, updateBlockProps, selectBlock, duplicateBlock, setDragging, setDragOver, setBlocks, getSelectedBlock }}
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
