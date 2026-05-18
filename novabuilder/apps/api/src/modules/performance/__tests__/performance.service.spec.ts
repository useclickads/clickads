import { describe, it, expect } from 'vitest';

function percentile(arr: number[], p: number): number {
  const sorted = [...arr].sort((a, b) => a - b);
  const idx = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, idx)] || 0;
}

function assessCoreWebVitals(metrics: Array<{ lcp: number; fid: number; cls: number }>) {
  const p75lcp = percentile(metrics.map((m) => m.lcp), 75);
  const p75fid = percentile(metrics.map((m) => m.fid), 75);
  const p75cls = percentile(metrics.map((m) => m.cls), 75);

  return {
    lcp: p75lcp <= 2500 ? 'good' : p75lcp <= 4000 ? 'needs-improvement' : 'poor',
    fid: p75fid <= 100 ? 'good' : p75fid <= 300 ? 'needs-improvement' : 'poor',
    cls: p75cls <= 0.1 ? 'good' : p75cls <= 0.25 ? 'needs-improvement' : 'poor',
  };
}

function calculateScore(metrics: Array<{ lcp: number; fid: number; cls: number }>) {
  const p75lcp = percentile(metrics.map((m) => m.lcp), 75);
  const p75cls = percentile(metrics.map((m) => m.cls), 75);
  const p75fid = percentile(metrics.map((m) => m.fid), 75);

  let score = 100;
  if (p75lcp > 2500) score -= 20;
  if (p75lcp > 4000) score -= 20;
  if (p75cls > 0.1) score -= 15;
  if (p75cls > 0.25) score -= 15;
  if (p75fid > 100) score -= 10;
  if (p75fid > 300) score -= 10;
  return Math.max(0, score);
}

describe('PerformanceService', () => {
  it('calculates p75 correctly', () => {
    const values = [100, 200, 300, 400, 500, 600, 700, 800];
    expect(percentile(values, 75)).toBe(600);
  });

  it('assesses good core web vitals', () => {
    const metrics = [
      { lcp: 1500, fid: 50, cls: 0.05 },
      { lcp: 2000, fid: 80, cls: 0.08 },
      { lcp: 1800, fid: 60, cls: 0.03 },
      { lcp: 2200, fid: 90, cls: 0.06 },
    ];
    const result = assessCoreWebVitals(metrics);
    expect(result.lcp).toBe('good');
    expect(result.fid).toBe('good');
    expect(result.cls).toBe('good');
  });

  it('detects poor LCP', () => {
    const metrics = [
      { lcp: 5000, fid: 50, cls: 0.05 },
      { lcp: 6000, fid: 80, cls: 0.08 },
      { lcp: 4500, fid: 60, cls: 0.03 },
      { lcp: 7000, fid: 40, cls: 0.02 },
    ];
    const result = assessCoreWebVitals(metrics);
    expect(result.lcp).toBe('poor');
  });

  it('detects needs-improvement CLS', () => {
    const metrics = [
      { lcp: 1500, fid: 50, cls: 0.15 },
      { lcp: 2000, fid: 80, cls: 0.18 },
      { lcp: 1800, fid: 60, cls: 0.12 },
      { lcp: 1600, fid: 70, cls: 0.20 },
    ];
    const result = assessCoreWebVitals(metrics);
    expect(result.cls).toBe('needs-improvement');
  });

  it('gives perfect score for fast pages', () => {
    const metrics = [
      { lcp: 1500, fid: 50, cls: 0.05 },
      { lcp: 2000, fid: 80, cls: 0.08 },
    ];
    expect(calculateScore(metrics)).toBe(100);
  });

  it('penalizes slow pages', () => {
    const metrics = [
      { lcp: 5000, fid: 400, cls: 0.3 },
      { lcp: 6000, fid: 500, cls: 0.4 },
    ];
    const score = calculateScore(metrics);
    expect(score).toBeLessThan(50);
  });

  it('handles single metric entry', () => {
    const metrics = [{ lcp: 3000, fid: 150, cls: 0.15 }];
    const result = assessCoreWebVitals(metrics);
    expect(result.lcp).toBe('needs-improvement');
    expect(result.fid).toBe('needs-improvement');
    expect(result.cls).toBe('needs-improvement');
  });
});
