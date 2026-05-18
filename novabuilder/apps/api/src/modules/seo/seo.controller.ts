import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SeoService } from './seo.service';

@Controller('projects/:projectId/seo')
@UseGuards(AuthGuard('jwt'))
export class SeoController {
  constructor(private readonly seo: SeoService) {}

  @Get('sitemap')
  async sitemap(@Param('projectId') projectId: string, @Query('baseUrl') baseUrl?: string) {
    const url = baseUrl || 'https://example.com';
    const xml = await this.seo.generateSitemap(projectId, url);
    return { contentType: 'application/xml', content: xml };
  }

  @Get('robots')
  async robots(@Param('projectId') projectId: string, @Query('baseUrl') baseUrl?: string) {
    const url = baseUrl || 'https://example.com';
    const txt = await this.seo.generateRobotsTxt(projectId, url);
    return { contentType: 'text/plain', content: txt };
  }

  @Get('overview')
  async overview(@Param('projectId') projectId: string) {
    return this.seo.getProjectSeoOverview(projectId);
  }

  @Get('pages/:pageId')
  async pageAnalysis(@Param('projectId') projectId: string, @Param('pageId') pageId: string) {
    const result = await this.seo.getPageSeoAnalysis(projectId, pageId);
    if (!result) return { error: 'Page not found' };
    return result;
  }
}
