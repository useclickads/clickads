'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ProtectedRoute } from '../../../../../components/protected-route';
import { useApi } from '../../../../../lib/use-api';

type Settings = {
  globalHeader: unknown;
  globalFooter: unknown;
  headScripts: string;
  bodyScripts: string;
  favicon: string;
  socialImage: string;
};

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <ProjectSettings />
    </ProtectedRoute>
  );
}

function ProjectSettings() {
  const { id } = useParams<{ id: string }>();
  const api = useApi();
  const [settings, setSettings] = useState<Settings>({
    globalHeader: null,
    globalFooter: null,
    headScripts: '',
    bodyScripts: '',
    favicon: '',
    socialImage: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'code'>('general');

  const load = useCallback(async () => {
    try {
      const data = await api.get<Settings>(`/projects/${id}/settings`);
      setSettings({
        globalHeader: data.globalHeader,
        globalFooter: data.globalFooter,
        headScripts: data.headScripts || '',
        bodyScripts: data.bodyScripts || '',
        favicon: data.favicon || '',
        socialImage: data.socialImage || '',
      });
    } catch {}
    setLoading(false);
  }, [api, id]);

  useEffect(() => { load(); }, [load]);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    try {
      await api.put(`/projects/${id}/settings`, settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {}
    setSaving(false);
  }

  if (loading) return <div style={containerStyle}><p style={muted}>Loading...</p></div>;

  return (
    <div style={containerStyle}>
      <nav style={navStyle}>
        <Link href="/dashboard" style={linkStyle}>Dashboard</Link>
        <span style={muted}>/</span>
        <Link href={`/dashboard/projects/${id}`} style={linkStyle}>Project</Link>
        <span style={muted}>/</span>
        <span style={{ color: '#0f172a', fontWeight: 600 }}>Settings</span>
      </nav>

      <header style={headerStyle}>
        <h1 style={titleStyle}>Project Settings</h1>
        <button onClick={handleSave} style={saveBtn} disabled={saving}>
          {saving ? 'Saving…' : saved ? 'Saved!' : 'Save Settings'}
        </button>
      </header>

      <div style={tabBar}>
        <button onClick={() => setActiveTab('general')} style={tabBtn(activeTab === 'general')}>General</button>
        <button onClick={() => setActiveTab('code')} style={tabBtn(activeTab === 'code')}>Code Injection</button>
      </div>

      {activeTab === 'general' ? (
        <div style={sectionStyle}>
          <label style={labelStyle}>
            Favicon URL
            <input
              type="url"
              value={settings.favicon}
              onChange={(e) => setSettings({ ...settings, favicon: e.target.value })}
              style={inputStyle}
              placeholder="https://example.com/favicon.ico"
            />
          </label>

          <label style={labelStyle}>
            Default Social Image (OG)
            <input
              type="url"
              value={settings.socialImage}
              onChange={(e) => setSettings({ ...settings, socialImage: e.target.value })}
              style={inputStyle}
              placeholder="https://example.com/og-image.png"
            />
          </label>

          <label style={labelStyle}>
            Global Header (JSON blocks)
            <textarea
              value={typeof settings.globalHeader === 'string' ? settings.globalHeader : JSON.stringify(settings.globalHeader || [], null, 2)}
              onChange={(e) => {
                try { setSettings({ ...settings, globalHeader: JSON.parse(e.target.value) }); } catch { setSettings({ ...settings, globalHeader: e.target.value }); }
              }}
              style={textareaStyle}
              placeholder='[{"type": "navigation", "props": {...}}]'
            />
            <span style={hint}>Define blocks that appear at the top of every page.</span>
          </label>

          <label style={labelStyle}>
            Global Footer (JSON blocks)
            <textarea
              value={typeof settings.globalFooter === 'string' ? settings.globalFooter : JSON.stringify(settings.globalFooter || [], null, 2)}
              onChange={(e) => {
                try { setSettings({ ...settings, globalFooter: JSON.parse(e.target.value) }); } catch { setSettings({ ...settings, globalFooter: e.target.value }); }
              }}
              style={textareaStyle}
              placeholder='[{"type": "footer", "props": {...}}]'
            />
            <span style={hint}>Define blocks that appear at the bottom of every page.</span>
          </label>
        </div>
      ) : (
        <div style={sectionStyle}>
          <label style={labelStyle}>
            Head Scripts
            <textarea
              value={settings.headScripts}
              onChange={(e) => setSettings({ ...settings, headScripts: e.target.value })}
              style={codeArea}
              placeholder={'<!-- Analytics, fonts, meta tags -->\n<script src="..."></script>'}
            />
            <span style={hint}>Injected into the {'<head>'} of every deployed page. Use for analytics, custom fonts, or meta tags.</span>
          </label>

          <label style={labelStyle}>
            Body Scripts
            <textarea
              value={settings.bodyScripts}
              onChange={(e) => setSettings({ ...settings, bodyScripts: e.target.value })}
              style={codeArea}
              placeholder={'<!-- Chat widgets, tracking pixels -->\n<script src="..."></script>'}
            />
            <span style={hint}>Injected before the closing {'</body>'} tag. Use for chat widgets, tracking pixels, or custom JS.</span>
          </label>
        </div>
      )}
    </div>
  );
}

const containerStyle: React.CSSProperties = { maxWidth: 800, margin: '0 auto', padding: '40px 24px' };
const navStyle: React.CSSProperties = { display: 'flex', gap: 8, alignItems: 'center', fontSize: '0.9rem' };
const headerStyle: React.CSSProperties = { marginTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const titleStyle: React.CSSProperties = { fontSize: '1.5rem', margin: 0, color: '#0f172a' };
const saveBtn: React.CSSProperties = { padding: '10px 20px', borderRadius: 10, border: 'none', background: '#0f172a', color: '#fff', fontWeight: 600, cursor: 'pointer' };
const tabBar: React.CSSProperties = { display: 'flex', gap: 0, marginTop: 24, borderBottom: '1px solid #e2e8f0' };
const tabBtn = (active: boolean): React.CSSProperties => ({ padding: '12px 20px', border: 'none', background: 'transparent', color: active ? '#0f172a' : '#64748b', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', borderBottom: active ? '2px solid #2563eb' : '2px solid transparent' });
const sectionStyle: React.CSSProperties = { marginTop: 24, display: 'grid', gap: 20 };
const labelStyle: React.CSSProperties = { display: 'grid', gap: 6, color: '#334155', fontSize: '0.9rem' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #cbd5e1', fontSize: '0.95rem' };
const textareaStyle: React.CSSProperties = { width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #cbd5e1', fontSize: '0.85rem', minHeight: 120, resize: 'vertical', fontFamily: 'monospace' };
const codeArea: React.CSSProperties = { width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid #cbd5e1', fontSize: '0.8rem', minHeight: 140, resize: 'vertical', fontFamily: 'ui-monospace, monospace', background: '#f8fafc', lineHeight: 1.5 };
const hint: React.CSSProperties = { fontSize: '0.75rem', color: '#94a3b8' };
const muted: React.CSSProperties = { color: '#64748b', fontSize: '0.9rem' };
const linkStyle: React.CSSProperties = { color: '#2563eb', textDecoration: 'none', fontWeight: 600 };
