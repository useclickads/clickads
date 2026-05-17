'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ProtectedRoute } from '../../../../../components/protected-route';
import { useApi } from '../../../../../lib/use-api';

type Webhook = {
  id: string;
  url: string;
  events: string[];
  createdAt: string;
};

const AVAILABLE_EVENTS = ['page.published', 'page.updated', 'deployment.created', 'form.submitted', 'collaborator.invited', 'entry.created'];

export default function WebhooksPage() {
  return (
    <ProtectedRoute>
      <WebhooksManagement />
    </ProtectedRoute>
  );
}

function WebhooksManagement() {
  const { id } = useParams<{ id: string }>();
  const api = useApi();
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await api.get<Webhook[]>(`/projects/${id}/webhooks`);
      setWebhooks(data);
    } catch {}
    setLoading(false);
  }, [api, id]);

  useEffect(() => { load(); }, [load]);

  async function handleRemove(webhookId: string) {
    if (!confirm('Remove this webhook?')) return;
    try {
      await api.delete(`/projects/${id}/webhooks/${webhookId}`);
      load();
    } catch {}
  }

  async function handleTest() {
    try {
      const res = await api.post<{ results: { webhookId: string; status: number | null }[] }>(`/projects/${id}/webhooks/test`, { event: 'test' });
      alert(`Sent test to ${res.results.length} webhook(s).`);
    } catch {}
  }

  if (loading) return <div style={containerStyle}><p style={muted}>Loading...</p></div>;

  return (
    <div style={containerStyle}>
      <nav style={navStyle}>
        <Link href="/dashboard" style={linkStyle}>Dashboard</Link>
        <span style={muted}>/</span>
        <Link href={`/dashboard/projects/${id}`} style={linkStyle}>Project</Link>
        <span style={muted}>/</span>
        <span style={{ color: '#0f172a', fontWeight: 600 }}>Webhooks</span>
      </nav>

      <header style={headerStyle}>
        <div>
          <h1 style={titleStyle}>Webhooks</h1>
          <p style={muted}>Receive HTTP callbacks when events happen in your project.</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {webhooks.length > 0 && <button onClick={handleTest} style={secondaryBtn}>Test All</button>}
          <button onClick={() => setShowAdd(true)} style={primaryBtn}>Add Webhook</button>
        </div>
      </header>

      {showAdd && (
        <AddWebhookForm api={api} projectId={id} onAdded={() => { setShowAdd(false); load(); }} onCancel={() => setShowAdd(false)} />
      )}

      {webhooks.length === 0 ? (
        <div style={emptyState}>
          <p style={{ margin: 0, fontWeight: 600 }}>No webhooks configured</p>
          <p style={muted}>Add a webhook to receive event notifications via HTTP.</p>
        </div>
      ) : (
        <div style={listStyle}>
          {webhooks.map((w) => (
            <div key={w.id} style={rowStyle}>
              <div style={{ flex: 1 }}>
                <p style={urlText}>{w.url}</p>
                <div style={eventsRow}>
                  {w.events.map((e) => <span key={e} style={eventChip}>{e}</span>)}
                </div>
              </div>
              <button onClick={() => handleRemove(w.id)} style={removeBtn}>Remove</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AddWebhookForm({ api, projectId, onAdded, onCancel }: { api: ReturnType<typeof useApi>; projectId: string; onAdded: () => void; onCancel: () => void }) {
  const [url, setUrl] = useState('');
  const [events, setEvents] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function toggleEvent(ev: string) {
    setEvents((prev) => prev.includes(ev) ? prev.filter((e) => e !== ev) : [...prev, ev]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (events.length === 0) { setError('Select at least one event.'); return; }
    setLoading(true);
    setError(null);
    try {
      const res = await api.post<{ error?: string }>(`/projects/${projectId}/webhooks`, { url, events });
      if (res.error) { setError(res.error); setLoading(false); return; }
      onAdded();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed.');
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} style={formCard}>
      <h3 style={{ margin: 0, color: '#0f172a' }}>Add Webhook</h3>
      <label style={labelStyle}>
        Endpoint URL
        <input type="url" required value={url} onChange={(e) => setUrl(e.target.value)} style={inputStyle} placeholder="https://example.com/webhook" />
      </label>
      <div style={labelStyle}>
        Events
        <div style={checkGrid}>
          {AVAILABLE_EVENTS.map((ev) => (
            <label key={ev} style={checkLabel}>
              <input type="checkbox" checked={events.includes(ev)} onChange={() => toggleEvent(ev)} />
              <span>{ev}</span>
            </label>
          ))}
        </div>
      </div>
      {error && <p style={{ margin: 0, color: '#dc2626', fontSize: '0.85rem' }}>{error}</p>}
      <div style={{ display: 'flex', gap: 12 }}>
        <button type="submit" style={primaryBtn} disabled={loading}>{loading ? 'Adding…' : 'Add Webhook'}</button>
        <button type="button" onClick={onCancel} style={cancelBtn}>Cancel</button>
      </div>
    </form>
  );
}

const containerStyle: React.CSSProperties = { maxWidth: 800, margin: '0 auto', padding: '40px 24px' };
const navStyle: React.CSSProperties = { display: 'flex', gap: 8, alignItems: 'center', fontSize: '0.9rem' };
const headerStyle: React.CSSProperties = { marginTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' };
const titleStyle: React.CSSProperties = { fontSize: '1.5rem', margin: 0, color: '#0f172a' };
const primaryBtn: React.CSSProperties = { padding: '10px 18px', borderRadius: 10, border: 'none', background: '#0f172a', color: '#fff', fontWeight: 600, cursor: 'pointer' };
const secondaryBtn: React.CSSProperties = { padding: '10px 16px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', color: '#475569', fontWeight: 600, cursor: 'pointer' };
const cancelBtn: React.CSSProperties = { padding: '10px 16px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontWeight: 600, color: '#475569' };
const removeBtn: React.CSSProperties = { padding: '6px 12px', borderRadius: 8, border: '1px solid #fecaca', background: '#fff', color: '#dc2626', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' };
const muted: React.CSSProperties = { color: '#64748b', fontSize: '0.9rem' };
const linkStyle: React.CSSProperties = { color: '#2563eb', textDecoration: 'none', fontWeight: 600 };
const emptyState: React.CSSProperties = { marginTop: 24, padding: 32, borderRadius: 16, background: '#f8fafc', border: '1px solid #e2e8f0', textAlign: 'center' };
const listStyle: React.CSSProperties = { marginTop: 16, display: 'grid', gap: 8 };
const rowStyle: React.CSSProperties = { padding: 16, borderRadius: 12, background: '#fff', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 16 };
const urlText: React.CSSProperties = { margin: 0, fontWeight: 600, color: '#0f172a', fontSize: '0.9rem', fontFamily: 'monospace' };
const eventsRow: React.CSSProperties = { display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 6 };
const eventChip: React.CSSProperties = { padding: '2px 8px', borderRadius: 4, background: '#f1f5f9', fontSize: '0.7rem', fontWeight: 600, color: '#475569' };
const formCard: React.CSSProperties = { marginTop: 16, padding: 24, borderRadius: 14, background: '#f8fafc', border: '1px solid #e2e8f0', display: 'grid', gap: 14 };
const labelStyle: React.CSSProperties = { display: 'grid', gap: 6, color: '#334155', fontSize: '0.9rem' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #cbd5e1', fontSize: '0.95rem' };
const checkGrid: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 };
const checkLabel: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: '#475569' };
