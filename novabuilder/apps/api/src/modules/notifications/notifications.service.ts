import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, type: string, payload: Record<string, unknown>) {
    return this.prisma.client.notification.create({
      data: { userId, type, payload: payload as any },
    });
  }

  async list(userId: string, unreadOnly = false) {
    return this.prisma.client.notification.findMany({
      where: { userId, ...(unreadOnly ? { read: false } : {}) },
      orderBy: { createdAt: 'desc' },
      take: 50,
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

  async unreadCount(userId: string) {
    return this.prisma.client.notification.count({
      where: { userId, read: false },
    });
  }
}
