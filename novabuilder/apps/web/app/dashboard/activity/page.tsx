'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '../../../components/protected-route';
import { useApi } from '../../../lib/use-api';

type AuditEntry = {
  id: string;
  action: string;
  resource: string;
  resourceId: string | null;
  meta: Record<string, unknown> | null;
  createdAt: string;
};

export default function ActivityPage() {
  return (
    <ProtectedRoute>
      <ActivityLog />
    </ProtectedRoute>
  );
}

function ActivityLog() {
  const api = useApi();
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const data = await api.get<AuditEntry[]>('/audit');
      setEntries(data);
    } catch {}
    setLoading(false);
  }, [api]);

  useEffect(() => { load(); }, [load]);

  if (loading) return <div style={containerStyle}><p style={muted}>Loading...</p></div>;

  return (
    <div style={containerStyle}>
      <nav style={navStyle}>
        <Link href="/dashboard" style={linkStyle}>Dashboard</Link>
        <span style={muted}>/</span>
        <span style={{ color: '#0f172a', fontWeight: 600 }}>Activity</span>
      </nav>

      <h1 style={titleStyle}>Activity Log</h1>
      <p style={muted}>Your recent actions across all projects.</p>

      {entries.length === 0 ? (
        <div style={emptyState}>
          <p style={{ margin: 0, fontWeight: 600 }}>No activity yet</p>
          <p style={muted}>Your actions will be recorded here.</p>
        </div>
      ) : (
        <div style={listStyle}>
          {entries.map((e) => (
            <div key={e.id} style={rowStyle}>
              <div style={iconCol}>
                <div style={actionDot(e.action)} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={actionText}>{formatAction(e.action)} <span style={resourceText}>{e.resource}{e.resourceId ? ` #${e.resourceId.slice(0, 8)}` : ''}</span></p>
                {e.meta && Object.keys(e.meta).length > 0 && (
                  <p style={metaText}>{JSON.stringify(e.meta).slice(0, 120)}</p>
                )}
              </div>
              <span style={dateText}>{new Date(e.createdAt).toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function formatAction(action: string) {
  return action.replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

const containerStyle: React.CSSProperties = { maxWidth: 800, margin: '0 auto', padding: '40px 24px' };
const navStyle: React.CSSProperties = { display: 'flex', gap: 8, alignItems: 'center', fontSize: '0.9rem' };
const titleStyle: React.CSSProperties = { fontSize: '1.5rem', margin: '20px 0 4px', color: '#0f172a' };
const muted: React.CSSProperties = { color: '#64748b', fontSize: '0.9rem' };
const linkStyle: React.CSSProperties = { color: '#2563eb', textDecoration: 'none', fontWeight: 600 };
const emptyState: React.CSSProperties = { marginTop: 24, padding: 32, borderRadius: 16, background: '#f8fafc', border: '1px solid #e2e8f0', textAlign: 'center' };
const listStyle: React.CSSProperties = { marginTop: 20, display: 'grid', gap: 4 };
const rowStyle: React.CSSProperties = { display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 0', borderBottom: '1px solid #f1f5f9' };
const iconCol: React.CSSProperties = { paddingTop: 4 };
const actionDot = (action: string): React.CSSProperties => {
  const colors: Record<string, string> = { create: '#16a34a', update: '#2563eb', delete: '#dc2626' };
  const key = Object.keys(colors).find((k) => action.toLowerCase().includes(k));
  return { width: 8, height: 8, borderRadius: '50%', background: key ? colors[key] : '#94a3b8' };
};
const actionText: React.CSSProperties = { margin: 0, fontSize: '0.85rem', color: '#0f172a' };
const resourceText: React.CSSProperties = { color: '#64748b', fontWeight: 400 };
const metaText: React.CSSProperties = { margin: '2px 0 0', fontSize: '0.75rem', color: '#94a3b8' };
const dateText: React.CSSProperties = { fontSize: '0.75rem', color: '#94a3b8', whiteSpace: 'nowrap' };
