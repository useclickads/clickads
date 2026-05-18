'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ProtectedRoute } from '../../../../../components/protected-route';
import { useApi } from '../../../../../lib/use-api';

type Workflow = {
  id: string;
  name: string;
  trigger: string;
  steps: { action: string; config: Record<string, unknown> }[];
  enabled: boolean;
  executionCount: number;
  lastExecutedAt: string | null;
};

const TRIGGERS = [
  { value: 'form.submitted', label: 'Form Submitted' },
  { value: 'page.published', label: 'Page Published' },
  { value: 'deployment.created', label: 'Deployment Created' },
  { value: 'entry.created', label: 'CMS Entry Created' },
  { value: 'collaborator.invited', label: 'Collaborator Invited' },
];

const ACTIONS = [
  { value: 'send_webhook', label: 'Send Webhook' },
  { value: 'send_email', label: 'Send Email' },
  { value: 'create_notification', label: 'Create Notification' },
  { value: 'log_audit', label: 'Log to Audit' },
];

export default function WorkflowsPage() {
  return <ProtectedRoute><WorkflowsContent /></ProtectedRoute>;
}

function WorkflowsContent() {
  const { id: projectId } = useParams<{ id: string }>();
  const api = useApi();
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await api.get<Workflow[]>(`/projects/${projectId}/workflows`);
      setWorkflows(data);
    } catch {}
    setLoading(false);
  }, [api, projectId]);

  useEffect(() => { load(); }, [load]);

  const toggleWorkflow = async (wf: Workflow) => {
    await api.patch(`/projects/${projectId}/workflows/${wf.id}`, { enabled: !wf.enabled });
    load();
  };

  const deleteWorkflow = async (id: string) => {
    await api.delete(`/projects/${projectId}/workflows/${id}`);
    load();
  };

  return (
    <div style={container}>
      <nav style={navStyle}>
        <Link href="/dashboard" style={linkStyle}>Dashboard</Link>
        <span style={muted}>/</span>
        <Link href={`/dashboard/projects/${projectId}`} style={linkStyle}>Project</Link>
        <span style={muted}>/</span>
        <span style={{ color: '#0f172a', fontWeight: 600 }}>Workflows</span>
      </nav>

      <header style={headerRow}>
        <h1 style={titleStyle}>Workflow Automation</h1>
        <button onClick={() => setShowCreate(true)} style={primaryBtn}>New Workflow</button>
      </header>

      {showCreate && (
        <CreateWorkflowForm
          api={api}
          projectId={projectId}
          onCreated={() => { setShowCreate(false); load(); }}
          onCancel={() => setShowCreate(false)}
        />
      )}

      {loading ? <p style={muted}>Loading...</p> : workflows.length === 0 ? (
        <div style={emptyState}>
          <p style={{ margin: 0, fontWeight: 600 }}>No workflows yet</p>
          <p style={muted}>Automate actions when events happen in your project.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 12, marginTop: 16 }}>
          {workflows.map((wf) => (
            <div key={wf.id} style={{ ...card, opacity: wf.enabled ? 1 : 0.6 }}>
              <div style={{ flex: 1 }}>
                <p style={cardTitle}>{wf.name}</p>
                <p style={cardMeta}>
                  Trigger: {wf.trigger} — {wf.steps.length} steps — Ran {wf.executionCount}x
                </p>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => toggleWorkflow(wf)} style={wf.enabled ? stopBtn : startBtn}>
                  {wf.enabled ? 'Disable' : 'Enable'}
                </button>
                <button onClick={() => deleteWorkflow(wf.id)} style={dangerBtn}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CreateWorkflowForm({ api, projectId, onCreated, onCancel }: { api: any; projectId: string; onCreated: () => void; onCancel: () => void }) {
  const [name, setName] = useState('');
  const [trigger, setTrigger] = useState('form.submitted');
  const [steps, setSteps] = useState<{ action: string; config: Record<string, string> }[]>([{ action: 'send_webhook', config: { url: '' } }]);

  const updateStep = (i: number, field: string, value: string) => {
    const next = [...steps];
    if (field === 'action') {
      next[i] = { action: value, config: {} };
    } else {
      next[i] = { ...next[i], config: { ...next[i].config, [field]: value } };
    }
    setSteps(next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    await api.post(`/projects/${projectId}/workflows`, { name, trigger, steps });
    onCreated();
  };

  return (
    <form onSubmit={handleSubmit} style={formCard}>
      <h3 style={{ margin: 0, fontSize: '0.95rem', color: '#0f172a' }}>Create Workflow</h3>
      <label style={labelStyle}>
        Name
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={inputStyle} placeholder="Notify on form submit" />
      </label>
      <label style={labelStyle}>
        Trigger
        <select value={trigger} onChange={(e) => setTrigger(e.target.value)} style={inputStyle}>
          {TRIGGERS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
      </label>

      {steps.map((step, i) => (
        <div key={i} style={{ display: 'grid', gap: 8, padding: 12, background: '#fff', borderRadius: 8, border: '1px solid #e2e8f0' }}>
          <label style={labelStyle}>
            Action
            <select value={step.action} onChange={(e) => updateStep(i, 'action', e.target.value)} style={inputStyle}>
              {ACTIONS.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
            </select>
          </label>
          {step.action === 'send_webhook' && (
            <label style={labelStyle}>
              Webhook URL
              <input type="url" value={(step.config.url as string) || ''} onChange={(e) => updateStep(i, 'url', e.target.value)} style={inputStyle} placeholder="https://..." />
            </label>
          )}
        </div>
      ))}

      <button type="button" onClick={() => setSteps([...steps, { action: 'send_webhook', config: {} }])} style={smallBtn}>+ Add Step</button>

      <div style={{ display: 'flex', gap: 8 }}>
        <button type="submit" style={primaryBtn}>Create</button>
        <button type="button" onClick={onCancel} style={smallBtn}>Cancel</button>
      </div>
    </form>
  );
}

const container: React.CSSProperties = { maxWidth: 900, margin: '0 auto', padding: '40px 24px' };
const navStyle: React.CSSProperties = { display: 'flex', gap: 8, alignItems: 'center', fontSize: '0.9rem' };
const linkStyle: React.CSSProperties = { color: '#2563eb', textDecoration: 'none', fontWeight: 600 };
const muted: React.CSSProperties = { color: '#64748b', fontSize: '0.9rem' };
const headerRow: React.CSSProperties = { marginTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const titleStyle: React.CSSProperties = { fontSize: '1.5rem', margin: 0, color: '#0f172a', fontWeight: 800 };
const primaryBtn: React.CSSProperties = { padding: '10px 18px', borderRadius: 10, border: 'none', background: '#0f172a', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' };
const emptyState: React.CSSProperties = { marginTop: 24, padding: 40, textAlign: 'center', borderRadius: 16, background: '#f8fafc', border: '1px solid #e2e8f0' };
const card: React.CSSProperties = { padding: 16, borderRadius: 12, background: '#fff', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const cardTitle: React.CSSProperties = { margin: 0, fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' };
const cardMeta: React.CSSProperties = { margin: '2px 0 0', fontSize: '0.8rem', color: '#64748b' };
const smallBtn: React.CSSProperties = { padding: '6px 14px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', color: '#475569', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' };
const startBtn: React.CSSProperties = { padding: '6px 14px', borderRadius: 8, border: 'none', background: '#16a34a', color: '#fff', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' };
const stopBtn: React.CSSProperties = { padding: '6px 14px', borderRadius: 8, border: 'none', background: '#f59e0b', color: '#fff', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' };
const dangerBtn: React.CSSProperties = { padding: '6px 14px', borderRadius: 8, border: '1px solid #fecaca', background: '#fff', color: '#dc2626', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' };
const formCard: React.CSSProperties = { marginTop: 16, padding: 20, borderRadius: 14, background: '#f8fafc', border: '1px solid #e2e8f0', display: 'grid', gap: 14 };
const labelStyle: React.CSSProperties = { display: 'grid', gap: 4, fontSize: '0.8rem', fontWeight: 600, color: '#334155' };
const inputStyle: React.CSSProperties = { padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '0.85rem' };
