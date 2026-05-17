import { describe, it, expect } from 'vitest';
import { renderTemplate } from '../templates/render';

describe('Email Templates', () => {
  describe('magic-link', () => {
    it('renders with name and link', () => {
      const html = renderTemplate('magic-link', { name: 'Alice', link: 'https://app.test/magic?token=abc' });
      expect(html).toContain('Alice');
      expect(html).toContain('https://app.test/magic?token=abc');
      expect(html).toContain('Sign In');
    });

    it('includes NovaBuilder branding', () => {
      const html = renderTemplate('magic-link', { name: 'Test', link: 'https://test.com' });
      expect(html).toContain('NovaBuilder');
    });

    it('is valid HTML', () => {
      const html = renderTemplate('magic-link', { name: 'Test', link: 'https://test.com' });
      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('</html>');
    });
  });

  describe('password-reset', () => {
    it('renders with name and link', () => {
      const html = renderTemplate('password-reset', { name: 'Bob', link: 'https://app.test/reset?token=xyz' });
      expect(html).toContain('Bob');
      expect(html).toContain('Reset Password');
      expect(html).toContain('https://app.test/reset?token=xyz');
    });

    it('mentions expiration', () => {
      const html = renderTemplate('password-reset', { name: 'Test', link: 'https://test.com' });
      expect(html).toContain('1 hour');
    });
  });

  describe('team-invite', () => {
    it('renders with inviter, project, role, and link', () => {
      const html = renderTemplate('team-invite', {
        inviterName: 'Charlie',
        projectName: 'My Site',
        role: 'editor',
        link: 'https://app.test/accept',
      });
      expect(html).toContain('Charlie');
      expect(html).toContain('My Site');
      expect(html).toContain('editor');
      expect(html).toContain('Accept Invitation');
    });
  });

  describe('welcome', () => {
    it('renders with name and feature list', () => {
      const html = renderTemplate('welcome', { name: 'Dana' });
      expect(html).toContain('Dana');
      expect(html).toContain('Go to Dashboard');
      expect(html).toContain('AI');
    });
  });

  describe('deploy-notification', () => {
    it('renders with project and url', () => {
      const html = renderTemplate('deploy-notification', {
        projectName: 'Portfolio',
        pageName: 'Home',
        url: 'https://portfolio.nova.app',
      });
      expect(html).toContain('Portfolio');
      expect(html).toContain('Home');
      expect(html).toContain('View Live Site');
    });
  });

  describe('error handling', () => {
    it('throws for unknown template', () => {
      expect(() => renderTemplate('nonexistent', {})).toThrow('not found');
    });
  });
});
