import { describe, it, expect } from 'vitest';

type WorkflowStep = {
  action: string;
  config: Record<string, unknown>;
  condition?: { field: string; operator: string; value?: unknown };
};

function evaluateCondition(condition: WorkflowStep['condition'], payload: Record<string, unknown>): boolean {
  if (!condition) return true;
  const value = payload[condition.field];
  switch (condition.operator) {
    case 'equals': return value === condition.value;
    case 'contains': return typeof value === 'string' && typeof condition.value === 'string' && value.includes(condition.value);
    case 'not_empty': return value !== undefined && value !== null && value !== '';
    case 'gt': return typeof value === 'number' && typeof condition.value === 'number' && value > condition.value;
    case 'lt': return typeof value === 'number' && typeof condition.value === 'number' && value < condition.value;
    default: return true;
  }
}

describe('Workflow conditions', () => {
  it('evaluates equals condition', () => {
    expect(evaluateCondition({ field: 'status', operator: 'equals', value: 'active' }, { status: 'active' })).toBe(true);
    expect(evaluateCondition({ field: 'status', operator: 'equals', value: 'active' }, { status: 'inactive' })).toBe(false);
  });

  it('evaluates contains condition', () => {
    expect(evaluateCondition({ field: 'email', operator: 'contains', value: '@test.com' }, { email: 'user@test.com' })).toBe(true);
    expect(evaluateCondition({ field: 'email', operator: 'contains', value: '@test.com' }, { email: 'user@other.com' })).toBe(false);
  });

  it('evaluates not_empty condition', () => {
    expect(evaluateCondition({ field: 'name', operator: 'not_empty' }, { name: 'John' })).toBe(true);
    expect(evaluateCondition({ field: 'name', operator: 'not_empty' }, { name: '' })).toBe(false);
    expect(evaluateCondition({ field: 'name', operator: 'not_empty' }, {})).toBe(false);
  });

  it('evaluates gt condition', () => {
    expect(evaluateCondition({ field: 'amount', operator: 'gt', value: 100 }, { amount: 150 })).toBe(true);
    expect(evaluateCondition({ field: 'amount', operator: 'gt', value: 100 }, { amount: 50 })).toBe(false);
  });

  it('evaluates lt condition', () => {
    expect(evaluateCondition({ field: 'amount', operator: 'lt', value: 100 }, { amount: 50 })).toBe(true);
    expect(evaluateCondition({ field: 'amount', operator: 'lt', value: 100 }, { amount: 150 })).toBe(false);
  });

  it('passes when no condition', () => {
    expect(evaluateCondition(undefined, {})).toBe(true);
  });

  it('handles unknown operator as true', () => {
    expect(evaluateCondition({ field: 'x', operator: 'unknown' }, { x: 1 })).toBe(true);
  });
});
