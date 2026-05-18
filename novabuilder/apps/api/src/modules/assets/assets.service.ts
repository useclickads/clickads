import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AssetsService {
  constructor(private readonly prisma: PrismaService) {}

  async listByProject(projectId: string, folderId?: string) {
    return this.prisma.client.asset.findMany({
      where: { projectId, folderId: folderId || null, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(projectId: string, data: { filename: string; url: string; size?: number; mimeType?: string; folderId?: string; metadata?: unknown }) {
    return this.prisma.client.asset.create({
      data: {
        projectId,
        filename: data.filename,
        url: data.url,
        size: data.size,
        mimeType: data.mimeType,
        folderId: data.folderId,
        metadata: data.metadata as any,
      },
    });
  }

  async delete(id: string) {
    return this.prisma.client.asset.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async listFolders(projectId: string) {
    return this.prisma.client.folder.findMany({
      where: { projectId, deletedAt: null },
      orderBy: { name: 'asc' },
      include: { _count: { select: { assets: true } } },
    });
  }

  async createFolder(projectId: string, name: string, parentId?: string) {
    return this.prisma.client.folder.create({
      data: { projectId, name, parentId },
    });
  }

  async deleteFolder(id: string) {
    return this.prisma.client.folder.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async getProjectPagesForAudit(projectId: string) {
    return this.prisma.client.page.findMany({
      where: { projectId, deletedAt: null },
      select: { content: true },
    });
  }
}
