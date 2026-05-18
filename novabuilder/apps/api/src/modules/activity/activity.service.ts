import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ActivityService {
  constructor(private readonly prisma: PrismaService) {}

  async logActivity(
    actorId: string,
    action: string,
    resource: string,
    resourceId: string,
    meta?: Record<string, unknown>,
  ) {
    return this.prisma.client.auditLog.create({
      data: {
        actorId,
        action,
        resource,
        resourceId,
        meta: (meta || {}) as any,
      },
    });
  }

  async getProjectTimeline(projectId: string, options?: { limit?: number; offset?: number; resource?: string }) {
    const limit = options?.limit || 50;
    const offset = options?.offset || 0;

    const where: Record<string, unknown> = {
      meta: { path: ['projectId'], equals: projectId },
    };
    if (options?.resource) where.resource = options.resource;

    const [events, total] = await Promise.all([
      this.prisma.client.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
        include: { actor: { select: { id: true, name: true, email: true, avatarUrl: true } } },
      }),
      this.prisma.client.auditLog.count({ where }),
    ]);

    return {
      events: events.map((e: any) => ({
        id: e.id,
        action: e.action,
        resource: e.resource,
        resourceId: e.resourceId,
        meta: e.meta,
        user: e.actor,
        createdAt: e.createdAt,
        description: this.describeAction(e.action, e.resource, e.meta as any),
      })),
      total,
      hasMore: offset + limit < total,
    };
  }

  async getUserActivity(actorId: string, limit = 20) {
    const events = await this.prisma.client.auditLog.findMany({
      where: { actorId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return events.map((e) => ({
      id: e.id,
      action: e.action,
      resource: e.resource,
      resourceId: e.resourceId,
      meta: e.meta,
      createdAt: e.createdAt,
      description: this.describeAction(e.action, e.resource, e.meta as any),
    }));
  }

  async getActivityStats(projectId: string, days = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const events = await this.prisma.client.auditLog.findMany({
      where: {
        meta: { path: ['projectId'], equals: projectId },
        createdAt: { gte: since },
      },
      select: { action: true, resource: true, createdAt: true },
    });

    const byDay = new Map<string, number>();
    const byAction = new Map<string, number>();
    const byResource = new Map<string, number>();

    for (const event of events) {
      const day = event.createdAt.toISOString().split('T')[0];
      byDay.set(day, (byDay.get(day) || 0) + 1);
      byAction.set(event.action, (byAction.get(event.action) || 0) + 1);
      byResource.set(event.resource, (byResource.get(event.resource) || 0) + 1);
    }

    return {
      totalEvents: events.length,
      byDay: Object.fromEntries(byDay),
      byAction: Object.fromEntries(byAction),
      byEntity: Object.fromEntries(byResource),
    };
  }

  private describeAction(action: string, resource: string, meta: Record<string, unknown> | null): string {
    const name = (meta?.name as string) || (meta?.title as string) || '';
    const suffix = name ? ` "${name}"` : '';

    const descriptions: Record<string, string> = {
      'create:page': `created page${suffix}`,
      'update:page': `updated page${suffix}`,
      'delete:page': `deleted page${suffix}`,
      'publish:page': `published page${suffix}`,
      'unpublish:page': `unpublished page${suffix}`,
      'create:deployment': `deployed project`,
      'create:backup': `created backup`,
      'restore:backup': `restored from backup`,
      'create:entry': `added CMS entry${suffix}`,
      'update:entry': `updated CMS entry${suffix}`,
      'invite:collaborator': `invited a team member`,
      'update:settings': `updated project settings`,
      'create:asset': `uploaded asset${suffix}`,
      'create:form': `created form${suffix}`,
      'create:integration': `added integration`,
    };

    return descriptions[`${action}:${resource}`] || `${action} ${resource}${suffix}`;
  }
}
