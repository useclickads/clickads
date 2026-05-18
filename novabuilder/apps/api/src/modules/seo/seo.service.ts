import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SeoService {
  constructor(private readonly prisma: PrismaService) {}

  async generateSitemap(projectId: string, baseUrl: string): Promise<string> {
    const pages = await this.prisma.client.page.findMany({
      where: { projectId, published: true, deletedAt: null },
      select: { path: true, updatedAt: true, slug: true },
      orderBy: { path: 'asc' },
    });

    const urls = pages.map((page) => {
      const loc = `${baseUrl}${page.path}`;
      const lastmod = page.updatedAt.toISOString().split('T')[0];
      const priority = page.path === '/' || page.slug === 'index' ? '1.0' : '0.8';
      return `  <url>\n    <loc>${this.escapeXml(loc)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
    });

    return [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      ...urls,
      '</urlset>',
    ].join('\n');
  }

  async generateRobotsTxt(projectId: string, baseUrl: string): Promise<string> {
    const settings = await this.prisma.client.projectSettings.findUnique({
      where: { projectId },
    });

    const raw = settings?.globalFooter as any;
    const disallowPaths: string[] = raw?.robotsDisallow || ['/api/', '/admin/'];
    const allowPaths: string[] = raw?.robotsAllow || ['/'];

    const lines = [
      'User-agent: *',
      ...allowPaths.map((p) => `Allow: ${p}`),
      ...disallowPaths.map((p) => `Disallow: ${p}`),
      '',
      `Sitemap: ${baseUrl}/sitemap.xml`,
    ];

    return lines.join('\n');
  }

  async getPageSeoAnalysis(projectId: string, pageId: string) {
    const page = await this.prisma.client.page.findUnique({ where: { id: pageId } });
    if (!page || page.projectId !== projectId) return null;

    const seo = page.seo as any;
    const content = Array.isArray(page.content) ? page.content : [];
    const issues: Array<{ severity: 'error' | 'warning' | 'info'; message: string }> = [];

    if (!page.title || page.title.length < 10) {
      issues.push({ severity: 'error', message: 'Page title is too short (minimum 10 characters)' });
    }
    if (page.title && page.title.length > 60) {
      issues.push({ severity: 'warning', message: 'Page title exceeds 60 characters — may be truncated in search results' });
    }

    if (!seo?.description) {
      issues.push({ severity: 'error', message: 'Missing meta description' });
    } else if (seo.description.length < 50) {
      issues.push({ severity: 'warning', message: 'Meta description is too short (minimum 50 characters)' });
    } else if (seo.description.length > 160) {
      issues.push({ severity: 'warning', message: 'Meta description exceeds 160 characters' });
    }

    if (!seo?.ogImage) {
      issues.push({ severity: 'warning', message: 'Missing Open Graph image' });
    }

    const headings = content.filter((b: any) => b?.type === 'heading');
    const h1s = headings.filter((h: any) => h?.props?.level === 1 || h?.props?.level === 'h1');
    if (h1s.length === 0) {
      issues.push({ severity: 'error', message: 'No H1 heading found on page' });
    } else if (h1s.length > 1) {
      issues.push({ severity: 'warning', message: `Multiple H1 headings found (${h1s.length}) — use only one` });
    }

    const images = content.filter((b: any) => b?.type === 'image');
    const imagesWithoutAlt = images.filter((i: any) => !i?.props?.alt);
    if (imagesWithoutAlt.length > 0) {
      issues.push({ severity: 'warning', message: `${imagesWithoutAlt.length} image(s) missing alt text` });
    }

    const links = content.filter((b: any) => b?.type === 'button' || b?.type === 'link');
    if (links.length === 0 && content.length > 3) {
      issues.push({ severity: 'info', message: 'No internal/external links found — consider adding relevant links' });
    }

    const wordCount = content.reduce((acc: number, b: any) => {
      const text = b?.props?.text || b?.props?.content || '';
      return acc + (typeof text === 'string' ? text.split(/\s+/).filter(Boolean).length : 0);
    }, 0);

    if (wordCount < 100) {
      issues.push({ severity: 'warning', message: `Low content (${wordCount} words) — aim for at least 300 words` });
    }

    const score = Math.max(0, 100 - issues.filter((i) => i.severity === 'error').length * 15
      - issues.filter((i) => i.severity === 'warning').length * 5);

    return {
      pageId,
      title: page.title,
      path: page.path,
      score,
      wordCount,
      headingCount: headings.length,
      imageCount: images.length,
      issues,
    };
  }

  async getProjectSeoOverview(projectId: string) {
    const pages = await this.prisma.client.page.findMany({
      where: { projectId, deletedAt: null },
      select: { id: true, title: true, path: true, seo: true, published: true },
    });

    const overview = pages.map((page) => {
      const seo = page.seo as any;
      return {
        pageId: page.id,
        title: page.title,
        path: page.path,
        published: page.published,
        hasTitle: !!page.title && page.title.length >= 10,
        hasDescription: !!seo?.description && seo.description.length >= 50,
        hasOgImage: !!seo?.ogImage,
      };
    });

    const complete = overview.filter((p) => p.hasTitle && p.hasDescription && p.hasOgImage).length;

    return {
      totalPages: pages.length,
      seoComplete: complete,
      seoIncomplete: pages.length - complete,
      completionPercent: pages.length > 0 ? Math.round((complete / pages.length) * 100) : 0,
      pages: overview,
    };
  }

  private escapeXml(str: string): string {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
}
