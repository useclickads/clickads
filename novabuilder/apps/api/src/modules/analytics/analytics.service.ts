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

  async trackPageView(projectId: string, data: { path: string; referrer?: string; userAgent?: string; visitorId?: string; sessionId?: string }) {
    let analytics = await this.prisma.client.analytics.findFirst({ where: { projectId } });
    if (!analytics) {
      analytics = await this.prisma.client.analytics.create({ data: { projectId } });
    }
    return this.prisma.client.analyticsEvent.create({
      data: {
        analyticsId: analytics.id,
        type: 'page_view',
        payload: {
          path: data.path,
          referrer: data.referrer || null,
          userAgent: data.userAgent || null,
          visitorId: data.visitorId || null,
          sessionId: data.sessionId || null,
        } as any,
      },
    });
  }

  async getEvents(projectId: string, type?: string, days: number = 30) {
    const analytics = await this.prisma.client.analytics.findFirst({ where: { projectId } });
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
    const analytics = await this.prisma.client.analytics.findFirst({ where: { projectId } });
    if (!analytics) return { totalEvents: 0, pageViews: 0, uniqueVisitors: 0, byType: {}, topPages: [], referrers: [], timeSeries: [] };

    const since = new Date();
    since.setDate(since.getDate() - days);

    const events = await this.prisma.client.analyticsEvent.findMany({
      where: { analyticsId: analytics.id, createdAt: { gte: since } },
      select: { type: true, payload: true, createdAt: true },
    });

    const byType: Record<string, number> = {};
    const pageCounts: Record<string, number> = {};
    const referrerCounts: Record<string, number> = {};
    const visitors = new Set<string>();
    const dailyCounts: Record<string, number> = {};

    for (const e of events) {
      byType[e.type] = (byType[e.type] || 0) + 1;

      const payload = e.payload as any;
      if (e.type === 'page_view') {
        if (payload?.path) {
          pageCounts[payload.path] = (pageCounts[payload.path] || 0) + 1;
        }
        if (payload?.referrer) {
          referrerCounts[payload.referrer] = (referrerCounts[payload.referrer] || 0) + 1;
        }
        if (payload?.visitorId) {
          visitors.add(payload.visitorId);
        }
      }

      const day = e.createdAt.toISOString().slice(0, 10);
      dailyCounts[day] = (dailyCounts[day] || 0) + 1;
    }

    const topPages = Object.entries(pageCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([path, views]) => ({ path, views }));

    const referrers = Object.entries(referrerCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([source, count]) => ({ source, count }));

    const timeSeries = Object.entries(dailyCounts)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, count]) => ({ date, count }));

    return {
      totalEvents: events.length,
      pageViews: byType['page_view'] || 0,
      uniqueVisitors: visitors.size,
      byType,
      topPages,
      referrers,
      timeSeries,
    };
  }
}
