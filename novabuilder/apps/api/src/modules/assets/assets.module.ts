import { Module } from '@nestjs/common';
import { AssetsController } from './assets.controller';
import { AssetsService } from './assets.service';
import { StorageService } from './providers/storage.provider';
import { ImageOptimizerService } from './image-optimizer.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [AssetsController],
  providers: [AssetsService, StorageService, ImageOptimizerService, PrismaService],
  exports: [AssetsService, StorageService, ImageOptimizerService],
})
export class AssetsModule {}
