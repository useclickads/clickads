'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ProtectedRoute } from '../../../../../components/protected-route';
import { useApi } from '../../../../../lib/use-api';

type Collaborator = {
  id: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
};

export default function TeamPage() {
  return (
    <ProtectedRoute>
      <TeamManagement />
    </ProtectedRoute>
  );
}

function TeamManagement() {
  const { id } = useParams<{ id: string }>();
  const api = useApi();
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInvite, setShowInvite] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await api.get<Collaborator[]>(`/projects/${id}/team/collaborators`);
      setCollaborators(data);
    } catch {
      setCollaborators([]);
    } finally {
      setLoading(false);
    }
  }, [api, id]);

  useEffect(() => { load(); }, [load]);

  async function handleRemove(collabId: string) {
    if (!confirm('Remove this collaborator?')) return;
    try {
      await api.delete(`/projects/${id}/team/collaborators/${collabId}`);
      load();
    } catch {}
  }

  async function handleRoleChange(collabId: string, role: string) {
    try {
      await api.patch(`/projects/${id}/team/collaborators/${collabId}/role`, { role });
      load();
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
        <span style={{ color: '#0f172a', fontWeight: 600 }}>Team</span>
      </nav>

      <header style={headerStyle}>
        <h1 style={titleStyle}>Team & Collaborators</h1>
        <button onClick={() => setShowInvite(true)} style={primaryBtn}>Invite</button>
      </header>

      {showInvite && (
        <InviteForm
          api={api}
          projectId={id}
          onInvited={() => { setShowInvite(false); load(); }}
          onCancel={() => setShowInvite(false)}
        />
      )}

      {collaborators.length === 0 ? (
        <div style={emptyState}>
          <p style={{ margin: 0, fontWeight: 600 }}>No collaborators yet</p>
          <p style={muted}>Invite team members to collaborate on this project.</p>
        </div>
      ) : (
        <div style={listStyle}>
          {collaborators.map((c) => (
            <div key={c.id} style={rowStyle}>
              <div>
                <p style={nameText}>{c.email}</p>
                <p style={statusText}>{c.status === 'pending' ? 'Invite pending' : 'Active'}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <select
                  value={c.role}
                  onChange={(e) => handleRoleChange(c.id, e.target.value)}
                  style={selectStyle}
                >
                  <option value="viewer">Viewer</option>
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                </select>
                <button onClick={() => handleRemove(c.id)} style={removeBtn}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function InviteForm({ api, projectId, onInvited, onCancel }: { api: ReturnType<typeof useApi>; projectId: string; onInvited: () => void; onCancel: () => void }) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('editor');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.post<{ error?: string }>(`/projects/${projectId}/team/collaborators`, { email, role });
      if (res.error) {
        setError(res.error);
        setLoading(false);
        return;
      }
      onInvited();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to invite.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={formCard}>
      <h3 style={{ margin: 0, color: '#0f172a' }}>Invite Collaborator</h3>
      <label style={labelStyle}>
        Email
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} placeholder="colleague@company.com" />
      </label>
      <label style={labelStyle}>
        Role
        <select value={role} onChange={(e) => setRole(e.target.value)} style={inputStyle}>
          <option value="viewer">Viewer</option>
          <option value="editor">Editor</option>
          <option value="admin">Admin</option>
        </select>
      </label>
      {error && <p style={{ margin: 0, color: '#dc2626', fontSize: '0.85rem' }}>{error}</p>}
      <div style={{ display: 'flex', gap: 12 }}>
        <button type="submit" style={primaryBtn} disabled={loading}>{loading ? 'Inviting…' : 'Send Invite'}</button>
        <button type="button" onClick={onCancel} style={cancelBtn}>Cancel</button>
      </div>
    </form>
  );
}

const containerStyle: React.CSSProperties = { maxWidth: 900, margin: '0 auto', padding: '40px 24px' };
const navStyle: React.CSSProperties = { display: 'flex', gap: 8, alignItems: 'center', fontSize: '0.9rem' };
const headerStyle: React.CSSProperties = { marginTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const titleStyle: React.CSSProperties = { fontSize: '1.5rem', margin: 0, color: '#0f172a' };
const primaryBtn: React.CSSProperties = { padding: '10px 18px', borderRadius: 10, border: 'none', background: '#0f172a', color: '#fff', fontWeight: 600, cursor: 'pointer' };
const cancelBtn: React.CSSProperties = { padding: '10px 16px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontWeight: 600, color: '#475569' };
const removeBtn: React.CSSProperties = { padding: '6px 12px', borderRadius: 8, border: '1px solid #fecaca', background: '#fff', color: '#dc2626', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' };
const muted: React.CSSProperties = { color: '#64748b', fontSize: '0.9rem' };
const linkStyle: React.CSSProperties = { color: '#2563eb', textDecoration: 'none', fontWeight: 600 };
const emptyState: React.CSSProperties = { marginTop: 20, padding: 32, borderRadius: 16, background: '#f8fafc', border: '1px solid #e2e8f0', textAlign: 'center' };
const listStyle: React.CSSProperties = { marginTop: 16, display: 'grid', gap: 8 };
const rowStyle: React.CSSProperties = { padding: 16, borderRadius: 12, background: '#fff', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const nameText: React.CSSProperties = { margin: 0, fontWeight: 600, color: '#0f172a', fontSize: '0.95rem' };
const statusText: React.CSSProperties = { margin: '2px 0 0', fontSize: '0.8rem', color: '#94a3b8' };
const selectStyle: React.CSSProperties = { padding: '6px 10px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.85rem', cursor: 'pointer' };
const formCard: React.CSSProperties = { marginTop: 16, padding: 24, borderRadius: 14, background: '#f8fafc', border: '1px solid #e2e8f0', display: 'grid', gap: 14 };
const labelStyle: React.CSSProperties = { display: 'grid', gap: 6, color: '#334155', fontSize: '0.9rem' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #cbd5e1', fontSize: '0.95rem' };
