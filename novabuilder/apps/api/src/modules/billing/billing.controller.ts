import { Body, Controller, Delete, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BillingService } from './billing.service';

@Controller('billing')
@UseGuards(AuthGuard('jwt'))
export class BillingController {
  constructor(private readonly billing: BillingService) {}

  @Get('plans')
  async plans() {
    return this.billing.getPlans();
  }

  @Get('subscription')
  async getSubscription(@Req() req: any) {
    const sub = await this.billing.getSubscription(req.user.userId);
    return sub || { plan: 'free', status: 'active' };
  }

  @Post('subscribe')
  async subscribe(@Req() req: any, @Body() body: { plan: string }) {
    if (!body.plan) return { error: 'Plan is required.' };
    const sub = await this.billing.createSubscription(req.user.userId, body.plan);
    return { subscription: sub };
  }

  @Delete('subscription')
  async cancel(@Req() req: any) {
    const sub = await this.billing.cancelSubscription(req.user.userId);
    if (!sub) return { error: 'No active subscription.' };
    return { ok: true };
  }

  @Get('invoices')
  async invoices(@Req() req: any) {
    return this.billing.getInvoices(req.user.userId);
  }

  @Get('usage')
  async usage(@Req() req: any) {
    return this.billing.getUsage(req.user.userId);
  }
}
