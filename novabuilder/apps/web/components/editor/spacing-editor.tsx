'use client';

import { useState } from 'react';

type SpacingValues = { top: number; right: number; bottom: number; left: number };

export function SpacingEditor({
  label,
  value,
  onChange,
  unit = 'px',
}: {
  label: string;
  value: SpacingValues;
  onChange: (v: SpacingValues) => void;
  unit?: string;
}) {
  const [linked, setLinked] = useState(false);

  function handleChange(side: keyof SpacingValues, val: number) {
    if (linked) {
      onChange({ top: val, right: val, bottom: val, left: val });
    } else {
      onChange({ ...value, [side]: val });
    }
  }

  return (
    <div style={containerStyle}>
      <div style={headerRow}>
        <label style={labelStyle}>{label}</label>
        <button
          onClick={() => setLinked(!linked)}
          style={{ ...linkBtn, color: linked ? '#2563eb' : '#94a3b8' }}
          title={linked ? 'Unlink sides' : 'Link all sides'}
        >
          {linked ? '⊞' : '⊟'}
        </button>
      </div>

      <div style={visualBox}>
        <input
          type="number"
          value={value.top}
          onChange={(e) => handleChange('top', Number(e.target.value))}
          style={{ ...inputStyle, gridArea: 'top' }}
          min={0}
        />
        <input
          type="number"
          value={value.right}
          onChange={(e) => handleChange('right', Number(e.target.value))}
          style={{ ...inputStyle, gridArea: 'right' }}
          min={0}
        />
        <input
          type="number"
          value={value.bottom}
          onChange={(e) => handleChange('bottom', Number(e.target.value))}
          style={{ ...inputStyle, gridArea: 'bottom' }}
          min={0}
        />
        <input
          type="number"
          value={value.left}
          onChange={(e) => handleChange('left', Number(e.target.value))}
          style={{ ...inputStyle, gridArea: 'left' }}
          min={0}
        />
        <div style={centerLabel}>{unit}</div>
      </div>

      <div style={quickActions}>
        {[0, 4, 8, 12, 16, 24, 32, 48].map((v) => (
          <button
            key={v}
            onClick={() => onChange({ top: v, right: v, bottom: v, left: v })}
            style={quickBtn}
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  );
}

const containerStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 8 };
const headerRow: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const labelStyle: React.CSSProperties = {
  fontSize: '0.75rem', fontWeight: 600, color: '#64748b',
  textTransform: 'uppercase', letterSpacing: '0.05em',
};
const linkBtn: React.CSSProperties = {
  width: 22, height: 22, borderRadius: 4, border: '1px solid #e2e8f0',
  background: '#fff', cursor: 'pointer', fontSize: '0.7rem', display: 'flex',
  alignItems: 'center', justifyContent: 'center', fontWeight: 700,
};
const visualBox: React.CSSProperties = {
  display: 'grid',
  gridTemplateAreas: `". top ." "left center right" ". bottom ."`,
  gridTemplateColumns: '1fr auto 1fr',
  gridTemplateRows: 'auto auto auto',
  gap: 4,
  padding: 8,
  background: '#f8fafc',
  borderRadius: 10,
  border: '1px solid #e2e8f0',
  justifyItems: 'center',
  alignItems: 'center',
};
const inputStyle: React.CSSProperties = {
  width: 44, height: 28, borderRadius: 6, border: '1px solid #e2e8f0',
  textAlign: 'center', fontSize: '0.75rem', color: '#334155', fontWeight: 600,
  outline: 'none', background: '#fff',
};
const centerLabel: React.CSSProperties = {
  gridArea: 'center', width: 36, height: 28, borderRadius: 6,
  background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontSize: '0.6rem', color: '#64748b', fontWeight: 700,
};
const quickActions: React.CSSProperties = { display: 'flex', gap: 2, flexWrap: 'wrap' };
const quickBtn: React.CSSProperties = {
  padding: '3px 7px', borderRadius: 4, border: '1px solid #e2e8f0',
  background: '#fff', cursor: 'pointer', fontSize: '0.65rem', color: '#64748b', fontWeight: 600,
};
