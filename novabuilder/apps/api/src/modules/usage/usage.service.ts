import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export type UsageMetrics = {
  projects: { used: number; limit: number };
  pages: { used: number; limit: number };
  storage: { usedMB: number; limitMB: number };
  apiCalls: { current: number; limit: number };
  deployments: { thisMonth: number; total: number };
  bandwidth: { usedMB: number; limitMB: number };
};

@Injectable()
export class UsageService {
  constructor(private readonly prisma: PrismaService) {}

  async getUsageForUser(userId: string): Promise<UsageMetrics> {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [projectCount, pageCount, deployThisMonth, deployTotal, assetAgg] = await Promise.all([
      this.prisma.client.project.count({ where: { ownerId: userId, deletedAt: null } }),
      this.prisma.client.page.count({
        where: { project: { ownerId: userId }, deletedAt: null },
      }),
      this.prisma.client.deployment.count({
        where: { project: { ownerId: userId }, createdAt: { gte: monthStart } },
      }),
      this.prisma.client.deployment.count({
        where: { project: { ownerId: userId } },
      }),
      this.prisma.client.asset.aggregate({
        where: { project: { ownerId: userId }, deletedAt: null },
        _sum: { size: true },
      }),
    ]);

    const storageMB = Math.round((assetAgg._sum.size || 0) / (1024 * 1024) * 10) / 10;

    const limits = await this.getLimitsForUser(userId);

    return {
      projects: { used: projectCount, limit: limits.projects },
      pages: { used: pageCount, limit: limits.pages },
      storage: { usedMB: storageMB, limitMB: limits.storageMB },
      apiCalls: { current: 0, limit: limits.apiCalls },
      deployments: { thisMonth: deployThisMonth, total: deployTotal },
      bandwidth: { usedMB: 0, limitMB: limits.bandwidthMB },
    };
  }

  async getUsageForProject(projectId: string) {
    const [pageCount, deployCount, assetAgg, assetCount] = await Promise.all([
      this.prisma.client.page.count({ where: { projectId, deletedAt: null } }),
      this.prisma.client.deployment.count({ where: { projectId } }),
      this.prisma.client.asset.aggregate({
        where: { projectId, deletedAt: null },
        _sum: { size: true },
      }),
      this.prisma.client.asset.count({ where: { projectId, deletedAt: null } }),
    ]);

    return {
      pages: pageCount,
      deployments: deployCount,
      assets: assetCount,
      storageMB: Math.round((assetAgg._sum.size || 0) / (1024 * 1024) * 10) / 10,
    };
  }

  private async getLimitsForUser(_userId: string) {
    return {
      projects: 20,
      pages: 100,
      storageMB: 5000,
      apiCalls: 10000,
      bandwidthMB: 50000,
    };
  }
}
