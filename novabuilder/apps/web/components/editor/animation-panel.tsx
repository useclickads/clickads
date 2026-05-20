'use client';

import { useState } from 'react';

type AnimationConfig = {
  type: 'none' | 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'scaleIn' | 'bounce' | 'rotate';
  duration: number;
  delay: number;
  easing: string;
  trigger: 'onLoad' | 'onScroll' | 'onHover';
};

const ANIMATIONS: { value: AnimationConfig['type']; label: string; preview: string }[] = [
  { value: 'none', label: 'None', preview: '' },
  { value: 'fadeIn', label: 'Fade In', preview: 'opacity: 0 → 1' },
  { value: 'slideUp', label: 'Slide Up', preview: 'translateY(20px) → 0' },
  { value: 'slideDown', label: 'Slide Down', preview: 'translateY(-20px) → 0' },
  { value: 'slideLeft', label: 'Slide Left', preview: 'translateX(20px) → 0' },
  { value: 'slideRight', label: 'Slide Right', preview: 'translateX(-20px) → 0' },
  { value: 'scaleIn', label: 'Scale In', preview: 'scale(0.9) → 1' },
  { value: 'bounce', label: 'Bounce', preview: 'translateY with bounce' },
  { value: 'rotate', label: 'Rotate', preview: 'rotate(90deg) → 0' },
];

const EASINGS = [
  { value: 'ease', label: 'Ease' },
  { value: 'ease-in', label: 'Ease In' },
  { value: 'ease-out', label: 'Ease Out' },
  { value: 'ease-in-out', label: 'Ease In Out' },
  { value: 'linear', label: 'Linear' },
  { value: 'cubic-bezier(0.34, 1.56, 0.64, 1)', label: 'Spring' },
  { value: 'cubic-bezier(0.22, 1, 0.36, 1)', label: 'Smooth' },
];

export function AnimationPanel({
  value,
  onChange,
}: {
  value: Partial<AnimationConfig>;
  onChange: (v: AnimationConfig) => void;
}) {
  const [playing, setPlaying] = useState(false);

  const config: AnimationConfig = {
    type: 'none',
    duration: 0.4,
    delay: 0,
    easing: 'ease-out',
    trigger: 'onScroll',
    ...value,
  };

  function update(key: keyof AnimationConfig, val: string | number) {
    onChange({ ...config, [key]: val });
  }

  function getKeyframes(type: AnimationConfig['type']): string {
    switch (type) {
      case 'fadeIn': return 'opacity: 0 → 1';
      case 'slideUp': return 'translateY(20px) → 0';
      case 'slideDown': return 'translateY(-20px) → 0';
      case 'slideLeft': return 'translateX(20px) → 0';
      case 'slideRight': return 'translateX(-20px) → 0';
      case 'scaleIn': return 'scale(0.9) → 1';
      case 'bounce': return 'translateY bounce';
      case 'rotate': return 'rotate(90deg) → 0';
      default: return '';
    }
  }

  function getPreviewStyle(): React.CSSProperties {
    if (!playing || config.type === 'none') return {};
    const base: React.CSSProperties = {
      transition: `all ${config.duration}s ${config.easing} ${config.delay}s`,
    };
    return base;
  }

  return (
    <div style={containerStyle}>
      <div style={sectionStyle}>
        <label style={labelStyle}>Animation Type</label>
        <div style={gridStyle}>
          {ANIMATIONS.map((anim) => (
            <button
              key={anim.value}
              onClick={() => update('type', anim.value)}
              style={{
                ...animBtn,
                ...(config.type === anim.value ? animBtnActive : {}),
              }}
            >
              <span style={animLabel}>{anim.label}</span>
            </button>
          ))}
        </div>
      </div>

      {config.type !== 'none' && (
        <>
          <div style={rowStyle}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Duration</label>
              <div style={inputRow}>
                <input
                  type="range"
                  min={0.1}
                  max={2}
                  step={0.1}
                  value={config.duration}
                  onChange={(e) => update('duration', Number(e.target.value))}
                  style={{ flex: 1 }}
                />
                <span style={valLabel}>{config.duration}s</span>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Delay</label>
              <div style={inputRow}>
                <input
                  type="range"
                  min={0}
                  max={2}
                  step={0.1}
                  value={config.delay}
                  onChange={(e) => update('delay', Number(e.target.value))}
                  style={{ flex: 1 }}
                />
                <span style={valLabel}>{config.delay}s</span>
              </div>
            </div>
          </div>

          <div style={sectionStyle}>
            <label style={labelStyle}>Easing</label>
            <select
              value={config.easing}
              onChange={(e) => update('easing', e.target.value)}
              style={selectStyle}
            >
              {EASINGS.map((ea) => (
                <option key={ea.value} value={ea.value}>{ea.label}</option>
              ))}
            </select>
          </div>

          <div style={sectionStyle}>
            <label style={labelStyle}>Trigger</label>
            <div style={btnGroup}>
              {(['onLoad', 'onScroll', 'onHover'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => update('trigger', t)}
                  style={{ ...triggerBtn, ...(config.trigger === t ? triggerActive : {}) }}
                >
                  {{ onLoad: 'Page Load', onScroll: 'Scroll Into View', onHover: 'Hover' }[t]}
                </button>
              ))}
            </div>
          </div>

          <div style={previewSection}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={labelStyle}>Preview</label>
              <button
                onClick={() => { setPlaying(false); setTimeout(() => setPlaying(true), 50); }}
                style={playBtn}
              >
                ▶ Play
              </button>
            </div>
            <div style={previewBox}>
              <div style={{ ...previewElement, ...getPreviewStyle() }}>
                {config.type}
              </div>
            </div>
            <div style={codeHint}>{getKeyframes(config.type)}</div>
          </div>
        </>
      )}
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
const gridStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4 };
const animBtn: React.CSSProperties = {
  padding: '8px 4px', borderRadius: 6, border: '1px solid #e2e8f0',
  background: '#fff', cursor: 'pointer', textAlign: 'center',
};
const animBtnActive: React.CSSProperties = { background: '#eff6ff', borderColor: '#2563eb' };
const animLabel: React.CSSProperties = { fontSize: '0.7rem', fontWeight: 600, color: '#334155' };
const inputRow: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 6 };
const valLabel: React.CSSProperties = { fontSize: '0.7rem', color: '#64748b', fontWeight: 600, minWidth: 28 };
const selectStyle: React.CSSProperties = {
  width: '100%', padding: '6px 8px', borderRadius: 6, border: '1px solid #e2e8f0',
  fontSize: '0.8rem', color: '#334155', background: '#fff', outline: 'none',
};
const btnGroup: React.CSSProperties = { display: 'flex', gap: 4 };
const triggerBtn: React.CSSProperties = {
  flex: 1, padding: '6px 4px', borderRadius: 6, border: '1px solid #e2e8f0',
  background: '#fff', cursor: 'pointer', fontSize: '0.65rem', fontWeight: 600, color: '#64748b',
};
const triggerActive: React.CSSProperties = { background: '#eff6ff', borderColor: '#2563eb', color: '#2563eb' };
const previewSection: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 6 };
const playBtn: React.CSSProperties = {
  border: 'none', background: '#eff6ff', color: '#2563eb', padding: '4px 10px',
  borderRadius: 6, fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer',
};
const previewBox: React.CSSProperties = {
  height: 60, borderRadius: 8, background: '#f8fafc', border: '1px solid #e2e8f0',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
};
const previewElement: React.CSSProperties = {
  width: 48, height: 48, borderRadius: 8, background: '#2563eb',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  color: '#fff', fontSize: '0.55rem', fontWeight: 700,
};
const codeHint: React.CSSProperties = {
  fontSize: '0.65rem', color: '#94a3b8', fontFamily: 'monospace', padding: '4px 8px',
  background: '#f8fafc', borderRadius: 4,
};
