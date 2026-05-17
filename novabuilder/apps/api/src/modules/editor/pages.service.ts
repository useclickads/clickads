import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PagesService {
  constructor(private readonly prisma: PrismaService) {}

  async getById(id: string) {
    return this.prisma.client.page.findUnique({ where: { id } });
  }

  async listByProject(projectId: string) {
    return this.prisma.client.page.findMany({
      where: { projectId, deletedAt: null },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async create(projectId: string, data: { title: string; slug: string; path: string }) {
    return this.prisma.client.page.create({
      data: { ...data, projectId, content: { blocks: [] } },
    });
  }

  async update(id: string, data: { title?: string; slug?: string; path?: string; published?: boolean }) {
    return this.prisma.client.page.update({ where: { id }, data });
  }

  async updateContent(id: string, content: unknown) {
    const page = await this.prisma.client.page.findUnique({ where: { id } });
    if (page?.content) {
      await this.prisma.client.snapshot.create({
        data: { projectId: page.projectId, data: { pageId: id, content: page.content } as any },
      });
    }
    return this.prisma.client.page.update({ where: { id }, data: { content: content as any } });
  }

  async listVersions(pageId: string, projectId: string) {
    const snapshots = await this.prisma.client.snapshot.findMany({
      where: { projectId, data: { path: ['pageId'], equals: pageId } },
      orderBy: { createdAt: 'desc' },
      take: 30,
    });
    return snapshots;
  }

  async restoreVersion(pageId: string, snapshotId: string) {
    const snapshot = await this.prisma.client.snapshot.findUnique({ where: { id: snapshotId } });
    if (!snapshot) return null;
    const data = snapshot.data as { pageId: string; content: unknown };
    return this.prisma.client.page.update({ where: { id: pageId }, data: { content: data.content as any } });
  }

  async updateSeo(id: string, seo: { metaTitle?: string; metaDescription?: string; ogImage?: string; noIndex?: boolean }) {
    return this.prisma.client.page.update({ where: { id }, data: { seo: seo as any } });
  }

  async schedule(id: string, scheduledAt: Date) {
    return this.prisma.client.page.update({
      where: { id },
      data: { scheduledAt },
    });
  }

  async cancelSchedule(id: string) {
    return this.prisma.client.page.update({
      where: { id },
      data: { scheduledAt: null },
    });
  }

  async publishScheduledPages() {
    const now = new Date();
    const pages = await this.prisma.client.page.findMany({
      where: { scheduledAt: { lte: now }, published: false, deletedAt: null },
    });
    for (const page of pages) {
      await this.prisma.client.page.update({
        where: { id: page.id },
        data: { published: true, scheduledAt: null },
      });
    }
    return pages.length;
  }

  async duplicate(id: string) {
    const page = await this.prisma.client.page.findUnique({ where: { id } });
    if (!page) return null;
    return this.prisma.client.page.create({
      data: {
        projectId: page.projectId,
        title: `${page.title} (Copy)`,
        slug: `${page.slug}-copy-${Date.now().toString(36)}`,
        path: `${page.path}-copy`,
        content: page.content as any,
        seo: page.seo as any,
      },
    });
  }

  async softDelete(id: string) {
    return this.prisma.client.page.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async bulkPublish(ids: string[]) {
    return this.prisma.client.page.updateMany({
      where: { id: { in: ids }, deletedAt: null },
      data: { published: true },
    });
  }

  async bulkUnpublish(ids: string[]) {
    return this.prisma.client.page.updateMany({
      where: { id: { in: ids }, deletedAt: null },
      data: { published: false },
    });
  }

  async bulkDelete(ids: string[]) {
    return this.prisma.client.page.updateMany({
      where: { id: { in: ids } },
      data: { deletedAt: new Date() },
    });
  }
}
