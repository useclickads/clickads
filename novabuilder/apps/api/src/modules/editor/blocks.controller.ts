import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BlocksService } from './blocks.service';

@Controller('projects/:projectId/components')
@UseGuards(AuthGuard('jwt'))
export class BlocksController {
  constructor(private readonly blocks: BlocksService) {}

  @Get()
  async list(@Param('projectId') projectId: string, @Query('category') category?: string) {
    if (category) return this.blocks.listByCategory(projectId, category);
    return this.blocks.listByProject(projectId);
  }

  @Post()
  async create(
    @Param('projectId') projectId: string,
    @Body() body: { name: string; category: string; schema: unknown; preview?: string },
  ) {
    if (!body.name || !body.category || !body.schema) return { error: 'Name, category, and schema are required.' };
    return this.blocks.saveComponent(projectId, body);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: { name?: string; category?: string; schema?: unknown; preview?: string }) {
    return this.blocks.updateComponent(id, body);
  }

  @Post(':id/duplicate')
  async duplicate(@Param('id') id: string) {
    const result = await this.blocks.duplicateComponent(id);
    if (!result) return { error: 'Component not found.' };
    return result;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.blocks.deleteComponent(id);
    return { ok: true };
  }
}
