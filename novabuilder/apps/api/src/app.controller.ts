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
        { method: 'GET', path: '/search', description: 'Global search', auth: true },
        { method: 'GET', path: '/users/profile', description: 'Get user profile', auth: true },
        { method: 'PATCH', path: '/users/profile', description: 'Update user profile', auth: true },
        { method: 'GET', path: '/notifications', description: 'List notifications', auth: true },
        { method: 'GET', path: '/audit', description: 'Query audit log', auth: true },
        { method: 'GET', path: '/admin/stats', description: 'Platform stats (admin)', auth: true },
      ],
    };
  }
}
