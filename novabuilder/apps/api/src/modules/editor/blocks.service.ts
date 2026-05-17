import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BlocksService {
  constructor(private readonly prisma: PrismaService) {}

  async listByProject(projectId: string) {
    return this.prisma.client.block.findMany({ where: { projectId } });
  }
}
