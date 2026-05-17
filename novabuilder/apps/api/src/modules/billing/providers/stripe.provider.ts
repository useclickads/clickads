import { Injectable } from '@nestjs/common';

@Injectable()
export class StripeProvider {
  constructor() {}

  async createCustomer(email: string) {
    // TODO: integrate stripe SDK
    return { id: `cus_${Math.random().toString(36).slice(2)}`, email };
  }

  async createSubscription(customerId: string, priceId: string) {
    return { id: `sub_${Math.random().toString(36).slice(2)}`, customerId, priceId, status: 'active' };
  }
}
