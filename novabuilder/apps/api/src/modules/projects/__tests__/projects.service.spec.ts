import { describe, it, expect } from 'vitest';

function generateCloneSlug(sourceSlug: string): string {
  const suffix = Date.now().toString(36);
  return `${sourceSlug}-clone-${suffix}`;
}

function generateCloneName(sourceName: string): string {
  return `${sourceName} (Clone)`;
}

type CloneOptions = {
  includeCms: boolean;
  includeSettings: boolean;
  includeTheme: boolean;
};

function mergeCloneOptions(options?: Partial<CloneOptions>): CloneOptions {
  return {
    includeCms: true,
    includeSettings: true,
    includeTheme: true,
    ...options,
  };
}

function validateSlug(slug: string): { valid: boolean; error?: string } {
  if (!slug) return { valid: false, error: 'Slug is required' };
  if (slug.length < 3) return { valid: false, error: 'Slug must be at least 3 characters' };
  if (slug.length > 60) return { valid: false, error: 'Slug must be at most 60 characters' };
  if (!/^[a-z0-9-]+$/.test(slug)) return { valid: false, error: 'Slug can only contain lowercase letters, numbers, and hyphens' };
  if (slug.startsWith('-') || slug.endsWith('-')) return { valid: false, error: 'Slug cannot start or end with a hyphen' };
  return { valid: true };
}

describe('ProjectsService', () => {
  it('generates clone slug with suffix', () => {
    const slug = generateCloneSlug('my-site');
    expect(slug).toContain('my-site-clone-');
    expect(slug.length).toBeGreaterThan('my-site-clone-'.length);
  });

  it('generates clone name', () => {
    expect(generateCloneName('My Website')).toBe('My Website (Clone)');
    expect(generateCloneName('Test')).toBe('Test (Clone)');
  });

  it('merges clone options with defaults', () => {
    const opts = mergeCloneOptions({});
    expect(opts.includeCms).toBe(true);
    expect(opts.includeSettings).toBe(true);
    expect(opts.includeTheme).toBe(true);
  });

  it('overrides specific clone options', () => {
    const opts = mergeCloneOptions({ includeCms: false });
    expect(opts.includeCms).toBe(false);
    expect(opts.includeSettings).toBe(true);
  });

  it('validates slug - valid', () => {
    expect(validateSlug('my-website').valid).toBe(true);
    expect(validateSlug('site123').valid).toBe(true);
    expect(validateSlug('abc').valid).toBe(true);
  });

  it('validates slug - required', () => {
    expect(validateSlug('').valid).toBe(false);
    expect(validateSlug('').error).toContain('required');
  });

  it('validates slug - min length', () => {
    expect(validateSlug('ab').valid).toBe(false);
  });

  it('validates slug - max length', () => {
    expect(validateSlug('a'.repeat(61)).valid).toBe(false);
  });

  it('validates slug - format', () => {
    expect(validateSlug('My Site').valid).toBe(false);
    expect(validateSlug('my_site').valid).toBe(false);
    expect(validateSlug('my.site').valid).toBe(false);
  });

  it('validates slug - no leading/trailing hyphens', () => {
    expect(validateSlug('-my-site').valid).toBe(false);
    expect(validateSlug('my-site-').valid).toBe(false);
  });
});
