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

  async getDetailedStats() {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalUsers, totalProjects, totalPages, totalDeployments,
      newUsers7d, newUsers30d, newProjects7d, deploys7d,
      totalPlugins, totalSubmissions, totalCollections,
    ] = await Promise.all([
      this.prisma.client.user.count(),
      this.prisma.client.project.count({ where: { deletedAt: null } }),
      this.prisma.client.page.count({ where: { deletedAt: null } }),
      this.prisma.client.deployment.count(),
      this.prisma.client.user.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
      this.prisma.client.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      this.prisma.client.project.count({ where: { createdAt: { gte: sevenDaysAgo }, deletedAt: null } }),
      this.prisma.client.deployment.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
      this.prisma.client.plugin.count(),
      this.prisma.client.formSubmission.count(),
      this.prisma.client.cMSCollection.count({ where: { deletedAt: null } }),
    ]);

    return {
      totals: { users: totalUsers, projects: totalProjects, pages: totalPages, deployments: totalDeployments, plugins: totalPlugins, submissions: totalSubmissions, collections: totalCollections },
      growth: { newUsers7d, newUsers30d, newProjects7d, deploys7d },
    };
  }

  async getSystemHealth() {
    const uptime = process.uptime();
    const memUsage = process.memoryUsage();

    return {
      uptime: Math.round(uptime),
      memory: {
        rss: Math.round(memUsage.rss / 1024 / 1024),
        heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
        heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
      },
      nodeVersion: process.version,
      platform: process.platform,
    };
  }

  async searchUsers(query: string) {
    return this.prisma.client.user.findMany({
      where: {
        OR: [
          { email: { contains: query, mode: 'insensitive' } },
          { name: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: { id: true, email: true, name: true, createdAt: true, _count: { select: { projects: true } } },
      take: 20,
    });
  }
}
