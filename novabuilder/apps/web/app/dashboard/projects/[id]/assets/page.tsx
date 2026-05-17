'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ProtectedRoute } from '../../../../../components/protected-route';
import { useApi } from '../../../../../lib/use-api';
import { useAuth } from '../../../../providers';

type Asset = { id: string; filename: string; url: string; mimeType: string | null; size: number | null; createdAt: string };
type Folder = { id: string; name: string; _count: { assets: number } };

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
  const { getAccessToken } = useAuth();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [currentFolder, setCurrentFolder] = useState<string | undefined>(undefined);
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [folderName, setFolderName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadAssets = useCallback(async () => {
    try {
      const [a, f] = await Promise.all([
        api.get<Asset[]>(`/projects/${projectId}/assets${currentFolder ? `?folderId=${currentFolder}` : ''}`),
        api.get<Folder[]>(`/projects/${projectId}/assets/folders`),
      ]);
      setAssets(a);
      setFolders(f);
    } catch {}
    setLoading(false);
  }, [api, projectId, currentFolder]);

  useEffect(() => { loadAssets(); }, [loadAssets]);

  async function uploadFiles(files: FileList | File[]) {
    setUploading(true);
    const token = getAccessToken();
    for (const file of Array.from(files)) {
      const form = new FormData();
      form.append('file', file);
      if (currentFolder) form.append('folderId', currentFolder);
      await fetch(`http://localhost:3001/api/projects/${projectId}/assets/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
    }
    setUploading(false);
    loadAssets();
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length) uploadFiles(e.dataTransfer.files);
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this asset?')) return;
    await api.delete(`/projects/${projectId}/assets/${id}`);
    loadAssets();
  }

  async function handleCreateFolder(e: React.FormEvent) {
    e.preventDefault();
    if (!folderName.trim()) return;
    await api.post(`/projects/${projectId}/assets/folders`, { name: folderName.trim() });
    setFolderName('');
    setShowNewFolder(false);
    loadAssets();
  }

  async function handleDeleteFolder(id: string) {
    if (!confirm('Delete this folder?')) return;
    await api.delete(`/projects/${projectId}/assets/folders/${id}`);
    if (currentFolder === id) setCurrentFolder(undefined);
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
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setShowNewFolder(true)} style={secondaryBtn}>New Folder</button>
          <button onClick={() => fileInputRef.current?.click()} style={primaryBtn} disabled={uploading}>
            {uploading ? 'Uploading...' : 'Upload Files'}
          </button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        style={{ display: 'none' }}
        onChange={(e) => e.target.files && uploadFiles(e.target.files)}
      />

      {showNewFolder && (
        <form onSubmit={handleCreateFolder} style={folderForm}>
          <input
            type="text"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            placeholder="Folder name"
            style={inputStyle}
            autoFocus
          />
          <button type="submit" style={primaryBtn}>Create</button>
          <button type="button" onClick={() => setShowNewFolder(false)} style={secondaryBtn}>Cancel</button>
        </form>
      )}

      {folders.length > 0 && (
        <div style={foldersRow}>
          <button
            onClick={() => setCurrentFolder(undefined)}
            style={currentFolder === undefined ? folderChipActive : folderChip}
          >
            All Files
          </button>
          {folders.map((f) => (
            <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <button
                onClick={() => setCurrentFolder(f.id)}
                style={currentFolder === f.id ? folderChipActive : folderChip}
              >
                {f.name} ({f._count.assets})
              </button>
              <button onClick={() => handleDeleteFolder(f.id)} style={folderDeleteBtn}>✕</button>
            </div>
          ))}
        </div>
      )}

      <div
        style={{ ...dropZone, ...(dragOver ? dropZoneActive : {}) }}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        {loading ? (
          <p style={muted}>Loading...</p>
        ) : assets.length === 0 ? (
          <div style={emptyInner}>
            <p style={{ margin: 0, fontWeight: 600, color: '#475569' }}>Drop files here or click Upload</p>
            <p style={muted}>Supports images, videos, PDFs up to 10MB</p>
          </div>
        ) : (
          <div style={gridStyle}>
            {assets.map((asset) => (
              <div key={asset.id} style={assetCard}>
                {asset.mimeType?.startsWith('image/') ? (
                  <img src={asset.url.startsWith('http') ? asset.url : `http://localhost:3001${asset.url}`} alt={asset.filename} style={assetImg} />
                ) : (
                  <div style={assetPlaceholder}>
                    <span style={fileTypeLabel}>{asset.mimeType?.split('/')[1]?.toUpperCase() || 'FILE'}</span>
                  </div>
                )}
                <div style={assetInfo}>
                  <p style={assetName} title={asset.filename}>{asset.filename}</p>
                  <p style={assetMeta}>
                    {asset.size ? formatSize(asset.size) : '—'}
                    {' · '}
                    {new Date(asset.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div style={assetActions}>
                  <button
                    onClick={() => navigator.clipboard.writeText(asset.url.startsWith('http') ? asset.url : `http://localhost:3001${asset.url}`)}
                    style={actionBtn}
                    title="Copy URL"
                  >
                    Copy
                  </button>
                  <button onClick={() => handleDelete(asset.id)} style={deleteBtn} title="Delete">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const containerStyle: React.CSSProperties = { maxWidth: 1100, margin: '0 auto', padding: '32px 24px' };
const navStyle: React.CSSProperties = { display: 'flex', gap: 8, alignItems: 'center', fontSize: '0.9rem', marginBottom: 24 };
const linkStyle: React.CSSProperties = { color: '#2563eb', textDecoration: 'none', fontWeight: 600 };
const headerStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const titleStyle: React.CSSProperties = { margin: 0, fontSize: '1.2rem', color: '#0f172a' };
const primaryBtn: React.CSSProperties = { padding: '10px 18px', borderRadius: 10, border: 'none', background: '#0f172a', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' };
const secondaryBtn: React.CSSProperties = { padding: '10px 18px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', color: '#475569', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' };
const muted: React.CSSProperties = { color: '#94a3b8', fontSize: '0.85rem', marginTop: 4 };
const folderForm: React.CSSProperties = { marginTop: 12, display: 'flex', gap: 8, alignItems: 'center' };
const inputStyle: React.CSSProperties = { padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '0.85rem' };
const foldersRow: React.CSSProperties = { marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' };
const folderChip: React.CSSProperties = { padding: '6px 14px', borderRadius: 20, border: '1px solid #e2e8f0', background: '#fff', color: '#475569', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' };
const folderChipActive: React.CSSProperties = { ...folderChip, background: '#0f172a', color: '#fff', border: '1px solid #0f172a' };
const folderDeleteBtn: React.CSSProperties = { padding: '2px 6px', borderRadius: 4, border: 'none', background: 'transparent', color: '#94a3b8', cursor: 'pointer', fontSize: '0.7rem' };
const dropZone: React.CSSProperties = { marginTop: 20, minHeight: 200, borderRadius: 16, border: '2px dashed #e2e8f0', padding: 24, transition: 'border-color 0.15s, background 0.15s' };
const dropZoneActive: React.CSSProperties = { borderColor: '#2563eb', background: '#f0f9ff' };
const emptyInner: React.CSSProperties = { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 150 };
const gridStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 };
const assetCard: React.CSSProperties = { borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden', background: '#fff' };
const assetImg: React.CSSProperties = { width: '100%', height: 120, objectFit: 'cover' };
const assetPlaceholder: React.CSSProperties = { width: '100%', height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9' };
const fileTypeLabel: React.CSSProperties = { fontSize: '0.75rem', fontWeight: 700, color: '#64748b', padding: '4px 10px', borderRadius: 6, background: '#e2e8f0' };
const assetInfo: React.CSSProperties = { padding: '10px 12px' };
const assetName: React.CSSProperties = { margin: 0, fontSize: '0.8rem', fontWeight: 600, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' };
const assetMeta: React.CSSProperties = { margin: '2px 0 0', fontSize: '0.7rem', color: '#94a3b8' };
const assetActions: React.CSSProperties = { padding: '0 12px 10px', display: 'flex', gap: 6 };
const actionBtn: React.CSSProperties = { padding: '4px 10px', borderRadius: 6, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 600, color: '#475569' };
const deleteBtn: React.CSSProperties = { padding: '4px 10px', borderRadius: 6, border: '1px solid #fecaca', background: '#fff', color: '#dc2626', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 600 };
