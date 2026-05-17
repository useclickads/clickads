import { Injectable, OnModuleDestroy } from '@nestjs/common';
import prisma from '../../prisma/prismaClient';

@Injectable()
export class PrismaService implements OnModuleDestroy {
  get client() {
    return prisma;
  }

  async onModuleDestroy() {
    try {
      await prisma.$disconnect();
    } catch (e) {
      const error = e instanceof Error ? e.message : String(e);
      // eslint-disable-next-line no-console
      console.warn('Prisma disconnect during app shutdown failed', error);
    }
  }
}

export default prisma;
