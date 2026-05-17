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
    return this.prisma.client.page.update({ where: { id }, data: { content: content as any } });
  }

  async updateSeo(id: string, seo: { metaTitle?: string; metaDescription?: string; ogImage?: string; noIndex?: boolean }) {
    return this.prisma.client.page.update({ where: { id }, data: { seo: seo as any } });
  }

  async softDelete(id: string) {
    return this.prisma.client.page.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
