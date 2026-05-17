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

function DashboardContent() {
  const { user, signOut } = useAuth();
  const api = useApi();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  const loadProjects = useCallback(async () => {
    try {
      const data = await api.get<Project[]>('/projects');
      setProjects(data);
    } catch {
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => { loadProjects(); }, [loadProjects]);

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <div>
          <h1 style={titleStyle}>Dashboard</h1>
          <p style={subtitleStyle}>Welcome, {user?.name || user?.email}</p>
        </div>
        <button onClick={signOut} style={logoutStyle}>Sign out</button>
      </header>

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
