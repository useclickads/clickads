'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ProtectedRoute } from '../../../../components/protected-route';
import { useApi } from '../../../../lib/use-api';
import { pageTemplates } from '../../../../lib/editor/templates';
import type { Page, Project } from '../../../../lib/api';

export default function ProjectDetailPage() {
  return (
    <ProtectedRoute>
      <ProjectDetail />
    </ProtectedRoute>
  );
}

type ProjectWithPages = Project & { pages: Page[] };

function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const api = useApi();
  const [project, setProject] = useState<ProjectWithPages | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddPage, setShowAddPage] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await api.get<ProjectWithPages>(`/projects/${id}`);
      setProject(data);
    } catch {
      setProject(null);
    } finally {
      setLoading(false);
    }
  }, [api, id]);

  useEffect(() => { load(); }, [load]);

  async function handleDelete() {
    if (!confirm('Delete this project? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await api.delete(`/projects/${id}`);
      router.push('/dashboard');
    } catch {
      setDeleting(false);
    }
  }

  if (loading) return <div style={containerStyle}><p style={muted}>Loading...</p></div>;
  if (!project) return <div style={containerStyle}><p style={muted}>Project not found.</p><Link href="/dashboard" style={linkStyle}>Back to dashboard</Link></div>;

  return (
    <div style={containerStyle}>
      <nav style={navStyle}>
        <Link href="/dashboard" style={linkStyle}>Dashboard</Link>
        <span style={muted}>/</span>
        <span style={{ color: '#0f172a', fontWeight: 600 }}>{project.name}</span>
      </nav>

      <header style={headerStyle}>
        <div>
          <h1 style={titleStyle}>{project.name}</h1>
          <p style={slugText}>/{project.slug}</p>
          {project.description && <p style={descText}>{project.description}</p>}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link href={`/dashboard/projects/${id}/cms`} style={secondaryBtn}>CMS</Link>
          <Link href={`/dashboard/projects/${id}/assets`} style={secondaryBtn}>Assets</Link>
          <Link href={`/dashboard/projects/${id}/forms`} style={secondaryBtn}>Forms</Link>
          <Link href={`/dashboard/projects/${id}/team`} style={secondaryBtn}>Team</Link>
          <Link href={`/dashboard/projects/${id}/theme`} style={secondaryBtn}>Theme</Link>
          <Link href={`/dashboard/projects/${id}/domains`} style={secondaryBtn}>Domains</Link>
          <Link href={`/dashboard/projects/${id}/analytics`} style={secondaryBtn}>Analytics</Link>
          <Link href={`/dashboard/projects/${id}/webhooks`} style={secondaryBtn}>Webhooks</Link>
          <Link href={`/dashboard/projects/${id}/integrations`} style={secondaryBtn}>Integrations</Link>
          <Link href={`/dashboard/projects/${id}/abtests`} style={secondaryBtn}>A/B Tests</Link>
          <Link href={`/dashboard/projects/${id}/analytics/funnels`} style={secondaryBtn}>Funnels</Link>
          <Link href={`/dashboard/projects/${id}/workflows`} style={secondaryBtn}>Workflows</Link>
          <Link href={`/dashboard/projects/${id}/staging`} style={secondaryBtn}>Staging</Link>
          <Link href={`/dashboard/projects/${id}/backups`} style={secondaryBtn}>Backups</Link>
          <Link href={`/dashboard/projects/${id}/activity`} style={secondaryBtn}>Activity</Link>
          <Link href={`/dashboard/projects/${id}/redirects`} style={secondaryBtn}>Redirects</Link>
          <Link href={`/dashboard/projects/${id}/seo`} style={secondaryBtn}>SEO</Link>
          <Link href={`/dashboard/projects/${id}/performance`} style={secondaryBtn}>Performance</Link>
          <Link href={`/dashboard/projects/${id}/settings`} style={secondaryBtn}>Settings</Link>
          <Link href={`/dashboard/projects/${id}/deploy`} style={deployBtnStyle}>Deploy</Link>
          <Link href={`/preview/${id}`} style={secondaryBtn} target="_blank">Preview</Link>
          <button onClick={async () => { await api.post(`/projects/${id}/clone`, {}); router.push('/dashboard'); }} style={secondaryBtn}>Clone</button>
          <button onClick={handleDelete} style={dangerBtn} disabled={deleting}>
            {deleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </header>

      <div style={sectionHeader}>
        <h2 style={sectionTitle}>Pages</h2>
        <button onClick={() => setShowAddPage(true)} style={primaryBtn}>Add Page</button>
      </div>

      {showAddPage && (
        <AddPageForm
          api={api}
          projectId={project.id}
          onCreated={() => { setShowAddPage(false); load(); }}
          onCancel={() => setShowAddPage(false)}
        />
      )}

      {project.pages.length === 0 ? (
        <div style={emptyState}>
          <p style={{ margin: 0, fontWeight: 600 }}>No pages yet</p>
          <p style={muted}>Add a page to start building.</p>
        </div>
      ) : (
        <div style={listStyle}>
          {project.pages.map((page) => (
            <PageRow key={page.id} page={page} projectId={project.id} api={api} onUpdate={load} />
          ))}
        </div>
      )}
    </div>
  );
}

function PageRow({ page, projectId, api, onUpdate }: { page: Page & { scheduledAt?: string | null }; projectId: string; api: ReturnType<typeof useApi>; onUpdate: () => void }) {
  const [toggling, setToggling] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');

  async function togglePublish() {
    setToggling(true);
    try {
      const endpoint = page.published ? 'unpublish' : 'publish';
      await api.patch(`/projects/${projectId}/pages/${page.id}/${endpoint}`, {});
      onUpdate();
    } catch {}
    setToggling(false);
  }

  async function handleSchedule() {
    if (!scheduleDate) return;
    try {
      await api.patch(`/projects/${projectId}/pages/${page.id}/schedule`, { scheduledAt: scheduleDate });
      setShowSchedule(false);
      setScheduleDate('');
      onUpdate();
    } catch {}
  }

  async function handleUnschedule() {
    try {
      await api.patch(`/projects/${projectId}/pages/${page.id}/unschedule`, {});
      onUpdate();
    } catch {}
  }

  return (
    <div>
      <div style={pageRow}>
        <div>
          <p style={pageTitle}>{page.title}</p>
          <p style={pagePath}>{page.path}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link href={`/editor/${projectId}/${page.id}`} style={editLink}>Edit</Link>
          <button onClick={async () => { await api.post(`/projects/${projectId}/pages/${page.id}/duplicate`, {}); onUpdate(); }} style={dupBtn}>Duplicate</button>
          <button onClick={togglePublish} disabled={toggling} style={publishBtn(page.published)}>
            {page.published ? 'Unpublish' : 'Publish'}
          </button>
          {!page.published && !page.scheduledAt && (
            <button onClick={() => setShowSchedule(!showSchedule)} style={scheduleBtn}>Schedule</button>
          )}
          {page.scheduledAt && (
            <button onClick={handleUnschedule} style={scheduledBadge}>
              Scheduled: {new Date(page.scheduledAt).toLocaleString()} ✕
            </button>
          )}
          <span style={badge(page.published)}>{page.published ? 'Live' : page.scheduledAt ? 'Scheduled' : 'Draft'}</span>
        </div>
      </div>
      {showSchedule && (
        <div style={scheduleRow}>
          <input
            type="datetime-local"
            value={scheduleDate}
            onChange={(e) => setScheduleDate(e.target.value)}
            min={new Date().toISOString().slice(0, 16)}
            style={scheduleInput}
          />
          <button onClick={handleSchedule} style={scheduleConfirmBtn}>Confirm</button>
          <button onClick={() => setShowSchedule(false)} style={cancelBtn}>Cancel</button>
        </div>
      )}
    </div>
  );
}

function AddPageForm({ api, projectId, onCreated, onCancel }: { api: ReturnType<typeof useApi>; projectId: string; onCreated: () => void; onCancel: () => void }) {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [path, setPath] = useState('');
  const [templateId, setTemplateId] = useState('blank');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleTitleChange(value: string) {
    setTitle(value);
    const s = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    setSlug(s);
    setPath(`/${s}`);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const template = pageTemplates.find((t) => t.id === templateId);
      const blocks = template?.blocks ?? [];
      const page = await api.post<{ id: string }>(`/projects/${projectId}/pages`, { title, slug, path });
      if (blocks.length > 0 && page.id) {
        await api.put(`/projects/${projectId}/pages/${page.id}/content`, { blocks });
      }
      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create page.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={formCard}>
      <h3 style={{ margin: 0, color: '#0f172a' }}>New Page</h3>
      <label style={labelStyle}>
        Template
        <div style={templateGrid}>
          {pageTemplates.map((t) => (
            <button type="button" key={t.id} onClick={() => setTemplateId(t.id)} style={templateCard(templateId === t.id)}>
              <p style={{ margin: 0, fontWeight: 600, fontSize: '0.85rem' }}>{t.name}</p>
              <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: '#64748b' }}>{t.description}</p>
            </button>
          ))}
        </div>
      </label>
      <label style={labelStyle}>
        Title
        <input type="text" required value={title} onChange={(e) => handleTitleChange(e.target.value)} style={inputStyle} />
      </label>
      <label style={labelStyle}>
        Slug
        <input type="text" required value={slug} onChange={(e) => setSlug(e.target.value)} style={inputStyle} />
      </label>
      <label style={labelStyle}>
        Path
        <input type="text" required value={path} onChange={(e) => setPath(e.target.value)} style={inputStyle} />
      </label>
      {error && <p style={{ margin: 0, color: '#dc2626', fontSize: '0.85rem' }}>{error}</p>}
      <div style={{ display: 'flex', gap: 12 }}>
        <button type="submit" style={primaryBtn} disabled={loading}>{loading ? 'Creating…' : 'Create'}</button>
        <button type="button" onClick={onCancel} style={cancelBtn}>Cancel</button>
      </div>
    </form>
  );
}

const containerStyle: React.CSSProperties = { maxWidth: 1000, margin: '0 auto', padding: '40px 24px' };
const navStyle: React.CSSProperties = { display: 'flex', gap: 8, alignItems: 'center', fontSize: '0.9rem' };
const headerStyle: React.CSSProperties = { marginTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' };
const titleStyle: React.CSSProperties = { fontSize: '1.75rem', margin: 0, color: '#0f172a' };
const slugText: React.CSSProperties = { margin: '4px 0 0', fontSize: '0.85rem', color: '#94a3b8' };
const descText: React.CSSProperties = { margin: '8px 0 0', color: '#475569', fontSize: '0.9rem' };
const sectionHeader: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 32 };
const sectionTitle: React.CSSProperties = { fontSize: '1.1rem', margin: 0, color: '#0f172a' };
const primaryBtn: React.CSSProperties = { padding: '10px 18px', borderRadius: 10, border: 'none', background: '#0f172a', color: '#fff', fontWeight: 600, cursor: 'pointer' };
const secondaryBtn: React.CSSProperties = { padding: '10px 16px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', color: '#475569', fontWeight: 600, cursor: 'pointer', textDecoration: 'none', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center' };
const deployBtnStyle: React.CSSProperties = { padding: '10px 16px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #0f172a, #1e40af)', color: '#fff', fontWeight: 600, cursor: 'pointer', textDecoration: 'none', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center' };
const dangerBtn: React.CSSProperties = { padding: '10px 16px', borderRadius: 10, border: '1px solid #fecaca', background: '#fff', color: '#dc2626', fontWeight: 600, cursor: 'pointer' };
const cancelBtn: React.CSSProperties = { padding: '10px 16px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontWeight: 600, color: '#475569' };
const muted: React.CSSProperties = { color: '#64748b', fontSize: '0.9rem' };
const linkStyle: React.CSSProperties = { color: '#2563eb', textDecoration: 'none', fontWeight: 600 };
const emptyState: React.CSSProperties = { marginTop: 20, padding: 32, borderRadius: 16, background: '#f8fafc', border: '1px solid #e2e8f0', textAlign: 'center' };
const listStyle: React.CSSProperties = { marginTop: 16, display: 'grid', gap: 8 };
const pageRow: React.CSSProperties = { padding: 16, borderRadius: 12, background: '#fff', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const pageTitle: React.CSSProperties = { margin: 0, fontWeight: 600, color: '#0f172a', fontSize: '0.95rem' };
const pagePath: React.CSSProperties = { margin: '2px 0 0', fontSize: '0.8rem', color: '#94a3b8' };
const editLink: React.CSSProperties = { padding: '6px 14px', borderRadius: 8, background: '#f1f5f9', color: '#2563eb', fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none' };
const publishBtn = (published: boolean): React.CSSProperties => ({ padding: '6px 12px', borderRadius: 8, border: published ? '1px solid #fecaca' : '1px solid #bbf7d0', background: '#fff', color: published ? '#dc2626' : '#16a34a', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' });
const badge = (published: boolean): React.CSSProperties => ({ padding: '4px 10px', borderRadius: 8, fontSize: '0.75rem', fontWeight: 600, background: published ? '#dcfce7' : '#f1f5f9', color: published ? '#16a34a' : '#64748b' });
const formCard: React.CSSProperties = { marginTop: 16, padding: 24, borderRadius: 14, background: '#f8fafc', border: '1px solid #e2e8f0', display: 'grid', gap: 14 };
const labelStyle: React.CSSProperties = { display: 'grid', gap: 6, color: '#334155', fontSize: '0.9rem' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #cbd5e1', fontSize: '0.95rem' };
const templateGrid: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 8, marginTop: 4 };
const templateCard = (active: boolean): React.CSSProperties => ({ padding: 12, borderRadius: 10, border: active ? '2px solid #2563eb' : '1px solid #e2e8f0', background: active ? '#eff6ff' : '#fff', cursor: 'pointer', textAlign: 'left' });
const dupBtn: React.CSSProperties = { padding: '6px 12px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', color: '#475569', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' };
const scheduleBtn: React.CSSProperties = { padding: '6px 12px', borderRadius: 8, border: '1px solid #c4b5fd', background: '#fff', color: '#7c3aed', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' };
const scheduledBadge: React.CSSProperties = { padding: '6px 10px', borderRadius: 8, border: 'none', background: '#ede9fe', color: '#7c3aed', fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer' };
const scheduleRow: React.CSSProperties = { display: 'flex', gap: 8, alignItems: 'center', padding: '8px 16px', background: '#faf5ff', borderRadius: '0 0 12px 12px', border: '1px solid #e2e8f0', borderTop: 'none' };
const scheduleInput: React.CSSProperties = { padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: '0.8rem' };
const scheduleConfirmBtn: React.CSSProperties = { padding: '6px 14px', borderRadius: 8, border: 'none', background: '#7c3aed', color: '#fff', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' };
