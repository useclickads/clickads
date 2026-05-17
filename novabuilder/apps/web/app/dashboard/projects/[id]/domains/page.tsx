'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ProtectedRoute } from '../../../../../components/protected-route';
import { useApi } from '../../../../../lib/use-api';

type Domain = {
  id: string;
  domain: string;
  verified: boolean;
  createdAt: string;
};

type DnsRecord = { type: string; name: string; value: string };

export default function DomainsPage() {
  return (
    <ProtectedRoute>
      <DomainManagement />
    </ProtectedRoute>
  );
}

function DomainManagement() {
  const { id } = useParams<{ id: string }>();
  const api = useApi();
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [dnsInfo, setDnsInfo] = useState<{ domain: string; records: DnsRecord[]; instructions: string } | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await api.get<Domain[]>(`/projects/${id}/domains`);
      setDomains(data);
    } catch {
      setDomains([]);
    } finally {
      setLoading(false);
    }
  }, [api, id]);

  useEffect(() => { load(); }, [load]);

  async function handleRemove(domainId: string) {
    if (!confirm('Remove this domain?')) return;
    try {
      await api.delete(`/projects/${id}/domains/${domainId}`);
      load();
    } catch {}
  }

  async function handleVerify(domainId: string) {
    try {
      await api.patch(`/projects/${id}/domains/${domainId}/verify`, {});
      load();
    } catch {}
  }

  async function showDns(domain: string) {
    try {
      const data = await api.get<{ domain: string; records: DnsRecord[]; instructions: string }>(`/projects/${id}/domains/dns/${domain}`);
      setDnsInfo(data);
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
        <span style={{ color: '#0f172a', fontWeight: 600 }}>Domains</span>
      </nav>

      <header style={headerStyle}>
        <div>
          <h1 style={titleStyle}>Custom Domains</h1>
          <p style={muted}>Connect your own domain to this project.</p>
        </div>
        <button onClick={() => setShowAdd(true)} style={primaryBtn}>Add Domain</button>
      </header>

      {showAdd && (
        <AddDomainForm
          api={api}
          projectId={id}
          onAdded={() => { setShowAdd(false); load(); }}
          onCancel={() => setShowAdd(false)}
        />
      )}

      {dnsInfo && (
        <div style={dnsCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, color: '#0f172a', fontSize: '1rem' }}>DNS Records for {dnsInfo.domain}</h3>
            <button onClick={() => setDnsInfo(null)} style={closeBtn}>Close</button>
          </div>
          <p style={{ margin: '8px 0', color: '#475569', fontSize: '0.85rem' }}>{dnsInfo.instructions}</p>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Type</th>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Value</th>
              </tr>
            </thead>
            <tbody>
              {dnsInfo.records.map((r, i) => (
                <tr key={i}>
                  <td style={tdStyle}>{r.type}</td>
                  <td style={tdStyle}>{r.name}</td>
                  <td style={{ ...tdStyle, fontFamily: 'monospace', fontSize: '0.8rem' }}>{r.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {domains.length === 0 ? (
        <div style={emptyState}>
          <p style={{ margin: 0, fontWeight: 600 }}>No custom domains</p>
          <p style={muted}>Add a domain to serve your site on your own URL.</p>
        </div>
      ) : (
        <div style={listStyle}>
          {domains.map((d) => (
            <div key={d.id} style={rowStyle}>
              <div>
                <p style={domainText}>{d.domain}</p>
                <p style={dateText}>Added {new Date(d.createdAt).toLocaleDateString()}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button onClick={() => showDns(d.domain)} style={dnsBtn}>DNS</button>
                {!d.verified && <button onClick={() => handleVerify(d.id)} style={verifyBtn}>Verify</button>}
                <span style={statusBadge(d.verified)}>{d.verified ? 'Verified' : 'Pending'}</span>
                <button onClick={() => handleRemove(d.id)} style={removeBtn}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AddDomainForm({ api, projectId, onAdded, onCancel }: { api: ReturnType<typeof useApi>; projectId: string; onAdded: () => void; onCancel: () => void }) {
  const [domain, setDomain] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.post<{ error?: string }>(`/projects/${projectId}/domains`, { domain });
      if (res.error) { setError(res.error); setLoading(false); return; }
      onAdded();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add domain.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={formCard}>
      <h3 style={{ margin: 0, color: '#0f172a' }}>Add Custom Domain</h3>
      <label style={labelStyle}>
        Domain
        <input type="text" required value={domain} onChange={(e) => setDomain(e.target.value)} style={inputStyle} placeholder="www.example.com" />
      </label>
      {error && <p style={{ margin: 0, color: '#dc2626', fontSize: '0.85rem' }}>{error}</p>}
      <div style={{ display: 'flex', gap: 12 }}>
        <button type="submit" style={primaryBtn} disabled={loading}>{loading ? 'Adding…' : 'Add Domain'}</button>
        <button type="button" onClick={onCancel} style={cancelBtn}>Cancel</button>
      </div>
    </form>
  );
}

const containerStyle: React.CSSProperties = { maxWidth: 900, margin: '0 auto', padding: '40px 24px' };
const navStyle: React.CSSProperties = { display: 'flex', gap: 8, alignItems: 'center', fontSize: '0.9rem' };
const headerStyle: React.CSSProperties = { marginTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' };
const titleStyle: React.CSSProperties = { fontSize: '1.5rem', margin: 0, color: '#0f172a' };
const primaryBtn: React.CSSProperties = { padding: '10px 18px', borderRadius: 10, border: 'none', background: '#0f172a', color: '#fff', fontWeight: 600, cursor: 'pointer' };
const cancelBtn: React.CSSProperties = { padding: '10px 16px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontWeight: 600, color: '#475569' };
const removeBtn: React.CSSProperties = { padding: '6px 12px', borderRadius: 8, border: '1px solid #fecaca', background: '#fff', color: '#dc2626', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' };
const dnsBtn: React.CSSProperties = { padding: '6px 12px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#f8fafc', color: '#475569', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' };
const verifyBtn: React.CSSProperties = { padding: '6px 12px', borderRadius: 8, border: '1px solid #bbf7d0', background: '#fff', color: '#16a34a', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' };
const closeBtn: React.CSSProperties = { padding: '6px 12px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', color: '#475569', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' };
const muted: React.CSSProperties = { color: '#64748b', fontSize: '0.9rem' };
const linkStyle: React.CSSProperties = { color: '#2563eb', textDecoration: 'none', fontWeight: 600 };
const emptyState: React.CSSProperties = { marginTop: 20, padding: 32, borderRadius: 16, background: '#f8fafc', border: '1px solid #e2e8f0', textAlign: 'center' };
const listStyle: React.CSSProperties = { marginTop: 16, display: 'grid', gap: 8 };
const rowStyle: React.CSSProperties = { padding: 16, borderRadius: 12, background: '#fff', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const domainText: React.CSSProperties = { margin: 0, fontWeight: 600, color: '#0f172a', fontSize: '0.95rem' };
const dateText: React.CSSProperties = { margin: '2px 0 0', fontSize: '0.8rem', color: '#94a3b8' };
const statusBadge = (verified: boolean): React.CSSProperties => ({ padding: '4px 10px', borderRadius: 8, fontSize: '0.75rem', fontWeight: 600, background: verified ? '#dcfce7' : '#fef3c7', color: verified ? '#16a34a' : '#d97706' });
const dnsCard: React.CSSProperties = { marginTop: 16, padding: 20, borderRadius: 14, background: '#f8fafc', border: '1px solid #e2e8f0' };
const tableStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', marginTop: 12 };
const thStyle: React.CSSProperties = { textAlign: 'left', padding: '8px 12px', fontSize: '0.75rem', color: '#64748b', fontWeight: 600, borderBottom: '1px solid #e2e8f0' };
const tdStyle: React.CSSProperties = { padding: '8px 12px', fontSize: '0.85rem', color: '#1e293b', borderBottom: '1px solid #f1f5f9' };
const formCard: React.CSSProperties = { marginTop: 16, padding: 24, borderRadius: 14, background: '#f8fafc', border: '1px solid #e2e8f0', display: 'grid', gap: 14 };
const labelStyle: React.CSSProperties = { display: 'grid', gap: 6, color: '#334155', fontSize: '0.9rem' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #cbd5e1', fontSize: '0.95rem' };
