import { describe, it, expect } from 'vitest';

type Event = { type: string; payload: Record<string, unknown>; createdAt: Date };

function computeSummary(events: Event[]) {
  const byType: Record<string, number> = {};
  const pageCounts: Record<string, number> = {};
  const referrerCounts: Record<string, number> = {};
  const visitors = new Set<string>();
  const dailyCounts: Record<string, number> = {};

  for (const e of events) {
    byType[e.type] = (byType[e.type] || 0) + 1;
    const payload = e.payload as any;
    if (e.type === 'page_view') {
      if (payload?.path) pageCounts[payload.path] = (pageCounts[payload.path] || 0) + 1;
      if (payload?.referrer) referrerCounts[payload.referrer] = (referrerCounts[payload.referrer] || 0) + 1;
      if (payload?.visitorId) visitors.add(payload.visitorId);
    }
    const day = e.createdAt.toISOString().slice(0, 10);
    dailyCounts[day] = (dailyCounts[day] || 0) + 1;
  }

  const topPages = Object.entries(pageCounts).sort(([, a], [, b]) => b - a).slice(0, 10).map(([path, views]) => ({ path, views }));
  const referrers = Object.entries(referrerCounts).sort(([, a], [, b]) => b - a).slice(0, 10).map(([source, count]) => ({ source, count }));
  const timeSeries = Object.entries(dailyCounts).sort(([a], [b]) => a.localeCompare(b)).map(([date, count]) => ({ date, count }));

  return {
    totalEvents: events.length,
    pageViews: byType['page_view'] || 0,
    uniqueVisitors: visitors.size,
    byType,
    topPages,
    referrers,
    timeSeries,
  };
}

describe('Analytics Summary Computation', () => {
  it('returns zeros for empty events', () => {
    const result = computeSummary([]);
    expect(result.totalEvents).toBe(0);
    expect(result.pageViews).toBe(0);
    expect(result.uniqueVisitors).toBe(0);
    expect(result.topPages).toEqual([]);
    expect(result.referrers).toEqual([]);
    expect(result.timeSeries).toEqual([]);
  });

  it('counts events by type', () => {
    const events: Event[] = [
      { type: 'page_view', payload: { path: '/' }, createdAt: new Date('2026-01-01') },
      { type: 'page_view', payload: { path: '/about' }, createdAt: new Date('2026-01-01') },
      { type: 'click', payload: { button: 'cta' }, createdAt: new Date('2026-01-01') },
    ];
    const result = computeSummary(events);
    expect(result.totalEvents).toBe(3);
    expect(result.byType['page_view']).toBe(2);
    expect(result.byType['click']).toBe(1);
  });

  it('tracks unique visitors', () => {
    const events: Event[] = [
      { type: 'page_view', payload: { path: '/', visitorId: 'v1' }, createdAt: new Date('2026-01-01') },
      { type: 'page_view', payload: { path: '/about', visitorId: 'v1' }, createdAt: new Date('2026-01-01') },
      { type: 'page_view', payload: { path: '/', visitorId: 'v2' }, createdAt: new Date('2026-01-01') },
    ];
    const result = computeSummary(events);
    expect(result.uniqueVisitors).toBe(2);
  });

  it('ranks top pages by views', () => {
    const events: Event[] = [
      { type: 'page_view', payload: { path: '/about' }, createdAt: new Date('2026-01-01') },
      { type: 'page_view', payload: { path: '/' }, createdAt: new Date('2026-01-01') },
      { type: 'page_view', payload: { path: '/' }, createdAt: new Date('2026-01-01') },
      { type: 'page_view', payload: { path: '/' }, createdAt: new Date('2026-01-01') },
    ];
    const result = computeSummary(events);
    expect(result.topPages[0]).toEqual({ path: '/', views: 3 });
    expect(result.topPages[1]).toEqual({ path: '/about', views: 1 });
  });

  it('aggregates referrers', () => {
    const events: Event[] = [
      { type: 'page_view', payload: { path: '/', referrer: 'google.com' }, createdAt: new Date('2026-01-01') },
      { type: 'page_view', payload: { path: '/', referrer: 'google.com' }, createdAt: new Date('2026-01-01') },
      { type: 'page_view', payload: { path: '/', referrer: 'twitter.com' }, createdAt: new Date('2026-01-01') },
    ];
    const result = computeSummary(events);
    expect(result.referrers[0]).toEqual({ source: 'google.com', count: 2 });
    expect(result.referrers[1]).toEqual({ source: 'twitter.com', count: 1 });
  });

  it('groups by date for time series', () => {
    const events: Event[] = [
      { type: 'page_view', payload: { path: '/' }, createdAt: new Date('2026-01-01') },
      { type: 'page_view', payload: { path: '/' }, createdAt: new Date('2026-01-01') },
      { type: 'page_view', payload: { path: '/' }, createdAt: new Date('2026-01-02') },
    ];
    const result = computeSummary(events);
    expect(result.timeSeries).toEqual([
      { date: '2026-01-01', count: 2 },
      { date: '2026-01-02', count: 1 },
    ]);
  });

  it('limits top pages to 10', () => {
    const events: Event[] = Array.from({ length: 12 }, (_, i) => ({
      type: 'page_view',
      payload: { path: `/page-${i}` },
      createdAt: new Date('2026-01-01'),
    }));
    const result = computeSummary(events);
    expect(result.topPages.length).toBe(10);
  });
});
