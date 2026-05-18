'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

type Backup = {
  id: string;
  createdAt: string;
  createdBy: string;
  pageCount: number;
};

export default function BackupsPage() {
  const { id: projectId } = useParams<{ id: string }>();
  const [backups, setBackups] = useState<Backup[]>([]);
  const [loading, setLoading] = useState(true);
  const [restoring, setRestoring] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
  const headers: Record<string, string> = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  async function load() {
    const res = await fetch(`${API}/projects/${projectId}/backups`, { headers });
    setBackups(await res.json());
    setLoading(false);
  }

  async function create() {
    setCreating(true);
    await fetch(`${API}/projects/${projectId}/backups`, { method: 'POST', headers });
    setCreating(false);
    load();
  }

  async function restore(backupId: string) {
    setRestoring(backupId);
    await fetch(`${API}/projects/${projectId}/backups/${backupId}/restore`, { method: 'POST', headers });
    setRestoring(null);
  }

  async function remove(backupId: string) {
    await fetch(`${API}/projects/${projectId}/backups/${backupId}`, { method: 'DELETE', headers });
    load();
  }

  useEffect(() => { load(); }, [projectId]);

  return (
    <div style={{ padding: 32, maxWidth: 900, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>Backups</h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Create snapshots of your project to restore later.
          </p>
        </div>
        <button onClick={create} disabled={creating} style={btnPrimary}>
          {creating ? 'Creating...' : 'Create Backup'}
        </button>
      </div>

      {loading ? (
        <p style={{ color: '#94a3b8' }}>Loading...</p>
      ) : backups.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8' }}>
          <div style={{ fontSize: '2rem', marginBottom: 8 }}>No backups yet</div>
          <p style={{ fontSize: '0.9rem' }}>Create your first backup to protect your work.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {backups.map((b) => (
            <div key={b.id} style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.95rem' }}>
                    {new Date(b.createdAt).toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: 2 }}>
                    {b.pageCount} page{b.pageCount !== 1 ? 's' : ''} backed up
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => restore(b.id)}
                    disabled={restoring === b.id}
                    style={btnSecondary}
                  >
                    {restoring === b.id ? 'Restoring...' : 'Restore'}
                  </button>
                  <button onClick={() => remove(b.id)} style={btnDelete}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const btnPrimary: React.CSSProperties = {
  padding: '10px 20px', borderRadius: 10, border: 'none', background: '#6366f1',
  color: '#fff', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
};
const btnSecondary: React.CSSProperties = {
  padding: '8px 16px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff',
  color: '#334155', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer',
};
const btnDelete: React.CSSProperties = {
  padding: '8px 16px', borderRadius: 8, border: '1px solid #fecaca', background: '#fff',
  color: '#ef4444', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer',
};
const cardStyle: React.CSSProperties = {
  padding: 16, borderRadius: 12, border: '1px solid #e2e8f0', background: '#fff',
};
