import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

type OptimizationResult = {
  originalSize: number;
  optimizedSize: number;
  savings: number;
  savingsPercent: number;
  format: string;
  width: number;
  height: number;
};

type ImageVariant = {
  width: number;
  height: number;
  format: string;
  quality: number;
  url: string;
};

@Injectable()
export class ImageOptimizerService {
  private readonly defaultBreakpoints = [320, 640, 768, 1024, 1280, 1920];
  private readonly defaultFormats = ['webp', 'avif'];
  private readonly defaultQuality = 80;

  constructor(private readonly prisma: PrismaService) {}

  async getOptimizationSettings(projectId: string) {
    const settings = await this.prisma.client.projectSettings.findUnique({
      where: { projectId },
    });

    const raw = settings?.globalFooter as any;
    return {
      breakpoints: raw?.imageBreakpoints || this.defaultBreakpoints,
      formats: raw?.imageFormats || this.defaultFormats,
      quality: raw?.imageQuality || this.defaultQuality,
      lazyLoading: raw?.lazyLoading !== false,
      srcSet: raw?.srcSet !== false,
    };
  }

  async updateOptimizationSettings(
    projectId: string,
    settings: {
      breakpoints?: number[];
      formats?: string[];
      quality?: number;
      lazyLoading?: boolean;
      srcSet?: boolean;
    },
  ) {
    const existing = await this.prisma.client.projectSettings.findUnique({
      where: { projectId },
    });

    const globalFooter = (existing?.globalFooter as any) || {};

    await this.prisma.client.projectSettings.upsert({
      where: { projectId },
      create: {
        projectId,
        globalFooter: {
          ...globalFooter,
          imageBreakpoints: settings.breakpoints,
          imageFormats: settings.formats,
          imageQuality: settings.quality,
          lazyLoading: settings.lazyLoading,
          srcSet: settings.srcSet,
        } as any,
      },
      update: {
        globalFooter: {
          ...globalFooter,
          imageBreakpoints: settings.breakpoints ?? globalFooter.imageBreakpoints,
          imageFormats: settings.formats ?? globalFooter.imageFormats,
          imageQuality: settings.quality ?? globalFooter.imageQuality,
          lazyLoading: settings.lazyLoading ?? globalFooter.lazyLoading,
          srcSet: settings.srcSet ?? globalFooter.srcSet,
        } as any,
      },
    });

    return { ok: true };
  }

  generateResponsiveHtml(
    src: string,
    alt: string,
    options?: { breakpoints?: number[]; formats?: string[]; quality?: number; lazyLoading?: boolean },
  ): string {
    const breakpoints = options?.breakpoints || this.defaultBreakpoints;
    const formats = options?.formats || this.defaultFormats;
    const quality = options?.quality || this.defaultQuality;
    const lazy = options?.lazyLoading !== false;

    const sources = formats.map((format) => {
      const srcset = breakpoints
        .map((w) => `${this.buildOptimizedUrl(src, w, format, quality)} ${w}w`)
        .join(', ');
      return `<source type="image/${format}" srcset="${srcset}" sizes="100vw">`;
    });

    const fallbackSrcset = breakpoints
      .map((w) => `${this.buildOptimizedUrl(src, w, 'jpeg', quality)} ${w}w`)
      .join(', ');

    return [
      '<picture>',
      ...sources.map((s) => `  ${s}`),
      `  <img src="${src}" srcset="${fallbackSrcset}" sizes="100vw" alt="${this.escapeHtml(alt)}"${lazy ? ' loading="lazy" decoding="async"' : ''}>`,
      '</picture>',
    ].join('\n');
  }

  analyzeProjectImages(pages: Array<{ content: unknown }>): {
    totalImages: number;
    withoutAlt: number;
    withoutDimensions: number;
    largeImages: number;
    nonOptimalFormat: number;
    recommendations: string[];
  } {
    let totalImages = 0;
    let withoutAlt = 0;
    let withoutDimensions = 0;
    let largeImages = 0;
    let nonOptimalFormat = 0;

    for (const page of pages) {
      const blocks = Array.isArray(page.content) ? page.content : [];
      for (const block of blocks) {
        if (block?.type !== 'image') continue;
        totalImages++;
        const props = block.props || {};
        if (!props.alt) withoutAlt++;
        if (!props.width || !props.height) withoutDimensions++;
        if (props.fileSize && props.fileSize > 500000) largeImages++;
        const src: string = props.src || '';
        if (src.match(/\.(bmp|tiff?)$/i)) nonOptimalFormat++;
      }
    }

    const recommendations: string[] = [];
    if (withoutAlt > 0) recommendations.push(`${withoutAlt} image(s) missing alt text`);
    if (withoutDimensions > 0) recommendations.push(`${withoutDimensions} image(s) missing explicit dimensions (causes layout shift)`);
    if (largeImages > 0) recommendations.push(`${largeImages} image(s) over 500KB — consider compression`);
    if (nonOptimalFormat > 0) recommendations.push(`${nonOptimalFormat} image(s) in non-optimal format — convert to WebP/AVIF`);
    if (totalImages > 0 && recommendations.length === 0) recommendations.push('All images look optimized');

    return { totalImages, withoutAlt, withoutDimensions, largeImages, nonOptimalFormat, recommendations };
  }

  generateSrcSet(src: string, breakpoints?: number[]): string {
    const bps = breakpoints || this.defaultBreakpoints;
    return bps.map((w) => `${this.buildOptimizedUrl(src, w, 'webp', this.defaultQuality)} ${w}w`).join(', ');
  }

  private buildOptimizedUrl(src: string, width: number, format: string, quality: number): string {
    const sep = src.includes('?') ? '&' : '?';
    return `${src}${sep}w=${width}&fm=${format}&q=${quality}`;
  }

  private escapeHtml(str: string): string {
    return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}
