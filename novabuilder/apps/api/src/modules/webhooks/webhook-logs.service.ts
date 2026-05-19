import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

type DeliveryLog = {
  id: string;
  webhookId: string;
  event: string;
  url: string;
  statusCode: number | null;
  requestBody: string;
  responseBody: string | null;
  duration: number;
  success: boolean;
  error: string | null;
  createdAt: string;
};

@Injectable()
export class WebhookLogsService {
  private logs: DeliveryLog[] = [];

  async logDelivery(
    webhookId: string,
    event: string,
    url: string,
    requestBody: string,
    statusCode: number | null,
    responseBody: string | null,
    duration: number,
    error: string | null,
  ) {
    const log: DeliveryLog = {
      id: `whl_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      webhookId,
      event,
      url,
      statusCode,
      requestBody,
      responseBody,
      duration,
      success: statusCode !== null && statusCode >= 200 && statusCode < 300,
      error,
      createdAt: new Date().toISOString(),
    };

    this.logs.push(log);

    if (this.logs.length > 10000) {
      this.logs = this.logs.slice(-5000);
    }

    return log;
  }

  async getDeliveryLogs(webhookId: string, limit = 50): Promise<DeliveryLog[]> {
    return this.logs
      .filter((l) => l.webhookId === webhookId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, limit);
  }

  async getRecentFailures(limit = 20): Promise<DeliveryLog[]> {
    return this.logs
      .filter((l) => !l.success)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, limit);
  }

  async getDeliveryStats(webhookId?: string) {
    const filtered = webhookId ? this.logs.filter((l) => l.webhookId === webhookId) : this.logs;
    const total = filtered.length;
    const successful = filtered.filter((l) => l.success).length;
    const failed = total - successful;
    const avgDuration = total > 0
      ? Math.round(filtered.reduce((sum, l) => sum + l.duration, 0) / total)
      : 0;

    const statusCodes = new Map<number, number>();
    for (const log of filtered) {
      if (log.statusCode) {
        statusCodes.set(log.statusCode, (statusCodes.get(log.statusCode) || 0) + 1);
      }
    }

    return {
      total,
      successful,
      failed,
      successRate: total > 0 ? Math.round((successful / total) * 100) : 0,
      avgDurationMs: avgDuration,
      statusCodes: Object.fromEntries(statusCodes),
    };
  }

  async retryDelivery(logId: string): Promise<DeliveryLog | null> {
    const original = this.logs.find((l) => l.id === logId);
    if (!original) return null;

    const startTime = Date.now();
    try {
      const res = await fetch(original.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: original.requestBody,
        signal: AbortSignal.timeout(10000),
      });
      const responseBody = await res.text();
      const duration = Date.now() - startTime;

      return this.logDelivery(
        original.webhookId, original.event, original.url,
        original.requestBody, res.status, responseBody, duration, null,
      );
    } catch (err: any) {
      const duration = Date.now() - startTime;
      return this.logDelivery(
        original.webhookId, original.event, original.url,
        original.requestBody, null, null, duration, err.message,
      );
    }
  }
}
