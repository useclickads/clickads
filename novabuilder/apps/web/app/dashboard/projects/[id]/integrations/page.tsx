'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ProtectedRoute } from '../../../../../components/protected-route';
import { useApi } from '../../../../../lib/use-api';

type Integration = {
  id: string;
  provider: string;
  config: Record<string, unknown>;
  createdAt: string;
};

const PROVIDERS = [
  { value: 'slack', label: 'Slack', icon: '#', description: 'Send notifications to a Slack channel' },
  { value: 'discord', label: 'Discord', icon: '#', description: 'Send notifications to a Discord channel' },
  { value: 'zapier', label: 'Zapier', icon: '#', description: 'Trigger Zapier workflows' },
  { value: 'custom_webhook', label: 'Custom Webhook', icon: '#', description: 'Send events to any HTTP endpoint' },
] as const;

const EVENTS = [
  'page.published', 'page.updated', 'deployment.created',
  'form.submitted', 'collaborator.invited', 'entry.created', '*',
];

export default function IntegrationsPage() {
  return <ProtectedRoute><IntegrationsContent /></ProtectedRoute>;
}

function IntegrationsContent() {
  const { id: projectId } = useParams<{ id: string }>();
  const api = useApi();
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await api.get<Integration[]>(`/projects/${projectId}/integrations`);
      setIntegrations(data);
    } catch {}
    setLoading(false);
  }, [api, projectId]);

  useEffect(() => { load(); }, [load]);

  const testIntegration = async (id: string) => {
    try {
      const result = await api.post<{ status: string }>(`/projects/${projectId}/integrations/${id}/test`, {});
      alert(result.status === 'ok' ? 'Test sent successfully!' : 'Test failed.');
    } catch { alert('Test failed.'); }
  };

  const removeIntegration = async (id: string) => {
    await api.delete(`/projects/${projectId}/integrations/${id}`);
    load();
  };

  return (
    <div style={container}>
      <nav style={navStyle}>
        <Link href="/dashboard" style={linkStyle}>Dashboard</Link>
        <span style={muted}>/</span>
        <Link href={`/dashboard/projects/${projectId}`} style={linkStyle}>Project</Link>
        <span style={muted}>/</span>
        <span style={{ color: '#0f172a', fontWeight: 600 }}>Integrations</span>
      </nav>

      <header style={headerStyle}>
        <h1 style={titleStyle}>Integrations</h1>
        <button onClick={() => setShowAdd(true)} style={primaryBtn}>Add Integration</button>
      </header>

      {showAdd && (
        <AddIntegrationForm
          api={api}
          projectId={projectId}
          onAdded={() => { setShowAdd(false); load(); }}
          onCancel={() => setShowAdd(false)}
        />
      )}

      {loading ? <p style={muted}>Loading...</p> : integrations.length === 0 ? (
        <div style={emptyState}>
          <p style={{ margin: 0, fontWeight: 600 }}>No integrations configured</p>
          <p style={muted}>Connect Slack, Discord, Zapier, or custom webhooks to get notified about project events.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 12, marginTop: 16 }}>
          {integrations.map((int) => {
            const provider = PROVIDERS.find((p) => p.value === int.provider);
            const config = int.config as any;
            return (
              <div key={int.id} style={card}>
                <div style={{ flex: 1 }}>
                  <p style={cardTitle}>{provider?.label || int.provider}</p>
                  <p style={cardMeta}>
                    {config.webhookUrl || config.url || 'Configured'} — {(config.events || []).length} events
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => testIntegration(int.id)} style={smallBtn}>Test</button>
                  <button onClick={() => removeIntegration(int.id)} style={dangerBtn}>Remove</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function AddIntegrationForm({ api, projectId, onAdded, onCancel }: { api: any; projectId: string; onAdded: () => void; onCancel: () => void }) {
  const [provider, setProvider] = useState<string>('slack');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [channel, setChannel] = useState('');
  const [selectedEvents, setSelectedEvents] = useState<string[]>(['*']);

  const toggleEvent = (event: string) => {
    setSelectedEvents((prev) =>
      prev.includes(event) ? prev.filter((e) => e !== event) : [...prev, event],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!webhookUrl) return;

    const config: Record<string, unknown> = { events: selectedEvents };
    if (provider === 'custom_webhook') {
      config.url = webhookUrl;
    } else {
      config.webhookUrl = webhookUrl;
    }
    if (provider === 'slack' && channel) {
      config.channel = channel;
    }

    await api.post(`/projects/${projectId}/integrations`, { provider, config });
    onAdded();
  };

  return (
    <form onSubmit={handleSubmit} style={formCard}>
      <h3 style={{ margin: 0, fontSize: '0.95rem', color: '#0f172a' }}>Add Integration</h3>

      <label style={labelStyle}>
        Provider
        <select value={provider} onChange={(e) => setProvider(e.target.value)} style={inputStyle}>
          {PROVIDERS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
        </select>
      </label>

      <label style={labelStyle}>
        Webhook URL
        <input type="url" value={webhookUrl} onChange={(e) => setWebhookUrl(e.target.value)} required style={inputStyle} placeholder="https://hooks.slack.com/services/..." />
      </label>

      {provider === 'slack' && (
        <label style={labelStyle}>
          Channel (optional)
          <input type="text" value={channel} onChange={(e) => setChannel(e.target.value)} style={inputStyle} placeholder="#general" />
        </label>
      )}

      <div>
        <p style={{ ...labelStyle, marginBottom: 6 }}>Events</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {EVENTS.map((event) => (
            <button
              key={event}
              type="button"
              onClick={() => toggleEvent(event)}
              style={{
                ...chipStyle,
                background: selectedEvents.includes(event) ? '#0f172a' : '#f1f5f9',
                color: selectedEvents.includes(event) ? '#fff' : '#475569',
              }}
            >
              {event === '*' ? 'All Events' : event}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <button type="submit" style={primaryBtn}>Add</button>
        <button type="button" onClick={onCancel} style={smallBtn}>Cancel</button>
      </div>
    </form>
  );
}

const container: React.CSSProperties = { maxWidth: 900, margin: '0 auto', padding: '40px 24px' };
const navStyle: React.CSSProperties = { display: 'flex', gap: 8, alignItems: 'center', fontSize: '0.9rem' };
const linkStyle: React.CSSProperties = { color: '#2563eb', textDecoration: 'none', fontWeight: 600 };
const muted: React.CSSProperties = { color: '#64748b', fontSize: '0.9rem' };
const headerStyle: React.CSSProperties = { marginTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const titleStyle: React.CSSProperties = { fontSize: '1.5rem', margin: 0, color: '#0f172a', fontWeight: 800 };
const primaryBtn: React.CSSProperties = { padding: '10px 18px', borderRadius: 10, border: 'none', background: '#0f172a', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' };
const emptyState: React.CSSProperties = { marginTop: 24, padding: 40, textAlign: 'center', borderRadius: 16, background: '#f8fafc', border: '1px solid #e2e8f0' };
const card: React.CSSProperties = { padding: 16, borderRadius: 12, background: '#fff', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const cardTitle: React.CSSProperties = { margin: 0, fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' };
const cardMeta: React.CSSProperties = { margin: '2px 0 0', fontSize: '0.8rem', color: '#64748b' };
const smallBtn: React.CSSProperties = { padding: '6px 14px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', color: '#475569', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' };
const dangerBtn: React.CSSProperties = { padding: '6px 14px', borderRadius: 8, border: '1px solid #fecaca', background: '#fff', color: '#dc2626', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' };
const formCard: React.CSSProperties = { marginTop: 16, padding: 20, borderRadius: 14, background: '#f8fafc', border: '1px solid #e2e8f0', display: 'grid', gap: 14 };
const labelStyle: React.CSSProperties = { display: 'grid', gap: 4, fontSize: '0.8rem', fontWeight: 600, color: '#334155' };
const inputStyle: React.CSSProperties = { padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '0.85rem' };
const chipStyle: React.CSSProperties = { padding: '4px 10px', borderRadius: 6, border: 'none', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' };
