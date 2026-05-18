import { describe, it, expect } from 'vitest';

function calculateAvgRating(reviews: { rating: number }[]): number | null {
  if (reviews.length === 0) return null;
  return Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10;
}

function validateRating(rating: number): boolean {
  return Number.isInteger(rating) && rating >= 1 && rating <= 5;
}

describe('Marketplace Reviews', () => {
  it('calculates average rating correctly', () => {
    expect(calculateAvgRating([{ rating: 5 }, { rating: 3 }, { rating: 4 }])).toBe(4);
  });

  it('returns null for empty reviews', () => {
    expect(calculateAvgRating([])).toBeNull();
  });

  it('handles single review', () => {
    expect(calculateAvgRating([{ rating: 4 }])).toBe(4);
  });

  it('rounds to one decimal place', () => {
    expect(calculateAvgRating([{ rating: 5 }, { rating: 4 }])).toBe(4.5);
  });

  it('handles all same ratings', () => {
    expect(calculateAvgRating([{ rating: 3 }, { rating: 3 }, { rating: 3 }])).toBe(3);
  });

  it('validates rating range - valid', () => {
    expect(validateRating(1)).toBe(true);
    expect(validateRating(3)).toBe(true);
    expect(validateRating(5)).toBe(true);
  });

  it('validates rating range - invalid', () => {
    expect(validateRating(0)).toBe(false);
    expect(validateRating(6)).toBe(false);
    expect(validateRating(-1)).toBe(false);
    expect(validateRating(3.5)).toBe(false);
  });
});
