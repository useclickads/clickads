import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

type Block = { id: string; type: string; props: Record<string, unknown>; children?: Block[] };

@Injectable()
export class DeployService {
  constructor(private readonly prisma: PrismaService) {}

  async deployProject(projectId: string, userId: string) {
    const pages = await this.prisma.client.page.findMany({
      where: { projectId, published: true, deletedAt: null },
    });

    const outputs: { path: string; html: string }[] = [];
    for (const page of pages) {
      const content = page.content as { blocks: Block[] } | null;
      const blocks = content?.blocks ?? [];
      const html = this.renderPageHtml(page.title, blocks);
      outputs.push({ path: page.path, html });
    }

    const deployment = await this.prisma.client.deployment.create({
      data: {
        projectId,
        url: `/sites/${projectId}`,
        status: 'deployed',
      },
    });

    await this.prisma.client.publishHistory.create({
      data: { projectId, deploymentId: deployment.id, userId, note: `Deployed ${pages.length} pages` },
    });

    return { deployment, pages: outputs.length };
  }

  async listDeployments(projectId: string) {
    return this.prisma.client.deployment.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
  }

  private renderPageHtml(title: string, blocks: Block[]): string {
    const body = blocks.map((b) => this.renderBlock(b)).join('\n');
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${this.escapeHtml(title)}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: ui-sans-serif, system-ui, sans-serif; color: #1e293b; }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
  </style>
</head>
<body>
  <div class="container">
    ${body}
  </div>
</body>
</html>`;
  }

  private renderBlock(block: Block): string {
    const p = block.props;
    switch (block.type) {
      case 'hero':
        return `<section style="padding:64px 32px;text-align:${p.align || 'center'};background:linear-gradient(135deg,#0f172a,#1e40af);border-radius:12px;margin:16px 0">
  <h1 style="font-size:2.5rem;color:#fff;font-weight:800">${this.escapeHtml(String(p.heading))}</h1>
  <p style="margin-top:12px;font-size:1.1rem;color:#cbd5e1">${this.escapeHtml(String(p.subheading))}</p>
  ${p.buttonText ? `<a href="${this.escapeHtml(String(p.buttonUrl))}" style="display:inline-block;margin-top:24px;padding:14px 28px;background:#fff;color:#0f172a;border-radius:10px;font-weight:700;text-decoration:none">${this.escapeHtml(String(p.buttonText))}</a>` : ''}
</section>`;
      case 'text':
        return `<div style="padding:12px 0;font-size:${p.fontSize};color:${p.color};text-align:${p.align || 'left'};line-height:1.7">${this.escapeHtml(String(p.content))}</div>`;
      case 'image':
        return p.src ? `<img src="${this.escapeHtml(String(p.src))}" alt="${this.escapeHtml(String(p.alt))}" style="width:${p.width};height:${p.height};border-radius:${p.borderRadius};display:block;margin:16px 0" />` : '';
      case 'button':
        return `<div style="text-align:${p.align || 'left'};margin:12px 0"><a href="${this.escapeHtml(String(p.url))}" style="display:inline-block;padding:12px 24px;background:#0f172a;color:#fff;border-radius:10px;font-weight:700;text-decoration:none">${this.escapeHtml(String(p.text))}</a></div>`;
      case 'spacer':
        return `<div style="height:${p.height}"></div>`;
      case 'columns': {
        const cols = Number(p.columns) || 2;
        const children = block.children || [];
        const colHtml = Array.from({ length: cols }).map((_, i) => {
          const child = children[i];
          return `<div style="flex:1">${child ? this.renderBlock(child) : ''}</div>`;
        }).join('');
        return `<div style="display:flex;gap:${p.gap};margin:16px 0">${colHtml}</div>`;
      }
      case 'card':
        return `<div style="padding:24px;border-radius:14px;border:1px solid #e2e8f0;max-width:400px;margin:16px 0">
  <h3 style="font-size:1.1rem;color:#0f172a">${this.escapeHtml(String(p.title))}</h3>
  <p style="margin-top:8px;color:#475569;font-size:0.9rem;line-height:1.6">${this.escapeHtml(String(p.description))}</p>
</div>`;
      default:
        return '';
    }
  }

  private escapeHtml(str: string): string {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
}
