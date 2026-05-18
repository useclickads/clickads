import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

type CodeSnippet = {
  id: string;
  name: string;
  code: string;
  location: 'head' | 'body_start' | 'body_end';
  pages: string[];
  enabled: boolean;
};

@Injectable()
export class CodeInjectService {
  constructor(private readonly prisma: PrismaService) {}

  async listSnippets(projectId: string) {
    const settings = await this.prisma.client.projectSettings.findUnique({
      where: { projectId },
    });

    const raw = settings?.globalHeader as any;
    return (raw?.codeSnippets as CodeSnippet[]) || [];
  }

  async addSnippet(projectId: string, snippet: Omit<CodeSnippet, 'id'>) {
    const settings = await this.prisma.client.projectSettings.findUnique({
      where: { projectId },
    });

    const raw = (settings?.globalHeader as any) || {};
    const snippets: CodeSnippet[] = raw.codeSnippets || [];

    const newSnippet: CodeSnippet = {
      ...snippet,
      id: `snip_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    };
    snippets.push(newSnippet);

    await this.prisma.client.projectSettings.upsert({
      where: { projectId },
      create: { projectId, globalHeader: { ...raw, codeSnippets: snippets } as any },
      update: { globalHeader: { ...raw, codeSnippets: snippets } as any },
    });

    return newSnippet;
  }

  async updateSnippet(projectId: string, snippetId: string, updates: Partial<Omit<CodeSnippet, 'id'>>) {
    const settings = await this.prisma.client.projectSettings.findUnique({
      where: { projectId },
    });

    const raw = (settings?.globalHeader as any) || {};
    const snippets: CodeSnippet[] = raw.codeSnippets || [];

    const idx = snippets.findIndex((s) => s.id === snippetId);
    if (idx === -1) return null;

    snippets[idx] = { ...snippets[idx], ...updates };

    await this.prisma.client.projectSettings.update({
      where: { projectId },
      data: { globalHeader: { ...raw, codeSnippets: snippets } as any },
    });

    return snippets[idx];
  }

  async deleteSnippet(projectId: string, snippetId: string) {
    const settings = await this.prisma.client.projectSettings.findUnique({
      where: { projectId },
    });

    const raw = (settings?.globalHeader as any) || {};
    const snippets: CodeSnippet[] = raw.codeSnippets || [];
    const filtered = snippets.filter((s) => s.id !== snippetId);

    await this.prisma.client.projectSettings.update({
      where: { projectId },
      data: { globalHeader: { ...raw, codeSnippets: filtered } as any },
    });

    return { ok: true };
  }

  async getInjectedCode(projectId: string, pageId?: string): Promise<{ head: string; bodyStart: string; bodyEnd: string }> {
    const snippets = await this.listSnippets(projectId);
    const active = snippets.filter(
      (s) => s.enabled && (s.pages.length === 0 || (pageId && s.pages.includes(pageId))),
    );

    return {
      head: active.filter((s) => s.location === 'head').map((s) => s.code).join('\n'),
      bodyStart: active.filter((s) => s.location === 'body_start').map((s) => s.code).join('\n'),
      bodyEnd: active.filter((s) => s.location === 'body_end').map((s) => s.code).join('\n'),
    };
  }
}
