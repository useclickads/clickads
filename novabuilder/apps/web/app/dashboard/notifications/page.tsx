'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '../../../components/protected-route';
import { useApi } from '../../../lib/use-api';

type Notification = {
  id: string;
  type: string;
  payload: Record<string, unknown>;
  read: boolean;
  createdAt: string;
};

export default function NotificationsPage() {
  return (
    <ProtectedRoute>
      <NotificationsCenter />
    </ProtectedRoute>
  );
}

function NotificationsCenter() {
  const api = useApi();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const data = await api.get<Notification[]>('/notifications');
      setNotifications(data);
    } catch {}
    setLoading(false);
  }, [api]);

  useEffect(() => { load(); }, [load]);

  async function handleMarkAllRead() {
    try {
      await api.patch('/notifications/read-all', {});
      load();
    } catch {}
  }

  async function handleMarkRead(id: string) {
    try {
      await api.patch(`/notifications/${id}/read`, {});
      setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
    } catch {}
  }

  const unread = notifications.filter((n) => !n.read).length;

  if (loading) return <div style={containerStyle}><p style={muted}>Loading...</p></div>;

  return (
    <div style={containerStyle}>
      <nav style={navStyle}>
        <Link href="/dashboard" style={linkStyle}>Dashboard</Link>
        <span style={muted}>/</span>
        <span style={{ color: '#0f172a', fontWeight: 600 }}>Notifications</span>
      </nav>

      <header style={headerStyle}>
        <div>
          <h1 style={titleStyle}>Notifications</h1>
          {unread > 0 && <span style={badge}>{unread} unread</span>}
        </div>
        {unread > 0 && <button onClick={handleMarkAllRead} style={markAllBtn}>Mark all read</button>}
      </header>

      {notifications.length === 0 ? (
        <div style={emptyState}>
          <p style={{ margin: 0, fontWeight: 600 }}>All caught up!</p>
          <p style={muted}>You have no notifications.</p>
        </div>
      ) : (
        <div style={listStyle}>
          {notifications.map((n) => (
            <div key={n.id} style={rowStyle(n.read)} onClick={() => !n.read && handleMarkRead(n.id)}>
              <div style={{ flex: 1 }}>
                <p style={typeText}>{formatType(n.type)}</p>
                <p style={bodyText}>{n.payload.message ? String(n.payload.message) : JSON.stringify(n.payload).slice(0, 100)}</p>
              </div>
              <div style={rightCol}>
                <span style={dateText}>{new Date(n.createdAt).toLocaleString()}</span>
                {!n.read && <div style={unreadDot} />}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function formatType(type: string) {
  return type.replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

const containerStyle: React.CSSProperties = { maxWidth: 700, margin: '0 auto', padding: '40px 24px' };
const navStyle: React.CSSProperties = { display: 'flex', gap: 8, alignItems: 'center', fontSize: '0.9rem' };
const headerStyle: React.CSSProperties = { marginTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const titleStyle: React.CSSProperties = { fontSize: '1.5rem', margin: 0, color: '#0f172a', display: 'inline' };
const badge: React.CSSProperties = { marginLeft: 10, padding: '3px 8px', borderRadius: 6, background: '#dbeafe', color: '#2563eb', fontSize: '0.75rem', fontWeight: 600 };
const markAllBtn: React.CSSProperties = { padding: '8px 14px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', color: '#475569', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' };
const muted: React.CSSProperties = { color: '#64748b', fontSize: '0.9rem' };
const linkStyle: React.CSSProperties = { color: '#2563eb', textDecoration: 'none', fontWeight: 600 };
const emptyState: React.CSSProperties = { marginTop: 24, padding: 32, borderRadius: 16, background: '#f8fafc', border: '1px solid #e2e8f0', textAlign: 'center' };
const listStyle: React.CSSProperties = { marginTop: 20, display: 'grid', gap: 4 };
const rowStyle = (read: boolean): React.CSSProperties => ({ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderRadius: 10, background: read ? '#fff' : '#f0f9ff', border: '1px solid #e2e8f0', cursor: read ? 'default' : 'pointer' });
const typeText: React.CSSProperties = { margin: 0, fontSize: '0.8rem', fontWeight: 600, color: '#334155' };
const bodyText: React.CSSProperties = { margin: '2px 0 0', fontSize: '0.85rem', color: '#475569' };
const rightCol: React.CSSProperties = { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 };
const dateText: React.CSSProperties = { fontSize: '0.7rem', color: '#94a3b8', whiteSpace: 'nowrap' };
const unreadDot: React.CSSProperties = { width: 8, height: 8, borderRadius: '50%', background: '#2563eb' };
