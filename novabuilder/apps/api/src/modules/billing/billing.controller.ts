import { Body, Controller, Post } from '@nestjs/common';
import { BillingService } from './billing.service';

@Controller('billing')
export class BillingController {
  constructor(private readonly billing: BillingService) {}

  @Post('subscribe')
  async subscribe(@Body() body: { userId: string; plan: string }) {
    const sub = await this.billing.createSubscription(body.userId, body.plan);
    return { subscription: sub };
  }

  @Post('usage')
  async usage(@Body() body: { subscriptionId: string; metric: string; quantity: number }) {
    const res = await this.billing.recordUsage(body.subscriptionId, body.metric, body.quantity);
    return { ok: true, record: res };
  }
}
