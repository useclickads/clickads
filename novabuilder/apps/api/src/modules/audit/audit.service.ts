import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async log(data: { actorId?: string; action: string; resource: string; resourceId?: string; meta?: Record<string, unknown>; ip?: string }) {
    return this.prisma.client.auditLog.create({
      data: {
        actorId: data.actorId,
        action: data.action,
        resource: data.resource,
        resourceId: data.resourceId,
        meta: data.meta as any,
        ip: data.ip,
      },
    });
  }

  async listByActor(actorId: string, take = 50) {
    return this.prisma.client.auditLog.findMany({
      where: { actorId },
      orderBy: { createdAt: 'desc' },
      take,
    });
  }

  async listByResource(resource: string, resourceId: string, take = 50) {
    return this.prisma.client.auditLog.findMany({
      where: { resource, resourceId },
      orderBy: { createdAt: 'desc' },
      take,
    });
  }

  async listAll(take = 100) {
    return this.prisma.client.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take,
    });
  }
}
