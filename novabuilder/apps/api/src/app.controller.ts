import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
@Controller()
export class AppController {
  private readonly appService: AppService;

  constructor(@Inject(AppService) appService?: AppService) {
    this.appService = appService ?? new AppService();
  }

  @Get()
  health() {
    return this.appService.getStatus();
  }

  @Get('docs')
  docs() {
    return {
      name: 'NovaBuilder API',
      version: '0.1.0',
      baseUrl: '/api',
      endpoints: [
        { method: 'POST', path: '/auth/signup', description: 'Register a new user', auth: false },
        { method: 'POST', path: '/auth/login', description: 'Login with email and password', auth: false },
        { method: 'POST', path: '/auth/magic-link', description: 'Request magic link login', auth: false },
        { method: 'POST', path: '/auth/magic-link/verify', description: 'Verify magic link token', auth: false },
        { method: 'POST', path: '/auth/refresh', description: 'Refresh access token', auth: false },
        { method: 'POST', path: '/auth/logout', description: 'Logout and revoke refresh token', auth: true },
        { method: 'GET', path: '/auth/me', description: 'Get current user info', auth: true },
        { method: 'POST', path: '/auth/forgot-password', description: 'Request password reset', auth: false },
        { method: 'POST', path: '/auth/reset-password', description: 'Reset password with token', auth: false },
        { method: 'GET', path: '/projects', description: 'List user projects', auth: true },
        { method: 'POST', path: '/projects', description: 'Create new project', auth: true },
        { method: 'GET', path: '/projects/:id', description: 'Get project details', auth: true },
        { method: 'PATCH', path: '/projects/:id', description: 'Update project', auth: true },
        { method: 'DELETE', path: '/projects/:id', description: 'Soft delete project', auth: true },
        { method: 'POST', path: '/projects/:id/clone', description: 'Clone project with pages', auth: true },
        { method: 'GET', path: '/projects/:projectId/pages', description: 'List pages', auth: true },
        { method: 'POST', path: '/projects/:projectId/pages', description: 'Create page', auth: true },
        { method: 'PATCH', path: '/projects/:projectId/pages/:id', description: 'Update page', auth: true },
        { method: 'PUT', path: '/projects/:projectId/pages/:id/content', description: 'Save page content', auth: true },
        { method: 'PATCH', path: '/projects/:projectId/pages/:id/publish', description: 'Publish page', auth: true },
        { method: 'PATCH', path: '/projects/:projectId/pages/:id/schedule', description: 'Schedule page publish', auth: true },
        { method: 'POST', path: '/projects/:projectId/pages/:id/duplicate', description: 'Duplicate page', auth: true },
        { method: 'POST', path: '/projects/:projectId/pages/bulk/publish', description: 'Bulk publish pages', auth: true },
        { method: 'POST', path: '/projects/:projectId/pages/bulk/delete', description: 'Bulk delete pages', auth: true },
        { method: 'POST', path: '/projects/:projectId/deploy', description: 'Deploy project', auth: true },
        { method: 'GET', path: '/projects/:projectId/deploy', description: 'List deployments', auth: true },
        { method: 'POST', path: '/projects/:projectId/analytics/track', description: 'Track event', auth: false },
        { method: 'POST', path: '/projects/:projectId/analytics/pageview', description: 'Track page view', auth: false },
        { method: 'GET', path: '/projects/:projectId/analytics/summary', description: 'Analytics summary', auth: true },
        { method: 'GET', path: '/projects/:projectId/analytics/events', description: 'List analytics events', auth: true },
        { method: 'GET', path: '/marketplace/plugins', description: 'List marketplace plugins', auth: true },
        { method: 'POST', path: '/marketplace/plugins', description: 'Publish a plugin', auth: true },
        { method: 'GET', path: '/marketplace/plugins/:id', description: 'Get plugin details', auth: true },
        { method: 'POST', path: '/marketplace/plugins/:id/install', description: 'Install plugin to project', auth: true },
        { method: 'POST', path: '/marketplace/plugins/:id/reviews', description: 'Create/update review', auth: true },
        { method: 'POST', path: '/projects/:projectId/analytics/heatmap', description: 'Track heatmap click', auth: false },
        { method: 'GET', path: '/projects/:projectId/analytics/heatmap/:pageId', description: 'Get heatmap data', auth: true },
        { method: 'POST', path: '/projects/:projectId/analytics/funnels', description: 'Create funnel', auth: true },
        { method: 'GET', path: '/projects/:projectId/analytics/funnels', description: 'List funnels', auth: true },
        { method: 'GET', path: '/projects/:projectId/analytics/funnels/:id/compute', description: 'Compute funnel results', auth: true },
        { method: 'POST', path: '/marketplace/plugins/:id/versions', description: 'Publish new plugin version', auth: true },
        { method: 'GET', path: '/marketplace/plugins/:id/versions', description: 'Get version history', auth: true },
        { method: 'GET', path: '/projects/:projectId/integrations', description: 'List integrations', auth: true },
        { method: 'POST', path: '/projects/:projectId/integrations', description: 'Add integration (Slack/Discord/Zapier)', auth: true },
        { method: 'POST', path: '/projects/:projectId/integrations/:id/test', description: 'Test integration', auth: true },
        { method: 'GET', path: '/projects/:projectId/workflows', description: 'List workflows', auth: true },
        { method: 'POST', path: '/projects/:projectId/workflows', description: 'Create workflow', auth: true },
        { method: 'POST', path: '/projects/:projectId/workflows/trigger', description: 'Trigger workflow manually', auth: true },
        { method: 'GET', path: '/projects/:projectId/pages/:id/versions/diff', description: 'Diff two page versions', auth: true },
        { method: 'GET', path: '/projects/:projectId/pages/:pageId/quality', description: 'Run quality audit', auth: true },
        { method: 'GET', path: '/projects/:projectId/components', description: 'List custom components', auth: true },
        { method: 'POST', path: '/projects/:projectId/components', description: 'Save custom component', auth: true },
        { method: 'POST', path: '/projects/:projectId/forms/submit', description: 'Submit form (with validation)', auth: false },
        { method: 'GET', path: '/projects/:projectId/forms/submissions/export', description: 'Export submissions as CSV', auth: true },
        { method: 'GET', path: '/projects/:projectId/theme/css', description: 'Get CSS variables', auth: true },
        { method: 'GET', path: '/projects/:projectId/theme/tailwind', description: 'Get Tailwind config', auth: true },
        { method: 'POST', path: '/projects/:projectId/cms/entries/:id/translate', description: 'Translate CMS entry', auth: true },
        { method: 'GET', path: '/projects/:projectId/cms/collections/:id/translations/status', description: 'Translation coverage', auth: true },
        { method: 'GET', path: '/search', description: 'Global search (projects, pages, plugins, team)', auth: true },
        { method: 'GET', path: '/users/profile', description: 'Get user profile', auth: true },
        { method: 'PATCH', path: '/users/profile', description: 'Update user profile', auth: true },
        { method: 'GET', path: '/notifications', description: 'List notifications', auth: true },
        { method: 'GET', path: '/audit', description: 'Query audit log', auth: true },
        { method: 'GET', path: '/admin/stats', description: 'Platform stats (admin)', auth: true },
        { method: 'GET', path: '/admin/stats/detailed', description: 'Detailed stats with growth metrics', auth: true },
        { method: 'GET', path: '/admin/health', description: 'System health (memory, uptime)', auth: true },
      ],
    };
  }
}
