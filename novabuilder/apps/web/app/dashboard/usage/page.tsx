'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '../../../components/protected-route';
import { useApi } from '../../../lib/use-api';

type UsageMetrics = {
  projects: { used: number; limit: number };
  pages: { used: number; limit: number };
  storage: { usedMB: number; limitMB: number };
  apiCalls: { current: number; limit: number };
  deployments: { thisMonth: number; total: number };
  bandwidth: { usedMB: number; limitMB: number };
};

export default function UsagePage() {
  return (
    <ProtectedRoute>
      <UsageDashboard />
    </ProtectedRoute>
  );
}

function UsageDashboard() {
  const api = useApi();
  const [metrics, setMetrics] = useState<UsageMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const data = await api.get<UsageMetrics>('/usage');
      setMetrics(data);
    } catch {}
    setLoading(false);
  }, [api]);

  useEffect(() => { load(); }, [load]);

  if (loading) return <div style={containerStyle}><p style={muted}>Loading...</p></div>;
  if (!metrics) return <div style={containerStyle}><p style={muted}>Failed to load usage data.</p></div>;

  return (
    <div style={containerStyle}>
      <nav style={navStyle}>
        <Link href="/dashboard" style={linkStyle}>Dashboard</Link>
        <span style={muted}>/</span>
        <span style={{ color: '#0f172a', fontWeight: 600 }}>Usage</span>
      </nav>

      <h1 style={titleStyle}>Usage & Limits</h1>
      <p style={muted}>Monitor your resource consumption and plan limits.</p>

      <div style={gridStyle}>
        <UsageCard
          label="Projects"
          used={metrics.projects.used}
          limit={metrics.projects.limit}
          unit=""
        />
        <UsageCard
          label="Pages"
          used={metrics.pages.used}
          limit={metrics.pages.limit}
          unit=""
        />
        <UsageCard
          label="Storage"
          used={metrics.storage.usedMB}
          limit={metrics.storage.limitMB}
          unit="MB"
        />
        <UsageCard
          label="API Calls"
          used={metrics.apiCalls.current}
          limit={metrics.apiCalls.limit}
          unit="/mo"
        />
        <UsageCard
          label="Bandwidth"
          used={metrics.bandwidth.usedMB}
          limit={metrics.bandwidth.limitMB}
          unit="MB"
        />
        <div style={cardStyle}>
          <p style={cardLabel}>Deployments</p>
          <p style={cardValue}>{metrics.deployments.thisMonth}</p>
          <p style={cardSub}>this month · {metrics.deployments.total} total</p>
        </div>
      </div>

      <div style={tipsSection}>
        <h3 style={tipsTitle}>Tips</h3>
        <ul style={tipsList}>
          <li>Delete unused pages and assets to free up storage</li>
          <li>Upgrade your plan for higher limits</li>
          <li>Use the API sparingly or batch requests to stay within your quota</li>
        </ul>
      </div>
    </div>
  );
}

function UsageCard({ label, used, limit, unit }: { label: string; used: number; limit: number; unit: string }) {
  const pct = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0;
  const barColor = pct > 90 ? '#dc2626' : pct > 70 ? '#f59e0b' : '#16a34a';

  return (
    <div style={cardStyle}>
      <p style={cardLabel}>{label}</p>
      <p style={cardValue}>{formatNum(used)}<span style={cardLimit}> / {formatNum(limit)}{unit}</span></p>
      <div style={barBg}>
        <div style={{ ...barFill, width: `${pct}%`, background: barColor }} />
      </div>
      <p style={cardPct}>{pct}% used</p>
    </div>
  );
}

function formatNum(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

const containerStyle: React.CSSProperties = { maxWidth: 900, margin: '0 auto', padding: '40px 24px' };
const navStyle: React.CSSProperties = { display: 'flex', gap: 8, alignItems: 'center', fontSize: '0.9rem' };
const linkStyle: React.CSSProperties = { color: '#2563eb', textDecoration: 'none', fontWeight: 600 };
const titleStyle: React.CSSProperties = { fontSize: '1.5rem', margin: '20px 0 4px', color: '#0f172a', fontWeight: 800 };
const muted: React.CSSProperties = { color: '#64748b', fontSize: '0.9rem' };
const gridStyle: React.CSSProperties = { marginTop: 24, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 };
const cardStyle: React.CSSProperties = { padding: 20, borderRadius: 14, background: '#fff', border: '1px solid #e2e8f0' };
const cardLabel: React.CSSProperties = { margin: 0, fontSize: '0.8rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' };
const cardValue: React.CSSProperties = { margin: '8px 0 0', fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' };
const cardLimit: React.CSSProperties = { fontSize: '0.9rem', fontWeight: 400, color: '#94a3b8' };
const cardSub: React.CSSProperties = { margin: '4px 0 0', fontSize: '0.8rem', color: '#94a3b8' };
const cardPct: React.CSSProperties = { margin: '6px 0 0', fontSize: '0.75rem', color: '#64748b' };
const barBg: React.CSSProperties = { marginTop: 10, height: 6, borderRadius: 3, background: '#f1f5f9', overflow: 'hidden' };
const barFill: React.CSSProperties = { height: '100%', borderRadius: 3, transition: 'width 0.3s ease' };
const tipsSection: React.CSSProperties = { marginTop: 32, padding: 20, borderRadius: 14, background: '#f0f9ff', border: '1px solid #bfdbfe' };
const tipsTitle: React.CSSProperties = { margin: '0 0 8px', fontSize: '0.9rem', fontWeight: 700, color: '#1e40af' };
const tipsList: React.CSSProperties = { margin: 0, padding: '0 0 0 18px', fontSize: '0.85rem', color: '#475569', lineHeight: 1.8 };
