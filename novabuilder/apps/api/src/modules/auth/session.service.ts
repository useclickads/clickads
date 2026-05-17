import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class SessionService implements OnModuleInit, OnModuleDestroy {
  redis!: Redis;

  onModuleInit() {
    this.redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
  }

  onModuleDestroy() {
    this.redis.disconnect();
  }

  async set(key: string, value: string, ttlSec?: number) {
    if (ttlSec) await this.redis.set(key, value, 'EX', ttlSec);
    else await this.redis.set(key, value);
  }

  async get(key: string) {
    return this.redis.get(key);
  }
}
