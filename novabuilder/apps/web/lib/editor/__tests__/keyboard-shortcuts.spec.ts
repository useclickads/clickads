import { describe, it, expect } from 'vitest';

type ShortcutAction =
  | 'undo' | 'redo' | 'save' | 'delete' | 'duplicate'
  | 'selectAll' | 'copy' | 'paste' | 'cut'
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

const SHORTCUTS: ShortcutDef[] = [
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
  { key: 'ArrowUp', alt: true, action: 'moveUp', description: 'Move block up' },
  { key: 'ArrowDown', alt: true, action: 'moveDown', description: 'Move block down' },
  { key: '=', meta: true, action: 'zoomIn', description: 'Zoom in' },
  { key: '-', meta: true, action: 'zoomOut', description: 'Zoom out' },
  { key: '0', meta: true, action: 'zoomReset', description: 'Reset zoom' },
  { key: 'k', meta: true, action: 'search', description: 'Search' },
];

function matchShortcut(
  e: { key: string; metaKey: boolean; ctrlKey: boolean; shiftKey: boolean; altKey: boolean },
  shortcuts: ShortcutDef[],
): ShortcutAction | null {
  for (const s of shortcuts) {
    const metaMatch = s.meta ? (e.metaKey || e.ctrlKey) : !(e.metaKey || e.ctrlKey);
    const shiftMatch = s.shift ? e.shiftKey : !e.shiftKey;
    const altMatch = s.alt ? e.altKey : !e.altKey;
    if (e.key === s.key && metaMatch && shiftMatch && altMatch) {
      return s.action;
    }
  }
  return null;
}

function getShortcutLabel(action: ShortcutAction, isMac = true): string {
  const s = SHORTCUTS.find((x) => x.action === action);
  if (!s) return '';
  const parts: string[] = [];
  if (s.meta) parts.push(isMac ? '⌘' : 'Ctrl');
  if (s.shift) parts.push(isMac ? '⇧' : 'Shift');
  if (s.alt) parts.push(isMac ? '⌥' : 'Alt');
  const keyLabels: Record<string, string> = { Backspace: '⌫', Escape: 'Esc', ArrowUp: '↑', ArrowDown: '↓', '=': '+' };
  parts.push(keyLabels[s.key] || s.key.toUpperCase());
  return parts.join(isMac ? '' : '+');
}

describe('KeyboardShortcuts', () => {
  it('matches Cmd+Z to undo', () => {
    const action = matchShortcut({ key: 'z', metaKey: true, ctrlKey: false, shiftKey: false, altKey: false }, SHORTCUTS);
    expect(action).toBe('undo');
  });

  it('matches Cmd+Shift+Z to redo', () => {
    const action = matchShortcut({ key: 'z', metaKey: true, ctrlKey: false, shiftKey: true, altKey: false }, SHORTCUTS);
    expect(action).toBe('redo');
  });

  it('matches Cmd+S to save', () => {
    const action = matchShortcut({ key: 's', metaKey: true, ctrlKey: false, shiftKey: false, altKey: false }, SHORTCUTS);
    expect(action).toBe('save');
  });

  it('matches Ctrl+Z on non-Mac', () => {
    const action = matchShortcut({ key: 'z', metaKey: false, ctrlKey: true, shiftKey: false, altKey: false }, SHORTCUTS);
    expect(action).toBe('undo');
  });

  it('matches Alt+ArrowUp to moveUp', () => {
    const action = matchShortcut({ key: 'ArrowUp', metaKey: false, ctrlKey: false, shiftKey: false, altKey: true }, SHORTCUTS);
    expect(action).toBe('moveUp');
  });

  it('matches Escape to escape', () => {
    const action = matchShortcut({ key: 'Escape', metaKey: false, ctrlKey: false, shiftKey: false, altKey: false }, SHORTCUTS);
    expect(action).toBe('escape');
  });

  it('returns null for unmatched key', () => {
    const action = matchShortcut({ key: 'q', metaKey: false, ctrlKey: false, shiftKey: false, altKey: false }, SHORTCUTS);
    expect(action).toBeNull();
  });

  it('does not match when modifier is wrong', () => {
    const action = matchShortcut({ key: 'z', metaKey: false, ctrlKey: false, shiftKey: false, altKey: false }, SHORTCUTS);
    expect(action).toBeNull();
  });

  it('generates Mac-style labels', () => {
    expect(getShortcutLabel('undo', true)).toBe('⌘Z');
    expect(getShortcutLabel('redo', true)).toBe('⌘⇧Z');
    expect(getShortcutLabel('moveUp', true)).toBe('⌥↑');
  });

  it('generates Windows-style labels', () => {
    expect(getShortcutLabel('undo', false)).toBe('Ctrl+Z');
    expect(getShortcutLabel('redo', false)).toBe('Ctrl+Shift+Z');
    expect(getShortcutLabel('moveUp', false)).toBe('Alt+↑');
  });

  it('every shortcut has a description', () => {
    for (const s of SHORTCUTS) {
      expect(s.description).toBeTruthy();
    }
  });

  it('no duplicate action mappings', () => {
    const actions = SHORTCUTS.map((s) => s.action);
    const unique = new Set(actions);
    expect(unique.size).toBe(actions.length);
  });
});
