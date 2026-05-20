'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ProtectedRoute } from '../../../../../components/protected-route';
import { useApi } from '../../../../../lib/use-api';

export default function ExportPage() {
  return (
    <ProtectedRoute>
      <ExportView />
    </ProtectedRoute>
  );
}

function ExportView() {
  const { id } = useParams<{ id: string }>();
  const api = useApi();
  const [exporting, setExporting] = useState(false);
  const [exported, setExported] = useState<object | null>(null);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ pagesImported: number; collectionsImported: number } | null>(null);

  async function handleExport() {
    setExporting(true);
    try {
      const data = await api.get<object>(`/projects/${id}/export`);
      setExported(data);
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `project-${id}-export.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {}
    setExporting(false);
  }

  async function handleImport() {
    if (!importFile) return;
    setImporting(true);
    try {
      const text = await importFile.text();
      const data = JSON.parse(text);
      const result = await api.post('/import', data);
      setImportResult(result as any);
    } catch {}
    setImporting(false);
  }

  return (
    <div style={containerStyle}>
      <nav style={navStyle}>
        <Link href="/dashboard" style={linkStyle}>Dashboard</Link>
        <span style={muted}>/</span>
        <Link href={`/dashboard/projects/${id}`} style={linkStyle}>Project</Link>
        <span style={muted}>/</span>
        <span style={{ color: '#0f172a', fontWeight: 600 }}>Export / Import</span>
      </nav>

      <header style={headerStyle}>
        <h1 style={titleStyle}>Export & Import</h1>
      </header>

      <div style={gridStyle}>
        <div style={cardStyle}>
          <h2 style={cardTitle}>Export Project</h2>
          <p style={cardDesc}>Download a complete backup of your project including pages, CMS data, settings, and theme tokens.</p>
          <button onClick={handleExport} disabled={exporting} style={primaryBtn}>
            {exporting ? 'Exporting...' : 'Export as JSON'}
          </button>
          {exported && <p style={successText}>Export downloaded successfully.</p>}
        </div>

        <div style={cardStyle}>
          <h2 style={cardTitle}>Import Project</h2>
          <p style={cardDesc}>Import a previously exported project. This creates a new project with all the data from the export file.</p>
          <input
            type="file"
            accept=".json"
            onChange={(e) => setImportFile(e.target.files?.[0] || null)}
            style={fileInput}
          />
          <button onClick={handleImport} disabled={importing || !importFile} style={primaryBtn}>
            {importing ? 'Importing...' : 'Import Project'}
          </button>
          {importResult && (
            <p style={successText}>
              Imported {importResult.pagesImported} pages and {importResult.collectionsImported} collections.
            </p>
          )}
        </div>

        <div style={cardStyle}>
          <h2 style={cardTitle}>Export Form Submissions</h2>
          <p style={cardDesc}>Export form submissions as CSV for use in spreadsheets or other tools.</p>
          <Link href={`/dashboard/projects/${id}/forms`} style={secondaryBtn}>
            Go to Forms
          </Link>
        </div>
      </div>
    </div>
  );
}

const containerStyle: React.CSSProperties = { maxWidth: 900, margin: '0 auto', padding: '40px 24px' };
const navStyle: React.CSSProperties = { display: 'flex', gap: 8, alignItems: 'center', fontSize: '0.9rem' };
const headerStyle: React.CSSProperties = { marginTop: 20, marginBottom: 24 };
const titleStyle: React.CSSProperties = { fontSize: '1.5rem', margin: 0, color: '#0f172a' };
const muted: React.CSSProperties = { color: '#64748b', fontSize: '0.9rem' };
const linkStyle: React.CSSProperties = { color: '#2563eb', textDecoration: 'none', fontWeight: 600 };
const gridStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 };
const cardStyle: React.CSSProperties = {
  padding: 24, borderRadius: 16, background: '#fff', border: '1px solid #e2e8f0',
  display: 'flex', flexDirection: 'column', gap: 12,
};
const cardTitle: React.CSSProperties = { margin: 0, fontSize: '1rem', color: '#0f172a', fontWeight: 700 };
const cardDesc: React.CSSProperties = { margin: 0, fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5 };
const primaryBtn: React.CSSProperties = {
  padding: '10px 16px', borderRadius: 10, border: 'none', background: '#2563eb',
  color: '#fff', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
};
const secondaryBtn: React.CSSProperties = {
  padding: '10px 16px', borderRadius: 10, border: '1px solid #e2e8f0',
  background: '#fff', color: '#334155', fontWeight: 600, fontSize: '0.85rem',
  cursor: 'pointer', textDecoration: 'none', textAlign: 'center' as const,
};
const fileInput: React.CSSProperties = { fontSize: '0.85rem', color: '#64748b' };
const successText: React.CSSProperties = { margin: 0, fontSize: '0.8rem', color: '#16a34a', fontWeight: 600 };
