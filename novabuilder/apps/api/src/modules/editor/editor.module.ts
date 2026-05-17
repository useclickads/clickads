import { Module } from '@nestjs/common';
import { PagesController } from './pages.controller';
import { BlocksController } from './blocks.controller';
import { PagesService } from './pages.service';
import { BlocksService } from './blocks.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [PagesController, BlocksController],
  providers: [PagesService, BlocksService, PrismaService]
})
export class EditorModule {}
