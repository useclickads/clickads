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

  async diffVersions(pageId: string, projectId: string, snapshotIdA: string, snapshotIdB: string) {
    const [snapA, snapB] = await Promise.all([
      this.prisma.client.snapshot.findUnique({ where: { id: snapshotIdA } }),
      this.prisma.client.snapshot.findUnique({ where: { id: snapshotIdB } }),
    ]);

    if (!snapA || !snapB) return null;
    const contentA = (snapA.data as any)?.content || { blocks: [] };
    const contentB = (snapB.data as any)?.content || { blocks: [] };

    const blocksA: any[] = contentA.blocks || [];
    const blocksB: any[] = contentB.blocks || [];

    const mapA = new Map(blocksA.map((b: any) => [b.id, b]));
    const mapB = new Map(blocksB.map((b: any) => [b.id, b]));

    const added: any[] = [];
    const removed: any[] = [];
    const modified: { blockId: string; type: string; changes: { field: string; before: unknown; after: unknown }[] }[] = [];

    for (const [id, block] of mapB) {
      if (!mapA.has(id)) {
        added.push(block);
      } else {
        const oldBlock = mapA.get(id);
        const changes = this.diffBlockProps(oldBlock, block);
        if (changes.length > 0) {
          modified.push({ blockId: id, type: block.type, changes });
        }
      }
    }

    for (const [id, block] of mapA) {
      if (!mapB.has(id)) {
        removed.push(block);
      }
    }

    return {
      snapshotA: { id: snapA.id, createdAt: snapA.createdAt },
      snapshotB: { id: snapB.id, createdAt: snapB.createdAt },
      summary: { added: added.length, removed: removed.length, modified: modified.length },
      added,
      removed,
      modified,
    };
  }

  private diffBlockProps(a: any, b: any): { field: string; before: unknown; after: unknown }[] {
    const changes: { field: string; before: unknown; after: unknown }[] = [];
    if (a.type !== b.type) {
      changes.push({ field: 'type', before: a.type, after: b.type });
    }
    const allKeys = new Set([...Object.keys(a.props || {}), ...Object.keys(b.props || {})]);
    for (const key of allKeys) {
      const valA = (a.props || {})[key];
      const valB = (b.props || {})[key];
      if (JSON.stringify(valA) !== JSON.stringify(valB)) {
        changes.push({ field: `props.${key}`, before: valA, after: valB });
      }
    }
    return changes;
  }
}
