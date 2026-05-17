import { Controller, Get, Param } from '@nestjs/common';
import { BlocksService } from './blocks.service';

@Controller('blocks')
export class BlocksController {
  constructor(private readonly blocks: BlocksService) {}

  @Get(':projectId')
  async listForProject(@Param('projectId') projectId: string) {
    return this.blocks.listByProject(projectId);
  }
}
