'use client';

import { useEffect, useState } from 'react';

type User = { id: string; email: string; name: string | null; role: string; createdAt: string; _count: { projects: number } };

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetch(`${API}/admin/users?page=${page}`, { headers: authHeaders() })
      .then((r) => r.json())
      .then((data) => { setUsers(data.users || []); setTotal(data.total || 0); })
      .catch(() => {});
  }, [page]);

  async function handleDelete(id: string) {
    if (!confirm('Permanently delete this user?')) return;
    await fetch(`${API}/admin/users/${id}`, { method: 'DELETE', headers: authHeaders() });
    setUsers((prev) => prev.filter((u) => u.id !== id));
  }

  return (
    <div>
      <h1 style={titleStyle}>Users ({total})</h1>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Role</th>
            <th style={thStyle}>Projects</th>
            <th style={thStyle}>Joined</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td style={tdStyle}>{u.email}</td>
              <td style={tdStyle}>{u.name || '—'}</td>
              <td style={tdStyle}><span style={roleBadge}>{u.role}</span></td>
              <td style={tdStyle}>{u._count.projects}</td>
              <td style={tdStyle}>{new Date(u.createdAt).toLocaleDateString()}</td>
              <td style={tdStyle}>
                <button onClick={() => handleDelete(u.id)} style={deleteBtn}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={paginationStyle}>
        <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} style={pageBtn}>← Prev</button>
        <span style={pageInfo}>Page {page}</span>
        <button onClick={() => setPage((p) => p + 1)} disabled={users.length < 20} style={pageBtn}>Next →</button>
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
const roleBadge: React.CSSProperties = { padding: '2px 8px', borderRadius: 4, background: '#f1f5f9', fontSize: '0.75rem', fontWeight: 600, color: '#475569' };
const deleteBtn: React.CSSProperties = { padding: '4px 10px', borderRadius: 6, border: '1px solid #fecaca', background: '#fff', color: '#dc2626', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' };
const paginationStyle: React.CSSProperties = { marginTop: 16, display: 'flex', gap: 12, alignItems: 'center' };
const pageBtn: React.CSSProperties = { padding: '8px 14px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' };
const pageInfo: React.CSSProperties = { fontSize: '0.85rem', color: '#64748b' };
