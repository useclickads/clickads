'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

type ActivityEvent = {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  description: string;
  user: { id: string; name: string; email: string; avatar: string | null } | null;
  createdAt: string;
};

type Stats = {
  totalEvents: number;
  byAction: Record<string, number>;
  byEntity: Record<string, number>;
};

export default function ActivityPage() {
  const { id: projectId } = useParams<{ id: string }>();
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [tab, setTab] = useState<'feed' | 'stats'>('feed');

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
  const headers: Record<string, string> = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  async function loadEvents(reset = false) {
    const o = reset ? 0 : offset;
    const res = await fetch(`${API}/projects/${projectId}/activity?limit=30&offset=${o}`, { headers });
    const data = await res.json();
    if (reset) {
      setEvents(data.events || []);
      setOffset(30);
    } else {
      setEvents((prev) => [...prev, ...(data.events || [])]);
      setOffset(o + 30);
    }
    setHasMore(data.hasMore || false);
    setLoading(false);
  }

  async function loadStats() {
    const res = await fetch(`${API}/projects/${projectId}/activity/stats?days=30`, { headers });
    setStats(await res.json());
  }

  useEffect(() => {
    loadEvents(true);
    loadStats();
  }, [projectId]);

  const actionIcons: Record<string, string> = {
    create: '+', update: '~', delete: 'x', publish: '^', unpublish: 'v',
    invite: '@', restore: '<', export: '>', import: '<',
  };

  return (
    <div style={{ padding: 32, maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>Activity Feed</h1>
      <p style={{ color: '#64748b', marginBottom: 24, fontSize: '0.9rem' }}>
        Track all changes and actions in your project.
      </p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <button onClick={() => setTab('feed')} style={tabBtn(tab === 'feed')}>Timeline</button>
        <button onClick={() => setTab('stats')} style={tabBtn(tab === 'stats')}>Statistics</button>
      </div>

      {tab === 'feed' && (
        <>
          {loading ? (
            <p style={{ color: '#94a3b8' }}>Loading...</p>
          ) : events.length === 0 ? (
            <p style={{ color: '#94a3b8', textAlign: 'center', padding: 40 }}>No activity recorded yet.</p>
          ) : (
            <div style={{ position: 'relative', paddingLeft: 24 }}>
              <div style={timelineBar} />
              {events.map((event) => (
                <div key={event.id} style={eventRow}>
                  <div style={dotStyle}>
                    <span style={{ fontSize: '0.65rem', fontWeight: 800 }}>
                      {actionIcons[event.action] || '.'}
                    </span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.85rem', color: '#0f172a' }}>
                      <strong>{event.user?.name || event.user?.email || 'System'}</strong>{' '}
                      {event.description}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: 2 }}>
                      {new Date(event.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
              {hasMore && (
                <button onClick={() => loadEvents()} style={loadMoreBtn}>Load More</button>
              )}
            </div>
          )}
        </>
      )}

      {tab === 'stats' && stats && (
        <div style={{ display: 'grid', gap: 20 }}>
          <div style={statCard}>
            <h3 style={statTitle}>Total Events (30 days)</h3>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#0f172a' }}>{stats.totalEvents}</div>
          </div>

          <div style={statCard}>
            <h3 style={statTitle}>By Action</h3>
            <div style={{ display: 'grid', gap: 6 }}>
              {Object.entries(stats.byAction).sort((a, b) => b[1] - a[1]).map(([action, count]) => (
                <div key={action} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: '#475569', textTransform: 'capitalize' }}>{action}</span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={statCard}>
            <h3 style={statTitle}>By Entity Type</h3>
            <div style={{ display: 'grid', gap: 6 }}>
              {Object.entries(stats.byEntity).sort((a, b) => b[1] - a[1]).map(([entity, count]) => (
                <div key={entity} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: '#475569', textTransform: 'capitalize' }}>{entity}</span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const tabBtn = (active: boolean): React.CSSProperties => ({
  padding: '8px 16px', borderRadius: 8, border: active ? '1px solid #6366f1' : '1px solid #e2e8f0',
  background: active ? '#eef2ff' : '#fff', color: active ? '#6366f1' : '#475569',
  fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
});
const timelineBar: React.CSSProperties = {
  position: 'absolute', left: 11, top: 0, bottom: 0, width: 2, background: '#e2e8f0',
};
const dotStyle: React.CSSProperties = {
  position: 'absolute', left: -16, width: 24, height: 24, borderRadius: '50%',
  background: '#f1f5f9', border: '2px solid #e2e8f0', display: 'flex',
  alignItems: 'center', justifyContent: 'center', color: '#64748b',
};
const eventRow: React.CSSProperties = {
  position: 'relative', paddingLeft: 20, paddingBottom: 20, display: 'flex', alignItems: 'flex-start',
};
const loadMoreBtn: React.CSSProperties = {
  padding: '8px 20px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff',
  color: '#475569', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', marginTop: 12,
};
const statCard: React.CSSProperties = {
  padding: 20, borderRadius: 12, border: '1px solid #e2e8f0', background: '#fff',
};
const statTitle: React.CSSProperties = {
  margin: '0 0 12px', fontSize: '0.9rem', fontWeight: 600, color: '#64748b',
};
