import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export type NotificationType =
  | 'project_published'
  | 'deploy_success'
  | 'deploy_failed'
  | 'form_submission'
  | 'team_invite'
  | 'team_removed'
  | 'comment_mention'
  | 'backup_complete'
  | 'domain_verified'
  | 'usage_warning'
  | 'system';

type NotificationPreferences = {
  email: boolean;
  inApp: boolean;
  mutedTypes: NotificationType[];
};

const DEFAULT_PREFERENCES: NotificationPreferences = {
  email: true,
  inApp: true,
  mutedTypes: [],
};

@Injectable()
export class NotificationsService {
  private preferences = new Map<string, NotificationPreferences>();
  private batchQueue = new Map<string, { userId: string; type: string; payload: Record<string, unknown> }[]>();
  private batchTimer: ReturnType<typeof setInterval> | null = null;

  constructor(private readonly prisma: PrismaService) {}

  onModuleInit() {
    this.batchTimer = setInterval(() => this.flushBatches(), 5000);
  }

  onModuleDestroy() {
    if (this.batchTimer) clearInterval(this.batchTimer);
    this.flushBatches();
  }

  async create(userId: string, type: string, payload: Record<string, unknown>) {
    const prefs = this.getPreferences(userId);
    if (prefs.mutedTypes.includes(type as NotificationType)) return null;
    if (!prefs.inApp) return null;

    return this.prisma.client.notification.create({
      data: { userId, type, payload: payload as any },
    });
  }

  async createBatch(notifications: { userId: string; type: string; payload: Record<string, unknown> }[]) {
    const results = [];
    for (const n of notifications) {
      const result = await this.create(n.userId, n.type, n.payload);
      if (result) results.push(result);
    }
    return results;
  }

  queueNotification(userId: string, type: string, payload: Record<string, unknown>) {
    const key = `${userId}:${type}`;
    if (!this.batchQueue.has(key)) this.batchQueue.set(key, []);
    this.batchQueue.get(key)!.push({ userId, type, payload });
  }

  private async flushBatches() {
    if (this.batchQueue.size === 0) return;
    const entries = Array.from(this.batchQueue.entries());
    this.batchQueue.clear();

    for (const [, items] of entries) {
      if (items.length === 1) {
        await this.create(items[0].userId, items[0].type, items[0].payload);
      } else {
        const first = items[0];
        await this.create(first.userId, first.type, {
          ...first.payload,
          batchCount: items.length,
          message: `${items.length} ${first.type} notifications`,
        });
      }
    }
  }

  async list(userId: string, unreadOnly = false, cursor?: string, limit = 50) {
    return this.prisma.client.notification.findMany({
      where: {
        userId,
        ...(unreadOnly ? { read: false } : {}),
        ...(cursor ? { createdAt: { lt: new Date(cursor) } } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async markRead(id: string) {
    return this.prisma.client.notification.update({
      where: { id },
      data: { read: true },
    });
  }

  async markAllRead(userId: string) {
    return this.prisma.client.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
  }

  async deleteNotification(id: string) {
    return this.prisma.client.notification.delete({ where: { id } });
  }

  async deleteOlderThan(userId: string, days: number) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return this.prisma.client.notification.deleteMany({
      where: { userId, createdAt: { lt: cutoff } },
    });
  }

  async unreadCount(userId: string) {
    return this.prisma.client.notification.count({
      where: { userId, read: false },
    });
  }

  async groupedByType(userId: string) {
    const notifications = await this.prisma.client.notification.findMany({
      where: { userId, read: false },
      orderBy: { createdAt: 'desc' },
    });

    const grouped: Record<string, typeof notifications> = {};
    for (const n of notifications) {
      if (!grouped[n.type]) grouped[n.type] = [];
      grouped[n.type].push(n);
    }
    return grouped;
  }

  getPreferences(userId: string): NotificationPreferences {
    return this.preferences.get(userId) || { ...DEFAULT_PREFERENCES };
  }

  updatePreferences(userId: string, updates: Partial<NotificationPreferences>) {
    const current = this.getPreferences(userId);
    this.preferences.set(userId, { ...current, ...updates });
    return this.getPreferences(userId);
  }

  muteType(userId: string, type: NotificationType) {
    const prefs = this.getPreferences(userId);
    if (!prefs.mutedTypes.includes(type)) {
      prefs.mutedTypes.push(type);
      this.preferences.set(userId, prefs);
    }
  }

  unmuteType(userId: string, type: NotificationType) {
    const prefs = this.getPreferences(userId);
    prefs.mutedTypes = prefs.mutedTypes.filter((t) => t !== type);
    this.preferences.set(userId, prefs);
  }
}
