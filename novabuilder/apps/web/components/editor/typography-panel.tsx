'use client';

import { useState } from 'react';

type TypographyConfig = {
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  lineHeight: number;
  letterSpacing: number;
  textAlign: 'left' | 'center' | 'right' | 'justify';
  textTransform: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  textDecoration: 'none' | 'underline' | 'line-through';
};

const FONT_STACKS = [
  { label: 'System', value: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
  { label: 'Inter', value: '"Inter", sans-serif' },
  { label: 'Roboto', value: '"Roboto", sans-serif' },
  { label: 'Poppins', value: '"Poppins", sans-serif' },
  { label: 'Playfair', value: '"Playfair Display", serif' },
  { label: 'Space Grotesk', value: '"Space Grotesk", sans-serif' },
  { label: 'DM Sans', value: '"DM Sans", sans-serif' },
  { label: 'JetBrains Mono', value: '"JetBrains Mono", monospace' },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Mono', value: 'ui-monospace, "Cascadia Code", monospace' },
];

const WEIGHTS = [100, 200, 300, 400, 500, 600, 700, 800, 900];

export function TypographyPanel({
  value,
  onChange,
}: {
  value: Partial<TypographyConfig>;
  onChange: (v: Partial<TypographyConfig>) => void;
}) {
  const config: TypographyConfig = {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: 16,
    fontWeight: 400,
    lineHeight: 1.5,
    letterSpacing: 0,
    textAlign: 'left',
    textTransform: 'none',
    textDecoration: 'none',
    ...value,
  };

  function update(key: keyof TypographyConfig, val: string | number) {
    onChange({ ...config, [key]: val });
  }

  return (
    <div style={containerStyle}>
      <div style={sectionStyle}>
        <label style={labelStyle}>Font Family</label>
        <select
          value={config.fontFamily}
          onChange={(e) => update('fontFamily', e.target.value)}
          style={selectStyle}
        >
          {FONT_STACKS.map((f) => (
            <option key={f.label} value={f.value}>{f.label}</option>
          ))}
        </select>
      </div>

      <div style={rowStyle}>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Size</label>
          <div style={inputRow}>
            <input
              type="number"
              value={config.fontSize}
              onChange={(e) => update('fontSize', Number(e.target.value))}
              style={numInput}
              min={8}
              max={200}
            />
            <span style={unitLabel}>px</span>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Weight</label>
          <select
            value={config.fontWeight}
            onChange={(e) => update('fontWeight', Number(e.target.value))}
            style={selectStyle}
          >
            {WEIGHTS.map((w) => (
              <option key={w} value={w}>{w}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={rowStyle}>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Line Height</label>
          <input
            type="number"
            value={config.lineHeight}
            onChange={(e) => update('lineHeight', Number(e.target.value))}
            style={numInput}
            min={0.5}
            max={4}
            step={0.1}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Letter Spacing</label>
          <div style={inputRow}>
            <input
              type="number"
              value={config.letterSpacing}
              onChange={(e) => update('letterSpacing', Number(e.target.value))}
              style={numInput}
              min={-5}
              max={20}
              step={0.1}
            />
            <span style={unitLabel}>px</span>
          </div>
        </div>
      </div>

      <div style={sectionStyle}>
        <label style={labelStyle}>Alignment</label>
        <div style={btnGroup}>
          {(['left', 'center', 'right', 'justify'] as const).map((a) => (
            <button
              key={a}
              onClick={() => update('textAlign', a)}
              style={{ ...toggleBtn, ...(config.textAlign === a ? activeBtn : {}) }}
            >
              {{ left: '≡', center: '≣', right: '⊟', justify: '☰' }[a]}
            </button>
          ))}
        </div>
      </div>

      <div style={rowStyle}>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Transform</label>
          <div style={btnGroup}>
            {(['none', 'uppercase', 'lowercase', 'capitalize'] as const).map((t) => (
              <button
                key={t}
                onClick={() => update('textTransform', t)}
                style={{ ...toggleBtn, fontSize: '0.55rem', ...(config.textTransform === t ? activeBtn : {}) }}
              >
                {{ none: '—', uppercase: 'AA', lowercase: 'aa', capitalize: 'Aa' }[t]}
              </button>
            ))}
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Decoration</label>
          <div style={btnGroup}>
            {(['none', 'underline', 'line-through'] as const).map((d) => (
              <button
                key={d}
                onClick={() => update('textDecoration', d)}
                style={{ ...toggleBtn, ...(config.textDecoration === d ? activeBtn : {}) }}
              >
                {{ none: '—', underline: 'U', 'line-through': 'S' }[d]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={previewBox}>
        <p style={{
          fontFamily: config.fontFamily,
          fontSize: config.fontSize,
          fontWeight: config.fontWeight,
          lineHeight: config.lineHeight,
          letterSpacing: config.letterSpacing,
          textAlign: config.textAlign,
          textTransform: config.textTransform,
          textDecoration: config.textDecoration,
          margin: 0,
          color: '#1e293b',
        }}>
          The quick brown fox
        </p>
      </div>
    </div>
  );
}

const containerStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 12 };
const sectionStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 4 };
const rowStyle: React.CSSProperties = { display: 'flex', gap: 10 };
const labelStyle: React.CSSProperties = {
  fontSize: '0.65rem', fontWeight: 600, color: '#94a3b8',
  textTransform: 'uppercase', letterSpacing: '0.05em',
};
const selectStyle: React.CSSProperties = {
  width: '100%', padding: '6px 8px', borderRadius: 6, border: '1px solid #e2e8f0',
  fontSize: '0.8rem', color: '#334155', background: '#fff', outline: 'none',
};
const numInput: React.CSSProperties = {
  width: '100%', padding: '6px 8px', borderRadius: 6, border: '1px solid #e2e8f0',
  fontSize: '0.8rem', color: '#334155', outline: 'none', background: '#fff',
};
const inputRow: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 4 };
const unitLabel: React.CSSProperties = { fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 };
const btnGroup: React.CSSProperties = { display: 'flex', gap: 2 };
const toggleBtn: React.CSSProperties = {
  flex: 1, padding: '6px 0', borderRadius: 6, border: '1px solid #e2e8f0',
  background: '#fff', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 700, color: '#64748b',
};
const activeBtn: React.CSSProperties = { background: '#eff6ff', borderColor: '#2563eb', color: '#2563eb' };
const previewBox: React.CSSProperties = {
  padding: 12, borderRadius: 8, background: '#f8fafc', border: '1px solid #e2e8f0',
  overflow: 'hidden',
};
