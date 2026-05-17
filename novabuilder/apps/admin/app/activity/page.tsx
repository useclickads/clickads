'use client';

import { useEffect, useState } from 'react';

type AuditEntry = { id: string; action: string; actor: string; resource: string; resourceId: string; metadata: unknown; createdAt: string };

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export default function ActivityPage() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);

  useEffect(() => {
    fetch(`${API}/admin/activity?limit=100`, { headers: authHeaders() })
      .then((r) => r.json())
      .then((data) => setEntries(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  return (
    <div>
      <h1 style={titleStyle}>Platform Activity</h1>
      {entries.length === 0 ? (
        <p style={muted}>No activity recorded yet.</p>
      ) : (
        <div style={listStyle}>
          {entries.map((e) => (
            <div key={e.id} style={entryStyle}>
              <div style={entryRow}>
                <span style={actionBadge(e.action)}>{e.action}</span>
                <span style={resourceText}>{e.resource} / {e.resourceId?.slice(0, 8)}</span>
                <span style={timeText}>{new Date(e.createdAt).toLocaleString()}</span>
              </div>
              <p style={actorText}>by {e.actor}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function authHeaders(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const titleStyle: React.CSSProperties = { fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: '0 0 24px' };
const muted: React.CSSProperties = { color: '#64748b', fontSize: '0.9rem' };
const listStyle: React.CSSProperties = { display: 'grid', gap: 8 };
const entryStyle: React.CSSProperties = { padding: '14px 16px', borderRadius: 10, background: '#fff', border: '1px solid #e2e8f0' };
const entryRow: React.CSSProperties = { display: 'flex', gap: 12, alignItems: 'center' };
const actionBadge = (action: string): React.CSSProperties => {
  const colors: Record<string, string> = { create: '#16a34a', update: '#2563eb', delete: '#dc2626' };
  const bg: Record<string, string> = { create: '#dcfce7', update: '#dbeafe', delete: '#fef2f2' };
  const key = Object.keys(colors).find((k) => action.toLowerCase().includes(k)) || 'update';
  return { padding: '2px 8px', borderRadius: 4, fontSize: '0.75rem', fontWeight: 700, color: colors[key], background: bg[key] };
};
const resourceText: React.CSSProperties = { fontSize: '0.85rem', color: '#334155', fontWeight: 500 };
const timeText: React.CSSProperties = { marginLeft: 'auto', fontSize: '0.75rem', color: '#94a3b8' };
const actorText: React.CSSProperties = { margin: '4px 0 0', fontSize: '0.75rem', color: '#64748b' };
