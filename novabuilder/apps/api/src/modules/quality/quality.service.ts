import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

type Block = { id: string; type: string; props: Record<string, unknown>; children?: Block[] };
type Issue = { severity: 'error' | 'warning' | 'info'; category: string; blockId?: string; message: string; suggestion: string };

@Injectable()
export class QualityService {
  constructor(private readonly prisma: PrismaService) {}

  async auditPage(pageId: string): Promise<{ score: number; issues: Issue[]; breakdown: Record<string, number> }> {
    const page = await this.prisma.client.page.findUnique({ where: { id: pageId } });
    if (!page) return { score: 0, issues: [{ severity: 'error', category: 'general', message: 'Page not found', suggestion: '' }], breakdown: {} };

    const content = page.content as { blocks: Block[] } | null;
    const blocks = content?.blocks || [];
    const seo = page.seo as { metaTitle?: string; metaDescription?: string; ogImage?: string; noIndex?: boolean } | null;

    const issues: Issue[] = [];

    this.checkAccessibility(blocks, issues);
    this.checkSeo(seo, page.title, issues);
    this.checkPerformance(blocks, issues);
    this.checkContent(blocks, issues);

    const breakdown: Record<string, number> = {};
    for (const issue of issues) {
      breakdown[issue.category] = (breakdown[issue.category] || 0) + 1;
    }

    const errorCount = issues.filter((i) => i.severity === 'error').length;
    const warningCount = issues.filter((i) => i.severity === 'warning').length;
    const score = Math.max(0, 100 - errorCount * 10 - warningCount * 3);

    return { score, issues, breakdown };
  }

  private checkAccessibility(blocks: Block[], issues: Issue[]) {
    let hasHeading = false;
    let hasNav = false;
    let imgCount = 0;
    let imgWithoutAlt = 0;

    const checkBlock = (block: Block) => {
      if (block.type === 'hero' || block.type === 'text') hasHeading = true;
      if (block.type === 'navigation') hasNav = true;

      if (block.type === 'image') {
        imgCount++;
        if (!block.props.alt || String(block.props.alt).trim() === '') {
          imgWithoutAlt++;
          issues.push({
            severity: 'error',
            category: 'accessibility',
            blockId: block.id,
            message: 'Image missing alt text',
            suggestion: 'Add descriptive alt text for screen readers',
          });
        }
      }

      if (block.type === 'button' && !block.props.text) {
        issues.push({
          severity: 'warning',
          category: 'accessibility',
          blockId: block.id,
          message: 'Button has no text label',
          suggestion: 'Add visible text or aria-label to buttons',
        });
      }

      if (block.type === 'form') {
        const fields = block.props.fields;
        if (typeof fields === 'string') {
          try {
            const parsed = JSON.parse(fields);
            for (const f of parsed) {
              if (!f.label) {
                issues.push({
                  severity: 'warning',
                  category: 'accessibility',
                  blockId: block.id,
                  message: `Form field "${f.name}" missing label`,
                  suggestion: 'Add labels to all form fields for accessibility',
                });
              }
            }
          } catch {}
        }
      }

      if (block.type === 'video' && !block.props.title) {
        issues.push({
          severity: 'info',
          category: 'accessibility',
          blockId: block.id,
          message: 'Video missing title attribute',
          suggestion: 'Add a descriptive title for the video iframe',
        });
      }

      if (block.children) block.children.forEach(checkBlock);
    };

    blocks.forEach(checkBlock);

    if (!hasNav && blocks.length > 3) {
      issues.push({
        severity: 'warning',
        category: 'accessibility',
        message: 'Page has no navigation block',
        suggestion: 'Add a navigation block for better page structure',
      });
    }

    if (imgCount > 0 && imgWithoutAlt === imgCount) {
      issues.push({
        severity: 'error',
        category: 'accessibility',
        message: 'No images have alt text',
        suggestion: 'Ensure all images have descriptive alt attributes',
      });
    }
  }

  private checkSeo(seo: { metaTitle?: string; metaDescription?: string; ogImage?: string; noIndex?: boolean } | null, pageTitle: string, issues: Issue[]) {
    if (!seo?.metaTitle && !pageTitle) {
      issues.push({ severity: 'error', category: 'seo', message: 'Page has no title', suggestion: 'Add a meta title for search engines' });
    } else {
      const title = seo?.metaTitle || pageTitle;
      if (title.length > 70) {
        issues.push({ severity: 'warning', category: 'seo', message: `Title too long (${title.length}/70 chars)`, suggestion: 'Keep title under 70 characters' });
      }
      if (title.length < 20) {
        issues.push({ severity: 'info', category: 'seo', message: 'Title is very short', suggestion: 'Consider a more descriptive title (20-70 chars)' });
      }
    }

    if (!seo?.metaDescription) {
      issues.push({ severity: 'warning', category: 'seo', message: 'Missing meta description', suggestion: 'Add a meta description (120-160 chars) for search results' });
    } else if (seo.metaDescription.length > 160) {
      issues.push({ severity: 'warning', category: 'seo', message: `Meta description too long (${seo.metaDescription.length}/160 chars)`, suggestion: 'Keep under 160 characters' });
    }

    if (!seo?.ogImage) {
      issues.push({ severity: 'info', category: 'seo', message: 'No Open Graph image set', suggestion: 'Add an OG image for better social media sharing' });
    }
  }

  private checkPerformance(blocks: Block[], issues: Issue[]) {
    const imageBlocks = blocks.filter((b) => b.type === 'image');
    if (imageBlocks.length > 10) {
      issues.push({
        severity: 'warning',
        category: 'performance',
        message: `Page has ${imageBlocks.length} images — may affect load time`,
        suggestion: 'Consider lazy loading images below the fold',
      });
    }

    for (const img of imageBlocks) {
      const src = String(img.props.src || '');
      if (src && !src.includes('.webp') && !src.includes('.avif') && (src.includes('.png') || src.includes('.bmp'))) {
        issues.push({
          severity: 'info',
          category: 'performance',
          blockId: img.id,
          message: 'Image uses unoptimized format',
          suggestion: 'Consider using WebP or AVIF for smaller file sizes',
        });
      }
    }

    const codeBlocks = blocks.filter((b) => b.type === 'code');
    for (const code of codeBlocks) {
      const html = String(code.props.html || '');
      if (html.length > 5000) {
        issues.push({
          severity: 'warning',
          category: 'performance',
          blockId: code.id,
          message: 'Code block contains large HTML payload',
          suggestion: 'Consider loading heavy content via external scripts',
        });
      }
    }

    if (blocks.length > 30) {
      issues.push({
        severity: 'info',
        category: 'performance',
        message: `Page has ${blocks.length} blocks — consider splitting into multiple pages`,
        suggestion: 'Long pages may affect rendering performance',
      });
    }
  }

  private checkContent(blocks: Block[], issues: Issue[]) {
    if (blocks.length === 0) {
      issues.push({ severity: 'error', category: 'content', message: 'Page has no content blocks', suggestion: 'Add at least a hero or text block' });
      return;
    }

    const hasFooter = blocks.some((b) => b.type === 'footer');
    if (!hasFooter && blocks.length > 5) {
      issues.push({ severity: 'info', category: 'content', message: 'Page has no footer', suggestion: 'Add a footer with copyright and links' });
    }

    const hasCta = blocks.some((b) => b.type === 'button' || (b.type === 'hero' && b.props.buttonText));
    if (!hasCta && blocks.length > 3) {
      issues.push({ severity: 'info', category: 'content', message: 'No call-to-action found', suggestion: 'Add a button or CTA to guide users' });
    }
  }
}
