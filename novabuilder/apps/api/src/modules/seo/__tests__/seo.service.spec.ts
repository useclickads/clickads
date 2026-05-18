import { describe, it, expect } from 'vitest';

function generateSitemap(pages: Array<{ path: string; updatedAt: Date; slug: string }>, baseUrl: string): string {
  const escapeXml = (str: string) => str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const urls = pages.map((page) => {
    const loc = `${baseUrl}${page.path}`;
    const lastmod = page.updatedAt.toISOString().split('T')[0];
    const priority = page.path === '/' || page.slug === 'index' ? '1.0' : '0.8';
    return `  <url>\n    <loc>${escapeXml(loc)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
  });
  return ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">', ...urls, '</urlset>'].join('\n');
}

function analyzeSeo(title: string, seo: any, content: any[]) {
  const issues: Array<{ severity: string; message: string }> = [];
  if (!title || title.length < 10) issues.push({ severity: 'error', message: 'Page title is too short' });
  if (title && title.length > 60) issues.push({ severity: 'warning', message: 'Page title too long' });
  if (!seo?.description) issues.push({ severity: 'error', message: 'Missing meta description' });
  const h1s = content.filter((b) => b?.type === 'heading' && (b?.props?.level === 1 || b?.props?.level === 'h1'));
  if (h1s.length === 0) issues.push({ severity: 'error', message: 'No H1' });
  if (h1s.length > 1) issues.push({ severity: 'warning', message: 'Multiple H1s' });
  const score = Math.max(0, 100 - issues.filter((i) => i.severity === 'error').length * 15 - issues.filter((i) => i.severity === 'warning').length * 5);
  return { issues, score };
}

describe('SeoService', () => {
  it('generates valid XML sitemap', () => {
    const xml = generateSitemap(
      [{ path: '/', updatedAt: new Date('2026-01-01'), slug: 'index' }],
      'https://test.com',
    );
    expect(xml).toContain('<?xml version="1.0"');
    expect(xml).toContain('<loc>https://test.com/</loc>');
    expect(xml).toContain('<priority>1.0</priority>');
  });

  it('assigns lower priority to non-index pages', () => {
    const xml = generateSitemap(
      [{ path: '/about', updatedAt: new Date('2026-01-01'), slug: 'about' }],
      'https://test.com',
    );
    expect(xml).toContain('<priority>0.8</priority>');
  });

  it('escapes XML special characters in URLs', () => {
    const xml = generateSitemap(
      [{ path: '/a&b', updatedAt: new Date('2026-01-01'), slug: 'a-b' }],
      'https://test.com',
    );
    expect(xml).toContain('&amp;');
    expect(xml).not.toContain('&b<');
  });

  it('returns perfect score for well-optimized page', () => {
    const result = analyzeSeo(
      'A properly titled page for testing',
      { description: 'A detailed meta description that is long enough for SEO purposes' },
      [{ type: 'heading', props: { level: 1, text: 'Main Title' } }],
    );
    expect(result.score).toBe(100);
    expect(result.issues).toHaveLength(0);
  });

  it('flags missing title and description', () => {
    const result = analyzeSeo('', null, []);
    expect(result.issues.length).toBeGreaterThanOrEqual(2);
    expect(result.issues.some((i) => i.severity === 'error')).toBe(true);
  });

  it('warns about multiple H1 headings', () => {
    const result = analyzeSeo(
      'Good enough title here',
      { description: 'A proper meta description for search engines' },
      [
        { type: 'heading', props: { level: 1, text: 'First' } },
        { type: 'heading', props: { level: 1, text: 'Second' } },
      ],
    );
    expect(result.issues.some((i) => i.message.includes('Multiple H1'))).toBe(true);
  });

  it('penalizes score per issue severity', () => {
    const result = analyzeSeo('Short', null, []);
    expect(result.score).toBeLessThan(80);
  });
});
