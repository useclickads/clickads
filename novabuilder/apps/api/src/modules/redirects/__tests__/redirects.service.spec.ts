import { describe, it, expect } from 'vitest';

function matchPath(pattern: string, path: string): boolean {
  if (pattern === path) return true;
  if (pattern.includes('*')) {
    const regex = new RegExp('^' + pattern.replace(/\*/g, '(.*)') + '$');
    return regex.test(path);
  }
  return false;
}

function generateRedirectConfig(redirects: Array<{ source: string; destination: string; statusCode: number; enabled: boolean }>): string {
  const active = redirects.filter((r) => r.enabled);
  if (active.length === 0) return '';
  return active.map((r) => `${r.source} ${r.destination} ${r.statusCode}`).join('\n');
}

describe('RedirectsService', () => {
  it('matches exact paths', () => {
    expect(matchPath('/old', '/old')).toBe(true);
    expect(matchPath('/old', '/new')).toBe(false);
  });

  it('matches wildcard paths', () => {
    expect(matchPath('/blog/*', '/blog/hello')).toBe(true);
    expect(matchPath('/blog/*', '/blog/2024/post')).toBe(true);
    expect(matchPath('/blog/*', '/about')).toBe(false);
  });

  it('matches double wildcard', () => {
    expect(matchPath('/docs/*/guide', '/docs/v2/guide')).toBe(true);
    expect(matchPath('/docs/*/guide', '/docs/v2/faq')).toBe(false);
  });

  it('does not match partial paths without wildcard', () => {
    expect(matchPath('/foo', '/foobar')).toBe(false);
    expect(matchPath('/foo', '/foo/bar')).toBe(false);
  });

  it('generates redirect config for active rules only', () => {
    const redirects = [
      { source: '/old', destination: '/new', statusCode: 301, enabled: true },
      { source: '/disabled', destination: '/x', statusCode: 302, enabled: false },
      { source: '/blog/*', destination: '/posts/*', statusCode: 308, enabled: true },
    ];
    const config = generateRedirectConfig(redirects);
    expect(config).toContain('/old /new 301');
    expect(config).toContain('/blog/* /posts/* 308');
    expect(config).not.toContain('/disabled');
  });

  it('returns empty string when no active redirects', () => {
    expect(generateRedirectConfig([])).toBe('');
    expect(generateRedirectConfig([{ source: '/a', destination: '/b', statusCode: 301, enabled: false }])).toBe('');
  });
});
