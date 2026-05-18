import { Injectable } from '@nestjs/common';

const startedAt = new Date();

@Injectable()
export class AppService {
  getStatus() {
    return {
      status: 'ok',
      service: 'novabuilder-api',
      version: '0.1.0',
      uptime: Math.floor((Date.now() - startedAt.getTime()) / 1000),
      startedAt: startedAt.toISOString(),
      node: process.version,
    };
  }
}
