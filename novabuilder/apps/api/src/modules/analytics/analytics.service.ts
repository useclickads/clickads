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

  async trackHeatmapClick(projectId: string, data: { pageId: string; x: number; y: number; elementSelector?: string; viewportWidth: number; viewportHeight: number; visitorId?: string }) {
    return this.prisma.client.heatmap.create({
      data: {
        projectId,
        data: {
          pageId: data.pageId,
          type: 'click',
          x: data.x,
          y: data.y,
          elementSelector: data.elementSelector || null,
          viewportWidth: data.viewportWidth,
          viewportHeight: data.viewportHeight,
          visitorId: data.visitorId || null,
          timestamp: new Date().toISOString(),
        } as any,
      },
    });
  }

  async getHeatmapData(projectId: string, pageId: string, days = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const entries = await this.prisma.client.heatmap.findMany({
      where: {
        projectId,
        data: { path: ['pageId'], equals: pageId },
        createdAt: { gte: since },
      },
      orderBy: { createdAt: 'desc' },
      take: 5000,
    });

    const clicks = entries.map((e) => {
      const d = e.data as any;
      return { x: d.x, y: d.y, selector: d.elementSelector, viewport: { w: d.viewportWidth, h: d.viewportHeight } };
    });

    return { pageId, clicks, totalClicks: clicks.length };
  }

  async createFunnel(projectId: string, data: { name: string; steps: { name: string; eventType: string; eventFilter?: Record<string, unknown> }[] }) {
    return this.prisma.client.funnel.create({
      data: {
        projectId,
        steps: data.steps as any,
        results: { computed: false } as any,
      },
    });
  }

  async listFunnels(projectId: string) {
    return this.prisma.client.funnel.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async computeFunnel(projectId: string, funnelId: string, days = 30) {
    const funnel = await this.prisma.client.funnel.findUnique({ where: { id: funnelId } });
    if (!funnel || funnel.projectId !== projectId) return null;

    const since = new Date();
    since.setDate(since.getDate() - days);

    const analytics = await this.prisma.client.analytics.findFirst({ where: { projectId } });
    if (!analytics) return { funnel, stepResults: [], conversionRate: 0 };

    const events = await this.prisma.client.analyticsEvent.findMany({
      where: { analyticsId: analytics.id, createdAt: { gte: since } },
      select: { type: true, payload: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    });

    const steps = funnel.steps as { name: string; eventType: string; eventFilter?: Record<string, unknown> }[];
    const stepResults: { name: string; count: number; dropoff: number }[] = [];

    const visitorsByStep = new Map<number, Set<string>>();

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      const visitors = new Set<string>();

      for (const e of events) {
        if (e.type !== step.eventType) continue;
        const payload = e.payload as any;
        const visitorId = payload?.visitorId || payload?.sessionId || 'anonymous';

        if (i === 0) {
          visitors.add(visitorId);
        } else {
          const prevVisitors = visitorsByStep.get(i - 1);
          if (prevVisitors?.has(visitorId)) {
            visitors.add(visitorId);
          }
        }
      }

      visitorsByStep.set(i, visitors);
      const prevCount = i > 0 ? (visitorsByStep.get(i - 1)?.size || 0) : visitors.size;
      stepResults.push({
        name: step.name,
        count: visitors.size,
        dropoff: prevCount > 0 ? Math.round((1 - visitors.size / prevCount) * 100) : 0,
      });
    }

    const firstStep = stepResults[0]?.count || 0;
    const lastStep = stepResults[stepResults.length - 1]?.count || 0;
    const conversionRate = firstStep > 0 ? Math.round((lastStep / firstStep) * 10000) / 100 : 0;

    const results = { stepResults, conversionRate, computedAt: new Date().toISOString() };
    await this.prisma.client.funnel.update({ where: { id: funnelId }, data: { results: results as any } });

    return { funnel, ...results };
  }

  async deleteFunnel(funnelId: string) {
    await this.prisma.client.funnel.delete({ where: { id: funnelId } });
    return { ok: true };
  }
}
