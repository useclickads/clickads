import { describe, it, expect, beforeEach } from 'vitest';
import { StripeProvider } from '../providers/stripe.provider';

describe('StripeProvider', () => {
  let provider: StripeProvider;

  beforeEach(() => {
    provider = new StripeProvider();
  });

  describe('createCustomer (mock mode)', () => {
    it('returns a mock customer with cus_ prefix', async () => {
      const customer = await provider.createCustomer('test@example.com', 'Test User');
      expect(customer.id).toMatch(/^cus_mock_/);
      expect(customer.email).toBe('test@example.com');
    });
  });

  describe('createCheckoutSession (mock mode)', () => {
    it('returns a session with the success URL', async () => {
      const session = await provider.createCheckoutSession('cus_123', 'pro', 'https://app/success', 'https://app/cancel');
      expect(session.id).toMatch(/^cs_mock_/);
      expect(session.url).toBe('https://app/success');
    });

    it('throws for invalid plan', async () => {
      await expect(provider.createCheckoutSession('cus_123', 'invalid_plan', 'url', 'url'))
        .rejects.toThrow('No price ID for plan');
    });
  });

  describe('createPortalSession (mock mode)', () => {
    it('returns the return URL', async () => {
      const session = await provider.createPortalSession('cus_123', 'https://app/billing');
      expect(session.url).toBe('https://app/billing');
    });
  });

  describe('cancelSubscription (mock mode)', () => {
    it('returns canceled status', async () => {
      const result = await provider.cancelSubscription('sub_123');
      expect(result.status).toBe('canceled');
      expect(result.id).toBe('sub_123');
    });
  });

  describe('getSubscription (mock mode)', () => {
    it('returns active status', async () => {
      const result = await provider.getSubscription('sub_456');
      expect(result.status).toBe('active');
      expect(result.id).toBe('sub_456');
    });
  });

  describe('verifyWebhookSignature', () => {
    it('returns false when no secret is configured', () => {
      const result = provider.verifyWebhookSignature('payload', 't=123,v1=abc');
      expect(result).toBe(false);
    });
  });
});
