'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ProtectedRoute } from '../../../../../components/protected-route';
import { useApi } from '../../../../../lib/use-api';

type Summary = {
  totalEvents: number;
  pageViews: number;
  uniqueVisitors: number;
  byType: Record<string, number>;
  topPages: { path: string; views: number }[];
  referrers: { source: string; count: number }[];
  timeSeries: { date: string; count: number }[];
};
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
  const [tab, setTab] = useState<'overview' | 'pages' | 'referrers' | 'events'>('overview');

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
  const maxPageViews = summary?.topPages?.[0]?.views || 1;
  const maxTimeCount = summary?.timeSeries ? Math.max(...summary.timeSeries.map((t) => t.count), 1) : 1;

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
        <div style={statCard}><p style={statLabel}>Page Views</p><p style={statValue}>{summary?.pageViews ?? 0}</p></div>
        <div style={statCard}><p style={statLabel}>Unique Visitors</p><p style={statValue}>{summary?.uniqueVisitors ?? 0}</p></div>
        <div style={statCard}><p style={statLabel}>Total Events</p><p style={statValue}>{summary?.totalEvents ?? 0}</p></div>
        <div style={statCard}><p style={statLabel}>Event Types</p><p style={statValue}>{sortedTypes.length}</p></div>
      </div>

      {summary?.timeSeries && summary.timeSeries.length > 0 && (
        <div style={{ marginTop: 28 }}>
          <h3 style={sectionTitle}>Traffic Over Time</h3>
          <div style={chartContainer}>
            {summary.timeSeries.map((t) => (
              <div key={t.date} style={chartBar}>
                <div style={{ ...chartBarFill, height: `${(t.count / maxTimeCount) * 100}%` }} />
                <span style={chartLabel}>{t.date.slice(5)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={tabRow}>
        <button onClick={() => setTab('overview')} style={tab === 'overview' ? tabActive : tabBtn}>By Type</button>
        <button onClick={() => setTab('pages')} style={tab === 'pages' ? tabActive : tabBtn}>Top Pages</button>
        <button onClick={() => setTab('referrers')} style={tab === 'referrers' ? tabActive : tabBtn}>Referrers</button>
        <button onClick={() => setTab('events')} style={tab === 'events' ? tabActive : tabBtn}>Events Log</button>
      </div>

      {tab === 'overview' && sortedTypes.length > 0 && (
        <div style={barChart}>
          {sortedTypes.map(([type, count]) => (
            <div key={type} style={barRow}>
              <span style={barLabel}>{type}</span>
              <div style={barTrack}><div style={{ ...barFill, width: `${(count / maxCount) * 100}%` }} /></div>
              <span style={barCount}>{count}</span>
            </div>
          ))}
        </div>
      )}

      {tab === 'pages' && (
        <div style={barChart}>
          {(summary?.topPages || []).length === 0 ? (
            <p style={muted}>No page view data yet.</p>
          ) : (
            summary!.topPages.map((p) => (
              <div key={p.path} style={barRow}>
                <span style={barLabel}>{p.path}</span>
                <div style={barTrack}><div style={{ ...barFill, width: `${(p.views / maxPageViews) * 100}%` }} /></div>
                <span style={barCount}>{p.views}</span>
              </div>
            ))
          )}
        </div>
      )}

      {tab === 'referrers' && (
        <div style={barChart}>
          {(summary?.referrers || []).length === 0 ? (
            <p style={muted}>No referrer data yet.</p>
          ) : (
            summary!.referrers.map((r) => (
              <div key={r.source} style={barRow}>
                <span style={barLabel}>{r.source}</span>
                <div style={barTrack}><div style={{ ...barFillGreen, width: `${(r.count / (summary!.referrers[0]?.count || 1)) * 100}%` }} /></div>
                <span style={barCount}>{r.count}</span>
              </div>
            ))
          )}
        </div>
      )}

      {tab === 'events' && (
        <div>
          {events.length === 0 ? (
            <div style={emptyState}><p style={{ margin: 0, fontWeight: 600 }}>No events yet</p><p style={muted}>Events will appear here once your site is live.</p></div>
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
      )}
    </div>
  );
}

const containerStyle: React.CSSProperties = { maxWidth: 1000, margin: '0 auto', padding: '40px 24px' };
const navStyle: React.CSSProperties = { display: 'flex', gap: 8, alignItems: 'center', fontSize: '0.9rem' };
const headerStyle: React.CSSProperties = { marginTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const titleStyle: React.CSSProperties = { fontSize: '1.5rem', margin: 0, color: '#0f172a', fontWeight: 800 };
const selectStyle: React.CSSProperties = { padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.85rem' };
const statsGrid: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginTop: 24 };
const statCard: React.CSSProperties = { padding: 20, borderRadius: 14, background: '#fff', border: '1px solid #e2e8f0', textAlign: 'center' };
const statLabel: React.CSSProperties = { margin: 0, fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 };
const statValue: React.CSSProperties = { margin: '8px 0 0', fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' };
const sectionTitle: React.CSSProperties = { fontSize: '1rem', margin: '0 0 12px', color: '#334155', fontWeight: 700 };
const chartContainer: React.CSSProperties = { display: 'flex', alignItems: 'flex-end', gap: 2, height: 120, padding: '0 0 24px', borderBottom: '1px solid #e2e8f0' };
const chartBar: React.CSSProperties = { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' };
const chartBarFill: React.CSSProperties = { width: '100%', maxWidth: 24, background: 'linear-gradient(180deg, #2563eb, #1e40af)', borderRadius: '3px 3px 0 0', minHeight: 2 };
const chartLabel: React.CSSProperties = { fontSize: '0.55rem', color: '#94a3b8', marginTop: 4 };
const tabRow: React.CSSProperties = { marginTop: 28, display: 'flex', gap: 4, borderBottom: '1px solid #e2e8f0', paddingBottom: 0 };
const tabBtn: React.CSSProperties = { padding: '10px 16px', border: 'none', background: 'transparent', color: '#64748b', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', borderBottom: '2px solid transparent' };
const tabActive: React.CSSProperties = { ...tabBtn, color: '#0f172a', borderBottom: '2px solid #2563eb' };
const barChart: React.CSSProperties = { display: 'grid', gap: 8, marginTop: 16 };
const barRow: React.CSSProperties = { display: 'grid', gridTemplateColumns: '140px 1fr 50px', alignItems: 'center', gap: 12 };
const barLabel: React.CSSProperties = { fontSize: '0.8rem', color: '#334155', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' };
const barTrack: React.CSSProperties = { height: 8, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' };
const barFill: React.CSSProperties = { height: '100%', background: 'linear-gradient(90deg, #2563eb, #1e40af)', borderRadius: 4, minWidth: 4 };
const barFillGreen: React.CSSProperties = { height: '100%', background: 'linear-gradient(90deg, #16a34a, #15803d)', borderRadius: 4, minWidth: 4 };
const barCount: React.CSSProperties = { fontSize: '0.8rem', color: '#64748b', textAlign: 'right' };
const emptyState: React.CSSProperties = { padding: 32, borderRadius: 16, background: '#f8fafc', border: '1px solid #e2e8f0', textAlign: 'center' };
const listStyle: React.CSSProperties = { display: 'grid', gap: 6, marginTop: 12 };
const eventRow: React.CSSProperties = { display: 'grid', gridTemplateColumns: '120px 1fr auto', gap: 12, padding: '10px 14px', borderRadius: 8, background: '#fff', border: '1px solid #f1f5f9', alignItems: 'center' };
const eventType: React.CSSProperties = { fontSize: '0.8rem', fontWeight: 600, color: '#2563eb' };
const eventPayload: React.CSSProperties = { fontSize: '0.75rem', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' };
const eventDate: React.CSSProperties = { fontSize: '0.7rem', color: '#94a3b8' };
const muted: React.CSSProperties = { color: '#64748b', fontSize: '0.9rem' };
const linkStyle: React.CSSProperties = { color: '#2563eb', textDecoration: 'none', fontWeight: 600 };
