import { Injectable, NestMiddleware } from '@nestjs/common';

type CacheEntry = { data: string; contentType: string; expiresAt: number };

@Injectable()
export class CacheMiddleware implements NestMiddleware {
  private cache = new Map<string, CacheEntry>();
  private readonly maxEntries = 500;
  private readonly defaultTtl = 60_000;

  private readonly cacheable: Array<{ pattern: RegExp; ttl: number }> = [
    { pattern: /^\/api\/templates(\?|$)/, ttl: 300_000 },
    { pattern: /^\/api\/templates\/categories/, ttl: 300_000 },
    { pattern: /^\/api\/docs\//, ttl: 600_000 },
    { pattern: /^\/api\/projects\/[^/]+\/seo\/sitemap/, ttl: 120_000 },
    { pattern: /^\/api\/projects\/[^/]+\/seo\/robots/, ttl: 120_000 },
    { pattern: /^\/api\/projects\/[^/]+\/performance\/script/, ttl: 300_000 },
  ];

  use(req: any, res: any, next: () => void) {
    if (req.method !== 'GET') {
      next();
      return;
    }

    const url: string = req.originalUrl || req.url;
    const match = this.cacheable.find((c) => c.pattern.test(url));
    if (!match) {
      next();
      return;
    }

    const now = Date.now();
    const cached = this.cache.get(url);
    if (cached && cached.expiresAt > now) {
      res.setHeader('X-Cache', 'HIT');
      res.setHeader('Content-Type', cached.contentType);
      res.status(200).send(cached.data);
      return;
    }

    const originalJson = res.json.bind(res);
    res.json = (body: unknown) => {
      const data = JSON.stringify(body);
      this.cache.set(url, {
        data,
        contentType: 'application/json',
        expiresAt: now + match.ttl,
      });
      this.evictExpired(now);
      res.setHeader('X-Cache', 'MISS');
      return originalJson(body);
    };

    next();
  }

  invalidatePattern(pattern: string) {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) this.cache.delete(key);
    }
  }

  getStats() {
    const now = Date.now();
    let active = 0;
    let expired = 0;
    for (const entry of this.cache.values()) {
      if (entry.expiresAt > now) active++;
      else expired++;
    }
    return { totalEntries: this.cache.size, active, expired, maxEntries: this.maxEntries };
  }

  private evictExpired(now: number) {
    if (this.cache.size <= this.maxEntries) return;
    for (const [key, entry] of this.cache) {
      if (entry.expiresAt <= now) this.cache.delete(key);
    }
    if (this.cache.size > this.maxEntries) {
      const oldest = [...this.cache.entries()].sort((a, b) => a[1].expiresAt - b[1].expiresAt);
      const toRemove = oldest.slice(0, this.cache.size - this.maxEntries);
      for (const [key] of toRemove) this.cache.delete(key);
    }
  }
}
