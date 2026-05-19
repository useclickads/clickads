import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async check() {
    const checks: Record<string, { status: string; latency?: number }> = {};

    const dbStart = Date.now();
    try {
      await this.prisma.client.$queryRaw`SELECT 1`;
      checks.database = { status: 'healthy', latency: Date.now() - dbStart };
    } catch {
      checks.database = { status: 'unhealthy', latency: Date.now() - dbStart };
    }

    const mem = process.memoryUsage();
    checks.memory = {
      status: mem.heapUsed / mem.heapTotal < 0.9 ? 'healthy' : 'warning',
      latency: 0,
    };

    const allHealthy = Object.values(checks).every((c) => c.status === 'healthy');

    return {
      status: allHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
      version: '1.0.0',
      node: process.version,
      checks,
      memory: {
        rss: Math.round(mem.rss / 1024 / 1024),
        heapUsed: Math.round(mem.heapUsed / 1024 / 1024),
        heapTotal: Math.round(mem.heapTotal / 1024 / 1024),
      },
    };
  }

  @Get('ready')
  async ready() {
    try {
      await this.prisma.client.$queryRaw`SELECT 1`;
      return { ready: true };
    } catch {
      return { ready: false };
    }
  }

  @Get('live')
  async live() {
    return { alive: true, timestamp: new Date().toISOString() };
  }
}
