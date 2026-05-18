import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

type StagedChange = {
  pageId: string;
  field: string;
  before: unknown;
  after: unknown;
};

@Injectable()
export class StagingService {
  constructor(private readonly prisma: PrismaService) {}

  async createStagingEnvironment(projectId: string, userId: string, name: string) {
    return this.prisma.client.snapshot.create({
      data: {
        projectId,
        data: {
          type: 'staging',
          name,
          createdBy: userId,
          status: 'draft',
          changes: [],
          createdAt: new Date().toISOString(),
        } as any,
      },
    });
  }

  async listStagingEnvironments(projectId: string) {
    const snapshots = await this.prisma.client.snapshot.findMany({
      where: { projectId, data: { path: ['type'], equals: 'staging' } },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return snapshots.map((s) => {
      const data = s.data as any;
      return {
        id: s.id,
        name: data.name,
        status: data.status,
        createdBy: data.createdBy,
        changeCount: data.changes?.length || 0,
        createdAt: s.createdAt,
      };
    });
  }

  async stagePageChange(
    stagingId: string,
    pageId: string,
    updates: { title?: string; content?: unknown; seo?: unknown },
  ) {
    const snapshot = await this.prisma.client.snapshot.findUnique({ where: { id: stagingId } });
    if (!snapshot) return null;

    const data = snapshot.data as any;
    if (data.status !== 'draft') return { error: 'Staging environment is not in draft state' };

    const page = await this.prisma.client.page.findUnique({ where: { id: pageId } });
    if (!page) return null;

    const changes: StagedChange[] = [];
    if (updates.title && updates.title !== page.title) {
      changes.push({ pageId, field: 'title', before: page.title, after: updates.title });
    }
    if (updates.content) {
      changes.push({ pageId, field: 'content', before: page.content, after: updates.content });
    }
    if (updates.seo) {
      changes.push({ pageId, field: 'seo', before: page.seo, after: updates.seo });
    }

    const existingChanges: StagedChange[] = data.changes || [];
    const merged = [
      ...existingChanges.filter((c: StagedChange) => c.pageId !== pageId || !changes.find((nc) => nc.field === c.field)),
      ...changes,
    ];

    await this.prisma.client.snapshot.update({
      where: { id: stagingId },
      data: { data: { ...data, changes: merged } as any },
    });

    return { staged: changes.length, total: merged.length };
  }

  async getStagingDetails(stagingId: string) {
    const snapshot = await this.prisma.client.snapshot.findUnique({ where: { id: stagingId } });
    if (!snapshot) return null;

    const data = snapshot.data as any;
    const changes: StagedChange[] = data.changes || [];

    const pageIds = [...new Set(changes.map((c) => c.pageId))];
    const pages = await this.prisma.client.page.findMany({
      where: { id: { in: pageIds } },
      select: { id: true, title: true, slug: true },
    });

    const pageMap = new Map(pages.map((p) => [p.id, p]));

    return {
      id: snapshot.id,
      name: data.name,
      status: data.status,
      createdBy: data.createdBy,
      createdAt: snapshot.createdAt,
      changes: changes.map((c) => ({
        ...c,
        pageTitle: pageMap.get(c.pageId)?.title || 'Unknown',
        pageSlug: pageMap.get(c.pageId)?.slug || '',
      })),
    };
  }

  async publishStaging(stagingId: string, userId: string) {
    const snapshot = await this.prisma.client.snapshot.findUnique({ where: { id: stagingId } });
    if (!snapshot) return null;

    const data = snapshot.data as any;
    if (data.status !== 'draft') return { error: 'Already published or discarded' };

    const changes: StagedChange[] = data.changes || [];
    let applied = 0;

    for (const change of changes) {
      const updateData: Record<string, unknown> = {};
      if (change.field === 'title') updateData.title = change.after;
      if (change.field === 'content') updateData.content = change.after as any;
      if (change.field === 'seo') updateData.seo = change.after as any;

      if (Object.keys(updateData).length > 0) {
        await this.prisma.client.page.update({
          where: { id: change.pageId },
          data: updateData as any,
        });
        applied++;
      }
    }

    await this.prisma.client.snapshot.update({
      where: { id: stagingId },
      data: {
        data: {
          ...data,
          status: 'published',
          publishedBy: userId,
          publishedAt: new Date().toISOString(),
        } as any,
      },
    });

    return { applied, total: changes.length };
  }

  async discardStaging(stagingId: string) {
    const snapshot = await this.prisma.client.snapshot.findUnique({ where: { id: stagingId } });
    if (!snapshot) return null;

    const data = snapshot.data as any;

    await this.prisma.client.snapshot.update({
      where: { id: stagingId },
      data: { data: { ...data, status: 'discarded' } as any },
    });

    return { ok: true };
  }
}
