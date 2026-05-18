import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

type PerformanceMetric = {
  pageId: string;
  url: string;
  lcp: number;
  fid: number;
  cls: number;
  ttfb: number;
  fcp: number;
  timestamp: string;
  device: 'desktop' | 'mobile' | 'tablet';
  connection: string;
};

@Injectable()
export class PerformanceService {
  constructor(private readonly prisma: PrismaService) {}

  async recordMetrics(projectId: string, metrics: PerformanceMetric) {
    return this.prisma.client.snapshot.create({
      data: {
        projectId,
        data: {
          type: 'performance',
          ...metrics,
          recordedAt: new Date().toISOString(),
        } as any,
      },
    });
  }

  async getPagePerformance(projectId: string, pageId: string, days = 7) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const snapshots = await this.prisma.client.snapshot.findMany({
      where: {
        projectId,
        data: { path: ['type'], equals: 'performance' },
        createdAt: { gte: since },
      },
      orderBy: { createdAt: 'desc' },
    });

    const metrics = snapshots
      .map((s) => s.data as any)
      .filter((d) => d.pageId === pageId);

    if (metrics.length === 0) return { pageId, metrics: [], summary: null };

    const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;

    return {
      pageId,
      metricCount: metrics.length,
      summary: {
        lcp: { avg: avg(metrics.map((m: any) => m.lcp)), p75: this.percentile(metrics.map((m: any) => m.lcp), 75) },
        fid: { avg: avg(metrics.map((m: any) => m.fid)), p75: this.percentile(metrics.map((m: any) => m.fid), 75) },
        cls: { avg: avg(metrics.map((m: any) => m.cls)), p75: this.percentile(metrics.map((m: any) => m.cls), 75) },
        ttfb: { avg: avg(metrics.map((m: any) => m.ttfb)), p75: this.percentile(metrics.map((m: any) => m.ttfb), 75) },
        fcp: { avg: avg(metrics.map((m: any) => m.fcp)), p75: this.percentile(metrics.map((m: any) => m.fcp), 75) },
      },
      coreWebVitals: this.assessCoreWebVitals(metrics),
    };
  }

  async getProjectPerformanceOverview(projectId: string) {
    const snapshots = await this.prisma.client.snapshot.findMany({
      where: {
        projectId,
        data: { path: ['type'], equals: 'performance' },
      },
      orderBy: { createdAt: 'desc' },
      take: 500,
    });

    const metrics = snapshots.map((s) => s.data as any);
    const pageGroups = new Map<string, any[]>();

    for (const m of metrics) {
      const group = pageGroups.get(m.pageId) || [];
      group.push(m);
      pageGroups.set(m.pageId, group);
    }

    const pages = Array.from(pageGroups.entries()).map(([pageId, pageMetrics]) => ({
      pageId,
      url: pageMetrics[0]?.url,
      sampleCount: pageMetrics.length,
      avgLcp: this.average(pageMetrics.map((m) => m.lcp)),
      avgCls: this.average(pageMetrics.map((m) => m.cls)),
      score: this.calculateScore(pageMetrics),
    }));

    return {
      totalSamples: metrics.length,
      pageCount: pageGroups.size,
      pages: pages.sort((a, b) => a.score - b.score),
      overallScore: pages.length > 0 ? Math.round(this.average(pages.map((p) => p.score))) : 0,
    };
  }

  generatePerformanceScript(projectId: string): string {
    return `
(function() {
  function sendMetrics(metrics) {
    var data = Object.assign({}, metrics, {
      pageId: document.querySelector('meta[name="page-id"]')?.content || '',
      url: window.location.pathname,
      timestamp: new Date().toISOString(),
      device: window.innerWidth < 768 ? 'mobile' : window.innerWidth < 1024 ? 'tablet' : 'desktop',
      connection: navigator.connection?.effectiveType || 'unknown'
    });
    navigator.sendBeacon('/api/projects/${projectId}/performance/collect', JSON.stringify(data));
  }

  if ('PerformanceObserver' in window) {
    var metrics = {};
    new PerformanceObserver(function(list) {
      var entries = list.getEntries();
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].entryType === 'largest-contentful-paint') metrics.lcp = entries[i].startTime;
        if (entries[i].entryType === 'first-input') metrics.fid = entries[i].processingStart - entries[i].startTime;
        if (entries[i].entryType === 'layout-shift' && !entries[i].hadRecentInput) metrics.cls = (metrics.cls || 0) + entries[i].value;
        if (entries[i].entryType === 'paint' && entries[i].name === 'first-contentful-paint') metrics.fcp = entries[i].startTime;
      }
    }).observe({ type: 'largest-contentful-paint', buffered: true });

    var nav = performance.getEntriesByType('navigation')[0];
    if (nav) metrics.ttfb = nav.responseStart;

    window.addEventListener('visibilitychange', function() {
      if (document.visibilityState === 'hidden') sendMetrics(metrics);
    });
  }
})();`.trim();
  }

  private percentile(arr: number[], p: number): number {
    const sorted = [...arr].sort((a, b) => a - b);
    const idx = Math.ceil((p / 100) * sorted.length) - 1;
    return sorted[Math.max(0, idx)] || 0;
  }

  private average(arr: number[]): number {
    if (arr.length === 0) return 0;
    return Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 100) / 100;
  }

  private assessCoreWebVitals(metrics: any[]): { lcp: string; fid: string; cls: string } {
    const p75lcp = this.percentile(metrics.map((m) => m.lcp), 75);
    const p75fid = this.percentile(metrics.map((m) => m.fid), 75);
    const p75cls = this.percentile(metrics.map((m) => m.cls), 75);

    return {
      lcp: p75lcp <= 2500 ? 'good' : p75lcp <= 4000 ? 'needs-improvement' : 'poor',
      fid: p75fid <= 100 ? 'good' : p75fid <= 300 ? 'needs-improvement' : 'poor',
      cls: p75cls <= 0.1 ? 'good' : p75cls <= 0.25 ? 'needs-improvement' : 'poor',
    };
  }

  private calculateScore(metrics: any[]): number {
    const p75lcp = this.percentile(metrics.map((m) => m.lcp), 75);
    const p75cls = this.percentile(metrics.map((m) => m.cls), 75);
    const p75fid = this.percentile(metrics.map((m) => m.fid), 75);

    let score = 100;
    if (p75lcp > 2500) score -= 20;
    if (p75lcp > 4000) score -= 20;
    if (p75cls > 0.1) score -= 15;
    if (p75cls > 0.25) score -= 15;
    if (p75fid > 100) score -= 10;
    if (p75fid > 300) score -= 10;

    return Math.max(0, score);
  }
}
