import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

type TokenValue = { type: string; value: string };

@Injectable()
export class ThemeService {
  constructor(private readonly prisma: PrismaService) {}

  async getTokens(projectId: string) {
    return this.prisma.client.designToken.findMany({
      where: { projectId },
      orderBy: { key: 'asc' },
    });
  }

  async upsertToken(projectId: string, key: string, value: TokenValue) {
    const existing = await this.prisma.client.designToken.findFirst({
      where: { projectId, key },
    });
    if (existing) {
      return this.prisma.client.designToken.update({
        where: { id: existing.id },
        data: { value: value as any },
      });
    }
    return this.prisma.client.designToken.create({
      data: { projectId, key, value: value as any },
    });
  }

  async deleteToken(id: string) {
    return this.prisma.client.designToken.delete({ where: { id } });
  }

  async saveThemeVersion(projectId: string) {
    const tokens = await this.getTokens(projectId);
    const tokenMap: Record<string, unknown> = {};
    for (const t of tokens) {
      tokenMap[t.key] = t.value;
    }
    return this.prisma.client.themeVersion.create({
      data: { projectId, tokens: tokenMap as any },
    });
  }

  async listThemeVersions(projectId: string) {
    return this.prisma.client.themeVersion.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
  }
}
