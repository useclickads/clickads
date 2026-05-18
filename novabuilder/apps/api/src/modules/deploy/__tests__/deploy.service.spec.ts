import { describe, it, expect } from 'vitest';

function renderBlock(block: any): string {
  const p = block.props;
  switch (block.type) {
    case 'hero':
      return `<section><h1>${p.heading}</h1></section>`;
    case 'text':
      return `<div>${p.content}</div>`;
    case 'spacer':
      return `<div style="height:${p.height}"></div>`;
    case 'divider':
      return `<hr style="border-top:${p.thickness} ${p.style} ${p.color}" />`;
    case 'testimonial':
      return `<div>"${p.quote}" - ${p.author}</div>`;
    case 'pricing':
      return `<div>${p.planName} ${p.price}${p.period}</div>`;
    case 'faq': {
      const items = JSON.parse(p.items);
      return `<div>${items.map((i: any) => `<details><summary>${i.question}</summary>${i.answer}</details>`).join('')}</div>`;
    }
    case 'countdown':
      return `<div>${p.heading}</div>`;
    case 'code':
      return `${p.css ? `<style>${p.css}</style>` : ''}${p.html}`;
    default:
      return '';
  }
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

describe('Deploy Block Rendering', () => {
  it('renders hero block', () => {
    const html = renderBlock({ type: 'hero', props: { heading: 'Hello World', subheading: 'Test', align: 'center' } });
    expect(html).toContain('Hello World');
  });

  it('renders text block', () => {
    const html = renderBlock({ type: 'text', props: { content: 'Paragraph text', fontSize: '1rem', color: '#000' } });
    expect(html).toContain('Paragraph text');
  });

  it('renders spacer block', () => {
    const html = renderBlock({ type: 'spacer', props: { height: '48px' } });
    expect(html).toContain('48px');
  });

  it('renders divider block', () => {
    const html = renderBlock({ type: 'divider', props: { style: 'solid', color: '#e2e8f0', thickness: '2px' } });
    expect(html).toContain('2px');
    expect(html).toContain('solid');
  });

  it('renders testimonial block', () => {
    const html = renderBlock({ type: 'testimonial', props: { quote: 'Great product!', author: 'John', role: 'CEO', rating: 5 } });
    expect(html).toContain('Great product!');
    expect(html).toContain('John');
  });

  it('renders pricing block', () => {
    const html = renderBlock({ type: 'pricing', props: { planName: 'Pro', price: '$29', period: '/mo', features: '["Feature 1"]', buttonText: 'Buy', buttonUrl: '#', highlighted: false } });
    expect(html).toContain('Pro');
    expect(html).toContain('$29');
  });

  it('renders FAQ block with items', () => {
    const items = [{ question: 'Q1?', answer: 'A1' }, { question: 'Q2?', answer: 'A2' }];
    const html = renderBlock({ type: 'faq', props: { heading: 'FAQ', items: JSON.stringify(items) } });
    expect(html).toContain('Q1?');
    expect(html).toContain('A1');
    expect(html).toContain('Q2?');
  });

  it('renders countdown block', () => {
    const html = renderBlock({ type: 'countdown', props: { heading: 'Launch', targetDate: '2026-12-31T00:00', expiredText: 'Live!' } });
    expect(html).toContain('Launch');
  });

  it('renders code block with HTML and CSS', () => {
    const html = renderBlock({ type: 'code', props: { html: '<div class="custom">Hello</div>', css: '.custom { color: red; }' } });
    expect(html).toContain('<div class="custom">Hello</div>');
    expect(html).toContain('.custom { color: red; }');
  });

  it('returns empty string for unknown block type', () => {
    const html = renderBlock({ type: 'nonexistent', props: {} });
    expect(html).toBe('');
  });
});

describe('HTML Escaping', () => {
  it('escapes angle brackets', () => {
    expect(escapeHtml('<script>alert("xss")</script>')).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
  });

  it('escapes ampersands', () => {
    expect(escapeHtml('A & B')).toBe('A &amp; B');
  });

  it('escapes quotes', () => {
    expect(escapeHtml('"hello"')).toBe('&quot;hello&quot;');
  });

  it('handles empty string', () => {
    expect(escapeHtml('')).toBe('');
  });
});
