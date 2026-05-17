import { Injectable, NestMiddleware } from '@nestjs/common';
import { RateLimiterMemory } from 'rate-limiter-flexible';

const limiter = new RateLimiterMemory({ points: 100, duration: 60 });

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    limiter.consume(req.ip)
      .then(() => next())
      .catch(() => res.status(429).send('Too many requests'));
  }
}
