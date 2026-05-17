import { Module } from '@nestjs/common';
import { ApiKeysController } from './apikeys.controller';
import { ApiKeysService } from './apikeys.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [ApiKeysController],
  providers: [ApiKeysService, PrismaService],
  exports: [ApiKeysService],
})
export class ApiKeysModule {}
