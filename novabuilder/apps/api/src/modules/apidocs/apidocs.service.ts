import { Injectable } from '@nestjs/common';

type ApiEndpoint = {
  method: string;
  path: string;
  description: string;
  auth: boolean;
  parameters?: Array<{ name: string; in: string; type: string; required: boolean; description: string }>;
  requestBody?: { type: string; properties: Record<string, { type: string; description: string }> };
  responses: Record<string, { description: string }>;
};

type ApiCategory = {
  name: string;
  description: string;
  endpoints: ApiEndpoint[];
};

@Injectable()
export class ApiDocsService {
  getOpenApiSpec(): Record<string, unknown> {
    return {
      openapi: '3.0.3',
      info: {
        title: 'NovaBuilder API',
        version: '1.0.0',
        description: 'AI-native enterprise no-code website builder API',
        contact: { email: 'support@novabuilder.app' },
      },
      servers: [{ url: '/api', description: 'API server' }],
      components: {
        securitySchemes: {
          bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        },
      },
      security: [{ bearerAuth: [] }],
      paths: this.buildPaths(),
    };
  }

  getCategories(): ApiCategory[] {
    return [
      {
        name: 'Authentication',
        description: 'User authentication and session management',
        endpoints: [
          { method: 'POST', path: '/auth/register', description: 'Register a new account', auth: false, requestBody: { type: 'object', properties: { email: { type: 'string', description: 'User email' }, password: { type: 'string', description: 'Password' }, name: { type: 'string', description: 'Display name' } } }, responses: { '201': { description: 'Account created' } } },
          { method: 'POST', path: '/auth/login', description: 'Sign in with email and password', auth: false, responses: { '200': { description: 'JWT token returned' } } },
          { method: 'GET', path: '/auth/me', description: 'Get current user profile', auth: true, responses: { '200': { description: 'User profile' } } },
        ],
      },
      {
        name: 'Projects',
        description: 'Project CRUD and management',
        endpoints: [
          { method: 'GET', path: '/projects', description: 'List all projects', auth: true, responses: { '200': { description: 'Array of projects' } } },
          { method: 'POST', path: '/projects', description: 'Create a new project', auth: true, requestBody: { type: 'object', properties: { name: { type: 'string', description: 'Project name' }, slug: { type: 'string', description: 'URL slug' }, description: { type: 'string', description: 'Optional description' } } }, responses: { '201': { description: 'Project created' } } },
          { method: 'GET', path: '/projects/:id', description: 'Get project details with pages', auth: true, responses: { '200': { description: 'Project with pages' } } },
          { method: 'DELETE', path: '/projects/:id', description: 'Delete a project', auth: true, responses: { '200': { description: 'Project deleted' } } },
          { method: 'POST', path: '/projects/:id/clone', description: 'Clone a project', auth: true, responses: { '200': { description: 'Cloned project' } } },
        ],
      },
      {
        name: 'Pages',
        description: 'Page content management',
        endpoints: [
          { method: 'POST', path: '/projects/:projectId/pages', description: 'Create a new page', auth: true, responses: { '201': { description: 'Page created' } } },
          { method: 'PUT', path: '/projects/:projectId/pages/:id/content', description: 'Update page content (blocks)', auth: true, responses: { '200': { description: 'Content saved' } } },
          { method: 'PATCH', path: '/projects/:projectId/pages/:id/publish', description: 'Publish a page', auth: true, responses: { '200': { description: 'Page published' } } },
          { method: 'GET', path: '/projects/:projectId/pages/:id/versions', description: 'List page versions', auth: true, responses: { '200': { description: 'Array of versions' } } },
          { method: 'GET', path: '/projects/:projectId/pages/:id/versions/diff', description: 'Diff two page versions', auth: true, parameters: [{ name: 'a', in: 'query', type: 'string', required: true, description: 'Version A ID' }, { name: 'b', in: 'query', type: 'string', required: true, description: 'Version B ID' }], responses: { '200': { description: 'Block-level diff' } } },
        ],
      },
      {
        name: 'CMS',
        description: 'Content management system collections and entries',
        endpoints: [
          { method: 'GET', path: '/projects/:projectId/collections', description: 'List CMS collections', auth: true, responses: { '200': { description: 'Array of collections' } } },
          { method: 'POST', path: '/projects/:projectId/collections', description: 'Create a collection', auth: true, responses: { '201': { description: 'Collection created' } } },
          { method: 'POST', path: '/projects/:projectId/collections/:id/entries', description: 'Add an entry', auth: true, responses: { '201': { description: 'Entry created' } } },
          { method: 'POST', path: '/projects/:projectId/entries/:id/translate', description: 'Translate an entry to another locale', auth: true, responses: { '200': { description: 'Translation created' } } },
          { method: 'GET', path: '/projects/:projectId/collections/:id/translations/status', description: 'Get translation coverage per locale', auth: true, responses: { '200': { description: 'Translation status' } } },
        ],
      },
      {
        name: 'Analytics',
        description: 'Page analytics, funnels, and heatmaps',
        endpoints: [
          { method: 'GET', path: '/projects/:projectId/analytics/summary', description: 'Get analytics summary', auth: true, parameters: [{ name: 'days', in: 'query', type: 'number', required: false, description: 'Number of days (default 30)' }], responses: { '200': { description: 'Analytics summary' } } },
          { method: 'POST', path: '/projects/:projectId/analytics/heatmap', description: 'Record a heatmap click', auth: false, responses: { '200': { description: 'Click recorded' } } },
          { method: 'POST', path: '/projects/:projectId/analytics/funnels', description: 'Create a funnel', auth: true, responses: { '201': { description: 'Funnel created' } } },
          { method: 'GET', path: '/projects/:projectId/analytics/funnels/:id/compute', description: 'Compute funnel results', auth: true, responses: { '200': { description: 'Funnel results with dropoff' } } },
        ],
      },
      {
        name: 'AI',
        description: 'AI-powered content generation',
        endpoints: [
          { method: 'POST', path: '/projects/:projectId/ai/generate-page', description: 'Generate a full page from prompt', auth: true, responses: { '200': { description: 'Generated page blocks' } } },
          { method: 'POST', path: '/projects/:projectId/ai/generate-copy', description: 'Generate copywriting for a block', auth: true, responses: { '200': { description: 'Generated text' } } },
          { method: 'POST', path: '/projects/:projectId/ai/suggest-seo', description: 'Get AI SEO suggestions', auth: true, responses: { '200': { description: 'SEO suggestions' } } },
        ],
      },
      {
        name: 'Deploy',
        description: 'Site deployment and hosting',
        endpoints: [
          { method: 'POST', path: '/projects/:projectId/deploy', description: 'Create a deployment', auth: true, responses: { '200': { description: 'Deployment created' } } },
          { method: 'GET', path: '/projects/:projectId/deploy', description: 'List deployments', auth: true, responses: { '200': { description: 'Array of deployments' } } },
        ],
      },
      {
        name: 'Templates',
        description: 'Project templates',
        endpoints: [
          { method: 'GET', path: '/templates', description: 'List available templates', auth: false, parameters: [{ name: 'category', in: 'query', type: 'string', required: false, description: 'Filter by category' }], responses: { '200': { description: 'Array of templates' } } },
          { method: 'POST', path: '/templates/:id/use', description: 'Create project from template', auth: true, responses: { '200': { description: 'Project created' } } },
        ],
      },
      {
        name: 'SEO',
        description: 'Search engine optimization tools',
        endpoints: [
          { method: 'GET', path: '/projects/:projectId/seo/sitemap', description: 'Generate XML sitemap', auth: true, responses: { '200': { description: 'Sitemap XML' } } },
          { method: 'GET', path: '/projects/:projectId/seo/robots', description: 'Generate robots.txt', auth: true, responses: { '200': { description: 'Robots.txt content' } } },
          { method: 'GET', path: '/projects/:projectId/seo/overview', description: 'Get project SEO overview', auth: true, responses: { '200': { description: 'SEO status per page' } } },
          { method: 'GET', path: '/projects/:projectId/seo/pages/:pageId', description: 'Analyze page SEO', auth: true, responses: { '200': { description: 'SEO analysis with score' } } },
        ],
      },
      {
        name: 'Performance',
        description: 'Core Web Vitals monitoring',
        endpoints: [
          { method: 'POST', path: '/projects/:projectId/performance/collect', description: 'Record performance metrics', auth: false, responses: { '200': { description: 'Metrics recorded' } } },
          { method: 'GET', path: '/projects/:projectId/performance/overview', description: 'Get performance overview', auth: true, responses: { '200': { description: 'Performance scores per page' } } },
          { method: 'GET', path: '/projects/:projectId/performance/script', description: 'Get auto-generated tracking script', auth: false, responses: { '200': { description: 'JavaScript snippet' } } },
        ],
      },
    ];
  }

  private buildPaths(): Record<string, unknown> {
    const paths: Record<string, unknown> = {};
    for (const category of this.getCategories()) {
      for (const ep of category.endpoints) {
        const oaPath = ep.path.replace(/:(\w+)/g, '{$1}');
        if (!paths[oaPath]) paths[oaPath] = {};

        const method = ep.method.toLowerCase();
        const operation: Record<string, unknown> = {
          tags: [category.name],
          summary: ep.description,
          responses: {},
        };

        if (ep.auth) operation.security = [{ bearerAuth: [] }];

        if (ep.parameters) {
          operation.parameters = ep.parameters.map((p) => ({
            name: p.name, in: p.in, required: p.required,
            schema: { type: p.type }, description: p.description,
          }));
        }

        if (ep.requestBody) {
          operation.requestBody = {
            content: {
              'application/json': {
                schema: {
                  type: ep.requestBody.type,
                  properties: Object.fromEntries(
                    Object.entries(ep.requestBody.properties).map(([k, v]) => [k, { type: v.type, description: v.description }]),
                  ),
                },
              },
            },
          };
        }

        for (const [code, resp] of Object.entries(ep.responses)) {
          (operation.responses as Record<string, unknown>)[code] = { description: resp.description };
        }

        (paths[oaPath] as Record<string, unknown>)[method] = operation;
      }
    }
    return paths;
  }
}
