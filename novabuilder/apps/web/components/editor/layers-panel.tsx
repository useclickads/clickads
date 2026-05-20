'use client';

import { useState } from 'react';

type Block = { id: string; type: string; props: Record<string, unknown>; children?: Block[] };

export function LayersPanel({
  blocks,
  selectedId,
  onSelect,
  onToggleVisibility,
  onDelete,
  onDuplicate,
}: {
  blocks: Block[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onToggleVisibility?: (id: string) => void;
  onDelete?: (id: string) => void;
  onDuplicate?: (id: string) => void;
}) {
  return (
    <div style={panelStyle}>
      <div style={headerStyle}>
        <h3 style={titleStyle}>Layers</h3>
        <span style={countStyle}>{blocks.length}</span>
      </div>
      <div style={listStyle}>
        {blocks.length === 0 ? (
          <p style={emptyStyle}>No blocks yet</p>
        ) : (
          blocks.map((block, index) => (
            <LayerItem
              key={block.id}
              block={block}
              index={index}
              depth={0}
              selectedId={selectedId}
              onSelect={onSelect}
              onToggleVisibility={onToggleVisibility}
              onDelete={onDelete}
              onDuplicate={onDuplicate}
            />
          ))
        )}
      </div>
    </div>
  );
}

function LayerItem({
  block,
  index,
  depth,
  selectedId,
  onSelect,
  onToggleVisibility,
  onDelete,
  onDuplicate,
}: {
  block: Block;
  index: number;
  depth: number;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onToggleVisibility?: (id: string) => void;
  onDelete?: (id: string) => void;
  onDuplicate?: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const [showActions, setShowActions] = useState(false);
  const isSelected = selectedId === block.id;
  const hasChildren = block.children && block.children.length > 0;
  const label = (block.props.title as string) || (block.props.text as string)?.slice(0, 20) || block.type;

  return (
    <div>
      <div
        style={{
          ...itemStyle,
          paddingLeft: 8 + depth * 16,
          background: isSelected ? '#eff6ff' : showActions ? '#f8fafc' : 'transparent',
          borderLeft: isSelected ? '2px solid #2563eb' : '2px solid transparent',
        }}
        onClick={() => onSelect(block.id)}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        {hasChildren && (
          <button
            onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
            style={expandBtn}
          >
            {expanded ? '▾' : '▸'}
          </button>
        )}
        {!hasChildren && <span style={{ width: 16 }} />}

        <span style={typeIcon}>{getBlockIcon(block.type)}</span>
        <span style={labelStyle}>{label}</span>
        <span style={indexLabel}>#{index + 1}</span>

        {showActions && (
          <div style={actionsStyle}>
            {onToggleVisibility && (
              <button onClick={(e) => { e.stopPropagation(); onToggleVisibility(block.id); }} style={actionBtnStyle} title="Toggle visibility">
                ◉
              </button>
            )}
            {onDuplicate && (
              <button onClick={(e) => { e.stopPropagation(); onDuplicate(block.id); }} style={actionBtnStyle} title="Duplicate">
                ⊕
              </button>
            )}
            {onDelete && (
              <button onClick={(e) => { e.stopPropagation(); onDelete(block.id); }} style={{ ...actionBtnStyle, color: '#ef4444' }} title="Delete">
                ✕
              </button>
            )}
          </div>
        )}
      </div>

      {hasChildren && expanded && block.children!.map((child, i) => (
        <LayerItem
          key={child.id}
          block={child}
          index={i}
          depth={depth + 1}
          selectedId={selectedId}
          onSelect={onSelect}
          onToggleVisibility={onToggleVisibility}
          onDelete={onDelete}
          onDuplicate={onDuplicate}
        />
      ))}
    </div>
  );
}

function getBlockIcon(type: string): string {
  const icons: Record<string, string> = {
    heading: 'H', text: 'T', image: '▣', button: '◻', hero: '★',
    features: '⊞', pricing: '$', gallery: '▦', form: '☐', video: '▶',
    divider: '—', spacer: '↕', columns: '▥', container: '□', footer: '▬',
    nav: '≡', cta: '►', testimonials: '"', cards: '▤', code: '<>',
  };
  return icons[type] || '◇';
}

const panelStyle: React.CSSProperties = {
  width: 240, borderRight: '1px solid #e2e8f0', background: '#fff',
  display: 'flex', flexDirection: 'column', height: '100%',
};
const headerStyle: React.CSSProperties = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  padding: '12px 12px 8px', borderBottom: '1px solid #f1f5f9',
};
const titleStyle: React.CSSProperties = { margin: 0, fontSize: '0.8rem', fontWeight: 700, color: '#334155' };
const countStyle: React.CSSProperties = {
  padding: '2px 8px', borderRadius: 10, background: '#f1f5f9',
  fontSize: '0.65rem', fontWeight: 700, color: '#64748b',
};
const listStyle: React.CSSProperties = { flex: 1, overflow: 'auto', padding: '4px 0' };
const emptyStyle: React.CSSProperties = { padding: '20px 12px', color: '#94a3b8', fontSize: '0.8rem', textAlign: 'center' };
const itemStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 6, padding: '5px 8px',
  cursor: 'pointer', fontSize: '0.8rem', transition: 'background 0.1s',
  position: 'relative',
};
const expandBtn: React.CSSProperties = {
  width: 16, height: 16, border: 'none', background: 'none', cursor: 'pointer',
  padding: 0, fontSize: '0.6rem', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center',
};
const typeIcon: React.CSSProperties = {
  width: 18, height: 18, borderRadius: 4, background: '#f1f5f9', display: 'flex',
  alignItems: 'center', justifyContent: 'center', fontSize: '0.55rem', color: '#64748b',
  fontWeight: 800, flexShrink: 0,
};
const labelStyle: React.CSSProperties = {
  flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
  color: '#334155', fontWeight: 500,
};
const indexLabel: React.CSSProperties = { fontSize: '0.6rem', color: '#cbd5e1', fontWeight: 600 };
const actionsStyle: React.CSSProperties = {
  display: 'flex', gap: 2, position: 'absolute', right: 8,
};
const actionBtnStyle: React.CSSProperties = {
  width: 18, height: 18, borderRadius: 4, border: 'none', background: '#f1f5f9',
  cursor: 'pointer', fontSize: '0.55rem', color: '#64748b', display: 'flex',
  alignItems: 'center', justifyContent: 'center',
};
