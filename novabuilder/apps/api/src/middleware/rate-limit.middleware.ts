import { Injectable, NestMiddleware } from '@nestjs/common';

type BucketEntry = { count: number; resetAt: number };

const PLANS: Record<string, { rpm: number; daily: number }> = {
  free: { rpm: 30, daily: 1000 },
  starter: { rpm: 60, daily: 5000 },
  pro: { rpm: 120, daily: 20000 },
  enterprise: { rpm: 300, daily: 100000 },
};

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private minuteBuckets = new Map<string, BucketEntry>();
  private dailyBuckets = new Map<string, BucketEntry>();

  use(req: any, res: any, next: () => void) {
    const userId = req.user?.userId || req.ip || 'anon';
    const plan = req.user?.plan || 'free';
    const limits = PLANS[plan] || PLANS.free;

    const now = Date.now();
    const minuteKey = `${userId}:min`;
    const dailyKey = `${userId}:day`;

    const minuteBucket = this.getBucket(this.minuteBuckets, minuteKey, now, 60_000);
    if (minuteBucket.count >= limits.rpm) {
      res.status(429).json({
        error: 'Rate limit exceeded',
        retryAfter: Math.ceil((minuteBucket.resetAt - now) / 1000),
        limit: limits.rpm,
        window: '1m',
      });
      return;
    }

    const dailyBucket = this.getBucket(this.dailyBuckets, dailyKey, now, 86_400_000);
    if (dailyBucket.count >= limits.daily) {
      res.status(429).json({
        error: 'Daily rate limit exceeded',
        retryAfter: Math.ceil((dailyBucket.resetAt - now) / 1000),
        limit: limits.daily,
        window: '24h',
      });
      return;
    }

    minuteBucket.count++;
    dailyBucket.count++;

    res.setHeader('X-RateLimit-Limit', limits.rpm);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, limits.rpm - minuteBucket.count));
    res.setHeader('X-RateLimit-Reset', Math.ceil(minuteBucket.resetAt / 1000));
    res.setHeader('X-RateLimit-Daily-Limit', limits.daily);
    res.setHeader('X-RateLimit-Daily-Remaining', Math.max(0, limits.daily - dailyBucket.count));

    next();
  }

  private getBucket(map: Map<string, BucketEntry>, key: string, now: number, windowMs: number): BucketEntry {
    const existing = map.get(key);
    if (existing && existing.resetAt > now) return existing;

    const entry: BucketEntry = { count: 0, resetAt: now + windowMs };
    map.set(key, entry);

    if (map.size > 10000) {
      for (const [k, v] of map) {
        if (v.resetAt <= now) map.delete(k);
      }
    }

    return entry;
  }
}
