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

  async clone(id: string, userId: string) {
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

    for (const page of source.pages) {
      await this.prisma.client.page.create({
        data: {
          projectId: clone.id,
          title: page.title,
          slug: page.slug,
          path: page.path,
          content: page.content as any,
          seo: page.seo as any,
        },
      });
    }

    return clone;
  }

  async slugExists(slug: string) {
    const project = await this.prisma.client.project.findUnique({ where: { slug } });
    return Boolean(project);
  }
}
