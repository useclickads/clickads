import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

type Variant = { id: string; name: string; content: unknown; weight: number };

@Injectable()
export class ABTestingService {
  constructor(private readonly prisma: PrismaService) {}

  async createTest(projectId: string, pageId: string, data: { name: string; variants: Variant[] }) {
    return this.prisma.client.aBTest.create({
      data: {
        projectId,
        pageId,
        name: data.name,
        variants: data.variants as any,
      },
    });
  }

  async listTests(projectId: string) {
    return this.prisma.client.aBTest.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getTest(id: string) {
    return this.prisma.client.aBTest.findUnique({ where: { id } });
  }

  async startTest(id: string) {
    return this.prisma.client.aBTest.update({
      where: { id },
      data: { status: 'running', startedAt: new Date() },
    });
  }

  async stopTest(id: string) {
    return this.prisma.client.aBTest.update({
      where: { id },
      data: { status: 'completed', endedAt: new Date() },
    });
  }

  async deleteTest(id: string) {
    await this.prisma.client.aBTestResult.deleteMany({ where: { testId: id } });
    return this.prisma.client.aBTest.delete({ where: { id } });
  }

  async assignVariant(testId: string, visitorId: string): Promise<Variant | null> {
    const test = await this.prisma.client.aBTest.findUnique({ where: { id: testId } });
    if (!test || test.status !== 'running') return null;

    const existing = await this.prisma.client.aBTestResult.findFirst({
      where: { testId, visitorId },
    });

    const variants = test.variants as unknown as Variant[];

    if (existing) {
      return variants.find((v) => v.id === existing.variantId) || null;
    }

    const totalWeight = variants.reduce((sum, v) => sum + v.weight, 0);
    let random = Math.random() * totalWeight;
    let selected = variants[0];
    for (const v of variants) {
      random -= v.weight;
      if (random <= 0) {
        selected = v;
        break;
      }
    }

    await this.prisma.client.aBTestResult.create({
      data: { testId, variantId: selected.id, visitorId },
    });

    return selected;
  }

  async recordConversion(testId: string, visitorId: string) {
    const result = await this.prisma.client.aBTestResult.findFirst({
      where: { testId, visitorId },
    });
    if (!result) return null;
    return this.prisma.client.aBTestResult.update({
      where: { id: result.id },
      data: { converted: true },
    });
  }

  async getResults(testId: string) {
    const test = await this.prisma.client.aBTest.findUnique({ where: { id: testId } });
    if (!test) return null;

    const variants = test.variants as unknown as Variant[];
    const results = await this.prisma.client.aBTestResult.findMany({ where: { testId } });

    const stats = variants.map((v) => {
      const variantResults = results.filter((r) => r.variantId === v.id);
      const views = variantResults.length;
      const conversions = variantResults.filter((r) => r.converted).length;
      return {
        variantId: v.id,
        variantName: v.name,
        views,
        conversions,
        conversionRate: views > 0 ? Math.round((conversions / views) * 10000) / 100 : 0,
      };
    });

    return { test, stats, totalViews: results.length };
  }
}
