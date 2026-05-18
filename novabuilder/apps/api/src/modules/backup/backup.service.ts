import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BackupService {
  constructor(private readonly prisma: PrismaService) {}

  async createBackup(projectId: string, userId: string): Promise<{ id: string; size: number; createdAt: Date }> {
    const [pages, settings, tokens, collections] = await Promise.all([
      this.prisma.client.page.findMany({ where: { projectId, deletedAt: null } }),
      this.prisma.client.projectSettings.findUnique({ where: { projectId } }),
      this.prisma.client.designToken.findMany({ where: { projectId } }),
      this.prisma.client.cMSCollection.findMany({
        where: { projectId, deletedAt: null },
        include: { fields: { where: { deletedAt: null } }, cmsentries: { where: { deletedAt: null } } },
      }),
    ]);

    const backupData = {
      version: '1.0',
      projectId,
      createdBy: userId,
      timestamp: new Date().toISOString(),
      pages: pages.map((p) => ({
        id: p.id, title: p.title, slug: p.slug, path: p.path,
        content: p.content, seo: p.seo, published: p.published,
      })),
      settings,
      tokens: tokens.map((t) => ({ key: t.key, value: t.value })),
      collections: collections.map((c) => ({
        name: c.name, slug: c.slug,
        fields: c.fields.map((f) => ({ name: f.name, type: f.type, options: f.options, validations: f.validations })),
        entries: c.cmsentries.map((e) => ({ data: e.data, locale: e.locale, status: e.status })),
      })),
    };

    const jsonStr = JSON.stringify(backupData);

    const snapshot = await this.prisma.client.snapshot.create({
      data: {
        projectId,
        data: { type: 'backup', userId, backup: backupData } as any,
      },
    });

    return { id: snapshot.id, size: jsonStr.length, createdAt: snapshot.createdAt };
  }

  async listBackups(projectId: string) {
    const snapshots = await this.prisma.client.snapshot.findMany({
      where: { projectId, data: { path: ['type'], equals: 'backup' } },
      orderBy: { createdAt: 'desc' },
      take: 20,
      select: { id: true, createdAt: true, data: true },
    });

    return snapshots.map((s) => {
      const data = s.data as any;
      return {
        id: s.id,
        createdAt: s.createdAt,
        createdBy: data.userId,
        pageCount: data.backup?.pages?.length || 0,
      };
    });
  }

  async restoreBackup(projectId: string, backupId: string) {
    const snapshot = await this.prisma.client.snapshot.findUnique({ where: { id: backupId } });
    if (!snapshot || snapshot.projectId !== projectId) return null;

    const data = snapshot.data as any;
    const backup = data.backup;
    if (!backup) return null;

    let pagesRestored = 0;
    for (const page of backup.pages || []) {
      const existing = await this.prisma.client.page.findFirst({
        where: { projectId, slug: page.slug, deletedAt: null },
      });

      if (existing) {
        await this.prisma.client.page.update({
          where: { id: existing.id },
          data: { content: page.content as any, seo: page.seo as any, title: page.title },
        });
      } else {
        await this.prisma.client.page.create({
          data: {
            projectId,
            title: page.title,
            slug: page.slug,
            path: page.path,
            content: page.content as any,
            seo: page.seo as any,
            published: false,
          },
        });
      }
      pagesRestored++;
    }

    if (backup.tokens?.length) {
      await this.prisma.client.designToken.deleteMany({ where: { projectId } });
      for (const token of backup.tokens) {
        await this.prisma.client.designToken.create({
          data: { projectId, key: token.key, value: token.value as any },
        });
      }
    }

    return { pagesRestored, tokensRestored: backup.tokens?.length || 0 };
  }

  async deleteBackup(backupId: string) {
    await this.prisma.client.snapshot.delete({ where: { id: backupId } });
    return { ok: true };
  }
}
