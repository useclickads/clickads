import { Module } from '@nestjs/common';
import { DomainsController } from './domains.controller';
import { DomainsService } from './domains.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [DomainsController],
  providers: [DomainsService, PrismaService],
  exports: [DomainsService],
})
export class DomainsModule {}
