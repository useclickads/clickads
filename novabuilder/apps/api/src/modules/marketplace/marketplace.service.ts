import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class MarketplaceService {
  constructor(private readonly prisma: PrismaService) {}

  async listPlugins(query?: string) {
    return this.prisma.client.plugin.findMany({
      where: query ? { name: { contains: query, mode: 'insensitive' } } : undefined,
      include: { _count: { select: { installations: true, reviews: true } }, marketplaceItems: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPlugin(id: string) {
    const plugin = await this.prisma.client.plugin.findUnique({
      where: { id },
      include: { _count: { select: { installations: true, reviews: true } }, marketplaceItems: true },
    });
    if (!plugin) return null;

    const reviews = await this.prisma.client.pluginReview.findMany({
      where: { pluginId: id },
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    const avgRating = reviews.length > 0
      ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10
      : null;

    return { ...plugin, reviews, avgRating };
  }

  async publishPlugin(publisherId: string, data: { name: string; version: string; manifest: unknown; price?: number }) {
    const plugin = await this.prisma.client.plugin.create({
      data: {
        name: data.name,
        version: data.version,
        publisherId,
        manifest: data.manifest as any,
      },
    });

    if (data.price !== undefined) {
      await this.prisma.client.marketplaceItem.create({
        data: { pluginId: plugin.id, price: data.price },
      });
    }

    return plugin;
  }

  async installPlugin(userId: string, projectId: string, pluginId: string, config?: unknown) {
    const existing = await this.prisma.client.pluginInstallation.findFirst({
      where: { pluginId, projectId },
    });
    if (existing) return existing;

    return this.prisma.client.pluginInstallation.create({
      data: {
        pluginId,
        projectId,
        userId,
        config: config as any,
      },
    });
  }

  async uninstallPlugin(projectId: string, pluginId: string) {
    const installation = await this.prisma.client.pluginInstallation.findFirst({
      where: { pluginId, projectId },
    });
    if (!installation) return { ok: false };

    await this.prisma.client.pluginInstallation.delete({ where: { id: installation.id } });
    return { ok: true };
  }

  async listInstalled(projectId: string) {
    return this.prisma.client.pluginInstallation.findMany({
      where: { projectId },
      include: { plugin: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async purchaseItem(buyerId: string, itemId: string) {
    const existing = await this.prisma.client.marketplacePurchase.findFirst({
      where: { itemId, buyerId },
    });
    if (existing) return existing;

    return this.prisma.client.marketplacePurchase.create({
      data: { itemId, buyerId },
    });
  }

  async listPurchases(userId: string) {
    return this.prisma.client.marketplacePurchase.findMany({
      where: { buyerId: userId },
      include: { item: { include: { plugin: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createReview(pluginId: string, userId: string, data: { rating: number; title?: string; body?: string }) {
    const existing = await this.prisma.client.pluginReview.findUnique({
      where: { pluginId_userId: { pluginId, userId } },
    });
    if (existing) {
      return this.prisma.client.pluginReview.update({
        where: { id: existing.id },
        data: { rating: data.rating, title: data.title, body: data.body },
      });
    }
    return this.prisma.client.pluginReview.create({
      data: { pluginId, userId, rating: data.rating, title: data.title, body: data.body },
    });
  }

  async deleteReview(pluginId: string, userId: string) {
    const review = await this.prisma.client.pluginReview.findUnique({
      where: { pluginId_userId: { pluginId, userId } },
    });
    if (!review) return { ok: false };
    await this.prisma.client.pluginReview.delete({ where: { id: review.id } });
    return { ok: true };
  }

  async getReviews(pluginId: string, take = 50) {
    return this.prisma.client.pluginReview.findMany({
      where: { pluginId },
      include: { user: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
      take,
    });
  }
}
