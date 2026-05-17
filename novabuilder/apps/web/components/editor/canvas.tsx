'use client';

import { useCallback } from 'react';
import { useEditor } from '../../lib/editor/editor-context';
import { EditableBlockRenderer } from './editable-block-renderer';
import type { BlockType } from '../../lib/editor/types';

const VIEWPORT_WIDTHS = { desktop: '100%', tablet: '768px', mobile: '375px' } as const;

export function Canvas() {
  const { state, addBlock, selectBlock, moveBlock, setDragging, setDragOver, viewport } = useEditor();
  const { blocks, selectedBlockId, dragOverIndex } = state;
  const canvasWidth = VIEWPORT_WIDTHS[viewport];

  const handleDrop = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOver(null);
    setDragging(false);

    const blockType = e.dataTransfer.getData('block-type') as BlockType;
    const fromIndex = e.dataTransfer.getData('block-index');

    if (blockType) {
      addBlock(blockType, index);
    } else if (fromIndex !== '') {
      moveBlock(Number(fromIndex), index);
    }
  }, [addBlock, moveBlock, setDragOver, setDragging]);

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOver(index);
  }, [setDragOver]);

  const handleDragLeave = useCallback(() => {
    setDragOver(null);
  }, [setDragOver]);

  return (
    <div style={canvasContainer} onClick={() => selectBlock(null)}>
      <div style={{ ...canvasInner, maxWidth: canvasWidth, transition: 'max-width 0.3s' }}>
        {blocks.length === 0 && (
          <div
            style={emptyCanvas}
            onDragOver={(e) => handleDragOver(e, 0)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, 0)}
          >
            <p style={{ margin: 0, fontWeight: 600, color: '#64748b' }}>Drag blocks here to start building</p>
            <p style={{ margin: '8px 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>Or click a block in the left panel</p>
          </div>
        )}
        {blocks.map((block, index) => (
          <div key={block.id}>
            <DropZone
              index={index}
              isActive={dragOverIndex === index}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
            />
            <CanvasBlock
              block={block}
              index={index}
              totalBlocks={blocks.length}
              isSelected={selectedBlockId === block.id}
              onSelect={() => selectBlock(block.id)}
            />
          </div>
        ))}
        {blocks.length > 0 && (
          <DropZone
            index={blocks.length}
            isActive={dragOverIndex === blocks.length}
            onDragOver={(e) => handleDragOver(e, blocks.length)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, blocks.length)}
          />
        )}
      </div>
    </div>
  );
}

function CanvasBlock({ block, index, totalBlocks, isSelected, onSelect }: {
  block: { id: string; type: string; props: Record<string, unknown>; children?: any[] };
  index: number;
  totalBlocks: number;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const { setDragging, moveBlock, removeBlock, duplicateBlock } = useEditor();

  function handleDragStart(e: React.DragEvent) {
    e.dataTransfer.setData('block-index', String(index));
    e.dataTransfer.effectAllowed = 'move';
    setDragging(true);
  }

  function handleDragEnd() {
    setDragging(false);
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={(e) => { e.stopPropagation(); onSelect(); }}
      style={{
        ...blockWrapper,
        outline: isSelected ? '2px solid #2563eb' : '2px solid transparent',
        outlineOffset: 2,
      }}
    >
      {isSelected && (
        <div style={toolbarOverlay}>
          <button
            style={toolBtn}
            disabled={index === 0}
            onClick={(e) => { e.stopPropagation(); moveBlock(index, index - 1); }}
            title="Move up"
          >↑</button>
          <button
            style={toolBtn}
            disabled={index === totalBlocks - 1}
            onClick={(e) => { e.stopPropagation(); moveBlock(index, index + 1); }}
            title="Move down"
          >↓</button>
          <button
            style={toolBtn}
            onClick={(e) => { e.stopPropagation(); duplicateBlock(block.id); }}
            title="Duplicate"
          >⧉</button>
          <button
            style={{ ...toolBtn, color: '#dc2626' }}
            onClick={(e) => { e.stopPropagation(); removeBlock(block.id); }}
            title="Delete"
          >✕</button>
          <span style={dragHandle}>⋮⋮</span>
        </div>
      )}
      <EditableBlockRenderer block={block as any} />
    </div>
  );
}

function DropZone({ index, isActive, onDragOver, onDragLeave, onDrop }: {
  index: number;
  isActive: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
}) {
  return (
    <div
      data-dropzone={index}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      style={{
        height: isActive ? 4 : 8,
        background: isActive ? '#2563eb' : 'transparent',
        borderRadius: 2,
        transition: 'all 0.15s',
      }}
    />
  );
}

const canvasContainer: React.CSSProperties = { flex: 1, overflow: 'auto', background: '#f1f5f9', padding: 32 };
const canvasInner: React.CSSProperties = { maxWidth: 900, margin: '0 auto', background: '#fff', borderRadius: 16, padding: 32, minHeight: 600, boxShadow: '0 4px 24px rgba(0,0,0,0.06)' };
const emptyCanvas: React.CSSProperties = { padding: 64, textAlign: 'center', border: '2px dashed #cbd5e1', borderRadius: 12 };
const blockWrapper: React.CSSProperties = { position: 'relative', cursor: 'pointer', borderRadius: 8, transition: 'outline 0.1s' };
const toolbarOverlay: React.CSSProperties = { position: 'absolute', top: -14, right: 0, display: 'flex', gap: 2, background: '#fff', borderRadius: 8, padding: '2px 4px', boxShadow: '0 2px 8px rgba(0,0,0,0.12)', zIndex: 10 };
const toolBtn: React.CSSProperties = { width: 24, height: 24, borderRadius: 4, border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const dragHandle: React.CSSProperties = { padding: '0 4px', cursor: 'grab', fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center' };
