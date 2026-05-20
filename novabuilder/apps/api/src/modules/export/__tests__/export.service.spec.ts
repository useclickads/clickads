import { describe, it, expect } from 'vitest';

type ExportData = {
  version: string;
  exportedAt: string;
  project: { id: string; name: string; slug: string };
  pages: { title: string; slug: string; path: string; published: boolean }[];
  cms: { name: string; slug: string; fields: { name: string; type: string }[]; entries: { data: unknown }[] }[];
  settings: Record<string, unknown> | null;
  theme: { key: string; value: unknown }[];
  domains: { domain: string; verified: boolean }[];
};

function createExportData(
  project: { id: string; name: string; slug: string },
  pages: ExportData['pages'],
  cms: ExportData['cms'],
  settings: ExportData['settings'],
  theme: ExportData['theme'],
  domains: ExportData['domains'],
): ExportData {
  return {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    project,
    pages,
    cms,
    settings,
    theme,
    domains,
  };
}

function validateExport(data: unknown): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!data || typeof data !== 'object') return { valid: false, errors: ['Invalid export data'] };

  const d = data as any;
  if (!d.version) errors.push('Missing version');
  if (!d.project?.name) errors.push('Missing project name');
  if (!d.project?.slug) errors.push('Missing project slug');
  if (!Array.isArray(d.pages)) errors.push('Pages must be an array');
  if (!Array.isArray(d.cms)) errors.push('CMS must be an array');
  if (!Array.isArray(d.theme)) errors.push('Theme must be an array');

  return { valid: errors.length === 0, errors };
}

function generateSlugForImport(originalSlug: string): string {
  return `${originalSlug}-${Date.now().toString(36)}`;
}

describe('ExportService', () => {
  it('creates valid export data', () => {
    const data = createExportData(
      { id: 'p1', name: 'My Site', slug: 'my-site' },
      [{ title: 'Home', slug: 'home', path: '/', published: true }],
      [],
      null,
      [{ key: 'primaryColor', value: '#2563eb' }],
      [],
    );
    expect(data.version).toBe('1.0');
    expect(data.project.name).toBe('My Site');
    expect(data.pages).toHaveLength(1);
    expect(data.theme).toHaveLength(1);
  });

  it('includes timestamp in export', () => {
    const before = new Date().toISOString();
    const data = createExportData(
      { id: 'p1', name: 'Test', slug: 'test' },
      [], [], null, [], [],
    );
    expect(data.exportedAt >= before).toBe(true);
  });

  it('validates export data', () => {
    const data = createExportData(
      { id: 'p1', name: 'Test', slug: 'test' },
      [], [], null, [], [],
    );
    const result = validateExport(data);
    expect(result.valid).toBe(true);
  });

  it('rejects invalid export data', () => {
    expect(validateExport(null).valid).toBe(false);
    expect(validateExport({}).errors).toContain('Missing version');
    expect(validateExport({ version: '1.0', project: {} }).errors).toContain('Missing project name');
  });

  it('generates slug with original prefix', () => {
    const slug = generateSlugForImport('my-site');
    expect(slug).toContain('my-site-');
    expect(slug.length).toBeGreaterThan('my-site-'.length);
  });

  it('includes CMS collections with fields and entries', () => {
    const data = createExportData(
      { id: 'p1', name: 'Blog', slug: 'blog' },
      [],
      [{
        name: 'Posts',
        slug: 'posts',
        fields: [{ name: 'title', type: 'text' }, { name: 'body', type: 'richtext' }],
        entries: [{ data: { title: 'Hello', body: 'World' } }],
      }],
      null, [], [],
    );
    expect(data.cms).toHaveLength(1);
    expect(data.cms[0].fields).toHaveLength(2);
    expect(data.cms[0].entries).toHaveLength(1);
  });

  it('handles null settings', () => {
    const data = createExportData(
      { id: 'p1', name: 'Test', slug: 'test' },
      [], [], null, [], [],
    );
    expect(data.settings).toBeNull();
  });

  it('includes domains in export', () => {
    const data = createExportData(
      { id: 'p1', name: 'Test', slug: 'test' },
      [], [], null, [],
      [{ domain: 'example.com', verified: true }, { domain: 'www.example.com', verified: false }],
    );
    expect(data.domains).toHaveLength(2);
    expect(data.domains[0].verified).toBe(true);
  });
});
