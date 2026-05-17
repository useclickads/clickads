import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats() {
    const [users, projects, pages, deployments] = await Promise.all([
      this.prisma.client.user.count(),
      this.prisma.client.project.count({ where: { deletedAt: null } }),
      this.prisma.client.page.count({ where: { deletedAt: null } }),
      this.prisma.client.deployment.count(),
    ]);
    return { users, projects, pages, deployments };
  }

  async listUsers(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      this.prisma.client.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: { id: true, email: true, name: true, roles: true, createdAt: true, _count: { select: { projects: true } } },
      }),
      this.prisma.client.user.count(),
    ]);
    return { users, total, page, limit };
  }

  async listProjects(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [projects, total] = await Promise.all([
      this.prisma.client.project.findMany({
        where: { deletedAt: null },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: { id: true, name: true, slug: true, createdAt: true, owner: { select: { email: true } }, _count: { select: { pages: true, deployments: true } } },
      }),
      this.prisma.client.project.count({ where: { deletedAt: null } }),
    ]);
    return { projects, total, page, limit };
  }

  async deleteUser(id: string) {
    return this.prisma.client.user.delete({ where: { id } });
  }

  async deleteProject(id: string) {
    return this.prisma.client.project.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async getRecentActivity(limit = 50) {
    return this.prisma.client.auditLog.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }
}
