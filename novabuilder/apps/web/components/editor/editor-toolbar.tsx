'use client';

import Link from 'next/link';
import { useEditor, type Viewport } from '../../lib/editor/editor-context';

export function EditorToolbar({ projectId, pageTitle, onSave, saving }: {
  projectId: string;
  pageTitle: string;
  onSave: () => void;
  saving: boolean;
}) {
  const { undo, redo, canUndo, canRedo, viewport, setViewport } = useEditor();

  return (
    <header style={toolbarStyle}>
      <div style={leftSection}>
        <Link href={`/dashboard/projects/${projectId}`} style={backLink}>← Back</Link>
        <span style={divider} />
        <span style={pageTitleStyle}>{pageTitle}</span>
      </div>

      <div style={centerSection}>
        <button onClick={undo} disabled={!canUndo} style={iconBtn} title="Undo (Cmd+Z)">↩</button>
        <button onClick={redo} disabled={!canRedo} style={iconBtn} title="Redo (Cmd+Shift+Z)">↪</button>
        <span style={divider} />
        <ViewportToggle viewport={viewport} setViewport={setViewport} />
      </div>

      <div style={rightSection}>
        <Link href={`/preview/${projectId}`} style={previewLink} target="_blank">Preview</Link>
        <button onClick={onSave} disabled={saving} style={saveBtn}>
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </header>
  );
}

function ViewportToggle({ viewport, setViewport }: { viewport: Viewport; setViewport: (v: Viewport) => void }) {
  return (
    <div style={viewportGroup}>
      <button onClick={() => setViewport('desktop')} style={viewport === 'desktop' ? vpActive : vpBtn} title="Desktop">🖥</button>
      <button onClick={() => setViewport('tablet')} style={viewport === 'tablet' ? vpActive : vpBtn} title="Tablet">⊟</button>
      <button onClick={() => setViewport('mobile')} style={viewport === 'mobile' ? vpActive : vpBtn} title="Mobile">📱</button>
    </div>
  );
}

const toolbarStyle: React.CSSProperties = { height: 52, padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', borderBottom: '1px solid #e2e8f0', flexShrink: 0 };
const leftSection: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 12 };
const centerSection: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 8 };
const rightSection: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 8 };
const backLink: React.CSSProperties = { color: '#475569', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 };
const divider: React.CSSProperties = { width: 1, height: 20, background: '#e2e8f0' };
const pageTitleStyle: React.CSSProperties = { fontSize: '0.9rem', fontWeight: 600, color: '#0f172a' };
const iconBtn: React.CSSProperties = { width: 32, height: 32, borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const saveBtn: React.CSSProperties = { padding: '8px 20px', borderRadius: 8, border: 'none', background: '#0f172a', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' };
const previewLink: React.CSSProperties = { padding: '8px 16px', borderRadius: 8, border: '1px solid #e2e8f0', color: '#475569', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' };
const viewportGroup: React.CSSProperties = { display: 'flex', gap: 2, background: '#f1f5f9', borderRadius: 8, padding: 2 };
const vpBtn: React.CSSProperties = { width: 30, height: 28, borderRadius: 6, border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '0.85rem' };
const vpActive: React.CSSProperties = { ...vpBtn, background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' };
