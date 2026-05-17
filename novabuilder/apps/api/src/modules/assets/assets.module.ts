import { Module } from '@nestjs/common';
import { AssetsController } from './assets.controller';
import { AssetsService } from './assets.service';
import { StorageService } from './providers/storage.provider';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [AssetsController],
  providers: [AssetsService, StorageService, PrismaService],
  exports: [AssetsService, StorageService],
})
export class AssetsModule {}
