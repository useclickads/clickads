'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ProtectedRoute } from '../../../../components/protected-route';
import { useApi } from '../../../../lib/use-api';

type Review = {
  id: string;
  rating: number;
  title?: string;
  body?: string;
  createdAt: string;
  user: { id: string; name: string | null };
};

type PluginDetail = {
  id: string;
  name: string;
  version: string;
  publisherId: string;
  manifest: { description?: string; author?: string; icon?: string; category?: string };
  _count: { installations: number; reviews: number };
  marketplaceItems: { id: string; price: number }[];
  reviews: Review[];
  avgRating: number | null;
};

export default function PluginDetailPage() {
  return (
    <ProtectedRoute>
      <PluginDetail />
    </ProtectedRoute>
  );
}

function PluginDetail() {
  const { pluginId } = useParams<{ pluginId: string }>();
  const api = useApi();
  const [plugin, setPlugin] = useState<PluginDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await api.get<PluginDetail>(`/marketplace/plugins/${pluginId}`);
      setPlugin(data);
    } catch {}
    setLoading(false);
  }, [api, pluginId]);

  useEffect(() => { load(); }, [load]);

  const submitReview = async () => {
    setSubmitting(true);
    try {
      await api.post(`/marketplace/plugins/${pluginId}/reviews`, { rating, title: title || undefined, body: body || undefined });
      setTitle('');
      setBody('');
      await load();
    } catch {}
    setSubmitting(false);
  };

  if (loading) return <div style={container}><p style={muted}>Loading...</p></div>;
  if (!plugin) return <div style={container}><p style={muted}>Plugin not found.</p></div>;

  return (
    <div style={container}>
      <nav style={navStyle}>
        <Link href="/dashboard" style={linkStyle}>Dashboard</Link>
        <span style={muted}>/</span>
        <Link href="/dashboard/marketplace" style={linkStyle}>Marketplace</Link>
        <span style={muted}>/</span>
        <span style={{ color: '#0f172a', fontWeight: 600 }}>{plugin.name}</span>
      </nav>

      <header style={headerStyle}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <span style={{ fontSize: '2.5rem' }}>{plugin.manifest?.icon || '🧩'}</span>
          <div>
            <h1 style={titleStyle}>{plugin.name}</h1>
            <p style={muted}>{plugin.manifest?.description || 'No description'}</p>
          </div>
        </div>
        <button style={installBtnLg}>Install</button>
      </header>

      <div style={metaRow}>
        <span style={metaChip}>v{plugin.version}</span>
        <span style={metaChip}>{plugin._count.installations} installs</span>
        <span style={metaChip}>{plugin._count.reviews} reviews</span>
        {plugin.avgRating !== null && <span style={ratingChip}>{renderStars(plugin.avgRating)} {plugin.avgRating}</span>}
        {plugin.manifest?.author && <span style={metaChip}>by {plugin.manifest.author}</span>}
        {plugin.marketplaceItems[0] && (
          <span style={priceChip}>
            {plugin.marketplaceItems[0].price === 0 ? 'Free' : `$${plugin.marketplaceItems[0].price}`}
          </span>
        )}
      </div>

      <section style={{ marginTop: 36 }}>
        <h2 style={sectionTitle}>Reviews</h2>

        <div style={reviewForm}>
          <h3 style={{ margin: 0, fontSize: '0.95rem', color: '#0f172a', fontWeight: 700 }}>Write a Review</h3>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                onClick={() => setRating(s)}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1.25rem', color: s <= rating ? '#f59e0b' : '#cbd5e1' }}
              >
                ★
              </button>
            ))}
            <span style={{ fontSize: '0.8rem', color: '#64748b', marginLeft: 8 }}>{rating}/5</span>
          </div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Review title (optional)"
            style={inputStyle}
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Share your experience..."
            rows={3}
            style={{ ...inputStyle, resize: 'vertical' }}
          />
          <button onClick={submitReview} disabled={submitting} style={submitBtn}>
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>

        {plugin.reviews.length === 0 ? (
          <div style={emptyState}><p style={{ margin: 0, fontWeight: 600 }}>No reviews yet</p><p style={muted}>Be the first to review this plugin.</p></div>
        ) : (
          <div style={{ display: 'grid', gap: 12, marginTop: 16 }}>
            {plugin.reviews.map((r) => (
              <div key={r.id} style={reviewCard}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0f172a' }}>{r.user.name || 'Anonymous'}</span>
                    <span style={{ fontSize: '0.85rem', color: '#f59e0b' }}>{renderStars(r.rating)}</span>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
                {r.title && <p style={{ margin: '4px 0 0', fontWeight: 600, fontSize: '0.9rem', color: '#1e293b' }}>{r.title}</p>}
                {r.body && <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#475569', lineHeight: 1.5 }}>{r.body}</p>}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function renderStars(rating: number): string {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5 ? 1 : 0;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(5 - full - half);
}

const container: React.CSSProperties = { maxWidth: 800, margin: '0 auto', padding: '40px 24px' };
const navStyle: React.CSSProperties = { display: 'flex', gap: 8, alignItems: 'center', fontSize: '0.9rem' };
const linkStyle: React.CSSProperties = { color: '#2563eb', textDecoration: 'none', fontWeight: 600 };
const muted: React.CSSProperties = { color: '#64748b', fontSize: '0.9rem' };
const headerStyle: React.CSSProperties = { marginTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const titleStyle: React.CSSProperties = { fontSize: '1.5rem', margin: 0, color: '#0f172a', fontWeight: 800 };
const installBtnLg: React.CSSProperties = { padding: '12px 28px', borderRadius: 10, border: 'none', background: '#2563eb', color: '#fff', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' };
const metaRow: React.CSSProperties = { marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' };
const metaChip: React.CSSProperties = { fontSize: '0.75rem', color: '#64748b', padding: '4px 10px', borderRadius: 6, background: '#f1f5f9' };
const ratingChip: React.CSSProperties = { fontSize: '0.75rem', color: '#f59e0b', padding: '4px 10px', borderRadius: 6, background: '#fffbeb', fontWeight: 700 };
const priceChip: React.CSSProperties = { fontSize: '0.75rem', fontWeight: 700, color: '#16a34a', padding: '4px 10px', borderRadius: 6, background: '#dcfce7' };
const sectionTitle: React.CSSProperties = { fontSize: '1.1rem', margin: '0 0 16px', color: '#0f172a', fontWeight: 700 };
const reviewForm: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 12, padding: 20, borderRadius: 14, background: '#f8fafc', border: '1px solid #e2e8f0' };
const inputStyle: React.CSSProperties = { padding: '10px 14px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '0.85rem', fontFamily: 'inherit' };
const submitBtn: React.CSSProperties = { alignSelf: 'flex-start', padding: '8px 20px', borderRadius: 8, border: 'none', background: '#0f172a', color: '#fff', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' };
const emptyState: React.CSSProperties = { marginTop: 16, padding: 32, textAlign: 'center', borderRadius: 16, background: '#f8fafc', border: '1px solid #e2e8f0' };
const reviewCard: React.CSSProperties = { padding: 16, borderRadius: 12, background: '#fff', border: '1px solid #e2e8f0' };
