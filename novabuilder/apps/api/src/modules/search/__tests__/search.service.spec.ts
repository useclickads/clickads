import { describe, it, expect } from 'vitest';

type SearchResult = {
  type: 'project' | 'page' | 'collection' | 'plugin' | 'team';
  id: string;
  title: string;
  subtitle?: string;
  projectId?: string;
};

function searchLocal(
  query: string,
  items: { type: SearchResult['type']; id: string; title: string; subtitle?: string; projectId?: string }[],
): SearchResult[] {
  if (!query.trim()) return [];
  const lq = query.toLowerCase();
  return items.filter((item) =>
    item.title.toLowerCase().includes(lq) ||
    (item.subtitle && item.subtitle.toLowerCase().includes(lq))
  );
}

function rankResults(results: SearchResult[], query: string): SearchResult[] {
  const lq = query.toLowerCase();
  return [...results].sort((a, b) => {
    const aExact = a.title.toLowerCase() === lq ? 0 : 1;
    const bExact = b.title.toLowerCase() === lq ? 0 : 1;
    if (aExact !== bExact) return aExact - bExact;

    const aStarts = a.title.toLowerCase().startsWith(lq) ? 0 : 1;
    const bStarts = b.title.toLowerCase().startsWith(lq) ? 0 : 1;
    if (aStarts !== bStarts) return aStarts - bStarts;

    const typeOrder: Record<string, number> = { project: 1, page: 2, collection: 3, plugin: 4, team: 5 };
    return (typeOrder[a.type] || 6) - (typeOrder[b.type] || 6);
  });
}

function groupByType(results: SearchResult[]): Record<string, SearchResult[]> {
  const groups: Record<string, SearchResult[]> = {};
  for (const r of results) {
    if (!groups[r.type]) groups[r.type] = [];
    groups[r.type].push(r);
  }
  return groups;
}

describe('SearchService', () => {
  const items: SearchResult[] = [
    { type: 'project', id: 'p1', title: 'My Website', subtitle: '/my-website' },
    { type: 'project', id: 'p2', title: 'Blog Platform', subtitle: '/blog' },
    { type: 'page', id: 'pg1', title: 'Homepage', subtitle: '/', projectId: 'p1' },
    { type: 'page', id: 'pg2', title: 'About Us', subtitle: '/about', projectId: 'p1' },
    { type: 'page', id: 'pg3', title: 'Blog Posts', subtitle: '/blog/posts', projectId: 'p2' },
    { type: 'collection', id: 'c1', title: 'Blog Articles', subtitle: '/articles', projectId: 'p2' },
    { type: 'plugin', id: 'pl1', title: 'Analytics Widget' },
    { type: 'team', id: 't1', title: 'john@example.com', subtitle: 'admin', projectId: 'p1' },
  ];

  it('finds items by title', () => {
    const results = searchLocal('blog', items);
    expect(results.length).toBe(3);
    expect(results.map((r) => r.id)).toContain('p2');
    expect(results.map((r) => r.id)).toContain('pg3');
    expect(results.map((r) => r.id)).toContain('c1');
  });

  it('finds items by subtitle', () => {
    const results = searchLocal('/about', items);
    expect(results.length).toBe(1);
    expect(results[0].id).toBe('pg2');
  });

  it('returns empty for empty query', () => {
    expect(searchLocal('', items)).toEqual([]);
    expect(searchLocal('   ', items)).toEqual([]);
  });

  it('is case insensitive', () => {
    const results = searchLocal('BLOG', items);
    expect(results.length).toBe(3);
  });

  it('ranks exact matches first', () => {
    const results = searchLocal('Blog Platform', items);
    const ranked = rankResults(results, 'Blog Platform');
    expect(ranked[0].id).toBe('p2');
  });

  it('ranks prefix matches before contains', () => {
    const allItems: SearchResult[] = [
      { type: 'page', id: 'a', title: 'Something About' },
      { type: 'page', id: 'b', title: 'About Page' },
    ];
    const results = searchLocal('about', allItems);
    const ranked = rankResults(results, 'about');
    expect(ranked[0].id).toBe('b');
  });

  it('ranks by type when titles match equally', () => {
    const ranked = rankResults(
      [
        { type: 'page', id: 'a', title: 'test' },
        { type: 'project', id: 'b', title: 'test' },
      ],
      'test',
    );
    expect(ranked[0].type).toBe('project');
  });

  it('groups results by type', () => {
    const results = searchLocal('blog', items);
    const groups = groupByType(results);
    expect(groups.project).toHaveLength(1);
    expect(groups.page).toHaveLength(1);
    expect(groups.collection).toHaveLength(1);
  });

  it('handles no matches', () => {
    const results = searchLocal('nonexistent', items);
    expect(results).toEqual([]);
  });
});
