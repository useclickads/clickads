import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

type RedirectRule = {
  id: string;
  source: string;
  destination: string;
  statusCode: 301 | 302 | 307 | 308;
  enabled: boolean;
  createdAt: string;
};

@Injectable()
export class RedirectsService {
  constructor(private readonly prisma: PrismaService) {}

  async listRedirects(projectId: string): Promise<RedirectRule[]> {
    const settings = await this.prisma.client.projectSettings.findUnique({
      where: { projectId },
    });

    const raw = settings?.globalFooter as any;
    return (raw?.redirects as RedirectRule[]) || [];
  }

  async addRedirect(projectId: string, rule: Omit<RedirectRule, 'id' | 'createdAt'>) {
    const settings = await this.prisma.client.projectSettings.findUnique({
      where: { projectId },
    });

    const raw = (settings?.globalFooter as any) || {};
    const redirects: RedirectRule[] = raw.redirects || [];

    const existing = redirects.find((r) => r.source === rule.source && r.enabled);
    if (existing) return { error: 'A redirect for this source path already exists' };

    const newRule: RedirectRule = {
      ...rule,
      id: `rdr_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    redirects.push(newRule);

    await this.prisma.client.projectSettings.upsert({
      where: { projectId },
      create: { projectId, globalFooter: { ...raw, redirects } as any },
      update: { globalFooter: { ...raw, redirects } as any },
    });

    return newRule;
  }

  async updateRedirect(projectId: string, redirectId: string, updates: Partial<Omit<RedirectRule, 'id' | 'createdAt'>>) {
    const settings = await this.prisma.client.projectSettings.findUnique({
      where: { projectId },
    });

    const raw = (settings?.globalFooter as any) || {};
    const redirects: RedirectRule[] = raw.redirects || [];

    const idx = redirects.findIndex((r) => r.id === redirectId);
    if (idx === -1) return null;

    redirects[idx] = { ...redirects[idx], ...updates };

    await this.prisma.client.projectSettings.update({
      where: { projectId },
      data: { globalFooter: { ...raw, redirects } as any },
    });

    return redirects[idx];
  }

  async deleteRedirect(projectId: string, redirectId: string) {
    const settings = await this.prisma.client.projectSettings.findUnique({
      where: { projectId },
    });

    const raw = (settings?.globalFooter as any) || {};
    const redirects: RedirectRule[] = raw.redirects || [];
    const filtered = redirects.filter((r) => r.id !== redirectId);

    await this.prisma.client.projectSettings.update({
      where: { projectId },
      data: { globalFooter: { ...raw, redirects: filtered } as any },
    });

    return { ok: true };
  }

  async resolveRedirect(projectId: string, path: string): Promise<RedirectRule | null> {
    const redirects = await this.listRedirects(projectId);
    return redirects.find((r) => r.enabled && this.matchPath(r.source, path)) || null;
  }

  generateRedirectConfig(redirects: RedirectRule[]): string {
    const active = redirects.filter((r) => r.enabled);
    if (active.length === 0) return '';

    const lines = active.map((r) => `${r.source} ${r.destination} ${r.statusCode}`);
    return lines.join('\n');
  }

  private matchPath(pattern: string, path: string): boolean {
    if (pattern === path) return true;

    if (pattern.includes('*')) {
      const regex = new RegExp('^' + pattern.replace(/\*/g, '(.*)') + '$');
      return regex.test(path);
    }

    return false;
  }
}
