import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BlocksService {
  constructor(private readonly prisma: PrismaService) {}

  async listByProject(projectId: string) {
    return this.prisma.client.block.findMany({
      where: { projectId, deletedAt: null },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async listByCategory(projectId: string, category: string) {
    return this.prisma.client.block.findMany({
      where: { projectId, category, deletedAt: null },
      orderBy: { name: 'asc' },
    });
  }

  async saveComponent(projectId: string, data: { name: string; category: string; schema: unknown; preview?: string }) {
    return this.prisma.client.block.create({
      data: {
        projectId,
        name: data.name,
        category: data.category,
        schema: data.schema as any,
        preview: data.preview || null,
      },
    });
  }

  async updateComponent(id: string, data: { name?: string; category?: string; schema?: unknown; preview?: string }) {
    const updateData: Record<string, unknown> = {};
    if (data.name) updateData.name = data.name;
    if (data.category) updateData.category = data.category;
    if (data.schema) updateData.schema = data.schema as any;
    if (data.preview !== undefined) updateData.preview = data.preview;
    return this.prisma.client.block.update({ where: { id }, data: updateData });
  }

  async deleteComponent(id: string) {
    return this.prisma.client.block.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async duplicateComponent(id: string) {
    const component = await this.prisma.client.block.findUnique({ where: { id } });
    if (!component) return null;
    return this.prisma.client.block.create({
      data: {
        projectId: component.projectId,
        name: `${component.name} (Copy)`,
        category: component.category,
        schema: component.schema as any,
        preview: component.preview,
      },
    });
  }
}
