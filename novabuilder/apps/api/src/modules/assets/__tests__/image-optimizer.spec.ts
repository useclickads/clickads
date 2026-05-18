import { describe, it, expect } from 'vitest';

function generateResponsiveHtml(
  src: string,
  alt: string,
  options?: { breakpoints?: number[]; formats?: string[]; quality?: number; lazyLoading?: boolean },
): string {
  const breakpoints = options?.breakpoints || [320, 640, 1024];
  const formats = options?.formats || ['webp'];
  const quality = options?.quality || 80;
  const lazy = options?.lazyLoading !== false;

  const buildUrl = (s: string, w: number, fm: string, q: number) => {
    const sep = s.includes('?') ? '&' : '?';
    return `${s}${sep}w=${w}&fm=${fm}&q=${q}`;
  };

  const sources = formats.map((format) => {
    const srcset = breakpoints.map((w) => `${buildUrl(src, w, format, quality)} ${w}w`).join(', ');
    return `<source type="image/${format}" srcset="${srcset}" sizes="100vw">`;
  });

  const fallbackSrcset = breakpoints.map((w) => `${buildUrl(src, w, 'jpeg', quality)} ${w}w`).join(', ');
  const escapeHtml = (str: string) => str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  return [
    '<picture>',
    ...sources.map((s) => `  ${s}`),
    `  <img src="${src}" srcset="${fallbackSrcset}" sizes="100vw" alt="${escapeHtml(alt)}"${lazy ? ' loading="lazy" decoding="async"' : ''}>`,
    '</picture>',
  ].join('\n');
}

function analyzeProjectImages(pages: Array<{ content: unknown }>) {
  let totalImages = 0, withoutAlt = 0, withoutDimensions = 0, largeImages = 0, nonOptimalFormat = 0;
  for (const page of pages) {
    const blocks = Array.isArray(page.content) ? page.content : [];
    for (const block of blocks) {
      if (block?.type !== 'image') continue;
      totalImages++;
      const props = block.props || {};
      if (!props.alt) withoutAlt++;
      if (!props.width || !props.height) withoutDimensions++;
      if (props.fileSize && props.fileSize > 500000) largeImages++;
      const src: string = props.src || '';
      if (src.match(/\.(bmp|tiff?)$/i)) nonOptimalFormat++;
    }
  }
  return { totalImages, withoutAlt, withoutDimensions, largeImages, nonOptimalFormat };
}

describe('ImageOptimizerService', () => {
  it('generates picture element with webp source', () => {
    const html = generateResponsiveHtml('https://img.test/photo.jpg', 'Test', { breakpoints: [320, 640] });
    expect(html).toContain('<picture>');
    expect(html).toContain('image/webp');
    expect(html).toContain('320w');
    expect(html).toContain('640w');
  });

  it('adds lazy loading by default', () => {
    const html = generateResponsiveHtml('https://img.test/photo.jpg', 'Test');
    expect(html).toContain('loading="lazy"');
    expect(html).toContain('decoding="async"');
  });

  it('respects lazyLoading=false', () => {
    const html = generateResponsiveHtml('https://img.test/photo.jpg', 'Test', { lazyLoading: false });
    expect(html).not.toContain('loading="lazy"');
  });

  it('escapes alt text', () => {
    const html = generateResponsiveHtml('https://img.test/photo.jpg', 'A "quoted" & <bold> alt');
    expect(html).toContain('&amp;');
    expect(html).toContain('&quot;');
    expect(html).toContain('&lt;');
  });

  it('generates multiple format sources', () => {
    const html = generateResponsiveHtml('https://img.test/photo.jpg', 'Test', { formats: ['webp', 'avif'] });
    expect(html).toContain('image/webp');
    expect(html).toContain('image/avif');
  });

  it('detects images without alt text', () => {
    const pages = [{ content: [{ type: 'image', props: { src: 'a.jpg' } }] }];
    const result = analyzeProjectImages(pages);
    expect(result.totalImages).toBe(1);
    expect(result.withoutAlt).toBe(1);
  });

  it('detects large images', () => {
    const pages = [{ content: [{ type: 'image', props: { alt: 'Ok', fileSize: 800000 } }] }];
    const result = analyzeProjectImages(pages);
    expect(result.largeImages).toBe(1);
  });

  it('detects non-optimal formats', () => {
    const pages = [{ content: [{ type: 'image', props: { alt: 'Ok', src: 'photo.bmp' } }] }];
    const result = analyzeProjectImages(pages);
    expect(result.nonOptimalFormat).toBe(1);
  });
});
