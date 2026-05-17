'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export function InlineEdit({ value, onChange, style, tag = 'div' }: {
  value: string;
  onChange: (value: string) => void;
  style?: React.CSSProperties;
  tag?: 'div' | 'h1' | 'h2' | 'h3' | 'p' | 'span';
}) {
  const ref = useRef<HTMLElement>(null);
  const [editing, setEditing] = useState(false);
  const lastValue = useRef(value);

  useEffect(() => {
    if (ref.current && !editing && ref.current.textContent !== value) {
      ref.current.textContent = value;
    }
    lastValue.current = value;
  }, [value, editing]);

  const handleBlur = useCallback(() => {
    setEditing(false);
    const newValue = ref.current?.textContent || '';
    if (newValue !== lastValue.current) {
      onChange(newValue);
    }
  }, [onChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      ref.current?.blur();
    }
    e.stopPropagation();
  }, []);

  const Tag = tag;

  return (
    <Tag
      ref={ref as any}
      contentEditable
      suppressContentEditableWarning
      onFocus={() => setEditing(true)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      onClick={(e) => e.stopPropagation()}
      style={{ ...style, outline: 'none', cursor: 'text', minWidth: 20 }}
    >
      {value}
    </Tag>
  );
}
