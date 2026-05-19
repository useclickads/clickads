'use client';

import { useEffect, useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

type Endpoint = {
  method: string;
  path: string;
  description: string;
  auth: boolean;
  parameters?: Array<{ name: string; in: string; type: string; required: boolean; description: string }>;
  requestBody?: { type: string; properties: Record<string, { type: string; description: string }> };
};

type Category = {
  name: string;
  description: string;
  endpoints: Endpoint[];
};

export default function ApiDocsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await fetch(`${API}/docs/categories`);
    const data = await res.json();
    setCategories(data);
    if (data.length > 0) setActiveCategory(data[0].name);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const methodColors: Record<string, { bg: string; text: string }> = {
    GET: { bg: '#dcfce7', text: '#16a34a' },
    POST: { bg: '#dbeafe', text: '#2563eb' },
    PUT: { bg: '#fef3c7', text: '#d97706' },
    PATCH: { bg: '#fef3c7', text: '#d97706' },
    DELETE: { bg: '#fef2f2', text: '#dc2626' },
  };

  const activeData = categories.find((c) => c.name === activeCategory);

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={sidebarStyle}>
        <h2 style={{ margin: '0 0 16px', fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>API Reference</h2>
        {loading ? (
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Loading...</p>
        ) : (
          <div style={{ display: 'grid', gap: 2 }}>
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                style={activeCategory === cat.name ? sidebarBtnActive : sidebarBtn}
              >
                {cat.name}
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', marginLeft: 'auto' }}>
                  {cat.endpoints.length}
                </span>
              </button>
            ))}
          </div>
        )}
      </aside>

      <main style={{ flex: 1, padding: 32, maxWidth: 800 }}>
        {activeData && (
          <>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>
              {activeData.name}
            </h1>
            <p style={{ color: '#64748b', marginBottom: 28, fontSize: '0.9rem' }}>{activeData.description}</p>

            <div style={{ display: 'grid', gap: 16 }}>
              {activeData.endpoints.map((ep, i) => {
                const colors = methodColors[ep.method] || methodColors.GET;
                return (
                  <div key={i} style={endpointCard}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <span style={{
                        padding: '3px 10px', borderRadius: 6, fontSize: '0.7rem', fontWeight: 800,
                        background: colors.bg, color: colors.text, fontFamily: 'monospace',
                      }}>
                        {ep.method}
                      </span>
                      <code style={{ fontSize: '0.85rem', color: '#334155', fontWeight: 600 }}>{ep.path}</code>
                      {ep.auth && <span style={authBadge}>Auth</span>}
                    </div>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>{ep.description}</p>

                    {ep.parameters && ep.parameters.length > 0 && (
                      <div style={{ marginTop: 12 }}>
                        <p style={sectionLabel}>Parameters</p>
                        <div style={{ display: 'grid', gap: 4 }}>
                          {ep.parameters.map((p, j) => (
                            <div key={j} style={paramRow}>
                              <code style={{ fontSize: '0.8rem', color: '#2563eb', fontWeight: 600 }}>{p.name}</code>
                              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{p.type} / {p.in}</span>
                              <span style={{ fontSize: '0.8rem', color: '#475569' }}>{p.description}</span>
                              {p.required && <span style={{ fontSize: '0.65rem', color: '#dc2626', fontWeight: 700 }}>required</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {ep.requestBody && (
                      <div style={{ marginTop: 12 }}>
                        <p style={sectionLabel}>Request Body</p>
                        <div style={{ display: 'grid', gap: 4 }}>
                          {Object.entries(ep.requestBody.properties).map(([key, val]) => (
                            <div key={key} style={paramRow}>
                              <code style={{ fontSize: '0.8rem', color: '#2563eb', fontWeight: 600 }}>{key}</code>
                              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{val.type}</span>
                              <span style={{ fontSize: '0.8rem', color: '#475569' }}>{val.description}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

const sidebarStyle: React.CSSProperties = {
  width: 240, padding: 24, borderRight: '1px solid #e2e8f0', background: '#fafbfc',
  position: 'sticky', top: 0, height: '100vh', overflow: 'auto',
};
const sidebarBtn: React.CSSProperties = {
  padding: '8px 12px', borderRadius: 8, border: 'none', background: 'transparent',
  color: '#475569', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
  textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8,
};
const sidebarBtnActive: React.CSSProperties = {
  ...sidebarBtn, background: '#eff6ff', color: '#2563eb',
};
const endpointCard: React.CSSProperties = {
  padding: 16, borderRadius: 12, border: '1px solid #e2e8f0', background: '#fff',
};
const authBadge: React.CSSProperties = {
  padding: '2px 8px', borderRadius: 6, fontSize: '0.65rem', fontWeight: 700,
  background: '#fef3c7', color: '#92400e',
};
const sectionLabel: React.CSSProperties = {
  margin: '0 0 6px', fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8',
  textTransform: 'uppercase', letterSpacing: '0.05em',
};
const paramRow: React.CSSProperties = {
  display: 'flex', gap: 10, alignItems: 'center', padding: '4px 8px',
  borderRadius: 6, background: '#f8fafc', fontSize: '0.8rem',
};
