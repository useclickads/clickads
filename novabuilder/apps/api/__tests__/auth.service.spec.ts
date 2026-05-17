import { describe, expect, it } from 'vitest';
import { AuthService } from '../src/modules/auth/auth.service';

describe('AuthService (smoke)', () => {
  it('has loginWithEmail method', async () => {
    const svc = new AuthService({} as any);
    expect(typeof svc.loginWithEmail).toBe('function');
  });
});
