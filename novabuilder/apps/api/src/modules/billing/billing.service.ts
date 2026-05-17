import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BillingService {
  constructor(private readonly prisma: PrismaService) {}

  async createSubscription(userId: string, plan: string) {
    // placeholder: integrate with Stripe
    const sub = await this.prisma.client.subscription.create({ data: { userId, plan, status: 'active', startedAt: new Date() } });
    return sub;
  }

  async recordUsage(subscriptionId: string, metric: string, quantity: number) {
    return this.prisma.client.billingUsage.create({ data: { subscriptionId, metric, quantity, periodStart: new Date(), periodEnd: new Date() } });
  }
}
