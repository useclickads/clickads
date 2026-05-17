'use client';

import { useEffect, useState } from 'react';

type Project = { id: string; name: string; slug: string; createdAt: string; owner: { email: string }; _count: { pages: number; deployments: number } };

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetch(`${API}/admin/projects?page=${page}`, { headers: authHeaders() })
      .then((r) => r.json())
      .then((data) => { setProjects(data.projects || []); setTotal(data.total || 0); })
      .catch(() => {});
  }, [page]);

  async function handleDelete(id: string) {
    if (!confirm('Delete this project?')) return;
    await fetch(`${API}/admin/projects/${id}`, { method: 'DELETE', headers: authHeaders() });
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div>
      <h1 style={titleStyle}>Projects ({total})</h1>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Slug</th>
            <th style={thStyle}>Owner</th>
            <th style={thStyle}>Pages</th>
            <th style={thStyle}>Deploys</th>
            <th style={thStyle}>Created</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((p) => (
            <tr key={p.id}>
              <td style={tdStyle}>{p.name}</td>
              <td style={tdStyle}><code style={slugStyle}>/{p.slug}</code></td>
              <td style={tdStyle}>{p.owner.email}</td>
              <td style={tdStyle}>{p._count.pages}</td>
              <td style={tdStyle}>{p._count.deployments}</td>
              <td style={tdStyle}>{new Date(p.createdAt).toLocaleDateString()}</td>
              <td style={tdStyle}>
                <button onClick={() => handleDelete(p.id)} style={deleteBtn}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={paginationStyle}>
        <button onClick={() => setPage((pg) => Math.max(1, pg - 1))} disabled={page === 1} style={pageBtn}>← Prev</button>
        <span style={pageInfo}>Page {page}</span>
        <button onClick={() => setPage((pg) => pg + 1)} disabled={projects.length < 20} style={pageBtn}>Next →</button>
      </div>
    </div>
  );
}

function authHeaders(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const titleStyle: React.CSSProperties = { fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: '0 0 24px' };
const tableStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 12, overflow: 'hidden', border: '1px solid #e2e8f0' };
const thStyle: React.CSSProperties = { textAlign: 'left', padding: '12px 16px', fontSize: '0.8rem', fontWeight: 600, color: '#64748b', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' };
const tdStyle: React.CSSProperties = { padding: '12px 16px', fontSize: '0.85rem', borderBottom: '1px solid #f1f5f9', color: '#334155' };
const slugStyle: React.CSSProperties = { padding: '2px 6px', borderRadius: 4, background: '#f1f5f9', fontSize: '0.8rem' };
const deleteBtn: React.CSSProperties = { padding: '4px 10px', borderRadius: 6, border: '1px solid #fecaca', background: '#fff', color: '#dc2626', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' };
const paginationStyle: React.CSSProperties = { marginTop: 16, display: 'flex', gap: 12, alignItems: 'center' };
const pageBtn: React.CSSProperties = { padding: '8px 14px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' };
const pageInfo: React.CSSProperties = { fontSize: '0.85rem', color: '#64748b' };
