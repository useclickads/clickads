import { describe, it, expect } from 'vitest';

type Block = { id: string; type: string; props: Record<string, unknown> };

function diffBlocks(blocksA: Block[], blocksB: Block[]) {
  const mapA = new Map(blocksA.map((b) => [b.id, b]));
  const mapB = new Map(blocksB.map((b) => [b.id, b]));

  const added: Block[] = [];
  const removed: Block[] = [];
  const modified: { blockId: string; type: string; changes: { field: string; before: unknown; after: unknown }[] }[] = [];

  for (const [id, block] of mapB) {
    if (!mapA.has(id)) {
      added.push(block);
    } else {
      const old = mapA.get(id)!;
      const changes: { field: string; before: unknown; after: unknown }[] = [];
      if (old.type !== block.type) changes.push({ field: 'type', before: old.type, after: block.type });
      const allKeys = new Set([...Object.keys(old.props), ...Object.keys(block.props)]);
      for (const key of allKeys) {
        if (JSON.stringify(old.props[key]) !== JSON.stringify(block.props[key])) {
          changes.push({ field: `props.${key}`, before: old.props[key], after: block.props[key] });
        }
      }
      if (changes.length > 0) modified.push({ blockId: id, type: block.type, changes });
    }
  }

  for (const [id, block] of mapA) {
    if (!mapB.has(id)) removed.push(block);
  }

  return { added, removed, modified };
}

describe('Version diff', () => {
  it('detects added blocks', () => {
    const a: Block[] = [{ id: '1', type: 'text', props: { content: 'Hello' } }];
    const b: Block[] = [
      { id: '1', type: 'text', props: { content: 'Hello' } },
      { id: '2', type: 'hero', props: { title: 'New' } },
    ];
    const diff = diffBlocks(a, b);
    expect(diff.added).toHaveLength(1);
    expect(diff.added[0].id).toBe('2');
    expect(diff.removed).toHaveLength(0);
    expect(diff.modified).toHaveLength(0);
  });

  it('detects removed blocks', () => {
    const a: Block[] = [
      { id: '1', type: 'text', props: { content: 'Hello' } },
      { id: '2', type: 'hero', props: { title: 'Old' } },
    ];
    const b: Block[] = [{ id: '1', type: 'text', props: { content: 'Hello' } }];
    const diff = diffBlocks(a, b);
    expect(diff.removed).toHaveLength(1);
    expect(diff.removed[0].id).toBe('2');
  });

  it('detects modified block props', () => {
    const a: Block[] = [{ id: '1', type: 'text', props: { content: 'Hello', color: '#000' } }];
    const b: Block[] = [{ id: '1', type: 'text', props: { content: 'Updated', color: '#000' } }];
    const diff = diffBlocks(a, b);
    expect(diff.modified).toHaveLength(1);
    expect(diff.modified[0].changes).toHaveLength(1);
    expect(diff.modified[0].changes[0].field).toBe('props.content');
    expect(diff.modified[0].changes[0].before).toBe('Hello');
    expect(diff.modified[0].changes[0].after).toBe('Updated');
  });

  it('detects type change', () => {
    const a: Block[] = [{ id: '1', type: 'text', props: { content: 'Hey' } }];
    const b: Block[] = [{ id: '1', type: 'hero', props: { content: 'Hey' } }];
    const diff = diffBlocks(a, b);
    expect(diff.modified).toHaveLength(1);
    expect(diff.modified[0].changes.some((c) => c.field === 'type')).toBe(true);
  });

  it('handles identical blocks', () => {
    const blocks: Block[] = [
      { id: '1', type: 'text', props: { content: 'Same' } },
      { id: '2', type: 'hero', props: { title: 'Same' } },
    ];
    const diff = diffBlocks(blocks, blocks);
    expect(diff.added).toHaveLength(0);
    expect(diff.removed).toHaveLength(0);
    expect(diff.modified).toHaveLength(0);
  });

  it('handles empty arrays', () => {
    const diff = diffBlocks([], []);
    expect(diff.added).toHaveLength(0);
    expect(diff.removed).toHaveLength(0);
    expect(diff.modified).toHaveLength(0);
  });

  it('detects new props added', () => {
    const a: Block[] = [{ id: '1', type: 'text', props: { content: 'Hi' } }];
    const b: Block[] = [{ id: '1', type: 'text', props: { content: 'Hi', color: 'red' } }];
    const diff = diffBlocks(a, b);
    expect(diff.modified).toHaveLength(1);
    expect(diff.modified[0].changes[0].field).toBe('props.color');
    expect(diff.modified[0].changes[0].before).toBeUndefined();
    expect(diff.modified[0].changes[0].after).toBe('red');
  });
});
