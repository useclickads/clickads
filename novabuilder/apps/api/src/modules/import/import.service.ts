import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

type ExportData = {
  project: { name: string; slug: string; description?: string | null };
  pages: { title: string; slug: string; path: string; content: unknown; seo: unknown; published: boolean }[];
  cms: { name: string; slug: string; fields: { name: string; type: string }[]; entries: { data: unknown; status: string; locale: string }[] }[];
  settings: { globalHeader?: unknown; globalFooter?: unknown; headScripts?: string; bodyScripts?: string; favicon?: string; socialImage?: string } | null;
  theme: { key: string; value: unknown }[];
};

@Injectable()
export class ImportService {
  constructor(private readonly prisma: PrismaService) {}

  async importProject(userId: string, data: ExportData) {
    const slug = `${data.project.slug}-${Date.now().toString(36)}`;
    const project = await this.prisma.client.project.create({
      data: { name: data.project.name, slug, description: data.project.description, ownerId: userId },
    });

    for (const page of data.pages) {
      await this.prisma.client.page.create({
        data: {
          projectId: project.id,
          title: page.title,
          slug: page.slug,
          path: page.path,
          content: page.content as any,
          seo: page.seo as any,
          published: page.published,
        },
      });
    }

    for (const col of data.cms) {
      const collection = await this.prisma.client.cMSCollection.create({
        data: { projectId: project.id, name: col.name, slug: col.slug },
      });
      for (const field of col.fields) {
        await this.prisma.client.cMSField.create({
          data: { collectionId: collection.id, name: field.name, type: field.type },
        });
      }
      for (const entry of col.entries) {
        await this.prisma.client.cMSEntry.create({
          data: { collectionId: collection.id, data: entry.data as any, status: entry.status, locale: entry.locale },
        });
      }
    }

    if (data.settings) {
      await this.prisma.client.projectSettings.create({
        data: {
          projectId: project.id,
          globalHeader: data.settings.globalHeader as any,
          globalFooter: data.settings.globalFooter as any,
          headScripts: data.settings.headScripts,
          bodyScripts: data.settings.bodyScripts,
          favicon: data.settings.favicon,
          socialImage: data.settings.socialImage,
        },
      });
    }

    for (const token of data.theme) {
      await this.prisma.client.designToken.create({
        data: { projectId: project.id, key: token.key, value: token.value as any },
      });
    }

    return { project, pagesImported: data.pages.length, collectionsImported: data.cms.length };
  }
}
