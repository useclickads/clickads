'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

type Template = {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail: string;
  tags: string[];
  popularity: number;
};

type Category = { id: string; label: string; count: number };

export default function TemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [search, setSearch] = useState('');
  const [creating, setCreating] = useState<string | null>(null);
  const [projectName, setProjectName] = useState('');
  const [loading, setLoading] = useState(true);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
  const headers: Record<string, string> = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  async function load() {
    const params = new URLSearchParams();
    if (activeCategory) params.set('category', activeCategory);
    if (search) params.set('search', search);

    const [tRes, cRes] = await Promise.all([
      fetch(`${API}/templates?${params}`, { headers }),
      fetch(`${API}/templates/categories`, { headers }),
    ]);

    setTemplates(await tRes.json());
    setCategories(await cRes.json());
    setLoading(false);
  }

  async function useTemplate(templateId: string) {
    if (!projectName.trim()) return;
    const slug = projectName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const res = await fetch(`${API}/templates/${templateId}/use`, {
      method: 'POST', headers, body: JSON.stringify({ name: projectName, slug }),
    });
    const data = await res.json();
    if (data.projectId) router.push(`/dashboard/projects/${data.projectId}`);
  }

  useEffect(() => { load(); }, [activeCategory, search]);

  return (
    <div style={{ padding: 32, maxWidth: 1100, margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>Template Gallery</h1>
      <p style={{ color: '#64748b', marginBottom: 24, fontSize: '0.9rem' }}>
        Start with a professionally designed template and customize it to fit your needs.
      </p>

      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search templates..."
          style={searchInput}
        />
        <button
          onClick={() => setActiveCategory('')}
          style={catBtn(activeCategory === '')}
        >
          All
        </button>
        {categories.map((c) => (
          <button key={c.id} onClick={() => setActiveCategory(c.id)} style={catBtn(activeCategory === c.id)}>
            {c.label} ({c.count})
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ color: '#94a3b8' }}>Loading...</p>
      ) : templates.length === 0 ? (
        <p style={{ color: '#94a3b8', textAlign: 'center', padding: 40 }}>No templates found.</p>
      ) : (
        <div style={gridStyle}>
          {templates.map((t) => (
            <div key={t.id} style={cardStyle}>
              <div style={thumbnailStyle}>
                <div style={{ fontSize: '2rem', color: '#94a3b8' }}>{t.category.charAt(0).toUpperCase()}</div>
              </div>
              <div style={{ padding: 16 }}>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>{t.name}</h3>
                <p style={{ margin: '6px 0 12px', fontSize: '0.8rem', color: '#64748b', lineHeight: 1.4 }}>{t.description}</p>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 12 }}>
                  {t.tags.map((tag) => (
                    <span key={tag} style={tagStyle}>{tag}</span>
                  ))}
                </div>

                {creating === t.id ? (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      placeholder="Project name"
                      style={{ ...searchInput, flex: 1, fontSize: '0.8rem', padding: '6px 10px' }}
                      autoFocus
                      onKeyDown={(e) => e.key === 'Enter' && useTemplate(t.id)}
                    />
                    <button onClick={() => useTemplate(t.id)} style={useBtnSmall}>Go</button>
                  </div>
                ) : (
                  <button onClick={() => { setCreating(t.id); setProjectName(''); }} style={useBtn}>
                    Use Template
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const searchInput: React.CSSProperties = {
  padding: '10px 14px', borderRadius: 10, border: '1px solid #e2e8f0',
  fontSize: '0.9rem', outline: 'none', minWidth: 200,
};
const catBtn = (active: boolean): React.CSSProperties => ({
  padding: '8px 14px', borderRadius: 8, border: active ? '1px solid #6366f1' : '1px solid #e2e8f0',
  background: active ? '#eef2ff' : '#fff', color: active ? '#6366f1' : '#475569',
  fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer',
});
const gridStyle: React.CSSProperties = {
  display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20,
};
const cardStyle: React.CSSProperties = {
  borderRadius: 14, border: '1px solid #e2e8f0', background: '#fff', overflow: 'hidden',
  transition: 'box-shadow 0.2s', cursor: 'default',
};
const thumbnailStyle: React.CSSProperties = {
  height: 140, background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center',
  borderBottom: '1px solid #f1f5f9',
};
const tagStyle: React.CSSProperties = {
  padding: '2px 8px', borderRadius: 6, background: '#f1f5f9', color: '#64748b',
  fontSize: '0.7rem', fontWeight: 600,
};
const useBtn: React.CSSProperties = {
  width: '100%', padding: '8px 16px', borderRadius: 8, border: 'none',
  background: '#6366f1', color: '#fff', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
};
const useBtnSmall: React.CSSProperties = {
  padding: '6px 12px', borderRadius: 8, border: 'none', background: '#6366f1',
  color: '#fff', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer',
};
