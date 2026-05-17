import { CanActivate, ExecutionContext, Injectable, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

const THROTTLE_KEY = 'throttle';

export const Throttle = (limit: number, windowSeconds: number) =>
  SetMetadata(THROTTLE_KEY, { limit, windowSeconds });

const store = new Map<string, { count: number; resetAt: number }>();

@Injectable()
export class ThrottleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const config = this.reflector.getAllAndOverride<{ limit: number; windowSeconds: number }>(THROTTLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!config) return true;

    const req = context.switchToHttp().getRequest();
    const key = `${req.ip}:${req.route?.path || req.url}`;
    const now = Date.now();

    const entry = store.get(key);
    if (!entry || now > entry.resetAt) {
      store.set(key, { count: 1, resetAt: now + config.windowSeconds * 1000 });
      return true;
    }

    if (entry.count >= config.limit) {
      const res = context.switchToHttp().getResponse();
      res.status(429).json({ error: 'Too many requests. Please try again later.' });
      return false;
    }

    entry.count++;
    return true;
  }
}
