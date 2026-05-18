'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

type PageSeo = {
  pageId: string;
  title: string;
  path: string;
  published: boolean;
  hasTitle: boolean;
  hasDescription: boolean;
  hasOgImage: boolean;
};

type Overview = {
  totalPages: number;
  seoComplete: number;
  seoIncomplete: number;
  completionPercent: number;
  pages: PageSeo[];
};

type PageAnalysis = {
  pageId: string;
  title: string;
  path: string;
  score: number;
  wordCount: number;
  headingCount: number;
  imageCount: number;
  issues: Array<{ severity: 'error' | 'warning' | 'info'; message: string }>;
};

export default function SeoPage() {
  const { id: projectId } = useParams<{ id: string }>();
  const [overview, setOverview] = useState<Overview | null>(null);
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<PageAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
  const headers: Record<string, string> = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  async function load() {
    const res = await fetch(`${API}/projects/${projectId}/seo/overview`, { headers });
    setOverview(await res.json());
    setLoading(false);
  }

  async function loadAnalysis(pageId: string) {
    setSelectedPage(pageId);
    const res = await fetch(`${API}/projects/${projectId}/seo/pages/${pageId}`, { headers });
    setAnalysis(await res.json());
  }

  useEffect(() => { load(); }, [projectId]);

  const severityColors: Record<string, { bg: string; text: string; border: string }> = {
    error: { bg: '#fef2f2', text: '#991b1b', border: '#fecaca' },
    warning: { bg: '#fffbeb', text: '#92400e', border: '#fde68a' },
    info: { bg: '#eff6ff', text: '#1e40af', border: '#bfdbfe' },
  };

  return (
    <div style={{ padding: 32, maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>SEO Dashboard</h1>
      <p style={{ color: '#64748b', marginBottom: 24, fontSize: '0.9rem' }}>
        Monitor and improve search engine optimization across your pages.
      </p>

      {loading ? (
        <p style={{ color: '#94a3b8' }}>Loading...</p>
      ) : overview && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 28 }}>
            <div style={statCard}>
              <div style={statLabel}>Total Pages</div>
              <div style={statValue}>{overview.totalPages}</div>
            </div>
            <div style={statCard}>
              <div style={statLabel}>SEO Complete</div>
              <div style={{ ...statValue, color: '#16a34a' }}>{overview.seoComplete}</div>
            </div>
            <div style={statCard}>
              <div style={statLabel}>Needs Work</div>
              <div style={{ ...statValue, color: overview.seoIncomplete > 0 ? '#f59e0b' : '#16a34a' }}>{overview.seoIncomplete}</div>
            </div>
            <div style={statCard}>
              <div style={statLabel}>Completion</div>
              <div style={statValue}>{overview.completionPercent}%</div>
              <div style={progressBar}>
                <div style={{ ...progressFill, width: `${overview.completionPercent}%` }} />
              </div>
            </div>
          </div>

          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: 12 }}>Pages</h3>
          <div style={{ display: 'grid', gap: 8 }}>
            {overview.pages.map((page) => (
              <div
                key={page.pageId}
                style={{ ...pageCard, background: selectedPage === page.pageId ? '#f8fafc' : '#fff', cursor: 'pointer' }}
                onClick={() => loadAnalysis(page.pageId)}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.9rem' }}>{page.title || 'Untitled'}</div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{page.path}</div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <span style={checkBadge(page.hasTitle)}>Title</span>
                  <span style={checkBadge(page.hasDescription)}>Description</span>
                  <span style={checkBadge(page.hasOgImage)}>OG Image</span>
                </div>
              </div>
            ))}
          </div>

          {selectedPage && analysis && (
            <div style={{ marginTop: 24, padding: 20, borderRadius: 14, border: '1px solid #e2e8f0', background: '#fff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
                  Analysis: {analysis.title}
                </h3>
                <div style={{
                  padding: '6px 14px', borderRadius: 20, fontWeight: 800, fontSize: '0.9rem',
                  background: analysis.score >= 80 ? '#dcfce7' : analysis.score >= 50 ? '#fef3c7' : '#fef2f2',
                  color: analysis.score >= 80 ? '#16a34a' : analysis.score >= 50 ? '#d97706' : '#dc2626',
                }}>
                  {analysis.score}/100
                </div>
              </div>

              <div style={{ display: 'flex', gap: 20, marginBottom: 16, fontSize: '0.85rem', color: '#64748b' }}>
                <span>{analysis.wordCount} words</span>
                <span>{analysis.headingCount} headings</span>
                <span>{analysis.imageCount} images</span>
              </div>

              {analysis.issues.length === 0 ? (
                <p style={{ color: '#16a34a', fontWeight: 600, fontSize: '0.9rem' }}>No issues found — great job!</p>
              ) : (
                <div style={{ display: 'grid', gap: 8 }}>
                  {analysis.issues.map((issue, i) => {
                    const colors = severityColors[issue.severity] || severityColors.info;
                    return (
                      <div key={i} style={{
                        padding: '10px 14px', borderRadius: 8,
                        background: colors.bg, border: `1px solid ${colors.border}`,
                        fontSize: '0.85rem', color: colors.text, fontWeight: 500,
                      }}>
                        <strong style={{ textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.05em' }}>
                          {issue.severity}
                        </strong>{' '}
                        {issue.message}
                      </div>
                    );
                  })}
                </div>
              )}
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
const progressBar: React.CSSProperties = {
  height: 4, borderRadius: 2, background: '#f1f5f9', marginTop: 8, overflow: 'hidden',
};
const progressFill: React.CSSProperties = {
  height: '100%', borderRadius: 2, background: 'linear-gradient(90deg, #6366f1, #2563eb)',
};
const pageCard: React.CSSProperties = {
  padding: 14, borderRadius: 12, border: '1px solid #e2e8f0',
  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
};
const checkBadge = (ok: boolean): React.CSSProperties => ({
  padding: '3px 8px', borderRadius: 6, fontSize: '0.7rem', fontWeight: 600,
  background: ok ? '#dcfce7' : '#fef2f2', color: ok ? '#16a34a' : '#dc2626',
});
