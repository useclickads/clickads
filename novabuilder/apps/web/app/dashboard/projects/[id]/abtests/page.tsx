'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ProtectedRoute } from '../../../../../components/protected-route';
import { useApi } from '../../../../../lib/use-api';

type ABTest = {
  id: string;
  name: string;
  pageId: string;
  status: string;
  variants: { id: string; name: string; weight: number }[];
  startedAt: string | null;
  endedAt: string | null;
  createdAt: string;
};

type TestResults = {
  test: ABTest;
  stats: { variantId: string; variantName: string; views: number; conversions: number; conversionRate: number }[];
  totalViews: number;
};

export default function ABTestsPage() {
  return (
    <ProtectedRoute>
      <ABTestsContent />
    </ProtectedRoute>
  );
}

function ABTestsContent() {
  const { id: projectId } = useParams<{ id: string }>();
  const api = useApi();
  const [tests, setTests] = useState<ABTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedResults, setSelectedResults] = useState<TestResults | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await api.get<ABTest[]>(`/projects/${projectId}/abtests`);
      setTests(data);
    } catch {}
    setLoading(false);
  }, [api, projectId]);

  useEffect(() => { load(); }, [load]);

  const viewResults = async (testId: string) => {
    try {
      const data = await api.get<TestResults>(`/projects/${projectId}/abtests/${testId}/results`);
      setSelectedResults(data);
    } catch {}
  };

  const toggleTest = async (test: ABTest) => {
    const action = test.status === 'running' ? 'stop' : 'start';
    await api.post(`/projects/${projectId}/abtests/${test.id}/${action}`, {});
    load();
  };

  const deleteTest = async (testId: string) => {
    await api.delete(`/projects/${projectId}/abtests/${testId}`);
    load();
  };

  return (
    <div style={container}>
      <nav style={navStyle}>
        <Link href="/dashboard" style={linkStyle}>Dashboard</Link>
        <span style={muted}>/</span>
        <Link href={`/dashboard/projects/${projectId}`} style={linkStyle}>Project</Link>
        <span style={muted}>/</span>
        <span style={{ color: '#0f172a', fontWeight: 600 }}>A/B Tests</span>
      </nav>

      <header style={headerStyle}>
        <h1 style={titleStyle}>A/B Testing</h1>
        <button onClick={() => setShowCreate(true)} style={primaryBtn}>New Test</button>
      </header>

      {showCreate && <CreateTestForm api={api} projectId={projectId} onCreated={() => { setShowCreate(false); load(); }} onCancel={() => setShowCreate(false)} />}

      {loading ? <p style={muted}>Loading...</p> : tests.length === 0 ? (
        <div style={emptyState}><p style={{ margin: 0, fontWeight: 600 }}>No A/B tests yet</p><p style={muted}>Create a test to compare page variants.</p></div>
      ) : (
        <div style={{ display: 'grid', gap: 12, marginTop: 16 }}>
          {tests.map((test) => (
            <div key={test.id} style={testCard}>
              <div style={{ flex: 1 }}>
                <p style={testName}>{test.name}</p>
                <p style={testMeta}>{test.variants.length} variants — {test.status}</p>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => viewResults(test.id)} style={smallBtn}>Results</button>
                <button onClick={() => toggleTest(test)} style={test.status === 'running' ? stopBtn : startBtn}>
                  {test.status === 'running' ? 'Stop' : 'Start'}
                </button>
                {test.status !== 'running' && <button onClick={() => deleteTest(test.id)} style={dangerSmallBtn}>Delete</button>}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedResults && (
        <div style={{ marginTop: 24 }}>
          <h3 style={{ margin: '0 0 12px', fontSize: '1rem', color: '#0f172a' }}>Results: {selectedResults.test.name}</h3>
          <p style={muted}>{selectedResults.totalViews} total views</p>
          <div style={{ display: 'grid', gap: 8, marginTop: 12 }}>
            {selectedResults.stats.map((s) => (
              <div key={s.variantId} style={resultRow}>
                <span style={resultName}>{s.variantName}</span>
                <span style={resultStat}>{s.views} views</span>
                <span style={resultStat}>{s.conversions} conversions</span>
                <span style={resultRate}>{s.conversionRate}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CreateTestForm({ api, projectId, onCreated, onCancel }: { api: any; projectId: string; onCreated: () => void; onCancel: () => void }) {
  const [name, setName] = useState('');
  const [pageId, setPageId] = useState('');
  const [variantA, setVariantA] = useState('Control');
  const [variantB, setVariantB] = useState('Variant B');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !pageId) return;
    await api.post(`/projects/${projectId}/abtests`, {
      name,
      pageId,
      variants: [
        { id: 'a', name: variantA, content: null, weight: 50 },
        { id: 'b', name: variantB, content: null, weight: 50 },
      ],
    });
    onCreated();
  };

  return (
    <form onSubmit={handleSubmit} style={formCard}>
      <h3 style={{ margin: 0, fontSize: '0.95rem', color: '#0f172a' }}>Create A/B Test</h3>
      <label style={labelStyle}>Test Name<input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={inputStyle} placeholder="Homepage CTA test" /></label>
      <label style={labelStyle}>Page ID<input type="text" value={pageId} onChange={(e) => setPageId(e.target.value)} required style={inputStyle} placeholder="Paste the page ID" /></label>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <label style={labelStyle}>Variant A Name<input type="text" value={variantA} onChange={(e) => setVariantA(e.target.value)} style={inputStyle} /></label>
        <label style={labelStyle}>Variant B Name<input type="text" value={variantB} onChange={(e) => setVariantB(e.target.value)} style={inputStyle} /></label>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="submit" style={primaryBtn}>Create Test</button>
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
const testCard: React.CSSProperties = { padding: 16, borderRadius: 12, background: '#fff', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const testName: React.CSSProperties = { margin: 0, fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' };
const testMeta: React.CSSProperties = { margin: '2px 0 0', fontSize: '0.8rem', color: '#64748b' };
const smallBtn: React.CSSProperties = { padding: '6px 14px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', color: '#475569', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' };
const startBtn: React.CSSProperties = { padding: '6px 14px', borderRadius: 8, border: 'none', background: '#16a34a', color: '#fff', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' };
const stopBtn: React.CSSProperties = { padding: '6px 14px', borderRadius: 8, border: 'none', background: '#f59e0b', color: '#fff', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' };
const dangerSmallBtn: React.CSSProperties = { padding: '6px 14px', borderRadius: 8, border: '1px solid #fecaca', background: '#fff', color: '#dc2626', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' };
const formCard: React.CSSProperties = { marginTop: 16, padding: 20, borderRadius: 14, background: '#f8fafc', border: '1px solid #e2e8f0', display: 'grid', gap: 14 };
const labelStyle: React.CSSProperties = { display: 'grid', gap: 4, fontSize: '0.8rem', fontWeight: 600, color: '#334155' };
const inputStyle: React.CSSProperties = { padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '0.85rem' };
const resultRow: React.CSSProperties = { display: 'grid', gridTemplateColumns: '150px 1fr 1fr 80px', gap: 12, padding: '10px 14px', borderRadius: 8, background: '#fff', border: '1px solid #e2e8f0', alignItems: 'center' };
const resultName: React.CSSProperties = { fontWeight: 700, fontSize: '0.85rem', color: '#0f172a' };
const resultStat: React.CSSProperties = { fontSize: '0.8rem', color: '#475569' };
const resultRate: React.CSSProperties = { fontSize: '0.85rem', fontWeight: 700, color: '#2563eb', textAlign: 'right' };
