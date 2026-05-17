import { describe, it, expect } from 'vitest';
import { AiService } from '../ai.service';

describe('AiService', () => {
  const service = new AiService();

  describe('generatePage', () => {
    it('returns blocks array for a landing page prompt', async () => {
      const result = await service.generatePage('A SaaS landing page with features');
      expect(result.blocks).toBeDefined();
      expect(result.blocks.length).toBeGreaterThan(3);
      expect(result.blocks[0].type).toBe('navigation');
    });

    it('includes a hero block for landing prompts', async () => {
      const result = await service.generatePage('landing page for my startup');
      const hero = result.blocks.find((b) => b.type === 'hero');
      expect(hero).toBeDefined();
      expect(hero!.props.title).toBeTruthy();
    });

    it('includes a form block when contact is mentioned', async () => {
      const result = await service.generatePage('contact page with form');
      const form = result.blocks.find((b) => b.type === 'form');
      expect(form).toBeDefined();
      expect(form!.props.formName).toBe('contact');
    });

    it('includes columns for feature-related prompts', async () => {
      const result = await service.generatePage('page with features section');
      const columns = result.blocks.find((b) => b.type === 'columns');
      expect(columns).toBeDefined();
    });

    it('always includes navigation and footer', async () => {
      const result = await service.generatePage('any page');
      expect(result.blocks[0].type).toBe('navigation');
      expect(result.blocks[result.blocks.length - 1].type).toBe('footer');
    });

    it('generates unique block IDs', async () => {
      const result = await service.generatePage('landing page');
      const ids = result.blocks.map((b) => b.id);
      const unique = new Set(ids);
      expect(unique.size).toBe(ids.length);
    });
  });

  describe('suggestBlocks', () => {
    it('suggests hero when none exists', async () => {
      const suggestions = await service.suggestBlocks({ existingBlocks: [{ id: '1', type: 'text', props: {} }] });
      const hero = suggestions.find((s) => s.type === 'hero');
      expect(hero).toBeDefined();
    });

    it('suggests navigation when none exists', async () => {
      const suggestions = await service.suggestBlocks({ existingBlocks: [{ id: '1', type: 'hero', props: {} }] });
      const nav = suggestions.find((s) => s.type === 'navigation');
      expect(nav).toBeDefined();
    });

    it('suggests footer when page has 3+ blocks and no footer', async () => {
      const blocks = [
        { id: '1', type: 'navigation', props: {} },
        { id: '2', type: 'hero', props: {} },
        { id: '3', type: 'text', props: {} },
      ];
      const suggestions = await service.suggestBlocks({ existingBlocks: blocks });
      const footer = suggestions.find((s) => s.type === 'footer');
      expect(footer).toBeDefined();
    });

    it('returns at most 3 suggestions', async () => {
      const suggestions = await service.suggestBlocks({ existingBlocks: [] });
      expect(suggestions.length).toBeLessThanOrEqual(3);
    });
  });

  describe('generateCopy', () => {
    it('generates headline text', async () => {
      const result = await service.generateCopy({ type: 'headline', topic: 'AI tools' });
      expect(result.text).toBeTruthy();
      expect(result.text.length).toBeGreaterThan(10);
    });

    it('generates CTA text', async () => {
      const result = await service.generateCopy({ type: 'cta' });
      expect(result.text).toBeTruthy();
      expect(result.text.length).toBeLessThan(50);
    });

    it('generates paragraph text', async () => {
      const result = await service.generateCopy({ type: 'paragraph', topic: 'project management' });
      expect(result.text).toBeTruthy();
      expect(result.text.length).toBeGreaterThan(50);
    });
  });

  describe('improveContent', () => {
    it('capitalizes first letter if content is all lowercase', async () => {
      const result = await service.improveContent('hello world this is a test');
      expect(result.improved[0]).toBe('H');
    });

    it('suggests more detail for short content', async () => {
      const result = await service.improveContent('Short');
      expect(result.suggestions).toContain('Consider adding more detail to engage readers');
    });

    it('returns suggestions array', async () => {
      const result = await service.improveContent('some text here.');
      expect(Array.isArray(result.suggestions)).toBe(true);
    });
  });
});
