'use client';

import { useEffect, useCallback, useRef } from 'react';

type ShortcutAction =
  | 'undo' | 'redo' | 'save' | 'delete' | 'duplicate'
  | 'selectAll' | 'deselect' | 'copy' | 'paste' | 'cut'
  | 'togglePreview' | 'toggleLayers' | 'toggleAI'
  | 'moveUp' | 'moveDown' | 'zoomIn' | 'zoomOut' | 'zoomReset'
  | 'search' | 'publish' | 'escape';

type ShortcutDef = {
  key: string;
  meta?: boolean;
  shift?: boolean;
  alt?: boolean;
  action: ShortcutAction;
  description: string;
};

const DEFAULT_SHORTCUTS: ShortcutDef[] = [
  { key: 'z', meta: true, action: 'undo', description: 'Undo' },
  { key: 'z', meta: true, shift: true, action: 'redo', description: 'Redo' },
  { key: 's', meta: true, action: 'save', description: 'Save' },
  { key: 'Backspace', action: 'delete', description: 'Delete selected' },
  { key: 'd', meta: true, action: 'duplicate', description: 'Duplicate' },
  { key: 'a', meta: true, action: 'selectAll', description: 'Select all' },
  { key: 'Escape', action: 'escape', description: 'Deselect / Close' },
  { key: 'c', meta: true, action: 'copy', description: 'Copy' },
  { key: 'v', meta: true, action: 'paste', description: 'Paste' },
  { key: 'x', meta: true, action: 'cut', description: 'Cut' },
  { key: 'p', meta: true, shift: true, action: 'togglePreview', description: 'Toggle preview' },
  { key: 'l', meta: true, shift: true, action: 'toggleLayers', description: 'Toggle layers panel' },
  { key: 'j', meta: true, action: 'toggleAI', description: 'Toggle AI panel' },
  { key: 'ArrowUp', alt: true, action: 'moveUp', description: 'Move block up' },
  { key: 'ArrowDown', alt: true, action: 'moveDown', description: 'Move block down' },
  { key: '=', meta: true, action: 'zoomIn', description: 'Zoom in' },
  { key: '-', meta: true, action: 'zoomOut', description: 'Zoom out' },
  { key: '0', meta: true, action: 'zoomReset', description: 'Reset zoom' },
  { key: 'k', meta: true, action: 'search', description: 'Search' },
  { key: 'Enter', meta: true, shift: true, action: 'publish', description: 'Publish' },
];

export function useKeyboardShortcuts(
  handlers: Partial<Record<ShortcutAction, () => void>>,
  enabled = true,
) {
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  useEffect(() => {
    if (!enabled) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (isInputFocused()) return;

      for (const shortcut of DEFAULT_SHORTCUTS) {
        const metaMatch = shortcut.meta ? (e.metaKey || e.ctrlKey) : !(e.metaKey || e.ctrlKey);
        const shiftMatch = shortcut.shift ? e.shiftKey : !e.shiftKey;
        const altMatch = shortcut.alt ? e.altKey : !e.altKey;

        if (e.key === shortcut.key && metaMatch && shiftMatch && altMatch) {
          const handler = handlersRef.current[shortcut.action];
          if (handler) {
            e.preventDefault();
            handler();
            return;
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [enabled]);
}

function isInputFocused(): boolean {
  const el = document.activeElement;
  if (!el) return false;
  const tag = el.tagName.toLowerCase();
  if (tag === 'input' || tag === 'textarea' || tag === 'select') return true;
  if ((el as HTMLElement).isContentEditable) return true;
  return false;
}

export function getShortcutLabel(action: ShortcutAction): string {
  const shortcut = DEFAULT_SHORTCUTS.find((s) => s.action === action);
  if (!shortcut) return '';

  const isMac = typeof navigator !== 'undefined' && navigator.platform.includes('Mac');
  const parts: string[] = [];
  if (shortcut.meta) parts.push(isMac ? '⌘' : 'Ctrl');
  if (shortcut.shift) parts.push(isMac ? '⇧' : 'Shift');
  if (shortcut.alt) parts.push(isMac ? '⌥' : 'Alt');

  const keyLabel: Record<string, string> = {
    'Backspace': '⌫', 'Escape': 'Esc', 'ArrowUp': '↑', 'ArrowDown': '↓',
    'Enter': '↵', '=': '+', '-': '-',
  };
  parts.push(keyLabel[shortcut.key] || shortcut.key.toUpperCase());
  return parts.join(isMac ? '' : '+');
}

export function getAllShortcuts(): { action: ShortcutAction; description: string; label: string }[] {
  return DEFAULT_SHORTCUTS.map((s) => ({
    action: s.action,
    description: s.description,
    label: getShortcutLabel(s.action),
  }));
}
