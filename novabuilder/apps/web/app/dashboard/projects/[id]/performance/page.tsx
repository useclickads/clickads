'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

type PagePerf = {
  pageId: string;
  url: string;
  sampleCount: number;
  avgLcp: number;
  avgCls: number;
  score: number;
};

type Overview = {
  totalSamples: number;
  pageCount: number;
  pages: PagePerf[];
  overallScore: number;
};

type PageDetail = {
  pageId: string;
  metricCount: number;
  summary: {
    lcp: { avg: number; p75: number };
    fid: { avg: number; p75: number };
    cls: { avg: number; p75: number };
    ttfb: { avg: number; p75: number };
    fcp: { avg: number; p75: number };
  } | null;
  coreWebVitals: { lcp: string; fid: string; cls: string } | null;
};

export default function PerformancePage() {
  const { id: projectId } = useParams<{ id: string }>();
  const [overview, setOverview] = useState<Overview | null>(null);
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [detail, setDetail] = useState<PageDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
  const headers: Record<string, string> = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  async function load() {
    const res = await fetch(`${API}/projects/${projectId}/performance/overview`, { headers });
    setOverview(await res.json());
    setLoading(false);
  }

  async function loadDetail(pageId: string) {
    setSelectedPage(pageId);
    const res = await fetch(`${API}/projects/${projectId}/performance/pages/${pageId}`, { headers });
    setDetail(await res.json());
  }

  useEffect(() => { load(); }, [projectId]);

  const scoreColor = (score: number) =>
    score >= 90 ? '#16a34a' : score >= 50 ? '#f59e0b' : '#dc2626';

  const vitalColor = (status: string) =>
    status === 'good' ? '#16a34a' : status === 'needs-improvement' ? '#f59e0b' : '#dc2626';

  const vitalBg = (status: string) =>
    status === 'good' ? '#dcfce7' : status === 'needs-improvement' ? '#fef3c7' : '#fef2f2';

  return (
    <div style={{ padding: 32, maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>Performance</h1>
      <p style={{ color: '#64748b', marginBottom: 24, fontSize: '0.9rem' }}>
        Monitor Core Web Vitals and page load performance.
      </p>

      {loading ? (
        <p style={{ color: '#94a3b8' }}>Loading...</p>
      ) : overview && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 28 }}>
            <div style={statCard}>
              <div style={statLabel}>Overall Score</div>
              <div style={{ ...statValue, color: scoreColor(overview.overallScore) }}>
                {overview.overallScore}
              </div>
            </div>
            <div style={statCard}>
              <div style={statLabel}>Pages Tracked</div>
              <div style={statValue}>{overview.pageCount}</div>
            </div>
            <div style={statCard}>
              <div style={statLabel}>Total Samples</div>
              <div style={statValue}>{overview.totalSamples}</div>
            </div>
          </div>

          {overview.pages.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>
              <p style={{ fontSize: '1rem', fontWeight: 600 }}>No performance data yet</p>
              <p style={{ fontSize: '0.85rem' }}>Add the tracking script to your deployed site to collect metrics.</p>
            </div>
          ) : (
            <>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: 12 }}>Pages</h3>
              <div style={{ display: 'grid', gap: 8 }}>
                {overview.pages.map((page) => (
                  <div
                    key={page.pageId}
                    style={{ ...pageRow, cursor: 'pointer', background: selectedPage === page.pageId ? '#f8fafc' : '#fff' }}
                    onClick={() => loadDetail(page.pageId)}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.9rem' }}>{page.url || page.pageId}</div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: 2 }}>
                        {page.sampleCount} samples | LCP: {page.avgLcp}ms | CLS: {page.avgCls}
                      </div>
                    </div>
                    <div style={{
                      padding: '6px 14px', borderRadius: 20, fontWeight: 800, fontSize: '0.85rem',
                      background: scoreColor(page.score) === '#16a34a' ? '#dcfce7' : scoreColor(page.score) === '#f59e0b' ? '#fef3c7' : '#fef2f2',
                      color: scoreColor(page.score),
                    }}>
                      {page.score}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {selectedPage && detail?.summary && detail.coreWebVitals && (
            <div style={{ marginTop: 24, padding: 20, borderRadius: 14, border: '1px solid #e2e8f0', background: '#fff' }}>
              <h3 style={{ margin: '0 0 16px', fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
                Core Web Vitals
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
                {(['lcp', 'fid', 'cls'] as const).map((metric) => (
                  <div key={metric} style={{
                    padding: 14, borderRadius: 10,
                    background: vitalBg(detail.coreWebVitals![metric]),
                    textAlign: 'center',
                  }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: vitalColor(detail.coreWebVitals![metric]) }}>
                      {metric.toUpperCase()}
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: vitalColor(detail.coreWebVitals![metric]), margin: '4px 0' }}>
                      {metric === 'cls' ? detail.summary![metric].p75.toFixed(3) : `${Math.round(detail.summary![metric].p75)}ms`}
                    </div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 600, color: vitalColor(detail.coreWebVitals![metric]), textTransform: 'capitalize' }}>
                      {detail.coreWebVitals![metric].replace('-', ' ')}
                    </div>
                  </div>
                ))}
              </div>

              <h4 style={{ margin: '0 0 10px', fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>All Metrics (p75)</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
                {(['lcp', 'fid', 'cls', 'ttfb', 'fcp'] as const).map((m) => (
                  <div key={m} style={{ padding: 10, borderRadius: 8, background: '#f8fafc', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>{m}</div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginTop: 2 }}>
                      {m === 'cls' ? detail.summary![m].p75.toFixed(3) : `${Math.round(detail.summary![m].p75)}ms`}
                    </div>
                    <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>avg: {m === 'cls' ? detail.summary![m].avg.toFixed(3) : `${Math.round(detail.summary![m].avg)}ms`}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

const statCard: React.CSSProperties = {
  padding: 16, borderRadius: 12, border: '1px solid #e2e8f0', background: '#fff', textAlign: 'center',
};
const statLabel: React.CSSProperties = {
  fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em',
};
const statValue: React.CSSProperties = {
  fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginTop: 4,
};
const pageRow: React.CSSProperties = {
  padding: 14, borderRadius: 12, border: '1px solid #e2e8f0',
  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
};
