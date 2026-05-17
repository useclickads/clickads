'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useApi } from '../../../lib/use-api';
import { ProtectedRoute } from '../../../components/protected-route';
import { BlockRenderer } from '../../../components/editor/block-renderer';
import type { Block } from '../../../lib/editor/types';

type PageData = { id: string; title: string; path: string; content: { blocks: Block[] } | null };
type ProjectData = { id: string; name: string; pages: PageData[] };

export default function PreviewPage() {
  return (
    <ProtectedRoute>
      <PreviewContent />
    </ProtectedRoute>
  );
}

function PreviewContent() {
  const { projectId } = useParams<{ projectId: string }>();
  const api = useApi();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [activePage, setActivePage] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await api.get<ProjectData>(`/projects/${projectId}`);
        setProject(data);
        if (data.pages.length > 0) setActivePage(data.pages[0]);
      } catch {}
      setLoading(false);
    })();
  }, [api, projectId]);

  if (loading) return <div style={centerStyle}><p>Loading preview...</p></div>;
  if (!project) return <div style={centerStyle}><p>Project not found.</p></div>;

  const blocks = activePage?.content?.blocks ?? [];

  return (
    <div style={previewShell}>
      {project.pages.length > 1 && (
        <nav style={pageNav}>
          {project.pages.map((p) => (
            <button
              key={p.id}
              onClick={() => setActivePage(p)}
              style={activePage?.id === p.id ? activePageBtn : pageBtn}
            >
              {p.title}
            </button>
          ))}
        </nav>
      )}
      <div style={previewBody}>
        {blocks.length === 0 ? (
          <div style={centerStyle}><p style={{ color: '#94a3b8' }}>This page has no content yet.</p></div>
        ) : (
          blocks.map((block) => (
            <BlockRenderer key={block.id} block={block} />
          ))
        )}
      </div>
    </div>
  );
}

const previewShell: React.CSSProperties = { minHeight: '100vh', background: '#fff' };
const pageNav: React.CSSProperties = { display: 'flex', gap: 4, padding: '12px 24px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' };
const pageBtn: React.CSSProperties = { padding: '6px 14px', borderRadius: 6, border: '1px solid #e2e8f0', background: '#fff', fontSize: '0.8rem', fontWeight: 600, color: '#475569', cursor: 'pointer' };
const activePageBtn: React.CSSProperties = { ...pageBtn, background: '#0f172a', color: '#fff', borderColor: '#0f172a' };
const previewBody: React.CSSProperties = { maxWidth: 1200, margin: '0 auto', padding: '32px 24px' };
const centerStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' };
