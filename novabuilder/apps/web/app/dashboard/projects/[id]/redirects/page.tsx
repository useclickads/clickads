'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

type Redirect = {
  id: string;
  source: string;
  destination: string;
  statusCode: number;
  enabled: boolean;
  createdAt: string;
};

export default function RedirectsPage() {
  const { id: projectId } = useParams<{ id: string }>();
  const [redirects, setRedirects] = useState<Redirect[]>([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [statusCode, setStatusCode] = useState(301);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
  const headers: Record<string, string> = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  async function load() {
    const res = await fetch(`${API}/projects/${projectId}/redirects`, { headers });
    setRedirects(await res.json());
    setLoading(false);
  }

  async function add() {
    if (!source.trim() || !destination.trim()) return;
    await fetch(`${API}/projects/${projectId}/redirects`, {
      method: 'POST', headers,
      body: JSON.stringify({ source: source.trim(), destination: destination.trim(), statusCode }),
    });
    setSource('');
    setDestination('');
    load();
  }

  async function toggle(id: string, enabled: boolean) {
    await fetch(`${API}/projects/${projectId}/redirects/${id}`, {
      method: 'PATCH', headers, body: JSON.stringify({ enabled: !enabled }),
    });
    load();
  }

  async function remove(id: string) {
    await fetch(`${API}/projects/${projectId}/redirects/${id}`, { method: 'DELETE', headers });
    load();
  }

  useEffect(() => { load(); }, [projectId]);

  return (
    <div style={{ padding: 32, maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>Redirects</h1>
      <p style={{ color: '#64748b', marginBottom: 24, fontSize: '0.9rem' }}>
        Manage URL redirects for your published site.
      </p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        <input value={source} onChange={(e) => setSource(e.target.value)} placeholder="/old-path" style={inputStyle} />
        <span style={{ alignSelf: 'center', color: '#94a3b8', fontWeight: 600 }}>→</span>
        <input value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="/new-path" style={inputStyle} />
        <select value={statusCode} onChange={(e) => setStatusCode(Number(e.target.value))} style={selectStyle}>
          <option value={301}>301 Permanent</option>
          <option value={302}>302 Temporary</option>
          <option value={307}>307 Temporary</option>
          <option value={308}>308 Permanent</option>
        </select>
        <button onClick={add} style={btnPrimary}>Add</button>
      </div>

      {loading ? (
        <p style={{ color: '#94a3b8' }}>Loading...</p>
      ) : redirects.length === 0 ? (
        <p style={{ color: '#94a3b8', textAlign: 'center', padding: 40 }}>No redirects configured.</p>
      ) : (
        <div style={{ display: 'grid', gap: 8 }}>
          {redirects.map((r) => (
            <div key={r.id} style={{ ...cardStyle, opacity: r.enabled ? 1 : 0.5 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.9rem' }}>
                  <code style={codeBg}>{r.source}</code>
                  <span style={{ color: '#94a3b8' }}>→</span>
                  <code style={codeBg}>{r.destination}</code>
                  <span style={badgeStyle}>{r.statusCode}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => toggle(r.id, r.enabled)} style={btnSmall}>
                  {r.enabled ? 'Disable' : 'Enable'}
                </button>
                <button onClick={() => remove(r.id)} style={btnDanger}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: '10px 14px', borderRadius: 10, border: '1px solid #e2e8f0',
  fontSize: '0.9rem', outline: 'none', flex: 1, minWidth: 140,
};
const selectStyle: React.CSSProperties = {
  padding: '10px 12px', borderRadius: 10, border: '1px solid #e2e8f0',
  fontSize: '0.85rem', background: '#fff',
};
const btnPrimary: React.CSSProperties = {
  padding: '10px 20px', borderRadius: 10, border: 'none', background: '#6366f1',
  color: '#fff', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
};
const btnSmall: React.CSSProperties = {
  padding: '6px 12px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff',
  color: '#475569', fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer',
};
const btnDanger: React.CSSProperties = {
  padding: '6px 12px', borderRadius: 8, border: '1px solid #fecaca', background: '#fff',
  color: '#ef4444', fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer',
};
const cardStyle: React.CSSProperties = {
  padding: 14, borderRadius: 12, border: '1px solid #e2e8f0', background: '#fff',
  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
};
const codeBg: React.CSSProperties = {
  padding: '2px 8px', borderRadius: 6, background: '#f1f5f9', fontSize: '0.8rem',
  fontFamily: 'monospace', color: '#334155',
};
const badgeStyle: React.CSSProperties = {
  padding: '2px 8px', borderRadius: 6, background: '#eff6ff', color: '#2563eb',
  fontSize: '0.7rem', fontWeight: 700,
};
