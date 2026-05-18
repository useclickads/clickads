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

    const settings = await this.prisma.client.projectSettings.findUnique({ where: { projectId } });

    const outputs: { path: string; html: string }[] = [];
    for (const page of pages) {
      const content = page.content as { blocks: Block[] } | null;
      const blocks = content?.blocks ?? [];
      const seo = page.seo as { metaTitle?: string; metaDescription?: string; ogImage?: string; noIndex?: boolean } | null;
      const html = this.renderPageHtml(page.title, blocks, { seo, settings });
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

  async generateSitemap(projectId: string): Promise<string> {
    const settings = await this.prisma.client.projectSettings.findUnique({ where: { projectId } });
    const baseUrl = (settings as any)?.siteUrl || 'https://example.com';

    const pages = await this.prisma.client.page.findMany({
      where: { projectId, published: true, deletedAt: null },
      select: { path: true, updatedAt: true },
    });

    const urls = pages.map((page) => `  <url>
    <loc>${baseUrl}${page.path}</loc>
    <lastmod>${page.updatedAt.toISOString().slice(0, 10)}</lastmod>
    <changefreq>weekly</changefreq>
  </url>`).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
  }

  async generateRobotsTxt(projectId: string): Promise<string> {
    const settings = await this.prisma.client.projectSettings.findUnique({ where: { projectId } });
    const custom = (settings as any)?.robotsTxt;
    if (custom) return custom;

    const baseUrl = (settings as any)?.siteUrl || 'https://example.com';
    return `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml`;
  }

  private renderPageHtml(title: string, blocks: Block[], opts?: { seo?: { metaTitle?: string; metaDescription?: string; ogImage?: string; noIndex?: boolean } | null; settings?: { headScripts?: string | null; bodyScripts?: string | null; favicon?: string | null; globalHeader?: unknown; globalFooter?: unknown } | null }): string {
    const seo = opts?.seo;
    const settings = opts?.settings;
    const pageTitle = seo?.metaTitle || title;
    const headerBlocks = (Array.isArray(settings?.globalHeader) ? settings.globalHeader : []) as Block[];
    const footerBlocks = (Array.isArray(settings?.globalFooter) ? settings.globalFooter : []) as Block[];
    const headerHtml = headerBlocks.map((b) => this.renderBlock(b)).join('\n');
    const bodyHtml = blocks.map((b) => this.renderBlock(b)).join('\n');
    const footerHtml = footerBlocks.map((b) => this.renderBlock(b)).join('\n');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${this.escapeHtml(pageTitle)}</title>
  ${seo?.metaDescription ? `<meta name="description" content="${this.escapeHtml(seo.metaDescription)}">` : ''}
  ${seo?.ogImage ? `<meta property="og:image" content="${this.escapeHtml(seo.ogImage)}">` : ''}
  ${seo?.noIndex ? '<meta name="robots" content="noindex, nofollow">' : ''}
  ${settings?.favicon ? `<link rel="icon" href="${this.escapeHtml(settings.favicon)}">` : ''}
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: ui-sans-serif, system-ui, sans-serif; color: #1e293b; }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
  </style>
  ${settings?.headScripts || ''}
</head>
<body>
  ${headerHtml}
  <div class="container">
    ${bodyHtml}
  </div>
  ${footerHtml}
  ${settings?.bodyScripts || ''}
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
      case 'navigation': {
        let links: { label: string; url: string }[] = [];
        try { links = JSON.parse(String(p.links)); } catch {}
        return `<nav style="display:flex;align-items:center;justify-content:space-between;padding:16px 24px;border-bottom:1px solid #e2e8f0">
  <span style="font-weight:800;font-size:1.1rem;color:#0f172a">${this.escapeHtml(String(p.brand))}</span>
  <div style="display:flex;gap:24px">${links.map(l => `<a href="${this.escapeHtml(l.url)}" style="color:#475569;text-decoration:none;font-size:0.9rem">${this.escapeHtml(l.label)}</a>`).join('')}</div>
</nav>`;
      }
      case 'footer': {
        let links: { label: string; url: string }[] = [];
        try { links = JSON.parse(String(p.links)); } catch {}
        return `<footer style="padding:24px 32px;background:#f8fafc;display:flex;justify-content:space-between;align-items:center;margin-top:32px">
  <span style="color:#64748b;font-size:0.85rem">${this.escapeHtml(String(p.text))}</span>
  <div style="display:flex;gap:16px">${links.map(l => `<a href="${this.escapeHtml(l.url)}" style="color:#64748b;text-decoration:none;font-size:0.85rem">${this.escapeHtml(l.label)}</a>`).join('')}</div>
</footer>`;
      }
      case 'form': {
        let fields: { name: string; type: string; label: string; required: boolean }[] = [];
        try { fields = JSON.parse(String(p.fields)); } catch {}
        return `<div style="padding:24px;border-radius:14px;background:#f8fafc;border:1px solid #e2e8f0;margin:16px 0">
  <h3 style="margin:0 0 16px;color:#0f172a">${this.escapeHtml(String(p.heading))}</h3>
  <form style="display:grid;gap:12px">${fields.map(f => `<label style="display:grid;gap:4px;font-size:0.85rem;color:#334155">${this.escapeHtml(f.label)}${f.required ? ' *' : ''}${f.type === 'textarea' ? '<textarea style="padding:10px 12px;border-radius:8px;border:1px solid #cbd5e1;resize:vertical;min-height:80px"></textarea>' : `<input type="${f.type}" style="padding:10px 12px;border-radius:8px;border:1px solid #cbd5e1" />`}</label>`).join('')}
  <button type="submit" style="padding:12px 20px;background:#0f172a;color:#fff;border:none;border-radius:8px;font-weight:600;cursor:pointer;justify-self:start">${this.escapeHtml(String(p.submitText))}</button></form>
</div>`;
      }
      case 'video':
        return p.url ? `<div style="aspect-ratio:${p.aspectRatio};border-radius:12px;overflow:hidden;margin:16px 0"><video src="${this.escapeHtml(String(p.url))}" ${p.autoplay ? 'autoplay' : ''} ${p.muted ? 'muted' : ''} controls style="width:100%;height:100%;object-fit:cover"></video></div>` : '';
      case 'code':
        return `${p.css ? `<style>${p.css}</style>` : ''}${p.html || ''}`;
      case 'divider':
        return `<div style="margin:${p.margin}"><hr style="border:none;border-top:${p.thickness} ${p.style} ${p.color};width:${p.width}" /></div>`;
      case 'testimonial':
        return `<div style="padding:28px;border-radius:16px;background:#f8fafc;border:1px solid #e2e8f0;text-align:center;margin:16px 0">
  ${Number(p.rating) > 0 ? `<div style="font-size:1.25rem;color:#f59e0b;margin-bottom:12px">${'★'.repeat(Number(p.rating))}${'☆'.repeat(5 - Number(p.rating))}</div>` : ''}
  <p style="font-size:1.05rem;color:#334155;line-height:1.7;font-style:italic">&ldquo;${this.escapeHtml(String(p.quote))}&rdquo;</p>
  <p style="margin-top:16px;font-weight:700;font-size:0.9rem;color:#0f172a">${this.escapeHtml(String(p.author))}</p>
  ${p.role ? `<p style="font-size:0.8rem;color:#64748b">${this.escapeHtml(String(p.role))}</p>` : ''}
</div>`;
      case 'pricing': {
        let features: string[] = [];
        try { features = JSON.parse(String(p.features)); } catch {}
        const hl = p.highlighted;
        return `<div style="padding:28px;border-radius:16px;${hl ? 'background:#0f172a;color:#fff' : 'background:#fff;border:1px solid #e2e8f0'};max-width:320px;text-align:center;margin:16px 0">
  <p style="font-weight:700;font-size:0.85rem;text-transform:uppercase;letter-spacing:0.05em;color:${hl ? '#94a3b8' : '#64748b'}">${this.escapeHtml(String(p.planName))}</p>
  <p style="margin:12px 0;font-size:2.5rem;font-weight:800;color:${hl ? '#fff' : '#0f172a'}">${this.escapeHtml(String(p.price))}<span style="font-size:1rem;font-weight:400;color:${hl ? '#94a3b8' : '#64748b'}">${this.escapeHtml(String(p.period))}</span></p>
  <ul style="list-style:none;padding:0;margin:16px 0 24px;display:grid;gap:8px">${features.map(f => `<li style="font-size:0.9rem;color:${hl ? '#cbd5e1' : '#475569'}">&#10003; ${this.escapeHtml(f)}</li>`).join('')}</ul>
  <a href="${this.escapeHtml(String(p.buttonUrl))}" style="display:inline-block;padding:12px 28px;border-radius:10px;font-weight:700;text-decoration:none;font-size:0.9rem;background:${hl ? '#fff' : '#0f172a'};color:${hl ? '#0f172a' : '#fff'}">${this.escapeHtml(String(p.buttonText))}</a>
</div>`;
      }
      case 'faq': {
        let items: { question: string; answer: string }[] = [];
        try { items = JSON.parse(String(p.items)); } catch {}
        return `<div style="padding:16px 0;margin:16px 0">
  ${p.heading ? `<h2 style="margin:0 0 20px;font-size:1.3rem;color:#0f172a;font-weight:700">${this.escapeHtml(String(p.heading))}</h2>` : ''}
  ${items.map(item => `<details style="padding:16px;border-radius:12px;background:#f8fafc;border:1px solid #e2e8f0;margin-bottom:8px"><summary style="font-weight:600;font-size:0.95rem;color:#0f172a;cursor:pointer">${this.escapeHtml(item.question)}</summary><p style="margin-top:8px;font-size:0.9rem;color:#475569;line-height:1.6">${this.escapeHtml(item.answer)}</p></details>`).join('\n')}
</div>`;
      }
      case 'gallery': {
        let images: string[] = [];
        try { images = JSON.parse(String(p.images)); } catch {}
        const cols = Number(p.columns) || 3;
        return images.length > 0 ? `<div style="display:grid;grid-template-columns:repeat(${cols},1fr);gap:${p.gap};margin:16px 0">${images.map(src => `<img src="${this.escapeHtml(src)}" alt="" style="width:100%;aspect-ratio:1;object-fit:cover;border-radius:${p.borderRadius}" />`).join('')}</div>` : '';
      }
      case 'map':
        return p.embedUrl ? `<iframe src="${this.escapeHtml(String(p.embedUrl))}" style="width:100%;height:${p.height};border:none;border-radius:${p.borderRadius};margin:16px 0" loading="lazy"></iframe>` : '';
      case 'countdown':
        return `<div style="padding:32px;text-align:center;border-radius:14px;background:linear-gradient(135deg,#0f172a,#1e40af);margin:16px 0">
  ${p.heading ? `<p style="margin:0 0 16px;font-size:1.1rem;font-weight:700;color:#cbd5e1">${this.escapeHtml(String(p.heading))}</p>` : ''}
  <div id="countdown-${block.id}" style="display:flex;justify-content:center;gap:24px;font-size:2rem;font-weight:800;color:#fff">Loading...</div>
  <script>(function(){var t=new Date("${this.escapeHtml(String(p.targetDate))}").getTime(),e=document.getElementById("countdown-${block.id}");function u(){var n=t-Date.now();if(n<=0){e.textContent="${this.escapeHtml(String(p.expiredText))}";return}var d=Math.floor(n/864e5),h=Math.floor(n/36e5%24),m=Math.floor(n/6e4%60),s=Math.floor(n/1e3%60);e.innerHTML="<span>"+d+"d</span><span>"+h+"h</span><span>"+m+"m</span><span>"+s+"s</span>"}u();setInterval(u,1e3)})()</script>
</div>`;
      default:
        return '';
    }
  }

  private escapeHtml(str: string): string {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
}
