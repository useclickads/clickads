'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '../../../components/protected-route';
import { useApi } from '../../../lib/use-api';

type Project = { id: string; name: string; slug: string };
type Page = { id: string; title: string };

export default function AiGeneratorPage() {
  return (
    <ProtectedRoute>
      <AiGenerator />
    </ProtectedRoute>
  );
}

function AiGenerator() {
  const api = useApi();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [prompt, setPrompt] = useState('');
  const [pageTitle, setPageTitle] = useState('');
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<{ page: Page; projectId: string } | null>(null);
  const [error, setError] = useState('');

  const loadProjects = useCallback(async () => {
    try {
      const data = await api.get<Project[]>('/projects');
      setProjects(data);
      if (data.length > 0) setSelectedProject(data[0].id);
    } catch {}
  }, [api]);

  useEffect(() => { loadProjects(); }, [loadProjects]);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedProject || !prompt.trim()) return;
    setGenerating(true);
    setError('');
    setResult(null);

    try {
      const aiData = await api.post<{ blocks: any[] }>('/ai/generate-page', { prompt });

      const slug = (pageTitle || prompt).toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40);
      const page = await api.post<Page>(`/projects/${selectedProject}/pages`, {
        title: pageTitle || `AI: ${prompt.slice(0, 50)}`,
        slug,
        path: `/${slug}`,
      });

      await api.put(`/projects/${selectedProject}/pages/${page.id}/content`, { blocks: aiData.blocks });

      setResult({ page, projectId: selectedProject });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed.');
    }
    setGenerating(false);
  }

  return (
    <div style={containerStyle}>
      <nav style={navStyle}>
        <Link href="/dashboard" style={linkStyle}>Dashboard</Link>
        <span style={muted}>/</span>
        <span style={{ color: '#0f172a', fontWeight: 600 }}>AI Page Generator</span>
      </nav>

      <h1 style={titleStyle}>AI Page Generator</h1>
      <p style={muted}>Describe a page and AI will generate it for you in seconds.</p>

      <form onSubmit={handleGenerate} style={formStyle}>
        <label style={labelStyle}>
          Project
          <select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)} style={inputStyle}>
            {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </label>

        <label style={labelStyle}>
          Page Title (optional)
          <input type="text" value={pageTitle} onChange={(e) => setPageTitle(e.target.value)} style={inputStyle} placeholder="My Landing Page" />
        </label>

        <label style={labelStyle}>
          Describe your page
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            style={textareaStyle}
            rows={5}
            placeholder="e.g. A SaaS landing page for a project management tool with hero, features section, pricing table, testimonials, and a contact form"
            required
          />
        </label>

        <div style={promptHints}>
          <span style={hintLabel}>Try:</span>
          <button type="button" onClick={() => setPrompt('A portfolio page for a designer with hero, project gallery, about section, and contact form')} style={hintBtn}>Portfolio</button>
          <button type="button" onClick={() => setPrompt('An ecommerce landing page with hero banner, featured products, testimonials, and newsletter signup')} style={hintBtn}>Ecommerce</button>
          <button type="button" onClick={() => setPrompt('A SaaS landing page with hero, features, pricing plans, and FAQ section')} style={hintBtn}>SaaS</button>
          <button type="button" onClick={() => setPrompt('A restaurant page with hero image, menu highlights, about the chef, and reservation form')} style={hintBtn}>Restaurant</button>
        </div>

        {error && <p style={errorText}>{error}</p>}

        <button type="submit" style={primaryBtn} disabled={generating || !prompt.trim()}>
          {generating ? 'Generating...' : 'Generate Page'}
        </button>
      </form>

      {result && (
        <div style={successBanner}>
          <p style={{ margin: 0, fontWeight: 600, color: '#16a34a' }}>Page generated successfully!</p>
          <div style={successLinks}>
            <Link href={`/editor/${result.projectId}/${result.page.id}`} style={successLink}>Open in Editor</Link>
            <Link href={`/dashboard/projects/${result.projectId}`} style={successLinkSecondary}>View Project</Link>
          </div>
        </div>
      )}
    </div>
  );
}

const containerStyle: React.CSSProperties = { maxWidth: 700, margin: '0 auto', padding: '40px 24px' };
const navStyle: React.CSSProperties = { display: 'flex', gap: 8, alignItems: 'center', fontSize: '0.9rem' };
const linkStyle: React.CSSProperties = { color: '#2563eb', textDecoration: 'none', fontWeight: 600 };
const titleStyle: React.CSSProperties = { fontSize: '1.5rem', margin: '20px 0 4px', color: '#0f172a', fontWeight: 800 };
const muted: React.CSSProperties = { color: '#64748b', fontSize: '0.9rem' };
const formStyle: React.CSSProperties = { marginTop: 24, display: 'grid', gap: 16 };
const labelStyle: React.CSSProperties = { display: 'grid', gap: 6, fontSize: '0.9rem', color: '#334155', fontWeight: 600 };
const inputStyle: React.CSSProperties = { padding: '10px 14px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: '0.9rem', fontWeight: 400 };
const textareaStyle: React.CSSProperties = { padding: '10px 14px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: '0.9rem', resize: 'vertical', fontWeight: 400 };
const promptHints: React.CSSProperties = { display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' };
const hintLabel: React.CSSProperties = { fontSize: '0.8rem', color: '#64748b' };
const hintBtn: React.CSSProperties = { padding: '4px 10px', borderRadius: 6, border: '1px solid #e2e8f0', background: '#f8fafc', color: '#475569', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' };
const primaryBtn: React.CSSProperties = { padding: '12px 24px', borderRadius: 10, border: 'none', background: '#2563eb', color: '#fff', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer' };
const errorText: React.CSSProperties = { margin: 0, color: '#dc2626', fontSize: '0.85rem' };
const successBanner: React.CSSProperties = { marginTop: 24, padding: 20, borderRadius: 14, background: '#f0fdf4', border: '1px solid #bbf7d0', display: 'grid', gap: 12 };
const successLinks: React.CSSProperties = { display: 'flex', gap: 12 };
const successLink: React.CSSProperties = { padding: '8px 16px', borderRadius: 8, background: '#16a34a', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: '0.85rem' };
const successLinkSecondary: React.CSSProperties = { padding: '8px 16px', borderRadius: 8, border: '1px solid #e2e8f0', color: '#475569', textDecoration: 'none', fontWeight: 600, fontSize: '0.85rem' };
