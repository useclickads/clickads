'use client';

import { useState } from 'react';

type Device = 'desktop' | 'tablet' | 'mobile';

const DEVICE_SIZES: Record<Device, { width: number; height: number; label: string }> = {
  desktop: { width: 1440, height: 900, label: 'Desktop' },
  tablet: { width: 768, height: 1024, label: 'Tablet' },
  mobile: { width: 375, height: 812, label: 'Mobile' },
};

export function ResponsivePreview({
  children,
  onDeviceChange,
}: {
  children: React.ReactNode;
  onDeviceChange?: (device: Device) => void;
}) {
  const [device, setDevice] = useState<Device>('desktop');
  const [zoom, setZoom] = useState(100);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

  const size = DEVICE_SIZES[device];
  const w = orientation === 'landscape' && device !== 'desktop' ? size.height : size.width;
  const h = orientation === 'landscape' && device !== 'desktop' ? size.width : size.height;
  const scale = zoom / 100;

  function switchDevice(d: Device) {
    setDevice(d);
    onDeviceChange?.(d);
    if (d === 'desktop') setOrientation('portrait');
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#f1f5f9' }}>
      <div style={toolbarStyle}>
        <div style={{ display: 'flex', gap: 4 }}>
          {(Object.keys(DEVICE_SIZES) as Device[]).map((d) => (
            <button
              key={d}
              onClick={() => switchDevice(d)}
              style={device === d ? deviceBtnActive : deviceBtn}
            >
              {DEVICE_SIZES[d].label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {device !== 'desktop' && (
            <button
              onClick={() => setOrientation((o) => o === 'portrait' ? 'landscape' : 'portrait')}
              style={actionBtn}
            >
              {orientation === 'portrait' ? 'Landscape' : 'Portrait'}
            </button>
          )}

          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{w} x {h}</span>

          <select
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            style={selectStyle}
          >
            <option value={50}>50%</option>
            <option value={75}>75%</option>
            <option value={100}>100%</option>
            <option value={125}>125%</option>
            <option value={150}>150%</option>
          </select>
        </div>
      </div>

      <div style={canvasContainer}>
        <div
          style={{
            width: device === 'desktop' ? '100%' : w,
            maxWidth: '100%',
            height: device === 'desktop' ? '100%' : h,
            background: '#fff',
            borderRadius: device === 'desktop' ? 0 : 12,
            border: device === 'desktop' ? 'none' : '1px solid #e2e8f0',
            boxShadow: device === 'desktop' ? 'none' : '0 8px 32px rgba(0,0,0,0.08)',
            overflow: 'auto',
            transform: `scale(${scale})`,
            transformOrigin: 'top center',
            transition: 'width 0.3s, height 0.3s',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

const toolbarStyle: React.CSSProperties = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  padding: '8px 16px', background: '#fff', borderBottom: '1px solid #e2e8f0',
};
const deviceBtn: React.CSSProperties = {
  padding: '6px 12px', borderRadius: 6, border: '1px solid #e2e8f0', background: '#fff',
  color: '#64748b', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
};
const deviceBtnActive: React.CSSProperties = {
  ...deviceBtn, background: '#0f172a', color: '#fff', border: '1px solid #0f172a',
};
const actionBtn: React.CSSProperties = {
  padding: '4px 10px', borderRadius: 6, border: '1px solid #e2e8f0', background: '#fff',
  color: '#475569', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
};
const selectStyle: React.CSSProperties = {
  padding: '4px 8px', borderRadius: 6, border: '1px solid #e2e8f0', fontSize: '0.75rem',
  background: '#fff', color: '#475569',
};
const canvasContainer: React.CSSProperties = {
  flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'flex-start',
  padding: 24, overflow: 'auto',
};
