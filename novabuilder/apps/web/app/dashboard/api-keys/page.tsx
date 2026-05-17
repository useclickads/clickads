'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '../../../components/protected-route';
import { useApi } from '../../../lib/use-api';

type ApiKey = { id: string; key: string; scopes: string[]; createdAt: string };

export default function ApiKeysPage() {
  return (
    <ProtectedRoute>
      <ApiKeysManagement />
    </ProtectedRoute>
  );
}

function ApiKeysManagement() {
  const api = useApi();
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newKey, setNewKey] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await api.get<ApiKey[]>('/api-keys');
      setKeys(data);
    } catch {}
    setLoading(false);
  }, [api]);

  useEffect(() => { load(); }, [load]);

  async function handleCreate() {
    setCreating(true);
    try {
      const res = await api.post<ApiKey>('/api-keys', { scopes: ['read', 'write'] });
      setNewKey(res.key);
      load();
    } catch {}
    setCreating(false);
  }

  async function handleRevoke(id: string) {
    if (!confirm('Revoke this API key? This cannot be undone.')) return;
    try {
      await api.delete(`/api-keys/${id}`);
      load();
    } catch {}
  }

  if (loading) return <div style={containerStyle}><p style={muted}>Loading...</p></div>;

  return (
    <div style={containerStyle}>
      <nav style={navStyle}>
        <Link href="/dashboard" style={linkStyle}>Dashboard</Link>
        <span style={muted}>/</span>
        <span style={{ color: '#0f172a', fontWeight: 600 }}>API Keys</span>
      </nav>

      <header style={headerStyle}>
        <div>
          <h1 style={titleStyle}>API Keys</h1>
          <p style={muted}>Manage programmatic access to your projects.</p>
        </div>
        <button onClick={handleCreate} style={primaryBtn} disabled={creating}>
          {creating ? 'Creating…' : 'Generate Key'}
        </button>
      </header>

      {newKey && (
        <div style={keyBanner}>
          <p style={{ margin: 0, fontWeight: 600, fontSize: '0.85rem' }}>New API key created. Copy it now — you won't see it again.</p>
          <code style={keyCode}>{newKey}</code>
          <button onClick={() => { navigator.clipboard.writeText(newKey); setNewKey(null); }} style={copyBtn}>Copy & Dismiss</button>
        </div>
      )}

      {keys.length === 0 ? (
        <div style={emptyState}>
          <p style={{ margin: 0, fontWeight: 600 }}>No API keys</p>
          <p style={muted}>Generate a key to access the NovaBuilder API programmatically.</p>
        </div>
      ) : (
        <div style={listStyle}>
          {keys.map((k) => (
            <div key={k.id} style={rowStyle}>
              <div>
                <code style={keyDisplay}>{k.key.slice(0, 12)}...{k.key.slice(-4)}</code>
                <p style={dateText}>Created {new Date(k.createdAt).toLocaleDateString()}</p>
                <div style={scopeRow}>
                  {k.scopes.map((s) => <span key={s} style={scopeChip}>{s}</span>)}
                </div>
              </div>
              <button onClick={() => handleRevoke(k.id)} style={revokeBtn}>Revoke</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const containerStyle: React.CSSProperties = { maxWidth: 700, margin: '0 auto', padding: '40px 24px' };
const navStyle: React.CSSProperties = { display: 'flex', gap: 8, alignItems: 'center', fontSize: '0.9rem' };
const headerStyle: React.CSSProperties = { marginTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' };
const titleStyle: React.CSSProperties = { fontSize: '1.5rem', margin: 0, color: '#0f172a' };
const primaryBtn: React.CSSProperties = { padding: '10px 18px', borderRadius: 10, border: 'none', background: '#0f172a', color: '#fff', fontWeight: 600, cursor: 'pointer' };
const muted: React.CSSProperties = { color: '#64748b', fontSize: '0.9rem' };
const linkStyle: React.CSSProperties = { color: '#2563eb', textDecoration: 'none', fontWeight: 600 };
const keyBanner: React.CSSProperties = { marginTop: 16, padding: 16, borderRadius: 12, background: '#fef3c7', border: '1px solid #fbbf24', display: 'grid', gap: 8 };
const keyCode: React.CSSProperties = { padding: '8px 12px', borderRadius: 6, background: '#fff', fontFamily: 'monospace', fontSize: '0.8rem', wordBreak: 'break-all' };
const copyBtn: React.CSSProperties = { padding: '8px 14px', borderRadius: 8, border: 'none', background: '#0f172a', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '0.8rem', justifySelf: 'start' };
const emptyState: React.CSSProperties = { marginTop: 24, padding: 32, borderRadius: 16, background: '#f8fafc', border: '1px solid #e2e8f0', textAlign: 'center' };
const listStyle: React.CSSProperties = { marginTop: 16, display: 'grid', gap: 8 };
const rowStyle: React.CSSProperties = { padding: 16, borderRadius: 12, background: '#fff', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const keyDisplay: React.CSSProperties = { fontFamily: 'monospace', fontSize: '0.85rem', color: '#0f172a' };
const dateText: React.CSSProperties = { margin: '4px 0 0', fontSize: '0.75rem', color: '#94a3b8' };
const scopeRow: React.CSSProperties = { display: 'flex', gap: 4, marginTop: 4 };
const scopeChip: React.CSSProperties = { padding: '2px 6px', borderRadius: 4, background: '#f1f5f9', fontSize: '0.7rem', fontWeight: 600, color: '#475569' };
const revokeBtn: React.CSSProperties = { padding: '6px 12px', borderRadius: 8, border: '1px solid #fecaca', background: '#fff', color: '#dc2626', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' };
