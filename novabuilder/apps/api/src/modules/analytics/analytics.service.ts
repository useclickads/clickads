import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async trackEvent(projectId: string, event: { type: string; payload: Record<string, unknown> }) {
    let analytics = await this.prisma.client.analytics.findFirst({ where: { projectId } });
    if (!analytics) {
      analytics = await this.prisma.client.analytics.create({ data: { projectId } });
    }
    return this.prisma.client.analyticsEvent.create({
      data: { analyticsId: analytics.id, type: event.type, payload: event.payload as any },
    });
  }

  async getEvents(projectId: string, type?: string, days: number = 30) {
    let analytics = await this.prisma.client.analytics.findFirst({ where: { projectId } });
    if (!analytics) return [];

    const since = new Date();
    since.setDate(since.getDate() - days);

    return this.prisma.client.analyticsEvent.findMany({
      where: {
        analyticsId: analytics.id,
        ...(type ? { type } : {}),
        createdAt: { gte: since },
      },
      orderBy: { createdAt: 'desc' },
      take: 500,
    });
  }

  async getSummary(projectId: string, days: number = 30) {
    let analytics = await this.prisma.client.analytics.findFirst({ where: { projectId } });
    if (!analytics) return { totalEvents: 0, byType: {} };

    const since = new Date();
    since.setDate(since.getDate() - days);

    const events = await this.prisma.client.analyticsEvent.findMany({
      where: { analyticsId: analytics.id, createdAt: { gte: since } },
      select: { type: true, createdAt: true },
    });

    const byType: Record<string, number> = {};
    for (const e of events) {
      byType[e.type] = (byType[e.type] || 0) + 1;
    }

    return { totalEvents: events.length, byType };
  }
}
