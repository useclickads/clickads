import { describe, it, expect } from 'vitest';

type Operation = {
  type: 'insert' | 'delete' | 'move' | 'update';
  blockId: string;
  index?: number;
  props?: Record<string, unknown>;
  timestamp: number;
};

function transformAgainst(op: Operation, against: Operation): Operation {
  if (op.type === 'insert' && against.type === 'insert') {
    if (op.index !== undefined && against.index !== undefined && against.index <= op.index) {
      return { ...op, index: op.index + 1 };
    }
  }

  if (op.type === 'insert' && against.type === 'delete') {
    if (op.index !== undefined && against.index !== undefined && against.index < op.index) {
      return { ...op, index: op.index - 1 };
    }
  }

  if (op.type === 'delete' && against.type === 'insert') {
    if (op.index !== undefined && against.index !== undefined && against.index <= op.index) {
      return { ...op, index: op.index + 1 };
    }
  }

  if (op.type === 'delete' && against.type === 'delete') {
    if (op.index !== undefined && against.index !== undefined) {
      if (against.index < op.index) return { ...op, index: op.index - 1 };
      if (against.blockId === op.blockId) return { ...op, type: 'update', props: {} };
    }
  }

  if (op.type === 'update' && against.type === 'update' && op.blockId === against.blockId) {
    const mergedProps = { ...op.props };
    if (against.props) {
      for (const key of Object.keys(against.props)) {
        if (key in (op.props || {})) {
          if (against.timestamp > op.timestamp) {
            mergedProps[key] = against.props[key];
          }
        }
      }
    }
    return { ...op, props: mergedProps };
  }

  return op;
}

describe('Operational Transform', () => {
  it('shifts insert index when prior insert exists', () => {
    const op: Operation = { type: 'insert', blockId: 'b2', index: 2, timestamp: 100 };
    const against: Operation = { type: 'insert', blockId: 'b1', index: 1, timestamp: 99 };
    const result = transformAgainst(op, against);
    expect(result.index).toBe(3);
  });

  it('shifts insert index down when prior delete exists', () => {
    const op: Operation = { type: 'insert', blockId: 'b2', index: 3, timestamp: 100 };
    const against: Operation = { type: 'delete', blockId: 'b1', index: 1, timestamp: 99 };
    const result = transformAgainst(op, against);
    expect(result.index).toBe(2);
  });

  it('shifts delete index when prior insert exists', () => {
    const op: Operation = { type: 'delete', blockId: 'b2', index: 3, timestamp: 100 };
    const against: Operation = { type: 'insert', blockId: 'b1', index: 1, timestamp: 99 };
    const result = transformAgainst(op, against);
    expect(result.index).toBe(4);
  });

  it('handles concurrent delete of same block', () => {
    const op: Operation = { type: 'delete', blockId: 'b1', index: 2, timestamp: 100 };
    const against: Operation = { type: 'delete', blockId: 'b1', index: 2, timestamp: 99 };
    const result = transformAgainst(op, against);
    expect(result.type).toBe('update');
  });

  it('resolves concurrent updates with last-write-wins', () => {
    const op: Operation = { type: 'update', blockId: 'b1', props: { title: 'A' }, timestamp: 100 };
    const against: Operation = { type: 'update', blockId: 'b1', props: { title: 'B' }, timestamp: 200 };
    const result = transformAgainst(op, against);
    expect(result.props?.title).toBe('B');
  });

  it('keeps non-conflicting update props', () => {
    const op: Operation = { type: 'update', blockId: 'b1', props: { title: 'A', color: 'red' }, timestamp: 100 };
    const against: Operation = { type: 'update', blockId: 'b1', props: { title: 'B' }, timestamp: 200 };
    const result = transformAgainst(op, against);
    expect(result.props?.title).toBe('B');
    expect(result.props?.color).toBe('red');
  });

  it('does not transform unrelated operations', () => {
    const op: Operation = { type: 'update', blockId: 'b1', props: { title: 'A' }, timestamp: 100 };
    const against: Operation = { type: 'update', blockId: 'b2', props: { title: 'B' }, timestamp: 200 };
    const result = transformAgainst(op, against);
    expect(result.props?.title).toBe('A');
  });
});
