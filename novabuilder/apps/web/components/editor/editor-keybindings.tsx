'use client';

import { useEffect } from 'react';
import { useEditor } from '../../lib/editor/editor-context';

export function EditorKeybindings({ onSave }: { onSave: () => void }) {
  const { state, removeBlock, selectBlock } = useEditor();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        onSave();
      }

      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (state.selectedBlockId && document.activeElement === document.body) {
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
  }, [onSave, state.selectedBlockId, removeBlock, selectBlock]);

  return null;
}
