import { describe, it, expect } from 'vitest';

function computeFunnelFromEvents(
  steps: { name: string; eventType: string }[],
  events: { type: string; payload: { visitorId?: string } }[],
) {
  const visitorsByStep = new Map<number, Set<string>>();

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    const visitors = new Set<string>();

    for (const e of events) {
      if (e.type !== step.eventType) continue;
      const visitorId = e.payload?.visitorId || 'anonymous';
      if (i === 0) {
        visitors.add(visitorId);
      } else {
        const prev = visitorsByStep.get(i - 1);
        if (prev?.has(visitorId)) visitors.add(visitorId);
      }
    }
    visitorsByStep.set(i, visitors);
  }

  const stepResults = steps.map((step, i) => {
    const count = visitorsByStep.get(i)?.size || 0;
    const prev = i > 0 ? (visitorsByStep.get(i - 1)?.size || 0) : count;
    return {
      name: step.name,
      count,
      dropoff: prev > 0 ? Math.round((1 - count / prev) * 100) : 0,
    };
  });

  const first = stepResults[0]?.count || 0;
  const last = stepResults[stepResults.length - 1]?.count || 0;
  const conversionRate = first > 0 ? Math.round((last / first) * 10000) / 100 : 0;

  return { stepResults, conversionRate };
}

describe('Funnel computation', () => {
  const steps = [
    { name: 'Visit', eventType: 'page_view' },
    { name: 'Signup', eventType: 'signup' },
    { name: 'Purchase', eventType: 'purchase' },
  ];

  it('computes correct counts for a full funnel', () => {
    const events = [
      { type: 'page_view', payload: { visitorId: 'a' } },
      { type: 'page_view', payload: { visitorId: 'b' } },
      { type: 'page_view', payload: { visitorId: 'c' } },
      { type: 'signup', payload: { visitorId: 'a' } },
      { type: 'signup', payload: { visitorId: 'b' } },
      { type: 'purchase', payload: { visitorId: 'a' } },
    ];

    const result = computeFunnelFromEvents(steps, events);
    expect(result.stepResults[0].count).toBe(3);
    expect(result.stepResults[1].count).toBe(2);
    expect(result.stepResults[2].count).toBe(1);
  });

  it('calculates overall conversion rate', () => {
    const events = [
      { type: 'page_view', payload: { visitorId: 'a' } },
      { type: 'page_view', payload: { visitorId: 'b' } },
      { type: 'signup', payload: { visitorId: 'a' } },
      { type: 'signup', payload: { visitorId: 'b' } },
      { type: 'purchase', payload: { visitorId: 'a' } },
    ];

    const result = computeFunnelFromEvents(steps, events);
    expect(result.conversionRate).toBe(50);
  });

  it('calculates dropoff per step', () => {
    const events = [
      { type: 'page_view', payload: { visitorId: 'a' } },
      { type: 'page_view', payload: { visitorId: 'b' } },
      { type: 'page_view', payload: { visitorId: 'c' } },
      { type: 'page_view', payload: { visitorId: 'd' } },
      { type: 'signup', payload: { visitorId: 'a' } },
      { type: 'signup', payload: { visitorId: 'b' } },
      { type: 'purchase', payload: { visitorId: 'a' } },
    ];

    const result = computeFunnelFromEvents(steps, events);
    expect(result.stepResults[0].dropoff).toBe(0);
    expect(result.stepResults[1].dropoff).toBe(50);
    expect(result.stepResults[2].dropoff).toBe(50);
  });

  it('handles empty events', () => {
    const result = computeFunnelFromEvents(steps, []);
    expect(result.conversionRate).toBe(0);
    expect(result.stepResults.every((s) => s.count === 0)).toBe(true);
  });

  it('only counts visitors who passed through prior steps', () => {
    const events = [
      { type: 'page_view', payload: { visitorId: 'a' } },
      { type: 'signup', payload: { visitorId: 'b' } },
      { type: 'purchase', payload: { visitorId: 'b' } },
    ];

    const result = computeFunnelFromEvents(steps, events);
    expect(result.stepResults[0].count).toBe(1);
    expect(result.stepResults[1].count).toBe(0);
    expect(result.stepResults[2].count).toBe(0);
  });

  it('handles duplicate visitor events', () => {
    const events = [
      { type: 'page_view', payload: { visitorId: 'a' } },
      { type: 'page_view', payload: { visitorId: 'a' } },
      { type: 'signup', payload: { visitorId: 'a' } },
    ];

    const result = computeFunnelFromEvents(
      [{ name: 'Visit', eventType: 'page_view' }, { name: 'Signup', eventType: 'signup' }],
      events,
    );
    expect(result.stepResults[0].count).toBe(1);
    expect(result.stepResults[1].count).toBe(1);
    expect(result.conversionRate).toBe(100);
  });
});
