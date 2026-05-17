'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ProtectedRoute } from '../../../../components/protected-route';
import { EditorProvider, useEditor } from '../../../../lib/editor/editor-context';
import { BlockPanel } from '../../../../components/editor/block-panel';
import { Canvas } from '../../../../components/editor/canvas';
import { PropsPanel } from '../../../../components/editor/props-panel';
import { EditorToolbar } from '../../../../components/editor/editor-toolbar';
import { EditorKeybindings } from '../../../../components/editor/editor-keybindings';
import { useApi } from '../../../../lib/use-api';
import type { Block } from '../../../../lib/editor/types';

export default function EditorPage() {
  return (
    <ProtectedRoute>
      <EditorLoader />
    </ProtectedRoute>
  );
}

function EditorLoader() {
  const { projectId, pageId } = useParams<{ projectId: string; pageId: string }>();
  const api = useApi();
  const [pageData, setPageData] = useState<{ title: string; content: { blocks: Block[] } } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await api.get<any>(`/projects/${projectId}/pages/${pageId}`);
        setPageData({
          title: data.title,
          content: data.content ?? { blocks: [] },
        });
      } catch {
        setPageData(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [api, projectId, pageId]);

  if (loading) {
    return <div style={loadingStyle}><p>Loading editor...</p></div>;
  }

  if (!pageData) {
    return <div style={loadingStyle}><p>Page not found.</p></div>;
  }

  return (
    <EditorProvider initialBlocks={pageData.content.blocks}>
      <EditorShell projectId={projectId} pageId={pageId} pageTitle={pageData.title} />
    </EditorProvider>
  );
}

function EditorShell({ projectId, pageId, pageTitle }: { projectId: string; pageId: string; pageTitle: string }) {
  const { state } = useEditor();
  const api = useApi();
  const [saving, setSaving] = useState(false);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      await api.put(`/projects/${projectId}/pages/${pageId}/content`, { blocks: state.blocks });
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  }, [api, projectId, pageId, state.blocks]);

  return (
    <div style={shellStyle}>
      <EditorKeybindings onSave={handleSave} />
      <EditorToolbar projectId={projectId} pageTitle={pageTitle} onSave={handleSave} saving={saving} />
      <div style={bodyStyle}>
        <BlockPanel />
        <Canvas />
        <PropsPanel />
      </div>
    </div>
  );
}

const shellStyle: React.CSSProperties = { height: '100vh', display: 'flex', flexDirection: 'column' };
const bodyStyle: React.CSSProperties = { flex: 1, display: 'flex', overflow: 'hidden' };
const loadingStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#64748b' };
