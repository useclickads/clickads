import { Module } from '@nestjs/common';
import { RedirectsController } from './redirects.controller';
import { RedirectsService } from './redirects.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [RedirectsController],
  providers: [RedirectsService, PrismaService],
  exports: [RedirectsService],
})
export class RedirectsModule {}
