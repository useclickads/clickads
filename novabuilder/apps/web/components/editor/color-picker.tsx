'use client';

import { useState, useRef, useEffect } from 'react';

const PRESETS = [
  '#0f172a', '#1e293b', '#334155', '#475569', '#64748b',
  '#dc2626', '#ea580c', '#d97706', '#ca8a04', '#65a30d',
  '#16a34a', '#0d9488', '#0891b2', '#2563eb', '#7c3aed',
  '#9333ea', '#c026d3', '#db2777', '#e11d48', '#f43f5e',
  '#ffffff', '#f8fafc', '#f1f5f9', '#e2e8f0', '#cbd5e1',
];

export function ColorPicker({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (color: string) => void;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState(value);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => { setInput(value); }, [value]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleInputChange(val: string) {
    setInput(val);
    if (/^#[0-9a-fA-F]{3,8}$/.test(val) || /^rgb/.test(val)) {
      onChange(val);
    }
  }

  function handlePresetClick(color: string) {
    setInput(color);
    onChange(color);
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {label && <label style={labelStyle}>{label}</label>}
      <div style={triggerRow} onClick={() => setOpen(!open)}>
        <div style={{ ...swatch, background: value }} />
        <input
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          style={inputStyle}
          placeholder="#000000"
        />
      </div>

      {open && (
        <div style={popoverStyle}>
          <div style={presetGrid}>
            {PRESETS.map((color) => (
              <button
                key={color}
                onClick={() => handlePresetClick(color)}
                style={{
                  ...presetBtn,
                  background: color,
                  border: color === value ? '2px solid #2563eb' : '1px solid #e2e8f0',
                  boxShadow: color === '#ffffff' ? 'inset 0 0 0 1px #e2e8f0' : 'none',
                }}
              />
            ))}
          </div>
          <input
            type="color"
            value={value.startsWith('#') ? value : '#000000'}
            onChange={(e) => { setInput(e.target.value); onChange(e.target.value); }}
            style={nativePickerStyle}
          />
        </div>
      )}
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b',
  marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em',
};
const triggerRow: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px',
  borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer',
};
const swatch: React.CSSProperties = {
  width: 20, height: 20, borderRadius: 4, border: '1px solid #e2e8f0', flexShrink: 0,
};
const inputStyle: React.CSSProperties = {
  border: 'none', outline: 'none', fontSize: '0.8rem', fontFamily: 'monospace',
  color: '#334155', flex: 1, background: 'transparent', width: 80,
};
const popoverStyle: React.CSSProperties = {
  position: 'absolute', top: '100%', left: 0, marginTop: 4, padding: 12,
  borderRadius: 12, border: '1px solid #e2e8f0', background: '#fff',
  boxShadow: '0 8px 24px rgba(0,0,0,0.1)', zIndex: 100, width: 220,
};
const presetGrid: React.CSSProperties = {
  display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 4, marginBottom: 8,
};
const presetBtn: React.CSSProperties = {
  width: 32, height: 32, borderRadius: 6, cursor: 'pointer', padding: 0,
};
const nativePickerStyle: React.CSSProperties = {
  width: '100%', height: 32, border: 'none', borderRadius: 6, cursor: 'pointer',
  padding: 0,
};
