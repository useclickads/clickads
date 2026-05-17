import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ExportService {
  constructor(private readonly prisma: PrismaService) {}

  async exportProject(projectId: string) {
    const [project, pages, collections, settings, tokens, domains] = await Promise.all([
      this.prisma.client.project.findUnique({ where: { id: projectId }, select: { id: true, name: true, slug: true, description: true } }),
      this.prisma.client.page.findMany({
        where: { projectId, deletedAt: null },
        select: { id: true, title: true, slug: true, path: true, content: true, seo: true, published: true },
      }),
      this.prisma.client.cMSCollection.findMany({
        where: { projectId, deletedAt: null },
        include: { fields: { where: { deletedAt: null }, select: { name: true, type: true, options: true } }, cmsentries: { where: { deletedAt: null }, select: { data: true, status: true, locale: true } } },
      }),
      this.prisma.client.projectSettings.findUnique({ where: { projectId } }),
      this.prisma.client.designToken.findMany({ where: { projectId } }),
      this.prisma.client.domain.findMany({ where: { projectId, deletedAt: null } }),
    ]);

    return {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      project,
      pages,
      cms: collections.map((c) => ({
        name: c.name,
        slug: c.slug,
        fields: c.fields,
        entries: c.cmsentries,
      })),
      settings: settings ? {
        globalHeader: settings.globalHeader,
        globalFooter: settings.globalFooter,
        headScripts: settings.headScripts,
        bodyScripts: settings.bodyScripts,
        favicon: settings.favicon,
        socialImage: settings.socialImage,
      } : null,
      theme: tokens.map((t) => ({ key: t.key, value: t.value })),
      domains: domains.map((d) => ({ domain: d.domain, verified: d.verified })),
    };
  }
}
