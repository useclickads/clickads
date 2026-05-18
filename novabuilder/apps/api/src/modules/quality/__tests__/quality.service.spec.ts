import { describe, it, expect } from 'vitest';

type Block = { id: string; type: string; props: Record<string, unknown>; children?: Block[] };
type Issue = { severity: 'error' | 'warning' | 'info'; category: string; blockId?: string; message: string };

function checkAccessibility(blocks: Block[]): Issue[] {
  const issues: Issue[] = [];
  for (const block of blocks) {
    if (block.type === 'image' && (!block.props.alt || String(block.props.alt).trim() === '')) {
      issues.push({ severity: 'error', category: 'accessibility', blockId: block.id, message: 'Image missing alt text' });
    }
    if (block.type === 'button' && !block.props.text) {
      issues.push({ severity: 'warning', category: 'accessibility', blockId: block.id, message: 'Button has no text label' });
    }
  }
  return issues;
}

function checkSeo(seo: { metaTitle?: string; metaDescription?: string } | null): Issue[] {
  const issues: Issue[] = [];
  if (!seo?.metaTitle) issues.push({ severity: 'error', category: 'seo', message: 'Page has no title' });
  if (!seo?.metaDescription) issues.push({ severity: 'warning', category: 'seo', message: 'Missing meta description' });
  else if (seo.metaDescription.length > 160) issues.push({ severity: 'warning', category: 'seo', message: 'Meta description too long' });
  return issues;
}

function calculateScore(issues: Issue[]): number {
  const errors = issues.filter((i) => i.severity === 'error').length;
  const warnings = issues.filter((i) => i.severity === 'warning').length;
  return Math.max(0, 100 - errors * 10 - warnings * 3);
}

describe('Quality audit', () => {
  it('flags images without alt text', () => {
    const issues = checkAccessibility([
      { id: '1', type: 'image', props: { src: 'test.jpg' } },
    ]);
    expect(issues).toHaveLength(1);
    expect(issues[0].severity).toBe('error');
  });

  it('passes images with alt text', () => {
    const issues = checkAccessibility([
      { id: '1', type: 'image', props: { src: 'test.jpg', alt: 'A test image' } },
    ]);
    expect(issues).toHaveLength(0);
  });

  it('flags buttons without text', () => {
    const issues = checkAccessibility([
      { id: '1', type: 'button', props: {} },
    ]);
    expect(issues).toHaveLength(1);
    expect(issues[0].severity).toBe('warning');
  });

  it('flags missing meta title', () => {
    const issues = checkSeo(null);
    expect(issues.some((i) => i.message === 'Page has no title')).toBe(true);
  });

  it('flags long meta description', () => {
    const issues = checkSeo({ metaTitle: 'Test', metaDescription: 'a'.repeat(200) });
    expect(issues.some((i) => i.message === 'Meta description too long')).toBe(true);
  });

  it('passes valid SEO', () => {
    const issues = checkSeo({ metaTitle: 'Test Page', metaDescription: 'A good description under 160 chars.' });
    expect(issues).toHaveLength(0);
  });

  it('calculates score correctly', () => {
    const issues: Issue[] = [
      { severity: 'error', category: 'a11y', message: 'err1' },
      { severity: 'error', category: 'a11y', message: 'err2' },
      { severity: 'warning', category: 'seo', message: 'warn1' },
    ];
    expect(calculateScore(issues)).toBe(77);
  });

  it('gives 100 for no issues', () => {
    expect(calculateScore([])).toBe(100);
  });

  it('clamps at 0', () => {
    const issues: Issue[] = Array.from({ length: 15 }, (_, i) => ({
      severity: 'error', category: 'test', message: `err${i}`,
    }));
    expect(calculateScore(issues)).toBe(0);
  });
});
