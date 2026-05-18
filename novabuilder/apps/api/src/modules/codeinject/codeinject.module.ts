import { Module } from '@nestjs/common';
import { CodeInjectController } from './codeinject.controller';
import { CodeInjectService } from './codeinject.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [CodeInjectController],
  providers: [CodeInjectService, PrismaService],
  exports: [CodeInjectService],
})
export class CodeInjectModule {}
