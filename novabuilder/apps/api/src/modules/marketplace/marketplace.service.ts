import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class MarketplaceService {
  constructor(private readonly prisma: PrismaService) {}

  async listPlugins(query?: string) {
    return this.prisma.client.plugin.findMany({
      where: query ? { name: { contains: query, mode: 'insensitive' } } : undefined,
      include: { _count: { select: { installations: true } }, marketplaceItems: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPlugin(id: string) {
    return this.prisma.client.plugin.findUnique({
      where: { id },
      include: { _count: { select: { installations: true } }, marketplaceItems: true },
    });
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
}
