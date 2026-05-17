import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AssetsService } from './assets.service';

@Controller('projects/:projectId/assets')
@UseGuards(AuthGuard('jwt'))
export class AssetsController {
  constructor(private readonly assets: AssetsService) {}

  @Get()
  async list(@Param('projectId') projectId: string, @Query('folderId') folderId?: string) {
    return this.assets.listByProject(projectId, folderId);
  }

  @Post()
  async create(@Param('projectId') projectId: string, @Body() body: { filename: string; url: string; size?: number; mimeType?: string; folderId?: string; metadata?: unknown }) {
    if (!body.filename || !body.url) return { error: 'Filename and url are required.' };
    return this.assets.create(projectId, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string) {
    await this.assets.delete(id);
    return { ok: true };
  }

  @Get('folders')
  async listFolders(@Param('projectId') projectId: string) {
    return this.assets.listFolders(projectId);
  }

  @Post('folders')
  async createFolder(@Param('projectId') projectId: string, @Body() body: { name: string; parentId?: string }) {
    if (!body.name) return { error: 'Folder name is required.' };
    return this.assets.createFolder(projectId, body.name, body.parentId);
  }

  @Delete('folders/:id')
  @HttpCode(HttpStatus.OK)
  async deleteFolder(@Param('id') id: string) {
    await this.assets.deleteFolder(id);
    return { ok: true };
  }
}
