import { describe, it, expect } from 'vitest';

type ValidationRule = {
  field: string;
  required?: boolean;
  type?: 'text' | 'email' | 'url' | 'number';
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
  patternMessage?: string;
};

function validateFields(fields: Record<string, unknown>, rules: ValidationRule[]): { valid: boolean; errors: { field: string; message: string }[] } {
  const errors: { field: string; message: string }[] = [];

  for (const rule of rules) {
    const value = fields[rule.field];

    if (rule.required && (value === undefined || value === null || value === '')) {
      errors.push({ field: rule.field, message: `${rule.field} is required` });
      continue;
    }

    if (value === undefined || value === null || value === '') continue;
    const strValue = String(value);

    if (rule.minLength && strValue.length < rule.minLength) {
      errors.push({ field: rule.field, message: `${rule.field} must be at least ${rule.minLength} characters` });
    }

    if (rule.maxLength && strValue.length > rule.maxLength) {
      errors.push({ field: rule.field, message: `${rule.field} must be at most ${rule.maxLength} characters` });
    }

    if (rule.pattern && !new RegExp(rule.pattern).test(strValue)) {
      errors.push({ field: rule.field, message: rule.patternMessage || `${rule.field} has an invalid format` });
    }

    if (rule.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(strValue)) {
      errors.push({ field: rule.field, message: `${rule.field} must be a valid email address` });
    }

    if (rule.type === 'number') {
      const num = Number(value);
      if (isNaN(num)) errors.push({ field: rule.field, message: `${rule.field} must be a number` });
      else {
        if (rule.min !== undefined && num < rule.min) errors.push({ field: rule.field, message: `${rule.field} must be at least ${rule.min}` });
        if (rule.max !== undefined && num > rule.max) errors.push({ field: rule.field, message: `${rule.field} must be at most ${rule.max}` });
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

describe('Form validation', () => {
  it('passes when all required fields present', () => {
    const result = validateFields(
      { name: 'John', email: 'john@test.com' },
      [{ field: 'name', required: true }, { field: 'email', required: true, type: 'email' }],
    );
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('fails when required field is missing', () => {
    const result = validateFields(
      { email: 'john@test.com' },
      [{ field: 'name', required: true }],
    );
    expect(result.valid).toBe(false);
    expect(result.errors[0].field).toBe('name');
  });

  it('validates email format', () => {
    const result = validateFields(
      { email: 'not-an-email' },
      [{ field: 'email', type: 'email' }],
    );
    expect(result.valid).toBe(false);
    expect(result.errors[0].message).toContain('valid email');
  });

  it('validates minLength', () => {
    const result = validateFields(
      { password: 'ab' },
      [{ field: 'password', minLength: 8 }],
    );
    expect(result.valid).toBe(false);
  });

  it('validates maxLength', () => {
    const result = validateFields(
      { bio: 'a'.repeat(300) },
      [{ field: 'bio', maxLength: 200 }],
    );
    expect(result.valid).toBe(false);
  });

  it('validates number min/max', () => {
    const result = validateFields(
      { age: 5 },
      [{ field: 'age', type: 'number', min: 18, max: 100 }],
    );
    expect(result.valid).toBe(false);
    expect(result.errors[0].message).toContain('at least 18');
  });

  it('validates regex pattern', () => {
    const result = validateFields(
      { zipcode: 'abc' },
      [{ field: 'zipcode', pattern: '^\\d{5}$', patternMessage: 'Must be 5 digits' }],
    );
    expect(result.valid).toBe(false);
    expect(result.errors[0].message).toBe('Must be 5 digits');
  });

  it('skips non-required empty fields', () => {
    const result = validateFields(
      {},
      [{ field: 'nickname', minLength: 3 }],
    );
    expect(result.valid).toBe(true);
  });
});
