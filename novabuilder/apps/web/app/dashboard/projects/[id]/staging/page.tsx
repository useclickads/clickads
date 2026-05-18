'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

type StagingEnv = {
  id: string;
  name: string;
  status: string;
  changeCount: number;
  createdBy: string;
  createdAt: string;
};

export default function StagingPage() {
  const { id: projectId } = useParams<{ id: string }>();
  const [envs, setEnvs] = useState<StagingEnv[]>([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedEnv, setSelectedEnv] = useState<string | null>(null);
  const [details, setDetails] = useState<any>(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
  const headers: Record<string, string> = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  async function load() {
    const res = await fetch(`${API}/projects/${projectId}/staging`, { headers });
    setEnvs(await res.json());
    setLoading(false);
  }

  async function loadDetails(envId: string) {
    const res = await fetch(`${API}/projects/${projectId}/staging/${envId}`, { headers });
    setDetails(await res.json());
    setSelectedEnv(envId);
  }

  async function create() {
    if (!name.trim()) return;
    await fetch(`${API}/projects/${projectId}/staging`, {
      method: 'POST', headers, body: JSON.stringify({ name: name.trim() }),
    });
    setName('');
    load();
  }

  async function publish(envId: string) {
    await fetch(`${API}/projects/${projectId}/staging/${envId}/publish`, { method: 'POST', headers });
    load();
    setSelectedEnv(null);
    setDetails(null);
  }

  async function discard(envId: string) {
    await fetch(`${API}/projects/${projectId}/staging/${envId}/discard`, { method: 'POST', headers });
    load();
    setSelectedEnv(null);
    setDetails(null);
  }

  useEffect(() => { load(); }, [projectId]);

  const statusColors: Record<string, string> = {
    draft: '#f59e0b',
    published: '#10b981',
    discarded: '#94a3b8',
  };

  return (
    <div style={{ padding: 32, maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>Content Staging</h1>
      <p style={{ color: '#64748b', marginBottom: 24, fontSize: '0.9rem' }}>
        Create staging environments to batch changes and publish them together.
      </p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Staging environment name..."
          style={inputStyle}
          onKeyDown={(e) => e.key === 'Enter' && create()}
        />
        <button onClick={create} style={btnPrimary}>Create</button>
      </div>

      {loading ? (
        <p style={{ color: '#94a3b8' }}>Loading...</p>
      ) : envs.length === 0 ? (
        <p style={{ color: '#94a3b8', textAlign: 'center', padding: 40 }}>No staging environments yet.</p>
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {envs.map((env) => (
            <div
              key={env.id}
              style={{
                ...cardStyle,
                borderLeft: `4px solid ${statusColors[env.status] || '#e2e8f0'}`,
                cursor: 'pointer',
                background: selectedEnv === env.id ? '#f8fafc' : '#fff',
              }}
              onClick={() => loadDetails(env.id)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ color: '#0f172a' }}>{env.name}</strong>
                  <span style={{
                    marginLeft: 12,
                    fontSize: '0.75rem',
                    padding: '2px 8px',
                    borderRadius: 8,
                    background: `${statusColors[env.status]}20`,
                    color: statusColors[env.status],
                    fontWeight: 600,
                  }}>
                    {env.status}
                  </span>
                </div>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  {env.changeCount} change{env.changeCount !== 1 ? 's' : ''}
                </span>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: 4 }}>
                Created {new Date(env.createdAt).toLocaleDateString()}
              </div>

              {selectedEnv === env.id && details && (
                <div style={{ marginTop: 16, borderTop: '1px solid #f1f5f9', paddingTop: 12 }}>
                  {details.changes?.length > 0 ? (
                    <div style={{ display: 'grid', gap: 8 }}>
                      {details.changes.map((c: any, i: number) => (
                        <div key={i} style={{ fontSize: '0.8rem', padding: '8px 12px', background: '#f8fafc', borderRadius: 8 }}>
                          <strong>{c.pageTitle}</strong> — {c.field} modified
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>No changes staged yet.</p>
                  )}

                  {env.status === 'draft' && (
                    <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                      <button onClick={() => publish(env.id)} style={btnPrimary}>Publish All</button>
                      <button onClick={() => discard(env.id)} style={btnDanger}>Discard</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  flex: 1, padding: '10px 14px', borderRadius: 10, border: '1px solid #e2e8f0',
  fontSize: '0.9rem', outline: 'none',
};
const btnPrimary: React.CSSProperties = {
  padding: '10px 20px', borderRadius: 10, border: 'none', background: '#6366f1',
  color: '#fff', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
};
const btnDanger: React.CSSProperties = {
  padding: '10px 20px', borderRadius: 10, border: '1px solid #fecaca', background: '#fff',
  color: '#ef4444', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
};
const cardStyle: React.CSSProperties = {
  padding: 16, borderRadius: 12, border: '1px solid #e2e8f0', background: '#fff',
};
