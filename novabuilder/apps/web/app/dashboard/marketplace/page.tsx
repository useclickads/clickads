'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '../../../components/protected-route';
import { useApi } from '../../../lib/use-api';

type Plugin = {
  id: string;
  name: string;
  version: string;
  manifest: { description?: string; author?: string; icon?: string; category?: string };
  _count: { installations: number; reviews: number };
  marketplaceItems: { id: string; price: number }[];
};

export default function MarketplacePage() {
  return (
    <ProtectedRoute>
      <MarketplaceContent />
    </ProtectedRoute>
  );
}

function MarketplaceContent() {
  const api = useApi();
  const [plugins, setPlugins] = useState<Plugin[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const load = useCallback(async () => {
    try {
      const data = await api.get<Plugin[]>(`/marketplace/plugins${search ? `?q=${encodeURIComponent(search)}` : ''}`);
      setPlugins(data);
    } catch {}
    setLoading(false);
  }, [api, search]);

  useEffect(() => { load(); }, [load]);

  const categories = ['all', ...new Set(plugins.map((p) => p.manifest?.category || 'other'))];
  const filtered = category === 'all' ? plugins : plugins.filter((p) => (p.manifest?.category || 'other') === category);

  return (
    <div style={containerStyle}>
      <nav style={navStyle}>
        <Link href="/dashboard" style={linkStyle}>Dashboard</Link>
        <span style={muted}>/</span>
        <span style={{ color: '#0f172a', fontWeight: 600 }}>Marketplace</span>
      </nav>

      <header style={headerStyle}>
        <div>
          <h1 style={titleStyle}>Plugin Marketplace</h1>
          <p style={muted}>Extend NovaBuilder with community plugins.</p>
        </div>
        <Link href="/dashboard/marketplace/publish" style={publishBtn}>Publish Plugin</Link>
      </header>

      <div style={searchRow}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search plugins..."
          style={searchInput}
        />
        <div style={categoryRow}>
          {categories.map((c) => (
            <button key={c} onClick={() => setCategory(c)} style={category === c ? categoryActive : categoryBtn}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p style={muted}>Loading plugins...</p>
      ) : filtered.length === 0 ? (
        <div style={emptyState}>
          <p style={{ margin: 0, fontWeight: 600 }}>No plugins found</p>
          <p style={muted}>Be the first to publish a plugin for the community.</p>
        </div>
      ) : (
        <div style={gridStyle}>
          {filtered.map((plugin) => (
            <Link key={plugin.id} href={`/dashboard/marketplace/${plugin.id}`} style={{ textDecoration: 'none' }}>
              <div style={pluginCard}>
                <div style={pluginIcon}>{plugin.manifest?.icon || '🧩'}</div>
                <h3 style={pluginName}>{plugin.name}</h3>
                <p style={pluginDesc}>{plugin.manifest?.description || 'No description'}</p>
                <div style={pluginMeta}>
                  <span style={metaText}>v{plugin.version}</span>
                  <span style={metaText}>{plugin._count.installations} installs</span>
                  {plugin._count.reviews > 0 && <span style={metaText}>{plugin._count.reviews} reviews</span>}
                  {plugin.marketplaceItems[0] && (
                    <span style={priceTag}>
                      {plugin.marketplaceItems[0].price === 0 ? 'Free' : `$${plugin.marketplaceItems[0].price}`}
                    </span>
                  )}
                </div>
                {plugin.manifest?.author && <p style={authorText}>by {plugin.manifest.author}</p>}
                <button style={installBtn}>Install</button>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

const containerStyle: React.CSSProperties = { maxWidth: 1100, margin: '0 auto', padding: '40px 24px' };
const navStyle: React.CSSProperties = { display: 'flex', gap: 8, alignItems: 'center', fontSize: '0.9rem' };
const linkStyle: React.CSSProperties = { color: '#2563eb', textDecoration: 'none', fontWeight: 600 };
const headerStyle: React.CSSProperties = { marginTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' };
const titleStyle: React.CSSProperties = { fontSize: '1.5rem', margin: 0, color: '#0f172a', fontWeight: 800 };
const muted: React.CSSProperties = { color: '#64748b', fontSize: '0.9rem' };
const publishBtn: React.CSSProperties = { padding: '10px 18px', borderRadius: 10, background: '#0f172a', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: '0.85rem' };
const searchRow: React.CSSProperties = { marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12 };
const searchInput: React.CSSProperties = { padding: '12px 16px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: '0.9rem', maxWidth: 400 };
const categoryRow: React.CSSProperties = { display: 'flex', gap: 6, flexWrap: 'wrap' };
const categoryBtn: React.CSSProperties = { padding: '6px 14px', borderRadius: 20, border: '1px solid #e2e8f0', background: '#fff', color: '#475569', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' };
const categoryActive: React.CSSProperties = { ...categoryBtn, background: '#0f172a', color: '#fff', border: '1px solid #0f172a' };
const emptyState: React.CSSProperties = { marginTop: 32, padding: 40, textAlign: 'center', borderRadius: 16, background: '#f8fafc', border: '1px solid #e2e8f0' };
const gridStyle: React.CSSProperties = { marginTop: 20, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 };
const pluginCard: React.CSSProperties = { padding: 24, borderRadius: 16, border: '1px solid #e2e8f0', background: '#fff', display: 'flex', flexDirection: 'column', gap: 8 };
const pluginIcon: React.CSSProperties = { fontSize: '1.5rem' };
const pluginName: React.CSSProperties = { margin: 0, fontSize: '1rem', fontWeight: 700, color: '#0f172a' };
const pluginDesc: React.CSSProperties = { margin: 0, fontSize: '0.85rem', color: '#475569', lineHeight: 1.5 };
const pluginMeta: React.CSSProperties = { display: 'flex', gap: 10, alignItems: 'center', marginTop: 4 };
const metaText: React.CSSProperties = { fontSize: '0.75rem', color: '#94a3b8' };
const priceTag: React.CSSProperties = { fontSize: '0.75rem', fontWeight: 700, color: '#16a34a', padding: '2px 6px', borderRadius: 4, background: '#dcfce7' };
const authorText: React.CSSProperties = { margin: 0, fontSize: '0.75rem', color: '#94a3b8' };
const installBtn: React.CSSProperties = { marginTop: 'auto', padding: '8px 16px', borderRadius: 8, border: '1px solid #2563eb', background: '#fff', color: '#2563eb', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' };
