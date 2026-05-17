'use client';

import { useEffect, useState } from 'react';

type Stats = { users: number; projects: number; pages: number; deployments: number };

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch(`${API}/admin/stats`, { headers: authHeaders() })
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  return (
    <div>
      <h1 style={titleStyle}>Platform Overview</h1>
      <div style={gridStyle}>
        <StatCard label="Total Users" value={stats?.users} />
        <StatCard label="Projects" value={stats?.projects} />
        <StatCard label="Pages" value={stats?.pages} />
        <StatCard label="Deployments" value={stats?.deployments} />
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value?: number }) {
  return (
    <div style={cardStyle}>
      <p style={cardLabel}>{label}</p>
      <p style={cardValue}>{value ?? '—'}</p>
    </div>
  );
}

function authHeaders(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const titleStyle: React.CSSProperties = { fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: '0 0 24px' };
const gridStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 };
const cardStyle: React.CSSProperties = { padding: 24, borderRadius: 14, background: '#fff', border: '1px solid #e2e8f0' };
const cardLabel: React.CSSProperties = { margin: 0, fontSize: '0.85rem', color: '#64748b', fontWeight: 600 };
const cardValue: React.CSSProperties = { margin: '8px 0 0', fontSize: '2rem', fontWeight: 800, color: '#0f172a' };
