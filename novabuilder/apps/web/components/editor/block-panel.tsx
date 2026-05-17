'use client';

import { useState } from 'react';
import { BLOCK_DEFINITIONS } from '../../lib/editor/blocks';
import { useEditor } from '../../lib/editor/editor-context';
import type { BlockType } from '../../lib/editor/types';

const CATEGORIES = [
  { key: 'layout', label: 'Layout' },
  { key: 'content', label: 'Content' },
  { key: 'media', label: 'Media' },
  { key: 'interactive', label: 'Interactive' },
] as const;

export function BlockPanel() {
  const { addBlock } = useEditor();
  const [activeCategory, setActiveCategory] = useState<string>('layout');

  function handleDragStart(e: React.DragEvent, type: BlockType) {
    e.dataTransfer.setData('block-type', type);
    e.dataTransfer.effectAllowed = 'copy';
  }

  const filteredBlocks = BLOCK_DEFINITIONS.filter((b) => b.category === activeCategory);

  return (
    <div style={panelStyle}>
      <h3 style={panelTitle}>Blocks</h3>
      <div style={tabsStyle}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            style={activeCategory === cat.key ? activeTab : tab}
          >
            {cat.label}
          </button>
        ))}
      </div>
      <div style={gridStyle}>
        {filteredBlocks.map((def) => (
          <button
            key={def.type}
            draggable
            onDragStart={(e) => handleDragStart(e, def.type)}
            onClick={() => addBlock(def.type)}
            style={blockBtn}
            title={`Add ${def.label} block`}
          >
            <span style={iconStyle}>{def.icon}</span>
            <span style={blockLabel}>{def.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

const panelStyle: React.CSSProperties = { width: 220, background: '#fff', borderRight: '1px solid #e2e8f0', padding: 16, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 12 };
const panelTitle: React.CSSProperties = { margin: 0, fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' };
const tabsStyle: React.CSSProperties = { display: 'flex', flexWrap: 'wrap', gap: 4 };
const tab: React.CSSProperties = { padding: '6px 10px', borderRadius: 6, border: 'none', background: '#f1f5f9', color: '#475569', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' };
const activeTab: React.CSSProperties = { ...tab, background: '#0f172a', color: '#fff' };
const gridStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 };
const blockBtn: React.CSSProperties = { padding: '12px 8px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#f8fafc', cursor: 'grab', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 };
const iconStyle: React.CSSProperties = { fontSize: '1.2rem' };
const blockLabel: React.CSSProperties = { fontSize: '0.7rem', color: '#475569', fontWeight: 600 };
