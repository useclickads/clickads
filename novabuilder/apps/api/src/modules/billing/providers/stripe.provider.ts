import { Injectable } from '@nestjs/common';

type StripeCustomer = { id: string; email: string };
type StripeSubscription = { id: string; customerId: string; priceId: string; status: string };
type StripeCheckoutSession = { id: string; url: string };
type StripePortalSession = { url: string };

@Injectable()
export class StripeProvider {
  private readonly secretKey = process.env.STRIPE_SECRET_KEY;
  private readonly priceIds: Record<string, string> = {
    pro: process.env.STRIPE_PRICE_PRO || 'price_pro_placeholder',
    business: process.env.STRIPE_PRICE_BUSINESS || 'price_business_placeholder',
  };

  private get isConfigured(): boolean {
    return !!this.secretKey && this.secretKey !== 'sk_test_placeholder';
  }

  async createCustomer(email: string, name?: string | null): Promise<StripeCustomer> {
    if (!this.isConfigured) {
      return { id: `cus_mock_${Date.now().toString(36)}`, email };
    }

    const body: Record<string, string> = { email };
    if (name) body.name = name;
    const res = await this.request('POST', '/v1/customers', body);
    return { id: res.id, email: res.email };
  }

  async createCheckoutSession(customerId: string, plan: string, successUrl: string, cancelUrl: string): Promise<StripeCheckoutSession> {
    const priceId = this.priceIds[plan];
    if (!priceId) throw new Error(`No price ID for plan: ${plan}`);

    if (!this.isConfigured) {
      return { id: `cs_mock_${Date.now().toString(36)}`, url: successUrl };
    }

    const res = await this.request('POST', '/v1/checkout/sessions', {
      customer: customerId,
      mode: 'subscription',
      'line_items[0][price]': priceId,
      'line_items[0][quantity]': '1',
      success_url: successUrl,
      cancel_url: cancelUrl,
    });
    return { id: res.id, url: res.url };
  }

  async createPortalSession(customerId: string, returnUrl: string): Promise<StripePortalSession> {
    if (!this.isConfigured) {
      return { url: returnUrl };
    }

    const res = await this.request('POST', '/v1/billing_portal/sessions', {
      customer: customerId,
      return_url: returnUrl,
    });
    return { url: res.url };
  }

  async cancelSubscription(subscriptionId: string): Promise<StripeSubscription> {
    if (!this.isConfigured) {
      return { id: subscriptionId, customerId: 'cus_mock', priceId: '', status: 'canceled' };
    }

    const res = await this.request('DELETE', `/v1/subscriptions/${subscriptionId}`);
    return { id: res.id, customerId: res.customer, priceId: res.items?.data?.[0]?.price?.id || '', status: res.status };
  }

  async getSubscription(subscriptionId: string): Promise<StripeSubscription> {
    if (!this.isConfigured) {
      return { id: subscriptionId, customerId: 'cus_mock', priceId: '', status: 'active' };
    }

    const res = await this.request('GET', `/v1/subscriptions/${subscriptionId}`);
    return { id: res.id, customerId: res.customer, priceId: res.items?.data?.[0]?.price?.id || '', status: res.status };
  }

  verifyWebhookSignature(payload: string, signature: string): boolean {
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!secret) return false;

    const crypto = require('crypto');
    const elements = signature.split(',');
    const timestamp = elements.find((e: string) => e.startsWith('t='))?.slice(2);
    const sig = elements.find((e: string) => e.startsWith('v1='))?.slice(3);

    if (!timestamp || !sig) return false;

    const signedPayload = `${timestamp}.${payload}`;
    const expected = crypto.createHmac('sha256', secret).update(signedPayload).digest('hex');
    return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  }

  private async request(method: string, path: string, body?: Record<string, string>): Promise<any> {
    const url = `https://api.stripe.com${path}`;
    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.secretKey}`,
    };

    const options: RequestInit = { method, headers };

    if (body && method !== 'GET') {
      headers['Content-Type'] = 'application/x-www-form-urlencoded';
      options.body = new URLSearchParams(body).toString();
    }

    const res = await fetch(url, options);
    return res.json();
  }
}
