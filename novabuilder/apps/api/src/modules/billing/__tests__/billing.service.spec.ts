import { describe, it, expect } from 'vitest';

type Plan = {
  name: string;
  price: number;
  interval: 'monthly' | 'yearly';
  features: string[];
  limits: { projects: number; pages: number; storage: number };
};

const PLANS: Record<string, Plan> = {
  free: {
    name: 'Free',
    price: 0,
    interval: 'monthly',
    features: ['3 projects', '10 pages each', '100MB storage', 'Community support'],
    limits: { projects: 3, pages: 10, storage: 100 },
  },
  starter: {
    name: 'Starter',
    price: 19,
    interval: 'monthly',
    features: ['10 projects', '50 pages each', '1GB storage', 'Email support', 'Custom domains'],
    limits: { projects: 10, pages: 50, storage: 1000 },
  },
  pro: {
    name: 'Pro',
    price: 49,
    interval: 'monthly',
    features: ['50 projects', '200 pages each', '10GB storage', 'Priority support', 'Team collaboration', 'API access'],
    limits: { projects: 50, pages: 200, storage: 10000 },
  },
  enterprise: {
    name: 'Enterprise',
    price: 199,
    interval: 'monthly',
    features: ['Unlimited projects', 'Unlimited pages', '100GB storage', 'Dedicated support', 'SLA', 'SSO'],
    limits: { projects: -1, pages: -1, storage: 100000 },
  },
};

function canUpgrade(currentPlan: string, targetPlan: string): boolean {
  const order = ['free', 'starter', 'pro', 'enterprise'];
  return order.indexOf(targetPlan) > order.indexOf(currentPlan);
}

function canDowngrade(currentPlan: string, targetPlan: string): boolean {
  const order = ['free', 'starter', 'pro', 'enterprise'];
  return order.indexOf(targetPlan) < order.indexOf(currentPlan);
}

function calculateProration(currentPlan: string, targetPlan: string, daysRemaining: number, totalDays: number): number {
  const current = PLANS[currentPlan];
  const target = PLANS[targetPlan];
  if (!current || !target) return 0;

  const unusedCredit = (current.price * daysRemaining) / totalDays;
  const newCharge = (target.price * daysRemaining) / totalDays;
  return Math.round((newCharge - unusedCredit) * 100) / 100;
}

function getYearlyPrice(plan: string): number {
  const p = PLANS[plan];
  if (!p) return 0;
  return Math.round(p.price * 12 * 0.8);
}

describe('BillingService', () => {
  it('has correct plan hierarchy', () => {
    expect(PLANS.free.price).toBe(0);
    expect(PLANS.starter.price).toBe(19);
    expect(PLANS.pro.price).toBe(49);
    expect(PLANS.enterprise.price).toBe(199);
  });

  it('allows valid upgrades', () => {
    expect(canUpgrade('free', 'starter')).toBe(true);
    expect(canUpgrade('free', 'pro')).toBe(true);
    expect(canUpgrade('starter', 'pro')).toBe(true);
    expect(canUpgrade('pro', 'enterprise')).toBe(true);
  });

  it('prevents invalid upgrades', () => {
    expect(canUpgrade('pro', 'free')).toBe(false);
    expect(canUpgrade('pro', 'pro')).toBe(false);
    expect(canUpgrade('enterprise', 'starter')).toBe(false);
  });

  it('allows valid downgrades', () => {
    expect(canDowngrade('pro', 'free')).toBe(true);
    expect(canDowngrade('enterprise', 'pro')).toBe(true);
  });

  it('prevents invalid downgrades', () => {
    expect(canDowngrade('free', 'starter')).toBe(false);
    expect(canDowngrade('free', 'free')).toBe(false);
  });

  it('calculates proration correctly', () => {
    const prorated = calculateProration('starter', 'pro', 15, 30);
    expect(prorated).toBeCloseTo(15, 0);
  });

  it('proration is zero for same plan', () => {
    expect(calculateProration('pro', 'pro', 15, 30)).toBe(0);
  });

  it('proration gives credit on downgrade', () => {
    const prorated = calculateProration('pro', 'starter', 15, 30);
    expect(prorated).toBeLessThan(0);
  });

  it('calculates yearly price with 20% discount', () => {
    expect(getYearlyPrice('starter')).toBe(Math.round(19 * 12 * 0.8));
    expect(getYearlyPrice('pro')).toBe(Math.round(49 * 12 * 0.8));
  });

  it('free plan yearly price is 0', () => {
    expect(getYearlyPrice('free')).toBe(0);
  });

  it('enterprise plan has unlimited resources', () => {
    expect(PLANS.enterprise.limits.projects).toBe(-1);
    expect(PLANS.enterprise.limits.pages).toBe(-1);
  });

  it('each plan tier has more features', () => {
    const planOrder = ['free', 'starter', 'pro', 'enterprise'];
    for (let i = 0; i < planOrder.length - 1; i++) {
      const current = PLANS[planOrder[i]];
      const next = PLANS[planOrder[i + 1]];
      expect(next.features.length).toBeGreaterThanOrEqual(current.features.length);
    }
  });
});
