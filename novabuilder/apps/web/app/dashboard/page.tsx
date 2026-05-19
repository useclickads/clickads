'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../providers';
import { useApi } from '../../lib/use-api';
import { ProtectedRoute } from '../../components/protected-route';
import type { Project } from '../../lib/api';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

type AuditEntry = { id: string; action: string; resource: string; resourceId?: string; details?: string; createdAt: string };
type Notification = { id: string; type: string; title: string; read: boolean; createdAt: string };

function DashboardContent() {
  const { user, signOut } = useAuth();
  const api = useApi();
  const [projects, setProjects] = useState<Project[]>([]);
  const [activity, setActivity] = useState<AuditEntry[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  const loadProjects = useCallback(async () => {
    try {
      const [data, act, notifs] = await Promise.all([
        api.get<Project[]>('/projects'),
        api.get<AuditEntry[]>('/audit?limit=5').catch(() => []),
        api.get<Notification[]>('/notifications?limit=5').catch(() => []),
      ]);
      setProjects(data);
      setActivity(act);
      setNotifications(notifs);
    } catch {
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => { loadProjects(); }, [loadProjects]);

  const totalPages = projects.reduce((sum, p) => sum + (p._count?.pages ?? 0), 0);
  const totalDeploys = projects.reduce((sum, p) => sum + (p._count?.deployments ?? 0), 0);
  const unreadNotifs = notifications.filter((n) => !n.read).length;

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <div>
          <h1 style={titleStyle}>Dashboard</h1>
          <p style={subtitleStyle}>Welcome, {user?.name || user?.email}</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <Link href="/dashboard/search" style={navBtn}>Search</Link>
          <Link href="/dashboard/notifications" style={navBtn}>Notifications</Link>
          <Link href="/dashboard/activity" style={navBtn}>Activity</Link>
          <Link href="/dashboard/ai" style={navBtn}>AI Generator</Link>
          <Link href="/dashboard/marketplace" style={navBtn}>Marketplace</Link>
          <Link href="/dashboard/templates" style={navBtn}>Templates</Link>
          <Link href="/dashboard/usage" style={navBtn}>Usage</Link>
          <Link href="/dashboard/billing" style={navBtn}>Billing</Link>
          <Link href="/dashboard/api-keys" style={navBtn}>API Keys</Link>
          <Link href="/dashboard/docs" style={navBtn}>API Docs</Link>
          <Link href="/dashboard/profile" style={navBtn}>Profile</Link>
          <button onClick={signOut} style={logoutStyle}>Sign out</button>
        </div>
      </header>

      <div style={statsRow}>
        <div style={statCard}><p style={statLabel}>Projects</p><p style={statValue}>{projects.length}</p></div>
        <div style={statCard}><p style={statLabel}>Total Pages</p><p style={statValue}>{totalPages}</p></div>
        <div style={statCard}><p style={statLabel}>Deployments</p><p style={statValue}>{totalDeploys}</p></div>
        <div style={statCard}><p style={statLabel}>Unread</p><p style={statValue}>{unreadNotifs}</p></div>
      </div>

      {activity.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <h3 style={sectionTitleSm}>Recent Activity</h3>
          <div style={{ display: 'grid', gap: 6 }}>
            {activity.map((a) => (
              <div key={a.id} style={activityRow}>
                <span style={activityAction}>{a.action}</span>
                <span style={activityResource}>{a.resource}{a.resourceId ? ` #${a.resourceId.slice(0, 8)}` : ''}</span>
                <span style={activityDate}>{new Date(a.createdAt).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
          <Link href="/dashboard/activity" style={{ fontSize: '0.8rem', color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}>View all activity →</Link>
        </div>
      )}

      <div style={toolbarStyle}>
        <h2 style={sectionTitle}>Projects</h2>
        <button onClick={() => setShowCreate(true)} style={primaryBtn}>New Project</button>
      </div>

      {showCreate && (
        <CreateProjectForm
          api={api}
          onCreated={() => { setShowCreate(false); loadProjects(); }}
          onCancel={() => setShowCreate(false)}
        />
      )}

      {loading ? (
        <p style={mutedText}>Loading projects...</p>
      ) : projects.length === 0 ? (
        <div style={emptyState}>
          <p style={{ margin: 0, fontWeight: 600 }}>No projects yet</p>
          <p style={mutedText}>Create your first project to get started.</p>
        </div>
      ) : (
        <div style={gridStyle}>
          {projects.map((project) => (
            <Link key={project.id} href={`/dashboard/projects/${project.id}`} style={cardLink}>
              <div style={cardStyle}>
                <h3 style={cardTitle}>{project.name}</h3>
                <p style={cardSlug}>/{project.slug}</p>
                {project.description && <p style={cardDesc}>{project.description}</p>}
                <div style={cardStats}>
                  <span>{project._count?.pages ?? 0} pages</span>
                  <span>{project._count?.deployments ?? 0} deploys</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function CreateProjectForm({ api, onCreated, onCancel }: { api: ReturnType<typeof useApi>; onCreated: () => void; onCancel: () => void }) {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleNameChange(value: string) {
    setName(value);
    setSlug(value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.post('/projects', { name, slug, description: description || undefined });
      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={formCard}>
      <h3 style={{ margin: 0, color: '#0f172a' }}>New Project</h3>
      <label style={labelStyle}>
        Name
        <input type="text" required value={name} onChange={(e) => handleNameChange(e.target.value)} style={inputStyle} />
      </label>
      <label style={labelStyle}>
        Slug
        <input type="text" required value={slug} onChange={(e) => setSlug(e.target.value)} style={inputStyle} pattern="[a-z0-9-]+" />
      </label>
      <label style={labelStyle}>
        Description (optional)
        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} style={inputStyle} />
      </label>
      {error && <p style={{ margin: 0, color: '#dc2626', fontSize: '0.85rem' }}>{error}</p>}
      <div style={{ display: 'flex', gap: 12 }}>
        <button type="submit" style={primaryBtn} disabled={loading}>
          {loading ? 'Creating…' : 'Create'}
        </button>
        <button type="button" onClick={onCancel} style={logoutStyle}>Cancel</button>
      </div>
    </form>
  );
}

const containerStyle: React.CSSProperties = { maxWidth: 1000, margin: '0 auto', padding: '40px 24px' };
const headerStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' };
const titleStyle: React.CSSProperties = { fontSize: '1.75rem', margin: 0, color: '#0f172a' };
const subtitleStyle: React.CSSProperties = { marginTop: 4, color: '#64748b', fontSize: '0.9rem' };
const navBtn: React.CSSProperties = { padding: '10px 16px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', textDecoration: 'none', fontWeight: 600, color: '#475569', fontSize: '0.85rem' };
const logoutStyle: React.CSSProperties = { padding: '10px 16px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontWeight: 600, color: '#475569' };
const toolbarStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 32 };
const sectionTitle: React.CSSProperties = { fontSize: '1.2rem', margin: 0, color: '#0f172a' };
const primaryBtn: React.CSSProperties = { padding: '10px 18px', borderRadius: 10, border: 'none', background: '#0f172a', color: '#fff', fontWeight: 600, cursor: 'pointer' };
const mutedText: React.CSSProperties = { color: '#64748b', fontSize: '0.9rem', marginTop: 8 };
const emptyState: React.CSSProperties = { marginTop: 24, padding: 32, borderRadius: 16, background: '#f8fafc', border: '1px solid #e2e8f0', textAlign: 'center' };
const gridStyle: React.CSSProperties = { marginTop: 20, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 };
const cardLink: React.CSSProperties = { textDecoration: 'none', color: 'inherit' };
const cardStyle: React.CSSProperties = { padding: 20, borderRadius: 14, background: '#fff', border: '1px solid #e2e8f0', transition: 'box-shadow 0.15s', cursor: 'pointer' };
const cardTitle: React.CSSProperties = { margin: 0, fontSize: '1.05rem', color: '#0f172a' };
const cardSlug: React.CSSProperties = { margin: '4px 0 0', fontSize: '0.8rem', color: '#94a3b8' };
const cardDesc: React.CSSProperties = { margin: '8px 0 0', fontSize: '0.85rem', color: '#475569' };
const cardStats: React.CSSProperties = { marginTop: 12, display: 'flex', gap: 16, fontSize: '0.8rem', color: '#64748b' };
const formCard: React.CSSProperties = { marginTop: 16, padding: 24, borderRadius: 14, background: '#f8fafc', border: '1px solid #e2e8f0', display: 'grid', gap: 14 };
const labelStyle: React.CSSProperties = { display: 'grid', gap: 6, color: '#334155', fontSize: '0.9rem' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #cbd5e1', fontSize: '0.95rem' };
const statsRow: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginTop: 24 };
const statCard: React.CSSProperties = { padding: 16, borderRadius: 12, background: '#fff', border: '1px solid #e2e8f0', textAlign: 'center' };
const statLabel: React.CSSProperties = { margin: 0, fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 };
const statValue: React.CSSProperties = { margin: '6px 0 0', fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' };
const sectionTitleSm: React.CSSProperties = { fontSize: '0.95rem', margin: '0 0 10px', color: '#334155', fontWeight: 700 };
const activityRow: React.CSSProperties = { display: 'grid', gridTemplateColumns: '100px 1fr auto', gap: 12, padding: '8px 12px', borderRadius: 8, background: '#f8fafc', border: '1px solid #f1f5f9', alignItems: 'center' };
const activityAction: React.CSSProperties = { fontSize: '0.75rem', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase' };
const activityResource: React.CSSProperties = { fontSize: '0.8rem', color: '#475569' };
const activityDate: React.CSSProperties = { fontSize: '0.7rem', color: '#94a3b8' };
