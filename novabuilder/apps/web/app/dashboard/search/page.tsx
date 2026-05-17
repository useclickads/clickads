'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '../../../components/protected-route';
import { useApi } from '../../../lib/use-api';

type SearchResult = { type: string; id: string; title: string; subtitle: string; projectId?: string };
type SearchResults = { projects: SearchResult[]; pages: SearchResult[]; collections: SearchResult[] };

export default function SearchPage() {
  return (
    <ProtectedRoute>
      <GlobalSearch />
    </ProtectedRoute>
  );
}

function GlobalSearch() {
  const api = useApi();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResults | null>(null);
  const [searching, setSearching] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.length < 2) return;
    setSearching(true);
    try {
      const data = await api.get<SearchResults>(`/search?q=${encodeURIComponent(query)}`);
      setResults(data);
    } catch { setResults(null); }
    setSearching(false);
  }

  const total = results ? results.projects.length + results.pages.length + results.collections.length : 0;

  return (
    <div style={containerStyle}>
      <nav style={navStyle}>
        <Link href="/dashboard" style={linkStyle}>Dashboard</Link>
        <span style={muted}>/</span>
        <span style={{ color: '#0f172a', fontWeight: 600 }}>Search</span>
      </nav>

      <h1 style={titleStyle}>Search</h1>

      <form onSubmit={handleSearch} style={searchForm}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={searchInput}
          placeholder="Search projects, pages, collections..."
          autoFocus
        />
        <button type="submit" style={searchBtn} disabled={searching || query.length < 2}>
          {searching ? 'Searching…' : 'Search'}
        </button>
      </form>

      {results && (
        <div style={{ marginTop: 24 }}>
          <p style={muted}>{total} result{total !== 1 ? 's' : ''} found</p>

          {results.projects.length > 0 && (
            <div style={groupStyle}>
              <h3 style={groupTitle}>Projects</h3>
              {results.projects.map((r) => (
                <Link key={r.id} href={`/dashboard/projects/${r.id}`} style={resultRow}>
                  <span style={resultTitle}>{r.title}</span>
                  <span style={resultSub}>{r.subtitle}</span>
                </Link>
              ))}
            </div>
          )}

          {results.pages.length > 0 && (
            <div style={groupStyle}>
              <h3 style={groupTitle}>Pages</h3>
              {results.pages.map((r) => (
                <Link key={r.id} href={`/editor/${r.projectId}/${r.id}`} style={resultRow}>
                  <span style={resultTitle}>{r.title}</span>
                  <span style={resultSub}>{r.subtitle}</span>
                </Link>
              ))}
            </div>
          )}

          {results.collections.length > 0 && (
            <div style={groupStyle}>
              <h3 style={groupTitle}>CMS Collections</h3>
              {results.collections.map((r) => (
                <Link key={r.id} href={`/dashboard/projects/${r.projectId}/cms`} style={resultRow}>
                  <span style={resultTitle}>{r.title}</span>
                  <span style={resultSub}>{r.subtitle}</span>
                </Link>
              ))}
            </div>
          )}

          {total === 0 && <p style={{ ...muted, marginTop: 20, textAlign: 'center' }}>No results found for "{query}"</p>}
        </div>
      )}
    </div>
  );
}

const containerStyle: React.CSSProperties = { maxWidth: 700, margin: '0 auto', padding: '40px 24px' };
const navStyle: React.CSSProperties = { display: 'flex', gap: 8, alignItems: 'center', fontSize: '0.9rem' };
const titleStyle: React.CSSProperties = { fontSize: '1.5rem', margin: '20px 0 0', color: '#0f172a' };
const searchForm: React.CSSProperties = { marginTop: 20, display: 'flex', gap: 8 };
const searchInput: React.CSSProperties = { flex: 1, padding: '12px 16px', borderRadius: 12, border: '1px solid #cbd5e1', fontSize: '1rem' };
const searchBtn: React.CSSProperties = { padding: '12px 24px', borderRadius: 12, border: 'none', background: '#0f172a', color: '#fff', fontWeight: 600, cursor: 'pointer' };
const muted: React.CSSProperties = { color: '#64748b', fontSize: '0.9rem' };
const linkStyle: React.CSSProperties = { color: '#2563eb', textDecoration: 'none', fontWeight: 600 };
const groupStyle: React.CSSProperties = { marginTop: 20 };
const groupTitle: React.CSSProperties = { fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 8px' };
const resultRow: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderRadius: 10, border: '1px solid #e2e8f0', marginBottom: 6, textDecoration: 'none', background: '#fff' };
const resultTitle: React.CSSProperties = { fontWeight: 600, color: '#0f172a', fontSize: '0.9rem' };
const resultSub: React.CSSProperties = { fontSize: '0.8rem', color: '#94a3b8' };
