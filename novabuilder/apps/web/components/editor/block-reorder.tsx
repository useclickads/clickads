'use client';

import { useState, useRef, useCallback } from 'react';

type Block = { id: string; type: string; props: Record<string, unknown> };

export function BlockReorder({
  blocks,
  onReorder,
  renderBlock,
}: {
  blocks: Block[];
  onReorder: (newBlocks: Block[]) => void;
  renderBlock: (block: Block, index: number) => React.ReactNode;
}) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const dragRef = useRef<number | null>(null);

  const handleDragStart = useCallback((index: number) => {
    setDragIndex(index);
    dragRef.current = index;
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    setOverIndex(index);
  }, []);

  const handleDrop = useCallback((dropIndex: number) => {
    const from = dragRef.current;
    if (from === null || from === dropIndex) {
      setDragIndex(null);
      setOverIndex(null);
      return;
    }

    const newBlocks = [...blocks];
    const [moved] = newBlocks.splice(from, 1);
    newBlocks.splice(dropIndex, 0, moved);
    onReorder(newBlocks);

    setDragIndex(null);
    setOverIndex(null);
    dragRef.current = null;
  }, [blocks, onReorder]);

  const handleDragEnd = useCallback(() => {
    setDragIndex(null);
    setOverIndex(null);
    dragRef.current = null;
  }, []);

  return (
    <div style={{ display: 'grid', gap: 2 }}>
      {blocks.map((block, index) => (
        <div
          key={block.id}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDrop={() => handleDrop(index)}
          onDragEnd={handleDragEnd}
          style={{
            ...blockWrapper,
            opacity: dragIndex === index ? 0.4 : 1,
            borderTop: overIndex === index && dragIndex !== null && dragIndex > index ? '2px solid #6366f1' : '2px solid transparent',
            borderBottom: overIndex === index && dragIndex !== null && dragIndex < index ? '2px solid #6366f1' : '2px solid transparent',
          }}
        >
          <div style={handleStyle} title="Drag to reorder">
            <span style={{ fontSize: '0.7rem', color: '#94a3b8', lineHeight: 1 }}>⠿</span>
          </div>
          <div style={{ flex: 1 }}>
            {renderBlock(block, index)}
          </div>
        </div>
      ))}
    </div>
  );
}

const blockWrapper: React.CSSProperties = {
  display: 'flex', alignItems: 'stretch', borderRadius: 8,
  transition: 'opacity 0.15s, border-color 0.15s',
  cursor: 'grab',
};
const handleStyle: React.CSSProperties = {
  width: 24, display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'grab', userSelect: 'none', flexShrink: 0,
};
