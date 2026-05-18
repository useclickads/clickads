import { describe, it, expect } from 'vitest';

function generateCssVariables(tokens: { key: string; value: { type: string; value: string } }[]): string {
  if (tokens.length === 0) return ':root {}';
  const vars = tokens.map((t) => {
    const name = t.key.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/\./g, '-');
    return `  --${name}: ${t.value.value};`;
  });
  return `:root {\n${vars.join('\n')}\n}`;
}

function generateTailwindConfig(tokens: { key: string; value: { type: string; value: string } }[]) {
  const colors: Record<string, string> = {};
  const fontFamily: Record<string, string[]> = {};
  for (const t of tokens) {
    if (t.value.type === 'color') colors[t.key.replace('color.', '')] = t.value.value;
    if (t.value.type === 'font') fontFamily[t.key.replace('font.', '')] = [t.value.value];
  }
  return { colors, fontFamily };
}

describe('Theme CSS generation', () => {
  it('generates CSS variables from tokens', () => {
    const css = generateCssVariables([
      { key: 'color.primary', value: { type: 'color', value: '#2563eb' } },
      { key: 'color.secondary', value: { type: 'color', value: '#64748b' } },
    ]);
    expect(css).toContain('--color-primary: #2563eb');
    expect(css).toContain('--color-secondary: #64748b');
    expect(css).toContain(':root');
  });

  it('returns empty root for no tokens', () => {
    expect(generateCssVariables([])).toBe(':root {}');
  });

  it('converts camelCase to kebab-case', () => {
    const css = generateCssVariables([
      { key: 'fontSize.heading', value: { type: 'font', value: '2rem' } },
    ]);
    expect(css).toContain('--font-size-heading');
  });
});

describe('Tailwind config generation', () => {
  it('maps color tokens to Tailwind colors', () => {
    const config = generateTailwindConfig([
      { key: 'color.brand', value: { type: 'color', value: '#0f172a' } },
    ]);
    expect(config.colors.brand).toBe('#0f172a');
  });

  it('maps font tokens to Tailwind fontFamily', () => {
    const config = generateTailwindConfig([
      { key: 'font.sans', value: { type: 'font', value: 'Inter' } },
    ]);
    expect(config.fontFamily.sans).toEqual(['Inter']);
  });

  it('handles empty tokens', () => {
    const config = generateTailwindConfig([]);
    expect(Object.keys(config.colors)).toHaveLength(0);
    expect(Object.keys(config.fontFamily)).toHaveLength(0);
  });
});
