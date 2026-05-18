import { Module } from '@nestjs/common';
import { StagingController } from './staging.controller';
import { StagingService } from './staging.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [StagingController],
  providers: [StagingService, PrismaService],
  exports: [StagingService],
})
export class StagingModule {}
