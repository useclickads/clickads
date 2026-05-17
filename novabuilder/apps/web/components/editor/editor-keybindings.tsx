'use client';

import { useEffect } from 'react';
import { useEditor } from '../../lib/editor/editor-context';

export function EditorKeybindings({ onSave }: { onSave: () => void }) {
  const { state, removeBlock, selectBlock, undo, redo, duplicateBlock } = useEditor();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const meta = e.metaKey || e.ctrlKey;

      if (meta && e.key === 's') {
        e.preventDefault();
        onSave();
        return;
      }

      if (meta && e.shiftKey && e.key === 'z') {
        e.preventDefault();
        redo();
        return;
      }

      if (meta && e.key === 'z') {
        e.preventDefault();
        undo();
        return;
      }

      if (meta && e.key === 'd' && state.selectedBlockId) {
        e.preventDefault();
        duplicateBlock(state.selectedBlockId);
        return;
      }

      if ((e.key === 'Delete' || e.key === 'Backspace') && state.selectedBlockId) {
        if (document.activeElement === document.body) {
          e.preventDefault();
          removeBlock(state.selectedBlockId);
        }
      }

      if (e.key === 'Escape') {
        selectBlock(null);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSave, state.selectedBlockId, removeBlock, selectBlock, undo, redo, duplicateBlock]);

  return null;
}
