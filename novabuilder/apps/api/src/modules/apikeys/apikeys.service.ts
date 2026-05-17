import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class ApiKeysService {
  constructor(private readonly prisma: PrismaService) {}

  async list(userId: string) {
    return this.prisma.client.apiKey.findMany({
      where: { ownerId: userId, revokedAt: null },
      select: { id: true, key: true, scopes: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(userId: string, scopes: string[]) {
    const key = `nova_${crypto.randomBytes(24).toString('hex')}`;
    return this.prisma.client.apiKey.create({
      data: { key, ownerId: userId, scopes },
      select: { id: true, key: true, scopes: true, createdAt: true },
    });
  }

  async revoke(id: string) {
    return this.prisma.client.apiKey.update({
      where: { id },
      data: { revokedAt: new Date() },
    });
  }

  async validate(key: string) {
    const apiKey = await this.prisma.client.apiKey.findUnique({ where: { key } });
    if (!apiKey || apiKey.revokedAt) return null;
    return apiKey;
  }
}
