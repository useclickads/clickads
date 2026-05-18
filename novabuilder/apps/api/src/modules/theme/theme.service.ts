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

  async restoreThemeVersion(projectId: string, versionId: string) {
    const version = await this.prisma.client.themeVersion.findUnique({ where: { id: versionId } });
    if (!version || version.projectId !== projectId) return null;

    const tokenMap = version.tokens as Record<string, { type: string; value: string }>;
    await this.prisma.client.designToken.deleteMany({ where: { projectId } });

    const created = [];
    for (const [key, val] of Object.entries(tokenMap)) {
      const token = await this.prisma.client.designToken.create({
        data: { projectId, key, value: val as any },
      });
      created.push(token);
    }
    return created;
  }

  async generateCssVariables(projectId: string): Promise<string> {
    const tokens = await this.getTokens(projectId);
    if (tokens.length === 0) return ':root {}';

    const vars = tokens.map((t) => {
      const val = t.value as any;
      const name = t.key.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/\./g, '-');
      return `  --${name}: ${val.value || val};`;
    });

    return `:root {\n${vars.join('\n')}\n}`;
  }

  async generateTailwindConfig(projectId: string): Promise<Record<string, unknown>> {
    const tokens = await this.getTokens(projectId);
    const colors: Record<string, string> = {};
    const fontFamily: Record<string, string[]> = {};
    const spacing: Record<string, string> = {};
    const borderRadius: Record<string, string> = {};

    for (const t of tokens) {
      const val = t.value as any;
      const tokenType = val.type || '';
      const tokenValue = val.value || '';

      switch (tokenType) {
        case 'color':
          colors[t.key.replace('color.', '')] = tokenValue;
          break;
        case 'font':
          fontFamily[t.key.replace('font.', '')] = [tokenValue];
          break;
        case 'spacing':
          spacing[t.key.replace('spacing.', '')] = tokenValue;
          break;
        case 'border-radius':
          borderRadius[t.key.replace('borderRadius.', '')] = tokenValue;
          break;
      }
    }

    return {
      theme: {
        extend: {
          colors: Object.keys(colors).length > 0 ? colors : undefined,
          fontFamily: Object.keys(fontFamily).length > 0 ? fontFamily : undefined,
          spacing: Object.keys(spacing).length > 0 ? spacing : undefined,
          borderRadius: Object.keys(borderRadius).length > 0 ? borderRadius : undefined,
        },
      },
    };
  }
}
