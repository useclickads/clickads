'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ProtectedRoute } from '../../../../../components/protected-route';
import { useApi } from '../../../../../lib/use-api';

type Deployment = {
  id: string;
  url: string;
  status: string;
  createdAt: string;
};

export default function DeployPage() {
  return (
    <ProtectedRoute>
      <DeployManagement />
    </ProtectedRoute>
  );
}

function DeployManagement() {
  const { id } = useParams<{ id: string }>();
  const api = useApi();
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [loading, setLoading] = useState(true);
  const [deploying, setDeploying] = useState(false);
  const [result, setResult] = useState<{ pages: number } | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await api.get<Deployment[]>(`/projects/${id}/deploy/history`);
      setDeployments(data);
    } catch {
      setDeployments([]);
    } finally {
      setLoading(false);
    }
  }, [api, id]);

  useEffect(() => { load(); }, [load]);

  async function handleDeploy() {
    setDeploying(true);
    setResult(null);
    try {
      const res = await api.post<{ deployment: Deployment; pages: number }>(`/projects/${id}/deploy`, {});
      setResult({ pages: res.pages });
      load();
    } catch {}
    setDeploying(false);
  }

  if (loading) return <div style={containerStyle}><p style={muted}>Loading...</p></div>;

  return (
    <div style={containerStyle}>
      <nav style={navStyle}>
        <Link href="/dashboard" style={linkStyle}>Dashboard</Link>
        <span style={muted}>/</span>
        <Link href={`/dashboard/projects/${id}`} style={linkStyle}>Project</Link>
        <span style={muted}>/</span>
        <span style={{ color: '#0f172a', fontWeight: 600 }}>Deploy</span>
      </nav>

      <header style={headerStyle}>
        <div>
          <h1 style={titleStyle}>Deployments</h1>
          <p style={muted}>Deploy your published pages as a static site.</p>
        </div>
        <button onClick={handleDeploy} style={deployBtn} disabled={deploying}>
          {deploying ? 'Deploying…' : 'Deploy Now'}
        </button>
      </header>

      {result && (
        <div style={successBanner}>
          Deployed {result.pages} page{result.pages !== 1 ? 's' : ''} successfully.
        </div>
      )}

      {deployments.length === 0 ? (
        <div style={emptyState}>
          <p style={{ margin: 0, fontWeight: 600 }}>No deployments yet</p>
          <p style={muted}>Click "Deploy Now" to publish your site.</p>
        </div>
      ) : (
        <div style={listStyle}>
          {deployments.map((d) => (
            <div key={d.id} style={rowStyle}>
              <div>
                <p style={urlText}>{d.url}</p>
                <p style={dateText}>{new Date(d.createdAt).toLocaleString()}</p>
              </div>
              <span style={statusBadge(d.status)}>{d.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const containerStyle: React.CSSProperties = { maxWidth: 900, margin: '0 auto', padding: '40px 24px' };
const navStyle: React.CSSProperties = { display: 'flex', gap: 8, alignItems: 'center', fontSize: '0.9rem' };
const headerStyle: React.CSSProperties = { marginTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' };
const titleStyle: React.CSSProperties = { fontSize: '1.5rem', margin: 0, color: '#0f172a' };
const deployBtn: React.CSSProperties = { padding: '12px 24px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #0f172a, #1e40af)', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem' };
const muted: React.CSSProperties = { color: '#64748b', fontSize: '0.9rem' };
const linkStyle: React.CSSProperties = { color: '#2563eb', textDecoration: 'none', fontWeight: 600 };
const emptyState: React.CSSProperties = { marginTop: 20, padding: 32, borderRadius: 16, background: '#f8fafc', border: '1px solid #e2e8f0', textAlign: 'center' };
const successBanner: React.CSSProperties = { marginTop: 16, padding: 16, borderRadius: 12, background: '#dcfce7', color: '#166534', fontWeight: 600, fontSize: '0.9rem' };
const listStyle: React.CSSProperties = { marginTop: 16, display: 'grid', gap: 8 };
const rowStyle: React.CSSProperties = { padding: 16, borderRadius: 12, background: '#fff', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const urlText: React.CSSProperties = { margin: 0, fontWeight: 600, color: '#0f172a', fontSize: '0.95rem' };
const dateText: React.CSSProperties = { margin: '2px 0 0', fontSize: '0.8rem', color: '#94a3b8' };
const statusBadge = (status: string): React.CSSProperties => ({
  padding: '4px 12px',
  borderRadius: 8,
  fontSize: '0.75rem',
  fontWeight: 600,
  background: status === 'deployed' ? '#dcfce7' : '#fef3c7',
  color: status === 'deployed' ? '#16a34a' : '#d97706',
});
