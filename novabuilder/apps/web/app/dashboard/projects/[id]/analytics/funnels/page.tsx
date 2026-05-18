'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ProtectedRoute } from '../../../../../../components/protected-route';
import { useApi } from '../../../../../../lib/use-api';

type Funnel = {
  id: string;
  steps: { name: string; eventType: string }[];
  results: any;
  createdAt: string;
};

type FunnelResult = {
  funnel: Funnel;
  stepResults: { name: string; count: number; dropoff: number }[];
  conversionRate: number;
  computedAt: string;
};

export default function FunnelsPage() {
  return <ProtectedRoute><FunnelsContent /></ProtectedRoute>;
}

function FunnelsContent() {
  const { id: projectId } = useParams<{ id: string }>();
  const api = useApi();
  const [funnels, setFunnels] = useState<Funnel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedResult, setSelectedResult] = useState<FunnelResult | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await api.get<Funnel[]>(`/projects/${projectId}/analytics/funnels`);
      setFunnels(data);
    } catch {}
    setLoading(false);
  }, [api, projectId]);

  useEffect(() => { load(); }, [load]);

  const computeFunnel = async (funnelId: string) => {
    try {
      const result = await api.get<FunnelResult>(`/projects/${projectId}/analytics/funnels/${funnelId}/compute`);
      setSelectedResult(result);
    } catch {}
  };

  const deleteFunnel = async (funnelId: string) => {
    await api.delete(`/projects/${projectId}/analytics/funnels/${funnelId}`);
    setSelectedResult(null);
    load();
  };

  return (
    <div style={container}>
      <nav style={navStyle}>
        <Link href="/dashboard" style={linkStyle}>Dashboard</Link>
        <span style={muted}>/</span>
        <Link href={`/dashboard/projects/${projectId}`} style={linkStyle}>Project</Link>
        <span style={muted}>/</span>
        <Link href={`/dashboard/projects/${projectId}/analytics`} style={linkStyle}>Analytics</Link>
        <span style={muted}>/</span>
        <span style={{ color: '#0f172a', fontWeight: 600 }}>Funnels</span>
      </nav>

      <header style={headerRow}>
        <h1 style={titleStyle}>Funnel Tracking</h1>
        <button onClick={() => setShowCreate(true)} style={primaryBtn}>New Funnel</button>
      </header>

      {showCreate && (
        <CreateFunnelForm
          api={api}
          projectId={projectId}
          onCreated={() => { setShowCreate(false); load(); }}
          onCancel={() => setShowCreate(false)}
        />
      )}

      {loading ? <p style={muted}>Loading...</p> : funnels.length === 0 ? (
        <div style={emptyState}>
          <p style={{ margin: 0, fontWeight: 600 }}>No funnels yet</p>
          <p style={muted}>Create a funnel to track user journeys through your site.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 12, marginTop: 16 }}>
          {funnels.map((funnel) => (
            <div key={funnel.id} style={card}>
              <div style={{ flex: 1 }}>
                <p style={cardTitle}>{funnel.steps.length}-step funnel</p>
                <p style={cardMeta}>{funnel.steps.map((s) => s.name).join(' -> ')}</p>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => computeFunnel(funnel.id)} style={smallBtn}>Compute</button>
                <button onClick={() => deleteFunnel(funnel.id)} style={dangerBtn}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedResult && (
        <div style={{ marginTop: 24 }}>
          <h3 style={sectionTitle}>Funnel Results</h3>
          <p style={{ ...muted, marginBottom: 16 }}>
            Overall conversion: <strong style={{ color: '#2563eb' }}>{selectedResult.conversionRate}%</strong>
          </p>

          <div style={{ display: 'grid', gap: 8 }}>
            {selectedResult.stepResults.map((step, i) => {
              const maxCount = selectedResult.stepResults[0]?.count || 1;
              const pct = maxCount > 0 ? (step.count / maxCount) * 100 : 0;
              return (
                <div key={i} style={stepRow}>
                  <div style={stepNum}>{i + 1}</div>
                  <div style={{ flex: 1 }}>
                    <p style={stepName}>{step.name}</p>
                    <div style={barTrack}>
                      <div style={{ ...barFill, width: `${Math.max(pct, 2)}%` }} />
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', minWidth: 80 }}>
                    <p style={stepCount}>{step.count}</p>
                    {i > 0 && <p style={dropoff}>{step.dropoff}% drop</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function CreateFunnelForm({ api, projectId, onCreated, onCancel }: { api: any; projectId: string; onCreated: () => void; onCancel: () => void }) {
  const [name, setName] = useState('');
  const [steps, setSteps] = useState([
    { name: 'Visit', eventType: 'page_view' },
    { name: 'Signup', eventType: 'signup' },
  ]);

  const addStep = () => setSteps([...steps, { name: '', eventType: '' }]);
  const removeStep = (i: number) => setSteps(steps.filter((_, j) => j !== i));
  const updateStep = (i: number, field: 'name' | 'eventType', value: string) => {
    const next = [...steps];
    next[i] = { ...next[i], [field]: value };
    setSteps(next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || steps.some((s) => !s.name || !s.eventType)) return;
    await api.post(`/projects/${projectId}/analytics/funnels`, { name, steps });
    onCreated();
  };

  return (
    <form onSubmit={handleSubmit} style={formCard}>
      <h3 style={{ margin: 0, fontSize: '0.95rem', color: '#0f172a' }}>Create Funnel</h3>
      <label style={labelStyle}>
        Funnel Name
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={inputStyle} placeholder="Signup funnel" />
      </label>

      <div>
        <p style={{ ...labelStyle, marginBottom: 8 }}>Steps</p>
        {steps.map((step, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 8, marginBottom: 8 }}>
            <input
              type="text" value={step.name} placeholder="Step name"
              onChange={(e) => updateStep(i, 'name', e.target.value)}
              style={inputStyle}
            />
            <input
              type="text" value={step.eventType} placeholder="Event type (e.g. page_view)"
              onChange={(e) => updateStep(i, 'eventType', e.target.value)}
              style={inputStyle}
            />
            {steps.length > 2 && (
              <button type="button" onClick={() => removeStep(i)} style={{ ...dangerBtn, padding: '6px 10px' }}>X</button>
            )}
          </div>
        ))}
        <button type="button" onClick={addStep} style={smallBtn}>+ Add Step</button>
      </div>

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
const dangerBtn: React.CSSProperties = { padding: '6px 14px', borderRadius: 8, border: '1px solid #fecaca', background: '#fff', color: '#dc2626', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' };
const sectionTitle: React.CSSProperties = { fontSize: '1rem', margin: '0 0 8px', color: '#0f172a', fontWeight: 700 };
const stepRow: React.CSSProperties = { display: 'flex', gap: 12, padding: '12px 14px', borderRadius: 10, background: '#fff', border: '1px solid #e2e8f0', alignItems: 'center' };
const stepNum: React.CSSProperties = { width: 28, height: 28, borderRadius: '50%', background: '#2563eb', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 };
const stepName: React.CSSProperties = { margin: '0 0 6px', fontWeight: 600, fontSize: '0.85rem', color: '#0f172a' };
const stepCount: React.CSSProperties = { margin: 0, fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' };
const dropoff: React.CSSProperties = { margin: '2px 0 0', fontSize: '0.7rem', color: '#dc2626', fontWeight: 600 };
const barTrack: React.CSSProperties = { height: 6, background: '#f1f5f9', borderRadius: 3, overflow: 'hidden' };
const barFill: React.CSSProperties = { height: '100%', background: 'linear-gradient(90deg, #2563eb, #1e40af)', borderRadius: 3, transition: 'width 0.3s' };
const formCard: React.CSSProperties = { marginTop: 16, padding: 20, borderRadius: 14, background: '#f8fafc', border: '1px solid #e2e8f0', display: 'grid', gap: 14 };
const labelStyle: React.CSSProperties = { display: 'grid', gap: 4, fontSize: '0.8rem', fontWeight: 600, color: '#334155' };
const inputStyle: React.CSSProperties = { padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '0.85rem' };
