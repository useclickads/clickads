import { describe, it, expect } from 'vitest';

function mergeStagedChanges(
  existing: Array<{ pageId: string; field: string; before: unknown; after: unknown }>,
  incoming: Array<{ pageId: string; field: string; before: unknown; after: unknown }>,
) {
  return [
    ...existing.filter((c) => !incoming.find((nc) => nc.pageId === c.pageId && nc.field === c.field)),
    ...incoming,
  ];
}

describe('StagingService', () => {
  it('merges changes by page and field', () => {
    const existing = [
      { pageId: 'p1', field: 'title', before: 'Old', after: 'New' },
      { pageId: 'p1', field: 'content', before: [], after: [{ type: 'text' }] },
    ];
    const incoming = [
      { pageId: 'p1', field: 'title', before: 'Old', after: 'Updated' },
    ];
    const result = mergeStagedChanges(existing, incoming);
    expect(result).toHaveLength(2);
    expect(result.find((c) => c.field === 'title')?.after).toBe('Updated');
  });

  it('adds new changes for different pages', () => {
    const existing = [{ pageId: 'p1', field: 'title', before: 'A', after: 'B' }];
    const incoming = [{ pageId: 'p2', field: 'title', before: 'C', after: 'D' }];
    const result = mergeStagedChanges(existing, incoming);
    expect(result).toHaveLength(2);
  });

  it('preserves unrelated fields during merge', () => {
    const existing = [
      { pageId: 'p1', field: 'title', before: 'T', after: 'T2' },
      { pageId: 'p1', field: 'seo', before: null, after: { title: 'SEO' } },
    ];
    const incoming = [{ pageId: 'p1', field: 'content', before: [], after: [{}] }];
    const result = mergeStagedChanges(existing, incoming);
    expect(result).toHaveLength(3);
  });

  it('handles empty existing changes', () => {
    const incoming = [{ pageId: 'p1', field: 'title', before: 'A', after: 'B' }];
    const result = mergeStagedChanges([], incoming);
    expect(result).toHaveLength(1);
  });

  it('handles empty incoming changes', () => {
    const existing = [{ pageId: 'p1', field: 'title', before: 'A', after: 'B' }];
    const result = mergeStagedChanges(existing, []);
    expect(result).toEqual(existing);
  });

  it('replaces last update when same page+field staged twice', () => {
    const existing = [{ pageId: 'p1', field: 'title', before: 'X', after: 'Y' }];
    const incoming = [{ pageId: 'p1', field: 'title', before: 'X', after: 'Z' }];
    const result = mergeStagedChanges(existing, incoming);
    expect(result).toHaveLength(1);
    expect(result[0].after).toBe('Z');
  });
});
