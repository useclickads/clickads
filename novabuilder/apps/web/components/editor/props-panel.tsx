'use client';

import { useEditor } from '../../lib/editor/editor-context';
import { getBlockDefinition } from '../../lib/editor/blocks';

export function PropsPanel() {
  const { state, getSelectedBlock, updateBlockProps, removeBlock, duplicateBlock } = useEditor();
  const block = getSelectedBlock();

  if (!block) {
    return (
      <div style={panelStyle}>
        <p style={emptyText}>Select a block to edit its properties</p>
      </div>
    );
  }

  const def = getBlockDefinition(block.type);

  return (
    <div style={panelStyle}>
      <div style={headerStyle}>
        <h3 style={titleStyle}>{def?.label || block.type}</h3>
        <div style={actionsStyle}>
          <button onClick={() => duplicateBlock(block.id)} style={actionBtn} title="Duplicate">⧉</button>
          <button onClick={() => removeBlock(block.id)} style={deleteBtn} title="Delete">✕</button>
        </div>
      </div>
      <div style={fieldsContainer}>
        {Object.entries(block.props).map(([key, value]) => (
          <PropField
            key={`${block.id}-${key}`}
            label={key}
            value={value}
            onChange={(newValue) => updateBlockProps(block.id, { [key]: newValue })}
          />
        ))}
      </div>
    </div>
  );
}

function PropField({ label, value, onChange }: { label: string; value: unknown; onChange: (v: unknown) => void }) {
  const displayLabel = label.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase());

  if (typeof value === 'boolean') {
    return (
      <label style={fieldStyle}>
        <span style={labelText}>{displayLabel}</span>
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
          style={{ width: 18, height: 18 }}
        />
      </label>
    );
  }

  if (typeof value === 'number') {
    return (
      <label style={fieldStyle}>
        <span style={labelText}>{displayLabel}</span>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={inputStyle}
        />
      </label>
    );
  }

  const strValue = String(value ?? '');

  if (label === 'align') {
    return (
      <label style={fieldStyle}>
        <span style={labelText}>{displayLabel}</span>
        <select value={strValue} onChange={(e) => onChange(e.target.value)} style={inputStyle}>
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </label>
    );
  }

  if (label === 'variant') {
    return (
      <label style={fieldStyle}>
        <span style={labelText}>{displayLabel}</span>
        <select value={strValue} onChange={(e) => onChange(e.target.value)} style={inputStyle}>
          <option value="primary">Primary</option>
          <option value="secondary">Secondary</option>
          <option value="outline">Outline</option>
        </select>
      </label>
    );
  }

  if (label === 'size') {
    return (
      <label style={fieldStyle}>
        <span style={labelText}>{displayLabel}</span>
        <select value={strValue} onChange={(e) => onChange(e.target.value)} style={inputStyle}>
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </label>
    );
  }

  if (strValue.length > 80 || label === 'content' || label === 'fields' || label === 'links') {
    return (
      <label style={fieldStyle}>
        <span style={labelText}>{displayLabel}</span>
        <textarea
          value={strValue}
          onChange={(e) => onChange(e.target.value)}
          style={{ ...inputStyle, minHeight: 72, resize: 'vertical' }}
        />
      </label>
    );
  }

  if (label === 'color' || label.toLowerCase().includes('color')) {
    return (
      <label style={fieldStyle}>
        <span style={labelText}>{displayLabel}</span>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input type="color" value={strValue || '#000000'} onChange={(e) => onChange(e.target.value)} style={{ width: 32, height: 32, border: 'none', borderRadius: 6, cursor: 'pointer' }} />
          <input type="text" value={strValue} onChange={(e) => onChange(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
        </div>
      </label>
    );
  }

  return (
    <label style={fieldStyle}>
      <span style={labelText}>{displayLabel}</span>
      <input
        type="text"
        value={strValue}
        onChange={(e) => onChange(e.target.value)}
        style={inputStyle}
      />
    </label>
  );
}

const panelStyle: React.CSSProperties = { width: 280, background: '#fff', borderLeft: '1px solid #e2e8f0', padding: 16, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 12 };
const emptyText: React.CSSProperties = { color: '#94a3b8', fontSize: '0.85rem', textAlign: 'center', marginTop: 32 };
const headerStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const titleStyle: React.CSSProperties = { margin: 0, fontSize: '0.95rem', color: '#0f172a' };
const actionsStyle: React.CSSProperties = { display: 'flex', gap: 4 };
const actionBtn: React.CSSProperties = { width: 28, height: 28, borderRadius: 6, border: '1px solid #e2e8f0', background: '#f8fafc', cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const deleteBtn: React.CSSProperties = { ...actionBtn, color: '#dc2626', borderColor: '#fecaca' };
const fieldsContainer: React.CSSProperties = { display: 'grid', gap: 12 };
const fieldStyle: React.CSSProperties = { display: 'grid', gap: 4 };
const labelText: React.CSSProperties = { fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'capitalize' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '0.85rem', color: '#1e293b' };
