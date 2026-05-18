import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

type IntegrationProvider = 'slack' | 'zapier' | 'discord' | 'custom_webhook';

type IntegrationConfig = {
  slack: { webhookUrl: string; channel?: string; events: string[] };
  zapier: { webhookUrl: string; events: string[] };
  discord: { webhookUrl: string; events: string[] };
  custom_webhook: { url: string; headers?: Record<string, string>; events: string[] };
};

@Injectable()
export class IntegrationsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(projectId: string) {
    return this.prisma.client.integration.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(projectId: string, provider: IntegrationProvider, config: Record<string, unknown>) {
    return this.prisma.client.integration.create({
      data: { projectId, provider, config: config as any },
    });
  }

  async update(id: string, config: Record<string, unknown>) {
    return this.prisma.client.integration.update({
      where: { id },
      data: { config: config as any },
    });
  }

  async delete(id: string) {
    await this.prisma.client.integration.delete({ where: { id } });
    return { ok: true };
  }

  async testIntegration(id: string) {
    const integration = await this.prisma.client.integration.findUnique({ where: { id } });
    if (!integration) return { ok: false, error: 'Integration not found' };

    const testPayload = {
      event: 'test',
      message: 'NovaBuilder integration test',
      timestamp: new Date().toISOString(),
    };

    return this.dispatch(integration.provider, integration.config as any, testPayload);
  }

  async fireEvent(projectId: string, event: string, payload: Record<string, unknown>) {
    const integrations = await this.prisma.client.integration.findMany({
      where: { projectId },
    });

    const results: { id: string; provider: string; status: 'ok' | 'error'; error?: string }[] = [];

    for (const integration of integrations) {
      const config = integration.config as any;
      const events: string[] = config.events || [];
      if (!events.includes(event) && !events.includes('*')) continue;

      const result = await this.dispatch(integration.provider, config, { event, ...payload });
      results.push({ id: integration.id, provider: integration.provider, ...result });
    }

    return results;
  }

  private async dispatch(
    provider: string,
    config: any,
    payload: Record<string, unknown>,
  ): Promise<{ status: 'ok' | 'error'; error?: string }> {
    try {
      switch (provider) {
        case 'slack':
          return this.sendSlack(config, payload);
        case 'discord':
          return this.sendDiscord(config, payload);
        case 'zapier':
        case 'custom_webhook':
          return this.sendWebhook(config, payload);
        default:
          return { status: 'error', error: `Unknown provider: ${provider}` };
      }
    } catch (err) {
      return { status: 'error', error: err instanceof Error ? err.message : 'Unknown error' };
    }
  }

  private async sendSlack(config: IntegrationConfig['slack'], payload: Record<string, unknown>): Promise<{ status: 'ok' | 'error'; error?: string }> {
    const text = this.formatMessage(payload);
    const res = await fetch(config.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        channel: config.channel,
        text,
        blocks: [
          { type: 'header', text: { type: 'plain_text', text: `NovaBuilder: ${payload.event}` } },
          { type: 'section', text: { type: 'mrkdwn', text } },
        ],
      }),
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return { status: 'error', error: `Slack returned ${res.status}` };
    return { status: 'ok' };
  }

  private async sendDiscord(config: IntegrationConfig['discord'], payload: Record<string, unknown>): Promise<{ status: 'ok' | 'error'; error?: string }> {
    const res = await fetch(config.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: this.formatMessage(payload),
        embeds: [{
          title: `NovaBuilder: ${payload.event}`,
          description: JSON.stringify(payload, null, 2).slice(0, 2000),
          color: 0x0f172a,
          timestamp: new Date().toISOString(),
        }],
      }),
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return { status: 'error', error: `Discord returned ${res.status}` };
    return { status: 'ok' };
  }

  private async sendWebhook(config: IntegrationConfig['zapier'] | IntegrationConfig['custom_webhook'], payload: Record<string, unknown>): Promise<{ status: 'ok' | 'error'; error?: string }> {
    const url = 'url' in config ? config.url : config.webhookUrl;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if ('headers' in config && config.headers) {
      Object.assign(headers, config.headers);
    }

    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ ...payload, timestamp: new Date().toISOString(), source: 'novabuilder' }),
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return { status: 'error', error: `Webhook returned ${res.status}` };
    return { status: 'ok' };
  }

  private formatMessage(payload: Record<string, unknown>): string {
    const event = payload.event || 'unknown';
    const parts = [`*Event:* ${event}`];
    if (payload.projectId) parts.push(`*Project:* ${payload.projectId}`);
    if (payload.pageId) parts.push(`*Page:* ${payload.pageId}`);
    if (payload.message) parts.push(`${payload.message}`);
    return parts.join('\n');
  }
}
