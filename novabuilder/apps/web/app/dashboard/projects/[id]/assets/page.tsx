'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ProtectedRoute } from '../../../../../components/protected-route';
import { useApi } from '../../../../../lib/use-api';

type Asset = { id: string; filename: string; url: string; mimeType: string | null; size: number | null; createdAt: string };

export default function AssetsPage() {
  return (
    <ProtectedRoute>
      <AssetsContent />
    </ProtectedRoute>
  );
}

function AssetsContent() {
  const { id: projectId } = useParams<{ id: string }>();
  const api = useApi();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);

  const loadAssets = useCallback(async () => {
    try {
      const data = await api.get<Asset[]>(`/projects/${projectId}/assets`);
      setAssets(data);
    } catch {}
    setLoading(false);
  }, [api, projectId]);

  useEffect(() => { loadAssets(); }, [loadAssets]);

  async function handleDelete(id: string) {
    if (!confirm('Delete this asset?')) return;
    await api.delete(`/projects/${projectId}/assets/${id}`);
    loadAssets();
  }

  return (
    <div style={containerStyle}>
      <nav style={navStyle}>
        <Link href={`/dashboard/projects/${projectId}`} style={linkStyle}>← Project</Link>
        <span style={{ color: '#94a3b8' }}>/</span>
        <span style={{ fontWeight: 600, color: '#0f172a' }}>Assets</span>
      </nav>

      <div style={headerStyle}>
        <h2 style={titleStyle}>Assets</h2>
        <button onClick={() => setShowUpload(true)} style={primaryBtn}>Upload Asset</button>
      </div>

      {showUpload && (
        <UploadForm api={api} projectId={projectId} onUploaded={() => { setShowUpload(false); loadAssets(); }} onCancel={() => setShowUpload(false)} />
      )}

      {loading ? (
        <p style={muted}>Loading...</p>
      ) : assets.length === 0 ? (
        <div style={emptyState}><p style={{ margin: 0, fontWeight: 600 }}>No assets yet</p><p style={muted}>Upload images and files to use in your pages.</p></div>
      ) : (
        <div style={gridStyle}>
          {assets.map((asset) => (
            <div key={asset.id} style={assetCard}>
              {asset.mimeType?.startsWith('image/') ? (
                <img src={asset.url} alt={asset.filename} style={assetImg} />
              ) : (
                <div style={assetPlaceholder}>{asset.mimeType || 'file'}</div>
              )}
              <div style={assetInfo}>
                <p style={assetName}>{asset.filename}</p>
                <p style={assetMeta}>{asset.size ? `${(asset.size / 1024).toFixed(1)} KB` : ''}</p>
              </div>
              <div style={assetActions}>
                <button onClick={() => navigator.clipboard.writeText(asset.url)} style={copyBtn} title="Copy URL">📋</button>
                <button onClick={() => handleDelete(asset.id)} style={deleteBtn} title="Delete">✕</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function UploadForm({ api, projectId, onUploaded, onCancel }: { api: any; projectId: string; onUploaded: () => void; onCancel: () => void }) {
  const [filename, setFilename] = useState('');
  const [url, setUrl] = useState('');
  const [mimeType, setMimeType] = useState('image/png');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await api.post(`/projects/${projectId}/assets`, { filename, url, mimeType });
      onUploaded();
    } catch (err: any) { setError(err.message); }
  }

  return (
    <form onSubmit={handleSubmit} style={formCard}>
      <h3 style={{ margin: 0, color: '#0f172a', fontSize: '0.95rem' }}>Add Asset</h3>
      <p style={{ margin: 0, ...muted }}>Paste a URL to register an external asset. File upload coming soon.</p>
      <label style={labelStyle}>
        Filename
        <input type="text" required value={filename} onChange={(e) => setFilename(e.target.value)} style={inputStyle} placeholder="hero-image.png" />
      </label>
      <label style={labelStyle}>
        URL
        <input type="url" required value={url} onChange={(e) => setUrl(e.target.value)} style={inputStyle} placeholder="https://..." />
      </label>
      <label style={labelStyle}>
        MIME Type
        <select value={mimeType} onChange={(e) => setMimeType(e.target.value)} style={inputStyle}>
          <option value="image/png">image/png</option>
          <option value="image/jpeg">image/jpeg</option>
          <option value="image/svg+xml">image/svg+xml</option>
          <option value="image/webp">image/webp</option>
          <option value="video/mp4">video/mp4</option>
          <option value="application/pdf">application/pdf</option>
        </select>
      </label>
      {error && <p style={{ margin: 0, color: '#dc2626', fontSize: '0.8rem' }}>{error}</p>}
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="submit" style={primaryBtn}>Add</button>
        <button type="button" onClick={onCancel} style={cancelBtn}>Cancel</button>
      </div>
    </form>
  );
}

const containerStyle: React.CSSProperties = { maxWidth: 1100, margin: '0 auto', padding: '32px 24px' };
const navStyle: React.CSSProperties = { display: 'flex', gap: 8, alignItems: 'center', fontSize: '0.9rem', marginBottom: 24 };
const linkStyle: React.CSSProperties = { color: '#2563eb', textDecoration: 'none', fontWeight: 600 };
const headerStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const titleStyle: React.CSSProperties = { margin: 0, fontSize: '1.2rem', color: '#0f172a' };
const primaryBtn: React.CSSProperties = { padding: '10px 18px', borderRadius: 10, border: 'none', background: '#0f172a', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' };
const cancelBtn: React.CSSProperties = { padding: '10px 18px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', color: '#475569', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' };
const muted: React.CSSProperties = { color: '#94a3b8', fontSize: '0.85rem', marginTop: 4 };
const emptyState: React.CSSProperties = { marginTop: 32, padding: 40, textAlign: 'center', borderRadius: 16, background: '#f8fafc', border: '1px solid #e2e8f0' };
const gridStyle: React.CSSProperties = { marginTop: 20, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 };
const assetCard: React.CSSProperties = { borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden', background: '#fff' };
const assetImg: React.CSSProperties = { width: '100%', height: 120, objectFit: 'cover' };
const assetPlaceholder: React.CSSProperties = { width: '100%', height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9', color: '#94a3b8', fontSize: '0.8rem' };
const assetInfo: React.CSSProperties = { padding: '10px 12px' };
const assetName: React.CSSProperties = { margin: 0, fontSize: '0.8rem', fontWeight: 600, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' };
const assetMeta: React.CSSProperties = { margin: '2px 0 0', fontSize: '0.7rem', color: '#94a3b8' };
const assetActions: React.CSSProperties = { padding: '0 12px 10px', display: 'flex', gap: 6 };
const copyBtn: React.CSSProperties = { padding: '4px 8px', borderRadius: 6, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: '0.75rem' };
const deleteBtn: React.CSSProperties = { padding: '4px 8px', borderRadius: 6, border: '1px solid #fecaca', background: '#fff', color: '#dc2626', cursor: 'pointer', fontSize: '0.75rem' };
const formCard: React.CSSProperties = { marginTop: 16, padding: 20, borderRadius: 14, background: '#f8fafc', border: '1px solid #e2e8f0', display: 'grid', gap: 12, maxWidth: 500 };
const labelStyle: React.CSSProperties = { display: 'grid', gap: 4, fontSize: '0.8rem', color: '#334155' };
const inputStyle: React.CSSProperties = { padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '0.85rem' };
