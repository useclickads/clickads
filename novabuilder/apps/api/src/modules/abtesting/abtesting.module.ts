import { Module } from '@nestjs/common';
import { ABTestingController } from './abtesting.controller';
import { ABTestingService } from './abtesting.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [ABTestingController],
  providers: [ABTestingService, PrismaService],
  exports: [ABTestingService],
})
export class ABTestingModule {}
