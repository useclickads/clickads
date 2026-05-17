'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ProtectedRoute } from '../../../../../components/protected-route';
import { useApi } from '../../../../../lib/use-api';

type Summary = { totalEvents: number; byType: Record<string, number> };
type Event = { id: string; type: string; payload: Record<string, unknown>; createdAt: string };

export default function AnalyticsPage() {
  return (
    <ProtectedRoute>
      <AnalyticsDashboard />
    </ProtectedRoute>
  );
}

function AnalyticsDashboard() {
  const { id } = useParams<{ id: string }>();
  const api = useApi();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  const load = useCallback(async () => {
    try {
      const [s, e] = await Promise.all([
        api.get<Summary>(`/projects/${id}/analytics/summary?days=${days}`),
        api.get<Event[]>(`/projects/${id}/analytics/events?days=${days}`),
      ]);
      setSummary(s);
      setEvents(e);
    } catch {}
    setLoading(false);
  }, [api, id, days]);

  useEffect(() => { load(); }, [load]);

  if (loading) return <div style={containerStyle}><p style={muted}>Loading...</p></div>;

  const sortedTypes = summary ? Object.entries(summary.byType).sort((a, b) => b[1] - a[1]) : [];
  const maxCount = sortedTypes.length > 0 ? sortedTypes[0][1] : 1;

  return (
    <div style={containerStyle}>
      <nav style={navStyle}>
        <Link href="/dashboard" style={linkStyle}>Dashboard</Link>
        <span style={muted}>/</span>
        <Link href={`/dashboard/projects/${id}`} style={linkStyle}>Project</Link>
        <span style={muted}>/</span>
        <span style={{ color: '#0f172a', fontWeight: 600 }}>Analytics</span>
      </nav>

      <header style={headerStyle}>
        <h1 style={titleStyle}>Analytics</h1>
        <select value={days} onChange={(e) => setDays(Number(e.target.value))} style={selectStyle}>
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </header>

      <div style={statsGrid}>
        <div style={statCard}>
          <p style={statLabel}>Total Events</p>
          <p style={statValue}>{summary?.totalEvents ?? 0}</p>
        </div>
        <div style={statCard}>
          <p style={statLabel}>Event Types</p>
          <p style={statValue}>{sortedTypes.length}</p>
        </div>
        <div style={statCard}>
          <p style={statLabel}>Period</p>
          <p style={statValue}>{days} days</p>
        </div>
      </div>

      {sortedTypes.length > 0 && (
        <div style={{ marginTop: 28 }}>
          <h3 style={sectionTitle}>Events by Type</h3>
          <div style={barChart}>
            {sortedTypes.map(([type, count]) => (
              <div key={type} style={barRow}>
                <span style={barLabel}>{type}</span>
                <div style={barTrack}>
                  <div style={{ ...barFill, width: `${(count / maxCount) * 100}%` }} />
                </div>
                <span style={barCount}>{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: 28 }}>
        <h3 style={sectionTitle}>Recent Events</h3>
        {events.length === 0 ? (
          <div style={emptyState}>
            <p style={{ margin: 0, fontWeight: 600 }}>No events yet</p>
            <p style={muted}>Events will appear here once your site is live and tracking.</p>
          </div>
        ) : (
          <div style={listStyle}>
            {events.slice(0, 50).map((e) => (
              <div key={e.id} style={eventRow}>
                <span style={eventType}>{e.type}</span>
                <span style={eventPayload}>{JSON.stringify(e.payload).slice(0, 80)}</span>
                <span style={eventDate}>{new Date(e.createdAt).toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const containerStyle: React.CSSProperties = { maxWidth: 900, margin: '0 auto', padding: '40px 24px' };
const navStyle: React.CSSProperties = { display: 'flex', gap: 8, alignItems: 'center', fontSize: '0.9rem' };
const headerStyle: React.CSSProperties = { marginTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const titleStyle: React.CSSProperties = { fontSize: '1.5rem', margin: 0, color: '#0f172a' };
const selectStyle: React.CSSProperties = { padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.85rem' };
const statsGrid: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 24 };
const statCard: React.CSSProperties = { padding: 20, borderRadius: 14, background: '#f8fafc', border: '1px solid #e2e8f0', textAlign: 'center' };
const statLabel: React.CSSProperties = { margin: 0, fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' };
const statValue: React.CSSProperties = { margin: '8px 0 0', fontSize: '1.75rem', fontWeight: 700, color: '#0f172a' };
const sectionTitle: React.CSSProperties = { fontSize: '1rem', margin: '0 0 12px', color: '#334155' };
const barChart: React.CSSProperties = { display: 'grid', gap: 8 };
const barRow: React.CSSProperties = { display: 'grid', gridTemplateColumns: '120px 1fr 50px', alignItems: 'center', gap: 12 };
const barLabel: React.CSSProperties = { fontSize: '0.8rem', color: '#334155', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' };
const barTrack: React.CSSProperties = { height: 8, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' };
const barFill: React.CSSProperties = { height: '100%', background: 'linear-gradient(90deg, #2563eb, #1e40af)', borderRadius: 4, minWidth: 4 };
const barCount: React.CSSProperties = { fontSize: '0.8rem', color: '#64748b', textAlign: 'right' };
const emptyState: React.CSSProperties = { padding: 32, borderRadius: 16, background: '#f8fafc', border: '1px solid #e2e8f0', textAlign: 'center' };
const listStyle: React.CSSProperties = { display: 'grid', gap: 6 };
const eventRow: React.CSSProperties = { display: 'grid', gridTemplateColumns: '120px 1fr auto', gap: 12, padding: '10px 14px', borderRadius: 8, background: '#fff', border: '1px solid #f1f5f9', alignItems: 'center' };
const eventType: React.CSSProperties = { fontSize: '0.8rem', fontWeight: 600, color: '#2563eb' };
const eventPayload: React.CSSProperties = { fontSize: '0.75rem', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' };
const eventDate: React.CSSProperties = { fontSize: '0.7rem', color: '#94a3b8' };
const muted: React.CSSProperties = { color: '#64748b', fontSize: '0.9rem' };
const linkStyle: React.CSSProperties = { color: '#2563eb', textDecoration: 'none', fontWeight: 600 };
