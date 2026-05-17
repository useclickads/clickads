import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

const PLANS = {
  free: { name: 'Free', price: 0, limits: { projects: 3, pages: 10, storage: 100 } },
  pro: { name: 'Pro', price: 29, limits: { projects: 20, pages: 100, storage: 5000 } },
  business: { name: 'Business', price: 99, limits: { projects: -1, pages: -1, storage: 50000 } },
};

@Injectable()
export class BillingService {
  constructor(private readonly prisma: PrismaService) {}

  getPlans() {
    return PLANS;
  }

  async getSubscription(userId: string) {
    return this.prisma.client.subscription.findFirst({
      where: { userId, status: 'active' },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createSubscription(userId: string, plan: string) {
    const existing = await this.getSubscription(userId);
    if (existing) {
      return this.prisma.client.subscription.update({
        where: { id: existing.id },
        data: { plan, status: 'active' },
      });
    }
    return this.prisma.client.subscription.create({
      data: { userId, plan, status: 'active', startedAt: new Date() },
    });
  }

  async cancelSubscription(userId: string) {
    const sub = await this.getSubscription(userId);
    if (!sub) return null;
    return this.prisma.client.subscription.update({
      where: { id: sub.id },
      data: { status: 'cancelled', endedAt: new Date() },
    });
  }

  async getInvoices(userId: string) {
    const sub = await this.getSubscription(userId);
    if (!sub) return [];
    return this.prisma.client.billingInvoice.findMany({
      where: { subscriptionId: sub.id },
      orderBy: { issuedAt: 'desc' },
      take: 20,
    });
  }

  async recordUsage(subscriptionId: string, metric: string, quantity: number) {
    const now = new Date();
    const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return this.prisma.client.billingUsage.create({
      data: { subscriptionId, metric, quantity, periodStart, periodEnd },
    });
  }

  async getUsage(userId: string) {
    const sub = await this.getSubscription(userId);
    if (!sub) return [];
    const now = new Date();
    const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
    return this.prisma.client.billingUsage.findMany({
      where: { subscriptionId: sub.id, periodStart: { gte: periodStart } },
    });
  }
}
