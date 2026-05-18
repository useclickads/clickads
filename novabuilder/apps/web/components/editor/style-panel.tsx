'use client';

import { useState } from 'react';

type StyleOverride = {
  cssClass?: string;
  animation?: 'none' | 'fade-in' | 'slide-up' | 'slide-left' | 'zoom-in';
  customCss?: string;
  margin?: string;
  padding?: string;
  background?: string;
  borderRadius?: string;
  opacity?: string;
};

export function StylePanel({ blockId, style, onChange }: {
  blockId: string | null;
  style: StyleOverride;
  onChange: (style: StyleOverride) => void;
}) {
  const [tab, setTab] = useState<'spacing' | 'appearance' | 'animation'>('spacing');

  if (!blockId) {
    return (
      <div style={panelStyle}>
        <p style={emptyText}>Select a block to edit its styles</p>
      </div>
    );
  }

  return (
    <div style={panelStyle}>
      <h3 style={titleStyle}>Style</h3>

      <div style={tabRow}>
        {(['spacing', 'appearance', 'animation'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} style={tab === t ? tabActive : tabBtn}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {tab === 'spacing' && (
        <div style={fieldGroup}>
          <label style={labelStyle}>
            Margin
            <input
              type="text"
              value={style.margin || ''}
              onChange={(e) => onChange({ ...style, margin: e.target.value })}
              style={inputStyle}
              placeholder="e.g. 16px 0"
            />
          </label>
          <label style={labelStyle}>
            Padding
            <input
              type="text"
              value={style.padding || ''}
              onChange={(e) => onChange({ ...style, padding: e.target.value })}
              style={inputStyle}
              placeholder="e.g. 24px"
            />
          </label>
        </div>
      )}

      {tab === 'appearance' && (
        <div style={fieldGroup}>
          <label style={labelStyle}>
            Background
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="color"
                value={style.background || '#ffffff'}
                onChange={(e) => onChange({ ...style, background: e.target.value })}
                style={{ width: 36, height: 32, borderRadius: 6, border: '1px solid #e2e8f0', cursor: 'pointer' }}
              />
              <input
                type="text"
                value={style.background || ''}
                onChange={(e) => onChange({ ...style, background: e.target.value })}
                style={{ ...inputStyle, flex: 1 }}
                placeholder="#ffffff or gradient"
              />
            </div>
          </label>
          <label style={labelStyle}>
            Border Radius
            <input
              type="text"
              value={style.borderRadius || ''}
              onChange={(e) => onChange({ ...style, borderRadius: e.target.value })}
              style={inputStyle}
              placeholder="e.g. 12px"
            />
          </label>
          <label style={labelStyle}>
            Opacity
            <input
              type="range"
              min="0"
              max="100"
              value={parseInt(style.opacity || '100')}
              onChange={(e) => onChange({ ...style, opacity: e.target.value })}
              style={{ width: '100%' }}
            />
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{style.opacity || '100'}%</span>
          </label>
          <label style={labelStyle}>
            CSS Class
            <input
              type="text"
              value={style.cssClass || ''}
              onChange={(e) => onChange({ ...style, cssClass: e.target.value })}
              style={inputStyle}
              placeholder="custom-class"
            />
          </label>
        </div>
      )}

      {tab === 'animation' && (
        <div style={fieldGroup}>
          <label style={labelStyle}>
            Entrance Animation
            <select
              value={style.animation || 'none'}
              onChange={(e) => onChange({ ...style, animation: e.target.value as StyleOverride['animation'] })}
              style={inputStyle}
            >
              <option value="none">None</option>
              <option value="fade-in">Fade In</option>
              <option value="slide-up">Slide Up</option>
              <option value="slide-left">Slide Left</option>
              <option value="zoom-in">Zoom In</option>
            </select>
          </label>
          <label style={labelStyle}>
            Custom CSS
            <textarea
              value={style.customCss || ''}
              onChange={(e) => onChange({ ...style, customCss: e.target.value })}
              style={{ ...inputStyle, minHeight: 80, fontFamily: 'monospace', fontSize: '0.8rem' }}
              placeholder=".block { ... }"
              rows={4}
            />
          </label>
        </div>
      )}
    </div>
  );
}

const panelStyle: React.CSSProperties = { padding: 16, overflowY: 'auto', height: '100%' };
const titleStyle: React.CSSProperties = { margin: '0 0 12px', fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' };
const emptyText: React.CSSProperties = { color: '#94a3b8', fontSize: '0.85rem', textAlign: 'center', padding: 20 };
const tabRow: React.CSSProperties = { display: 'flex', gap: 2, marginBottom: 16, background: '#f1f5f9', borderRadius: 8, padding: 2 };
const tabBtn: React.CSSProperties = { flex: 1, padding: '6px 0', borderRadius: 6, border: 'none', background: 'transparent', color: '#64748b', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' };
const tabActive: React.CSSProperties = { ...tabBtn, background: '#fff', color: '#0f172a', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' };
const fieldGroup: React.CSSProperties = { display: 'grid', gap: 12 };
const labelStyle: React.CSSProperties = { display: 'grid', gap: 4, fontSize: '0.8rem', fontWeight: 600, color: '#334155' };
const inputStyle: React.CSSProperties = { padding: '8px 10px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '0.85rem' };
