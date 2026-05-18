import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CmsService {
  constructor(private readonly prisma: PrismaService) {}

  async listCollections(projectId: string) {
    return this.prisma.client.cMSCollection.findMany({
      where: { projectId, deletedAt: null },
      include: { fields: { where: { deletedAt: null } }, _count: { select: { cmsentries: true } } },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async getCollection(id: string) {
    return this.prisma.client.cMSCollection.findUnique({
      where: { id },
      include: { fields: { where: { deletedAt: null } } },
    });
  }

  async createCollection(projectId: string, data: { name: string; slug: string }) {
    return this.prisma.client.cMSCollection.create({
      data: { ...data, projectId },
      include: { fields: true },
    });
  }

  async deleteCollection(id: string) {
    return this.prisma.client.cMSCollection.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async addField(collectionId: string, data: { name: string; type: string; options?: unknown; validations?: unknown }) {
    return this.prisma.client.cMSField.create({
      data: {
        collectionId,
        name: data.name,
        type: data.type,
        options: data.options as any,
        validations: data.validations as any,
      },
    });
  }

  async removeField(fieldId: string) {
    return this.prisma.client.cMSField.update({
      where: { id: fieldId },
      data: { deletedAt: new Date() },
    });
  }

  async listEntries(collectionId: string) {
    return this.prisma.client.cMSEntry.findMany({
      where: { collectionId, deletedAt: null },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async createEntry(collectionId: string, data: Record<string, unknown>, locale?: string) {
    return this.prisma.client.cMSEntry.create({
      data: { collectionId, data: data as any, locale: locale || 'en' },
    });
  }

  async updateEntry(id: string, data: Record<string, unknown>) {
    return this.prisma.client.cMSEntry.update({
      where: { id },
      data: { data: data as any },
    });
  }

  async deleteEntry(id: string) {
    return this.prisma.client.cMSEntry.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async publishEntry(id: string) {
    return this.prisma.client.cMSEntry.update({
      where: { id },
      data: { status: 'published' },
    });
  }

  async listEntriesByLocale(collectionId: string, locale: string) {
    return this.prisma.client.cMSEntry.findMany({
      where: { collectionId, locale, deletedAt: null },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async translateEntry(entryId: string, targetLocale: string, translatedData: Record<string, unknown>) {
    const source = await this.prisma.client.cMSEntry.findUnique({ where: { id: entryId } });
    if (!source) return null;

    const existing = await this.prisma.client.cMSEntry.findFirst({
      where: {
        collectionId: source.collectionId,
        locale: targetLocale,
        data: { path: ['_sourceId'], equals: entryId },
        deletedAt: null,
      },
    });

    if (existing) {
      return this.prisma.client.cMSEntry.update({
        where: { id: existing.id },
        data: { data: { ...translatedData, _sourceId: entryId } as any },
      });
    }

    return this.prisma.client.cMSEntry.create({
      data: {
        collectionId: source.collectionId,
        locale: targetLocale,
        data: { ...translatedData, _sourceId: entryId } as any,
        status: 'draft',
      },
    });
  }

  async getTranslationStatus(collectionId: string, locales: string[]) {
    const entries = await this.prisma.client.cMSEntry.findMany({
      where: { collectionId, deletedAt: null },
      select: { id: true, locale: true },
    });

    const byLocale: Record<string, number> = {};
    for (const entry of entries) {
      byLocale[entry.locale] = (byLocale[entry.locale] || 0) + 1;
    }

    return locales.map((locale) => ({
      locale,
      count: byLocale[locale] || 0,
      total: byLocale['en'] || 0,
      coverage: (byLocale['en'] || 0) > 0 ? Math.round(((byLocale[locale] || 0) / byLocale['en']) * 100) : 0,
    }));
  }
}
