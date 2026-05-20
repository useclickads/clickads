import { describe, it, expect } from 'vitest';

type PlanLimits = {
  projects: number;
  pagesPerProject: number;
  storageMB: number;
  apiCallsPerMonth: number;
  bandwidthMB: number;
};

const PLAN_LIMITS: Record<string, PlanLimits> = {
  free: { projects: 3, pagesPerProject: 10, storageMB: 100, apiCallsPerMonth: 1000, bandwidthMB: 1000 },
  starter: { projects: 10, pagesPerProject: 50, storageMB: 1000, apiCallsPerMonth: 10000, bandwidthMB: 10000 },
  pro: { projects: 50, pagesPerProject: 200, storageMB: 10000, apiCallsPerMonth: 100000, bandwidthMB: 50000 },
  enterprise: { projects: -1, pagesPerProject: -1, storageMB: 100000, apiCallsPerMonth: -1, bandwidthMB: -1 },
};

function checkQuota(plan: string, resource: keyof PlanLimits, currentUsage: number): { allowed: boolean; limit: number } {
  const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.free;
  const limit = limits[resource];
  if (limit === -1) return { allowed: true, limit: -1 };
  return { allowed: currentUsage < limit, limit };
}

function getUsagePercentage(used: number, limit: number): number {
  if (limit <= 0) return 0;
  return Math.min(100, Math.round((used / limit) * 100));
}

function getUsageStatus(percentage: number): 'ok' | 'warning' | 'critical' {
  if (percentage >= 90) return 'critical';
  if (percentage >= 70) return 'warning';
  return 'ok';
}

function trackApiCalls(store: Map<string, { count: number; resetAt: Date }>, userId: string): number {
  const now = new Date();
  const record = store.get(userId);
  if (!record || record.resetAt <= now) {
    const resetAt = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    store.set(userId, { count: 1, resetAt });
    return 1;
  }
  record.count++;
  return record.count;
}

describe('UsageService', () => {
  it('free plan has correct limits', () => {
    const limits = PLAN_LIMITS.free;
    expect(limits.projects).toBe(3);
    expect(limits.storageMB).toBe(100);
    expect(limits.apiCallsPerMonth).toBe(1000);
  });

  it('enterprise plan has unlimited projects', () => {
    const limits = PLAN_LIMITS.enterprise;
    expect(limits.projects).toBe(-1);
    expect(limits.pagesPerProject).toBe(-1);
  });

  it('checks quota - within limit', () => {
    const result = checkQuota('free', 'projects', 2);
    expect(result.allowed).toBe(true);
    expect(result.limit).toBe(3);
  });

  it('checks quota - at limit', () => {
    const result = checkQuota('free', 'projects', 3);
    expect(result.allowed).toBe(false);
  });

  it('checks quota - enterprise unlimited', () => {
    const result = checkQuota('enterprise', 'projects', 1000);
    expect(result.allowed).toBe(true);
    expect(result.limit).toBe(-1);
  });

  it('checks quota - unknown plan defaults to free', () => {
    const result = checkQuota('unknown', 'projects', 5);
    expect(result.allowed).toBe(false);
    expect(result.limit).toBe(3);
  });

  it('calculates usage percentage', () => {
    expect(getUsagePercentage(50, 100)).toBe(50);
    expect(getUsagePercentage(100, 100)).toBe(100);
    expect(getUsagePercentage(150, 100)).toBe(100);
    expect(getUsagePercentage(0, 100)).toBe(0);
  });

  it('handles zero limit', () => {
    expect(getUsagePercentage(50, 0)).toBe(0);
    expect(getUsagePercentage(50, -1)).toBe(0);
  });

  it('returns correct usage status', () => {
    expect(getUsageStatus(50)).toBe('ok');
    expect(getUsageStatus(70)).toBe('warning');
    expect(getUsageStatus(90)).toBe('critical');
    expect(getUsageStatus(100)).toBe('critical');
  });

  it('tracks API calls per user', () => {
    const store = new Map<string, { count: number; resetAt: Date }>();
    expect(trackApiCalls(store, 'u1')).toBe(1);
    expect(trackApiCalls(store, 'u1')).toBe(2);
    expect(trackApiCalls(store, 'u1')).toBe(3);
    expect(trackApiCalls(store, 'u2')).toBe(1);
  });

  it('plan tiers scale correctly', () => {
    const plans = ['free', 'starter', 'pro', 'enterprise'];
    for (let i = 0; i < plans.length - 1; i++) {
      const current = PLAN_LIMITS[plans[i]];
      const next = PLAN_LIMITS[plans[i + 1]];
      if (next.projects !== -1) {
        expect(next.projects).toBeGreaterThan(current.projects);
      }
      if (next.storageMB !== -1 && current.storageMB !== -1) {
        expect(next.storageMB).toBeGreaterThan(current.storageMB);
      }
    }
  });
});
