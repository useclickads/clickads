'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ProtectedRoute } from '../../../../../components/protected-route';
import { useApi } from '../../../../../lib/use-api';

type DesignToken = {
  id: string;
  key: string;
  value: { type: string; value: string };
};

export default function ThemePage() {
  return (
    <ProtectedRoute>
      <ThemeSettings />
    </ProtectedRoute>
  );
}

function ThemeSettings() {
  const { id } = useParams<{ id: string }>();
  const api = useApi();
  const [tokens, setTokens] = useState<DesignToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await api.get<DesignToken[]>(`/projects/${id}/theme/tokens`);
      setTokens(data);
    } catch {
      setTokens([]);
    } finally {
      setLoading(false);
    }
  }, [api, id]);

  useEffect(() => { load(); }, [load]);

  async function handleDelete(tokenId: string) {
    if (!confirm('Delete this token?')) return;
    try {
      await api.delete(`/projects/${id}/theme/tokens/${tokenId}`);
      load();
    } catch {}
  }

  async function handleSaveVersion() {
    try {
      await api.post(`/projects/${id}/theme/versions`, {});
      alert('Theme version saved.');
    } catch {}
  }

  if (loading) return <div style={containerStyle}><p style={muted}>Loading...</p></div>;

  const colors = tokens.filter((t) => t.value.type === 'color');
  const fonts = tokens.filter((t) => t.value.type === 'font');
  const spacing = tokens.filter((t) => t.value.type === 'spacing');
  const other = tokens.filter((t) => !['color', 'font', 'spacing'].includes(t.value.type));

  return (
    <div style={containerStyle}>
      <nav style={navStyle}>
        <Link href="/dashboard" style={linkStyle}>Dashboard</Link>
        <span style={muted}>/</span>
        <Link href={`/dashboard/projects/${id}`} style={linkStyle}>Project</Link>
        <span style={muted}>/</span>
        <span style={{ color: '#0f172a', fontWeight: 600 }}>Theme</span>
      </nav>

      <header style={headerStyle}>
        <div>
          <h1 style={titleStyle}>Design Tokens</h1>
          <p style={muted}>Define global colors, fonts, and spacing for your project.</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setShowAdd(true)} style={primaryBtn}>Add Token</button>
          <button onClick={handleSaveVersion} style={secondaryBtn}>Save Version</button>
        </div>
      </header>

      {showAdd && (
        <AddTokenForm
          api={api}
          projectId={id}
          onAdded={() => { setShowAdd(false); load(); }}
          onCancel={() => setShowAdd(false)}
        />
      )}

      {tokens.length === 0 ? (
        <div style={emptyState}>
          <p style={{ margin: 0, fontWeight: 600 }}>No design tokens yet</p>
          <p style={muted}>Add colors, fonts, and spacing to create your design system.</p>
        </div>
      ) : (
        <>
          {colors.length > 0 && <TokenSection title="Colors" tokens={colors} onDelete={handleDelete} />}
          {fonts.length > 0 && <TokenSection title="Fonts" tokens={fonts} onDelete={handleDelete} />}
          {spacing.length > 0 && <TokenSection title="Spacing" tokens={spacing} onDelete={handleDelete} />}
          {other.length > 0 && <TokenSection title="Other" tokens={other} onDelete={handleDelete} />}
        </>
      )}
    </div>
  );
}

function TokenSection({ title, tokens, onDelete }: { title: string; tokens: DesignToken[]; onDelete: (id: string) => void }) {
  return (
    <div style={{ marginTop: 24 }}>
      <h3 style={sectionTitle}>{title}</h3>
      <div style={listStyle}>
        {tokens.map((t) => (
          <div key={t.id} style={rowStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {t.value.type === 'color' && (
                <div style={{ width: 24, height: 24, borderRadius: 6, background: t.value.value, border: '1px solid #e2e8f0' }} />
              )}
              <div>
                <p style={keyText}>{t.key}</p>
                <p style={valText}>{t.value.value}</p>
              </div>
            </div>
            <button onClick={() => onDelete(t.id)} style={removeBtn}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function AddTokenForm({ api, projectId, onAdded, onCancel }: { api: ReturnType<typeof useApi>; projectId: string; onAdded: () => void; onCancel: () => void }) {
  const [key, setKey] = useState('');
  const [type, setType] = useState('color');
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.post<{ error?: string }>(`/projects/${projectId}/theme/tokens`, { key, value: { type, value } });
      if (res.error) { setError(res.error); setLoading(false); return; }
      onAdded();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add token.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={formCard}>
      <h3 style={{ margin: 0, color: '#0f172a' }}>Add Design Token</h3>
      <label style={labelStyle}>
        Key
        <input type="text" required value={key} onChange={(e) => setKey(e.target.value)} style={inputStyle} placeholder="primary-color" />
      </label>
      <label style={labelStyle}>
        Type
        <select value={type} onChange={(e) => setType(e.target.value)} style={inputStyle}>
          <option value="color">Color</option>
          <option value="font">Font</option>
          <option value="spacing">Spacing</option>
          <option value="border-radius">Border Radius</option>
          <option value="shadow">Shadow</option>
        </select>
      </label>
      <label style={labelStyle}>
        Value
        <div style={{ display: 'flex', gap: 8 }}>
          {type === 'color' && <input type="color" value={value || '#000000'} onChange={(e) => setValue(e.target.value)} style={{ width: 40, height: 36, border: 'none', borderRadius: 6, cursor: 'pointer' }} />}
          <input type="text" required value={value} onChange={(e) => setValue(e.target.value)} style={{ ...inputStyle, flex: 1 }} placeholder={type === 'color' ? '#3b82f6' : type === 'font' ? 'Inter, sans-serif' : '16px'} />
        </div>
      </label>
      {error && <p style={{ margin: 0, color: '#dc2626', fontSize: '0.85rem' }}>{error}</p>}
      <div style={{ display: 'flex', gap: 12 }}>
        <button type="submit" style={primaryBtn} disabled={loading}>{loading ? 'Adding…' : 'Add Token'}</button>
        <button type="button" onClick={onCancel} style={cancelBtn}>Cancel</button>
      </div>
    </form>
  );
}

const containerStyle: React.CSSProperties = { maxWidth: 900, margin: '0 auto', padding: '40px 24px' };
const navStyle: React.CSSProperties = { display: 'flex', gap: 8, alignItems: 'center', fontSize: '0.9rem' };
const headerStyle: React.CSSProperties = { marginTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' };
const titleStyle: React.CSSProperties = { fontSize: '1.5rem', margin: 0, color: '#0f172a' };
const sectionTitle: React.CSSProperties = { fontSize: '1rem', margin: '0 0 8px', color: '#334155' };
const primaryBtn: React.CSSProperties = { padding: '10px 18px', borderRadius: 10, border: 'none', background: '#0f172a', color: '#fff', fontWeight: 600, cursor: 'pointer' };
const secondaryBtn: React.CSSProperties = { padding: '10px 16px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', color: '#475569', fontWeight: 600, cursor: 'pointer' };
const cancelBtn: React.CSSProperties = { padding: '10px 16px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontWeight: 600, color: '#475569' };
const removeBtn: React.CSSProperties = { padding: '6px 12px', borderRadius: 8, border: '1px solid #fecaca', background: '#fff', color: '#dc2626', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' };
const muted: React.CSSProperties = { color: '#64748b', fontSize: '0.9rem' };
const linkStyle: React.CSSProperties = { color: '#2563eb', textDecoration: 'none', fontWeight: 600 };
const emptyState: React.CSSProperties = { marginTop: 20, padding: 32, borderRadius: 16, background: '#f8fafc', border: '1px solid #e2e8f0', textAlign: 'center' };
const listStyle: React.CSSProperties = { display: 'grid', gap: 8 };
const rowStyle: React.CSSProperties = { padding: 14, borderRadius: 12, background: '#fff', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const keyText: React.CSSProperties = { margin: 0, fontWeight: 600, color: '#0f172a', fontSize: '0.9rem' };
const valText: React.CSSProperties = { margin: '2px 0 0', fontSize: '0.8rem', color: '#64748b' };
const formCard: React.CSSProperties = { marginTop: 16, padding: 24, borderRadius: 14, background: '#f8fafc', border: '1px solid #e2e8f0', display: 'grid', gap: 14 };
const labelStyle: React.CSSProperties = { display: 'grid', gap: 6, color: '#334155', fontSize: '0.9rem' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #cbd5e1', fontSize: '0.95rem' };
