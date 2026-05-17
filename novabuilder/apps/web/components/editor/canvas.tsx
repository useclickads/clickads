'use client';

import { useCallback } from 'react';
import { useEditor } from '../../lib/editor/editor-context';
import { BlockRenderer } from './block-renderer';
import type { BlockType } from '../../lib/editor/types';

export function Canvas() {
  const { state, addBlock, selectBlock, moveBlock, setDragging, setDragOver } = useEditor();
  const { blocks, selectedBlockId, dragOverIndex } = state;

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
      <div style={canvasInner}>
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

function CanvasBlock({ block, index, isSelected, onSelect }: {
  block: { id: string; type: string; props: Record<string, unknown> };
  index: number;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const { setDragging } = useEditor();

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
      {isSelected && <div style={dragHandle}>⋮⋮</div>}
      <BlockRenderer block={block as any} />
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
        margin: '0 0',
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
const dragHandle: React.CSSProperties = { position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: '#2563eb', color: '#fff', padding: '2px 8px', borderRadius: 6, fontSize: '0.7rem', cursor: 'grab', zIndex: 10 };
