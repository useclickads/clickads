'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

type Notification = {
  id: string;
  type: string;
  payload: Record<string, unknown>;
  read: boolean;
  createdAt: string;
};

const TYPE_CONFIG: Record<string, { icon: string; color: string; label: string }> = {
  project_published: { icon: '🚀', color: '#16a34a', label: 'Published' },
  deploy_success: { icon: '✓', color: '#16a34a', label: 'Deploy Success' },
  deploy_failed: { icon: '✕', color: '#dc2626', label: 'Deploy Failed' },
  form_submission: { icon: '☐', color: '#2563eb', label: 'Form Submission' },
  team_invite: { icon: '👥', color: '#7c3aed', label: 'Team Invite' },
  team_removed: { icon: '—', color: '#ea580c', label: 'Team Update' },
  comment_mention: { icon: '@', color: '#2563eb', label: 'Mention' },
  backup_complete: { icon: '◉', color: '#0891b2', label: 'Backup' },
  domain_verified: { icon: '◇', color: '#16a34a', label: 'Domain' },
  usage_warning: { icon: '⚠', color: '#d97706', label: 'Usage' },
  system: { icon: 'ℹ', color: '#64748b', label: 'System' },
};

export function NotificationBell() {
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const fetchCount = useCallback(async () => {
    try {
      const res = await fetch('/api/notifications/count', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` },
      });
      if (res.ok) {
        const data = await res.json();
        setCount(data.count);
      }
    } catch {}
  }, []);

  useEffect(() => {
    fetchCount();
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, [fetchCount]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function loadNotifications() {
    setLoading(true);
    try {
      const res = await fetch('/api/notifications', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` },
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch {}
    setLoading(false);
  }

  function toggleOpen() {
    setOpen(!open);
    if (!open) loadNotifications();
  }

  async function markRead(id: string) {
    try {
      await fetch(`/api/notifications/${id}/read`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` },
      });
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
      setCount((c) => Math.max(0, c - 1));
    } catch {}
  }

  async function markAllRead() {
    try {
      await fetch('/api/notifications/read-all', {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` },
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setCount(0);
    } catch {}
  }

  function formatTime(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={toggleOpen} style={bellBtn}>
        <span style={{ fontSize: '1rem' }}>◎</span>
        {count > 0 && <span style={badge}>{count > 99 ? '99+' : count}</span>}
      </button>

      {open && (
        <div style={popoverStyle}>
          <div style={popoverHeader}>
            <h3 style={popoverTitle}>Notifications</h3>
            {count > 0 && (
              <button onClick={markAllRead} style={markAllBtn}>Mark all read</button>
            )}
          </div>

          <div style={listStyle}>
            {loading ? (
              <div style={emptyStyle}>Loading...</div>
            ) : notifications.length === 0 ? (
              <div style={emptyStyle}>No notifications</div>
            ) : (
              notifications.map((n) => {
                const config = TYPE_CONFIG[n.type] || TYPE_CONFIG.system;
                const message = (n.payload.message as string) || config.label;
                return (
                  <div
                    key={n.id}
                    style={{
                      ...itemStyle,
                      background: n.read ? 'transparent' : '#f0f9ff',
                    }}
                    onClick={() => !n.read && markRead(n.id)}
                  >
                    <span style={{ ...iconStyle, background: `${config.color}15`, color: config.color }}>
                      {config.icon}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={messageStyle}>{message}</div>
                      <div style={timeStyle}>{formatTime(n.createdAt)}</div>
                    </div>
                    {!n.read && <span style={unreadDot} />}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const bellBtn: React.CSSProperties = {
  position: 'relative', width: 36, height: 36, borderRadius: 8, border: '1px solid #e2e8f0',
  background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
};
const badge: React.CSSProperties = {
  position: 'absolute', top: -4, right: -4, minWidth: 16, height: 16, borderRadius: 8,
  background: '#dc2626', color: '#fff', fontSize: '0.55rem', fontWeight: 700,
  display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px',
};
const popoverStyle: React.CSSProperties = {
  position: 'absolute', top: '100%', right: 0, marginTop: 8, width: 360,
  background: '#fff', borderRadius: 14, border: '1px solid #e2e8f0',
  boxShadow: '0 12px 40px rgba(0,0,0,0.12)', overflow: 'hidden', zIndex: 100,
};
const popoverHeader: React.CSSProperties = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  padding: '14px 16px 10px', borderBottom: '1px solid #f1f5f9',
};
const popoverTitle: React.CSSProperties = { margin: 0, fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' };
const markAllBtn: React.CSSProperties = {
  border: 'none', background: 'none', color: '#2563eb', fontSize: '0.75rem',
  fontWeight: 600, cursor: 'pointer',
};
const listStyle: React.CSSProperties = { maxHeight: 400, overflow: 'auto' };
const emptyStyle: React.CSSProperties = { padding: '24px 16px', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' };
const itemStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 16px',
  cursor: 'pointer', transition: 'background 0.1s', borderBottom: '1px solid #f8fafc',
};
const iconStyle: React.CSSProperties = {
  width: 28, height: 28, borderRadius: 6, display: 'flex',
  alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, flexShrink: 0,
};
const messageStyle: React.CSSProperties = {
  fontSize: '0.8rem', color: '#1e293b', fontWeight: 500,
  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
};
const timeStyle: React.CSSProperties = { fontSize: '0.7rem', color: '#94a3b8', marginTop: 2 };
const unreadDot: React.CSSProperties = {
  width: 6, height: 6, borderRadius: 3, background: '#2563eb', flexShrink: 0, marginTop: 6,
};
