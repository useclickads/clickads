import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async listByOwner(userId: string) {
    return this.prisma.client.project.findMany({
      where: { ownerId: userId, deletedAt: null },
      orderBy: { updatedAt: 'desc' },
      include: { _count: { select: { pages: true, deployments: true } } },
    });
  }

  async getById(id: string, userId: string) {
    return this.prisma.client.project.findFirst({
      where: { id, ownerId: userId, deletedAt: null },
      include: {
        pages: { where: { deletedAt: null }, orderBy: { updatedAt: 'desc' } },
        domains: { where: { deletedAt: null } },
        _count: { select: { pages: true, deployments: true, blocks: true } },
      },
    });
  }

  async create(userId: string, data: { name: string; slug: string; description?: string }) {
    return this.prisma.client.project.create({
      data: { ...data, ownerId: userId },
    });
  }

  async update(id: string, userId: string, data: { name?: string; description?: string }) {
    const project = await this.prisma.client.project.findFirst({
      where: { id, ownerId: userId, deletedAt: null },
    });
    if (!project) return null;
    return this.prisma.client.project.update({ where: { id }, data });
  }

  async softDelete(id: string, userId: string) {
    const project = await this.prisma.client.project.findFirst({
      where: { id, ownerId: userId, deletedAt: null },
    });
    if (!project) return null;
    return this.prisma.client.project.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async clone(id: string, userId: string, options?: { includeCms?: boolean; includeSettings?: boolean; includeTheme?: boolean }) {
    const opts = { includeCms: true, includeSettings: true, includeTheme: true, ...options };

    const source = await this.prisma.client.project.findFirst({
      where: { id, deletedAt: null },
      include: {
        pages: { where: { deletedAt: null } },
      },
    });
    if (!source) return null;

    const suffix = Date.now().toString(36);
    const clone = await this.prisma.client.project.create({
      data: {
        name: `${source.name} (Clone)`,
        slug: `${source.slug}-clone-${suffix}`,
        description: source.description,
        ownerId: userId,
      },
    });

    const pageIdMap = new Map<string, string>();

    for (const page of source.pages) {
      const newPage = await this.prisma.client.page.create({
        data: {
          projectId: clone.id,
          title: page.title,
          slug: page.slug,
          path: page.path,
          content: page.content as any,
          seo: page.seo as any,
        },
      });
      pageIdMap.set(page.id, newPage.id);
    }

    if (opts.includeSettings) {
      const settings = await this.prisma.client.projectSettings.findUnique({ where: { projectId: id } });
      if (settings) {
        await this.prisma.client.projectSettings.create({
          data: {
            projectId: clone.id,
            globalHeader: settings.globalHeader as any,
            globalFooter: settings.globalFooter as any,
            headScripts: settings.headScripts,
            bodyScripts: settings.bodyScripts,
            favicon: settings.favicon,
            socialImage: settings.socialImage,
            defaultLocale: settings.defaultLocale,
            supportedLocales: settings.supportedLocales,
            siteName: settings.siteName,
            siteUrl: settings.siteUrl,
          },
        });
      }
    }

    if (opts.includeTheme) {
      const tokens = await this.prisma.client.designToken.findMany({ where: { projectId: id } });
      for (const token of tokens) {
        await this.prisma.client.designToken.create({
          data: { projectId: clone.id, key: token.key, value: token.value as any },
        });
      }
    }

    if (opts.includeCms) {
      const collections = await this.prisma.client.cMSCollection.findMany({
        where: { projectId: id, deletedAt: null },
        include: {
          fields: { where: { deletedAt: null } },
          cmsentries: { where: { deletedAt: null } },
        },
      });
      for (const col of collections) {
        const newCol = await this.prisma.client.cMSCollection.create({
          data: { projectId: clone.id, name: col.name, slug: col.slug },
        });
        for (const field of col.fields) {
          await this.prisma.client.cMSField.create({
            data: { collectionId: newCol.id, name: field.name, type: field.type, options: field.options as any },
          });
        }
        for (const entry of col.cmsentries) {
          await this.prisma.client.cMSEntry.create({
            data: { collectionId: newCol.id, data: entry.data as any, status: entry.status, locale: entry.locale },
          });
        }
      }
    }

    return {
      project: clone,
      pagesCloned: source.pages.length,
    };
  }

  async slugExists(slug: string) {
    const project = await this.prisma.client.project.findUnique({ where: { slug } });
    return Boolean(project);
  }
}
