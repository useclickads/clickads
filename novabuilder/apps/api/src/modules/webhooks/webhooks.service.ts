import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class WebhooksService {
  constructor(private readonly prisma: PrismaService) {}

  async list(projectId: string) {
    return this.prisma.client.webhook.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(projectId: string, data: { url: string; events: string[] }) {
    const secret = crypto.randomBytes(32).toString('hex');
    return this.prisma.client.webhook.create({
      data: { projectId, url: data.url, events: data.events, secret },
    });
  }

  async delete(id: string) {
    return this.prisma.client.webhook.delete({ where: { id } });
  }

  async fire(projectId: string, event: string, payload: Record<string, unknown>) {
    const hooks = await this.prisma.client.webhook.findMany({
      where: { projectId, events: { has: event } },
    });

    const results: { webhookId: string; status: number | null; error?: string }[] = [];
    for (const hook of hooks) {
      try {
        const body = JSON.stringify({ event, payload, timestamp: new Date().toISOString() });
        const signature = crypto.createHmac('sha256', hook.secret || '').update(body).digest('hex');
        const res = await fetch(hook.url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Webhook-Signature': signature },
          body,
          signal: AbortSignal.timeout(10000),
        });
        results.push({ webhookId: hook.id, status: res.status });
      } catch (err) {
        results.push({ webhookId: hook.id, status: null, error: err instanceof Error ? err.message : 'Failed' });
      }
    }
    return results;
  }
}
