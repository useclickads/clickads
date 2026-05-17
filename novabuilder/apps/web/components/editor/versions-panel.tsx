'use client';

import { useCallback, useEffect, useState } from 'react';
import { useApi } from '../../lib/use-api';
import { useEditor } from '../../lib/editor/editor-context';
import type { Block } from '../../lib/editor/types';

type Snapshot = {
  id: string;
  data: { pageId: string; content: { blocks: Block[] } };
  createdAt: string;
};

export function VersionsPanel({ projectId, pageId }: { projectId: string; pageId: string }) {
  const api = useApi();
  const { setBlocks } = useEditor();
  const [versions, setVersions] = useState<Snapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [restoring, setRestoring] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await api.get<Snapshot[]>(`/projects/${projectId}/pages/${pageId}/versions`);
      setVersions(data);
    } catch {}
    setLoading(false);
  }, [api, projectId, pageId]);

  useEffect(() => { load(); }, [load]);

  async function handleRestore(snapshotId: string, blocks: Block[]) {
    if (!confirm('Restore this version? Current changes will be saved as a new version.')) return;
    setRestoring(snapshotId);
    try {
      await api.post(`/projects/${projectId}/pages/${pageId}/versions/${snapshotId}/restore`, {});
      setBlocks(blocks);
    } catch {}
    setRestoring(null);
  }

  if (loading) return <div style={panelStyle}><p style={muted}>Loading versions...</p></div>;

  return (
    <div style={panelStyle}>
      <h3 style={titleStyle}>Version History</h3>
      {versions.length === 0 ? (
        <p style={muted}>No previous versions. Versions are created each time you save.</p>
      ) : (
        <div style={listStyle}>
          {versions.map((v, i) => (
            <div key={v.id} style={versionRow}>
              <div>
                <p style={versionLabel}>Version {versions.length - i}</p>
                <p style={versionDate}>{new Date(v.createdAt).toLocaleString()}</p>
                <p style={versionMeta}>{v.data.content?.blocks?.length ?? 0} blocks</p>
              </div>
              <button
                onClick={() => handleRestore(v.id, v.data.content?.blocks ?? [])}
                style={restoreBtn}
                disabled={restoring === v.id}
              >
                {restoring === v.id ? 'Restoring…' : 'Restore'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const panelStyle: React.CSSProperties = { padding: 16, display: 'grid', gap: 12 };
const titleStyle: React.CSSProperties = { margin: 0, fontSize: '0.95rem', color: '#0f172a' };
const muted: React.CSSProperties = { color: '#94a3b8', fontSize: '0.8rem' };
const listStyle: React.CSSProperties = { display: 'grid', gap: 8 };
const versionRow: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 10, borderRadius: 8, border: '1px solid #f1f5f9', background: '#fafbfc' };
const versionLabel: React.CSSProperties = { margin: 0, fontSize: '0.8rem', fontWeight: 600, color: '#0f172a' };
const versionDate: React.CSSProperties = { margin: '2px 0 0', fontSize: '0.7rem', color: '#94a3b8' };
const versionMeta: React.CSSProperties = { margin: '2px 0 0', fontSize: '0.7rem', color: '#64748b' };
const restoreBtn: React.CSSProperties = { padding: '5px 10px', borderRadius: 6, border: '1px solid #e2e8f0', background: '#fff', color: '#2563eb', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' };
