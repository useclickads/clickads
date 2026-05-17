import { Module } from '@nestjs/common';
import { BillingService } from './billing.service';
import { BillingController } from './billing.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { StripeProvider } from './providers/stripe.provider';

@Module({
  providers: [BillingService, PrismaService, StripeProvider],
  controllers: [BillingController],
  exports: [BillingService]
})
export class BillingModule {}
