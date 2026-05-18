'use client';

const SHORTCUTS = [
  { keys: ['Cmd', 'S'], description: 'Save page' },
  { keys: ['Cmd', 'Z'], description: 'Undo' },
  { keys: ['Cmd', 'Shift', 'Z'], description: 'Redo' },
  { keys: ['Cmd', 'D'], description: 'Duplicate block' },
  { keys: ['Delete'], description: 'Remove selected block' },
  { keys: ['Escape'], description: 'Deselect block' },
  { keys: ['Cmd', 'Shift', 'P'], description: 'Toggle preview' },
  { keys: ['?'], description: 'Show shortcuts' },
];

export function ShortcutsModal({ onClose }: { onClose: () => void }) {
  return (
    <div style={overlay} onClick={onClose}>
      <div style={modal} onClick={(e) => e.stopPropagation()}>
        <div style={header}>
          <h2 style={titleStyle}>Keyboard Shortcuts</h2>
          <button onClick={onClose} style={closeBtn}>×</button>
        </div>
        <div style={list}>
          {SHORTCUTS.map((s, i) => (
            <div key={i} style={row}>
              <div style={keysContainer}>
                {s.keys.map((key, j) => (
                  <span key={j}>
                    <kbd style={kbd}>{key}</kbd>
                    {j < s.keys.length - 1 && <span style={plus}>+</span>}
                  </span>
                ))}
              </div>
              <span style={desc}>{s.description}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const overlay: React.CSSProperties = {
  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center',
  justifyContent: 'center', zIndex: 10000, backdropFilter: 'blur(4px)',
};
const modal: React.CSSProperties = {
  background: '#fff', borderRadius: 16, padding: 24, width: 420, maxHeight: '80vh', overflow: 'auto',
  boxShadow: '0 24px 48px rgba(0,0,0,0.12)',
};
const header: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 };
const titleStyle: React.CSSProperties = { margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' };
const closeBtn: React.CSSProperties = { width: 28, height: 28, borderRadius: 8, border: 'none', background: '#f1f5f9', cursor: 'pointer', fontSize: '1.2rem', color: '#64748b' };
const list: React.CSSProperties = { display: 'grid', gap: 8 };
const row: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f1f5f9' };
const keysContainer: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 4 };
const kbd: React.CSSProperties = { padding: '3px 8px', borderRadius: 6, background: '#f1f5f9', border: '1px solid #e2e8f0', fontSize: '0.75rem', fontWeight: 600, color: '#334155', fontFamily: 'monospace' };
const plus: React.CSSProperties = { fontSize: '0.7rem', color: '#94a3b8', margin: '0 2px' };
const desc: React.CSSProperties = { fontSize: '0.85rem', color: '#475569' };
