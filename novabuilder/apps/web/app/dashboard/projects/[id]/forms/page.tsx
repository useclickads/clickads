'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ProtectedRoute } from '../../../../../components/protected-route';
import { useApi } from '../../../../../lib/use-api';

type Submission = {
  id: string;
  formName: string;
  data: Record<string, unknown>;
  createdAt: string;
};

export default function FormsPage() {
  return (
    <ProtectedRoute>
      <FormsView />
    </ProtectedRoute>
  );
}

function FormsView() {
  const { id } = useParams<{ id: string }>();
  const api = useApi();
  const [formNames, setFormNames] = useState<string[]>([]);
  const [activeForm, setActiveForm] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNames = useCallback(async () => {
    try {
      const names = await api.get<string[]>(`/projects/${id}/forms/names`);
      setFormNames(names);
    } catch {}
    setLoading(false);
  }, [api, id]);

  useEffect(() => { loadNames(); }, [loadNames]);

  const loadSubmissions = useCallback(async (formName: string) => {
    setActiveForm(formName);
    try {
      const data = await api.get<Submission[]>(`/projects/${id}/forms/submissions?form=${encodeURIComponent(formName)}`);
      setSubmissions(data);
    } catch { setSubmissions([]); }
  }, [api, id]);

  async function handleDelete(subId: string) {
    if (!confirm('Delete this submission?')) return;
    try {
      await api.delete(`/projects/${id}/forms/submissions/${subId}`);
      if (activeForm) loadSubmissions(activeForm);
    } catch {}
  }

  if (loading) return <div style={containerStyle}><p style={muted}>Loading...</p></div>;

  return (
    <div style={containerStyle}>
      <nav style={navStyle}>
        <Link href="/dashboard" style={linkStyle}>Dashboard</Link>
        <span style={muted}>/</span>
        <Link href={`/dashboard/projects/${id}`} style={linkStyle}>Project</Link>
        <span style={muted}>/</span>
        <span style={{ color: '#0f172a', fontWeight: 600 }}>Form Submissions</span>
      </nav>

      <header style={headerStyle}>
        <h1 style={titleStyle}>Form Submissions</h1>
      </header>

      {formNames.length === 0 ? (
        <div style={emptyState}>
          <p style={{ margin: 0, fontWeight: 600 }}>No form submissions yet</p>
          <p style={muted}>When visitors submit forms on your site, the data will appear here.</p>
        </div>
      ) : (
        <div style={layoutStyle}>
          <aside style={sidebarStyle}>
            <h3 style={sidebarTitle}>Forms</h3>
            {formNames.map((name) => (
              <button key={name} onClick={() => loadSubmissions(name)} style={activeForm === name ? activeItem : sideItem}>
                {name}
              </button>
            ))}
          </aside>
          <main style={mainStyle}>
            {!activeForm ? (
              <div style={emptyMain}><p style={muted}>Select a form to view submissions</p></div>
            ) : submissions.length === 0 ? (
              <div style={emptyMain}><p style={muted}>No submissions for "{activeForm}"</p></div>
            ) : (
              <div style={listStyle}>
                <p style={{ margin: '0 0 12px', color: '#475569', fontSize: '0.85rem' }}>{submissions.length} submission{submissions.length !== 1 ? 's' : ''}</p>
                {submissions.map((sub) => (
                  <div key={sub.id} style={rowStyle}>
                    <div style={{ flex: 1 }}>
                      {Object.entries(sub.data).map(([key, val]) => (
                        <div key={key} style={fieldRow}>
                          <span style={fieldLabel}>{key}</span>
                          <span style={fieldValue}>{String(val)}</span>
                        </div>
                      ))}
                    </div>
                    <div style={rowActions}>
                      <span style={dateText}>{new Date(sub.createdAt).toLocaleString()}</span>
                      <button onClick={() => handleDelete(sub.id)} style={deleteBtn}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      )}
    </div>
  );
}

const containerStyle: React.CSSProperties = { maxWidth: 1100, margin: '0 auto', padding: '40px 24px' };
const navStyle: React.CSSProperties = { display: 'flex', gap: 8, alignItems: 'center', fontSize: '0.9rem' };
const headerStyle: React.CSSProperties = { marginTop: 20, marginBottom: 24 };
const titleStyle: React.CSSProperties = { fontSize: '1.5rem', margin: 0, color: '#0f172a' };
const muted: React.CSSProperties = { color: '#64748b', fontSize: '0.9rem' };
const linkStyle: React.CSSProperties = { color: '#2563eb', textDecoration: 'none', fontWeight: 600 };
const emptyState: React.CSSProperties = { marginTop: 20, padding: 32, borderRadius: 16, background: '#f8fafc', border: '1px solid #e2e8f0', textAlign: 'center' };
const layoutStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: '200px 1fr', gap: 24 };
const sidebarStyle: React.CSSProperties = { background: '#f8fafc', borderRadius: 14, padding: 16, border: '1px solid #e2e8f0' };
const sidebarTitle: React.CSSProperties = { margin: '0 0 12px', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' };
const sideItem: React.CSSProperties = { display: 'block', width: '100%', padding: '10px 12px', borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '0.85rem', color: '#334155', textAlign: 'left' };
const activeItem: React.CSSProperties = { ...sideItem, background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', fontWeight: 600 };
const mainStyle: React.CSSProperties = { minHeight: 300 };
const emptyMain: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 };
const listStyle: React.CSSProperties = { display: 'grid', gap: 10 };
const rowStyle: React.CSSProperties = { padding: 16, borderRadius: 12, background: '#fff', border: '1px solid #e2e8f0', display: 'flex', gap: 16 };
const fieldRow: React.CSSProperties = { display: 'flex', gap: 8, marginBottom: 4 };
const fieldLabel: React.CSSProperties = { fontSize: '0.75rem', color: '#64748b', fontWeight: 600, minWidth: 80 };
const fieldValue: React.CSSProperties = { fontSize: '0.85rem', color: '#1e293b' };
const rowActions: React.CSSProperties = { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 };
const dateText: React.CSSProperties = { fontSize: '0.75rem', color: '#94a3b8' };
const deleteBtn: React.CSSProperties = { padding: '4px 10px', borderRadius: 6, border: '1px solid #fecaca', background: '#fff', color: '#dc2626', fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer' };
