'use client';

import { useState } from 'react';
import Link from 'next/link';

export function EditorToolbar({ projectId, pageTitle, onSave, saving }: {
  projectId: string;
  pageTitle: string;
  onSave: () => void;
  saving: boolean;
}) {
  return (
    <header style={toolbarStyle}>
      <div style={leftSection}>
        <Link href={`/dashboard/projects/${projectId}`} style={backLink}>← Back</Link>
        <span style={divider} />
        <span style={pageTitleStyle}>{pageTitle}</span>
      </div>
      <div style={rightSection}>
        <button onClick={onSave} disabled={saving} style={saveBtn}>
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </header>
  );
}

const toolbarStyle: React.CSSProperties = { height: 52, padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', borderBottom: '1px solid #e2e8f0', flexShrink: 0 };
const leftSection: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 12 };
const rightSection: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 8 };
const backLink: React.CSSProperties = { color: '#475569', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 };
const divider: React.CSSProperties = { width: 1, height: 20, background: '#e2e8f0' };
const pageTitleStyle: React.CSSProperties = { fontSize: '0.9rem', fontWeight: 600, color: '#0f172a' };
const saveBtn: React.CSSProperties = { padding: '8px 20px', borderRadius: 8, border: 'none', background: '#0f172a', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' };
