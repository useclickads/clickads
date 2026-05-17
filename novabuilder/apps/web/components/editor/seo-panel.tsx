'use client';

import { useCallback, useEffect, useState } from 'react';
import { useApi } from '../../lib/use-api';

type SeoData = {
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
  noIndex: boolean;
};

export function SeoPanel({ projectId, pageId }: { projectId: string; pageId: string }) {
  const api = useApi();
  const [seo, setSeo] = useState<SeoData>({ metaTitle: '', metaDescription: '', ogImage: '', noIndex: false });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await api.get<SeoData>(`/projects/${projectId}/pages/${pageId}/seo`);
        setSeo(data);
      } catch {}
    })();
  }, [api, projectId, pageId]);

  const handleSave = useCallback(async () => {
    setSaving(true);
    setSaved(false);
    try {
      await api.put(`/projects/${projectId}/pages/${pageId}/seo`, seo);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {}
    setSaving(false);
  }, [api, projectId, pageId, seo]);

  return (
    <div style={panelStyle}>
      <h3 style={titleStyle}>SEO Settings</h3>

      <label style={labelStyle}>
        Meta Title
        <input
          type="text"
          value={seo.metaTitle}
          onChange={(e) => setSeo({ ...seo, metaTitle: e.target.value })}
          style={inputStyle}
          placeholder="Page title for search engines"
          maxLength={70}
        />
        <span style={charCount}>{seo.metaTitle.length}/70</span>
      </label>

      <label style={labelStyle}>
        Meta Description
        <textarea
          value={seo.metaDescription}
          onChange={(e) => setSeo({ ...seo, metaDescription: e.target.value })}
          style={{ ...inputStyle, height: 80, resize: 'vertical' }}
          placeholder="Brief description shown in search results"
          maxLength={160}
        />
        <span style={charCount}>{seo.metaDescription.length}/160</span>
      </label>

      <label style={labelStyle}>
        OG Image URL
        <input
          type="url"
          value={seo.ogImage}
          onChange={(e) => setSeo({ ...seo, ogImage: e.target.value })}
          style={inputStyle}
          placeholder="https://example.com/image.png"
        />
      </label>

      <label style={checkLabel}>
        <input
          type="checkbox"
          checked={seo.noIndex}
          onChange={(e) => setSeo({ ...seo, noIndex: e.target.checked })}
        />
        <span>No Index (hide from search engines)</span>
      </label>

      <div style={previewBox}>
        <p style={previewTitle}>{seo.metaTitle || 'Page Title'}</p>
        <p style={previewUrl}>yoursite.com/page</p>
        <p style={previewDesc}>{seo.metaDescription || 'Page description will appear here...'}</p>
      </div>

      <button onClick={handleSave} style={saveBtn} disabled={saving}>
        {saving ? 'Saving…' : saved ? 'Saved!' : 'Save SEO'}
      </button>
    </div>
  );
}

const panelStyle: React.CSSProperties = { padding: 16, display: 'grid', gap: 14 };
const titleStyle: React.CSSProperties = { margin: 0, fontSize: '0.95rem', color: '#0f172a' };
const labelStyle: React.CSSProperties = { display: 'grid', gap: 4, fontSize: '0.8rem', color: '#475569', position: 'relative' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '0.85rem' };
const charCount: React.CSSProperties = { position: 'absolute', top: 0, right: 0, fontSize: '0.7rem', color: '#94a3b8' };
const checkLabel: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', color: '#475569' };
const previewBox: React.CSSProperties = { padding: 12, borderRadius: 8, background: '#f8fafc', border: '1px solid #e2e8f0' };
const previewTitle: React.CSSProperties = { margin: 0, color: '#1a0dab', fontSize: '0.9rem', fontWeight: 500 };
const previewUrl: React.CSSProperties = { margin: '2px 0', color: '#006621', fontSize: '0.75rem' };
const previewDesc: React.CSSProperties = { margin: 0, color: '#545454', fontSize: '0.8rem', lineHeight: 1.4 };
const saveBtn: React.CSSProperties = { padding: '8px 16px', borderRadius: 8, border: 'none', background: '#0f172a', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' };
