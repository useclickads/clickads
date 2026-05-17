import { Module } from '@nestjs/common';
import { DeployController } from './deploy.controller';
import { DeployService } from './deploy.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [DeployController],
  providers: [DeployService, PrismaService],
  exports: [DeployService],
})
export class DeployModule {}
