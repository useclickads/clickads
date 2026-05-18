import { Module } from '@nestjs/common';
import { EnvVarsController } from './envvars.controller';
import { EnvVarsService } from './envvars.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [EnvVarsController],
  providers: [EnvVarsService, PrismaService],
  exports: [EnvVarsService],
})
export class EnvVarsModule {}
