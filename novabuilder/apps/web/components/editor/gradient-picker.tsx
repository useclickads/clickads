'use client';

import { useState } from 'react';

type GradientStop = { color: string; position: number };
type GradientType = 'linear' | 'radial' | 'conic';

const PRESETS: { name: string; css: string }[] = [
  { name: 'Sunset', css: 'linear-gradient(135deg, #f97316, #ec4899)' },
  { name: 'Ocean', css: 'linear-gradient(135deg, #06b6d4, #3b82f6)' },
  { name: 'Forest', css: 'linear-gradient(135deg, #22c55e, #14b8a6)' },
  { name: 'Lavender', css: 'linear-gradient(135deg, #8b5cf6, #ec4899)' },
  { name: 'Night', css: 'linear-gradient(135deg, #1e293b, #475569)' },
  { name: 'Fire', css: 'linear-gradient(135deg, #ef4444, #f59e0b)' },
  { name: 'Sky', css: 'linear-gradient(135deg, #38bdf8, #818cf8)' },
  { name: 'Mint', css: 'linear-gradient(135deg, #34d399, #a78bfa)' },
];

export function GradientPicker({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (css: string) => void;
  label?: string;
}) {
  const [type, setType] = useState<GradientType>('linear');
  const [angle, setAngle] = useState(135);
  const [stops, setStops] = useState<GradientStop[]>([
    { color: '#3b82f6', position: 0 },
    { color: '#8b5cf6', position: 100 },
  ]);
  const [activeStop, setActiveStop] = useState(0);

  function buildCss(t: GradientType, a: number, s: GradientStop[]) {
    const sorted = [...s].sort((a, b) => a.position - b.position);
    const stopsStr = sorted.map((st) => `${st.color} ${st.position}%`).join(', ');
    if (t === 'linear') return `linear-gradient(${a}deg, ${stopsStr})`;
    if (t === 'radial') return `radial-gradient(circle, ${stopsStr})`;
    return `conic-gradient(from ${a}deg, ${stopsStr})`;
  }

  function updateAndEmit(t: GradientType, a: number, s: GradientStop[]) {
    setType(t);
    setAngle(a);
    setStops(s);
    onChange(buildCss(t, a, s));
  }

  function updateStop(index: number, updates: Partial<GradientStop>) {
    const newStops = stops.map((s, i) => (i === index ? { ...s, ...updates } : s));
    updateAndEmit(type, angle, newStops);
  }

  function addStop() {
    if (stops.length >= 5) return;
    const newStop = { color: '#64748b', position: 50 };
    const newStops = [...stops, newStop];
    setActiveStop(newStops.length - 1);
    updateAndEmit(type, angle, newStops);
  }

  function removeStop(index: number) {
    if (stops.length <= 2) return;
    const newStops = stops.filter((_, i) => i !== index);
    setActiveStop(Math.min(activeStop, newStops.length - 1));
    updateAndEmit(type, angle, newStops);
  }

  return (
    <div style={containerStyle}>
      {label && <label style={labelStyle}>{label}</label>}

      <div style={{ ...previewBox, background: buildCss(type, angle, stops) }} />

      <div style={controlRow}>
        {(['linear', 'radial', 'conic'] as const).map((t) => (
          <button
            key={t}
            onClick={() => updateAndEmit(t, angle, stops)}
            style={{ ...typeBtn, ...(type === t ? typeBtnActive : {}) }}
          >
            {t}
          </button>
        ))}
      </div>

      {(type === 'linear' || type === 'conic') && (
        <div style={controlRow}>
          <label style={smallLabel}>Angle</label>
          <input
            type="range"
            min={0}
            max={360}
            value={angle}
            onChange={(e) => updateAndEmit(type, Number(e.target.value), stops)}
            style={{ flex: 1 }}
          />
          <span style={angleValue}>{angle}°</span>
        </div>
      )}

      <div style={stopsSection}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label style={smallLabel}>Color Stops</label>
          {stops.length < 5 && (
            <button onClick={addStop} style={addBtn}>+ Add</button>
          )}
        </div>
        {stops.map((stop, i) => (
          <div key={i} style={{ ...stopRow, border: i === activeStop ? '1px solid #2563eb' : '1px solid #e2e8f0' }} onClick={() => setActiveStop(i)}>
            <input
              type="color"
              value={stop.color}
              onChange={(e) => updateStop(i, { color: e.target.value })}
              style={colorInput}
            />
            <input
              type="range"
              min={0}
              max={100}
              value={stop.position}
              onChange={(e) => updateStop(i, { position: Number(e.target.value) })}
              style={{ flex: 1 }}
            />
            <span style={posValue}>{stop.position}%</span>
            {stops.length > 2 && (
              <button onClick={() => removeStop(i)} style={removeBtn}>✕</button>
            )}
          </div>
        ))}
      </div>

      <div style={presetsSection}>
        <label style={smallLabel}>Presets</label>
        <div style={presetGrid}>
          {PRESETS.map((p) => (
            <button
              key={p.name}
              onClick={() => onChange(p.css)}
              style={{ ...presetBtn, background: p.css }}
              title={p.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const containerStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 10 };
const labelStyle: React.CSSProperties = {
  fontSize: '0.75rem', fontWeight: 600, color: '#64748b',
  textTransform: 'uppercase', letterSpacing: '0.05em',
};
const previewBox: React.CSSProperties = {
  width: '100%', height: 60, borderRadius: 10, border: '1px solid #e2e8f0',
};
const controlRow: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 6 };
const typeBtn: React.CSSProperties = {
  flex: 1, padding: '6px 0', borderRadius: 6, border: '1px solid #e2e8f0',
  background: '#fff', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 600,
  color: '#64748b', textTransform: 'capitalize',
};
const typeBtnActive: React.CSSProperties = { background: '#eff6ff', borderColor: '#2563eb', color: '#2563eb' };
const smallLabel: React.CSSProperties = { fontSize: '0.65rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' };
const angleValue: React.CSSProperties = { fontSize: '0.75rem', color: '#64748b', fontWeight: 600, minWidth: 32, textAlign: 'right' };
const stopsSection: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 6 };
const stopRow: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 6, padding: '6px 8px',
  borderRadius: 8, cursor: 'pointer',
};
const colorInput: React.CSSProperties = { width: 24, height: 24, border: 'none', borderRadius: 4, cursor: 'pointer', padding: 0 };
const posValue: React.CSSProperties = { fontSize: '0.7rem', color: '#64748b', fontWeight: 600, minWidth: 28 };
const addBtn: React.CSSProperties = {
  border: 'none', background: 'none', color: '#2563eb', fontSize: '0.7rem',
  fontWeight: 600, cursor: 'pointer',
};
const removeBtn: React.CSSProperties = {
  width: 18, height: 18, borderRadius: 4, border: 'none', background: '#fef2f2',
  color: '#dc2626', fontSize: '0.55rem', cursor: 'pointer', display: 'flex',
  alignItems: 'center', justifyContent: 'center',
};
const presetsSection: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 6 };
const presetGrid: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4 };
const presetBtn: React.CSSProperties = { height: 28, borderRadius: 6, border: '1px solid #e2e8f0', cursor: 'pointer', padding: 0 };
