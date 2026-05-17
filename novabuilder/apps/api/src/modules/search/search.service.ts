import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  async search(userId: string, query: string) {
    const q = `%${query}%`;

    const [projects, pages, collections] = await Promise.all([
      this.prisma.client.project.findMany({
        where: {
          ownerId: userId,
          deletedAt: null,
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { slug: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
        select: { id: true, name: true, slug: true },
        take: 10,
      }),
      this.prisma.client.page.findMany({
        where: {
          deletedAt: null,
          project: { ownerId: userId, deletedAt: null },
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { slug: { contains: query, mode: 'insensitive' } },
            { path: { contains: query, mode: 'insensitive' } },
          ],
        },
        select: { id: true, title: true, path: true, projectId: true },
        take: 10,
      }),
      this.prisma.client.cMSCollection.findMany({
        where: {
          deletedAt: null,
          project: { ownerId: userId, deletedAt: null },
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { slug: { contains: query, mode: 'insensitive' } },
          ],
        },
        select: { id: true, name: true, slug: true, projectId: true },
        take: 10,
      }),
    ]);

    return {
      projects: projects.map((p) => ({ type: 'project' as const, id: p.id, title: p.name, subtitle: `/${p.slug}` })),
      pages: pages.map((p) => ({ type: 'page' as const, id: p.id, title: p.title, subtitle: p.path, projectId: p.projectId })),
      collections: collections.map((c) => ({ type: 'collection' as const, id: c.id, title: c.name, subtitle: `/${c.slug}`, projectId: c.projectId })),
    };
  }
}
