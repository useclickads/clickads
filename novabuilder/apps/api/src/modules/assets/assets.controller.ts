import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { AssetsService } from './assets.service';
import { StorageService } from './providers/storage.provider';
import { ImageOptimizerService } from './image-optimizer.service';

@Controller('projects/:projectId/assets')
@UseGuards(AuthGuard('jwt'))
export class AssetsController {
  constructor(
    private readonly assets: AssetsService,
    private readonly storage: StorageService,
    private readonly imageOptimizer: ImageOptimizerService,
  ) {}

  @Get()
  async list(@Param('projectId') projectId: string, @Query('folderId') folderId?: string) {
    return this.assets.listByProject(projectId, folderId);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 10 * 1024 * 1024 } }))
  async upload(
    @Param('projectId') projectId: string,
    @UploadedFile() file: { buffer: Buffer; originalname: string; mimetype: string; size: number },
    @Body() body: { folderId?: string },
  ) {
    if (!file) return { error: 'No file provided.' };

    const result = await this.storage.upload(file.buffer, file.originalname, file.mimetype);

    return this.assets.create(projectId, {
      filename: file.originalname,
      url: result.url,
      size: result.size,
      mimeType: file.mimetype,
      folderId: body.folderId,
      metadata: { storageKey: result.key },
    });
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

  @Get('images/settings')
  async getImageSettings(@Param('projectId') projectId: string) {
    return this.imageOptimizer.getOptimizationSettings(projectId);
  }

  @Post('images/settings')
  async updateImageSettings(
    @Param('projectId') projectId: string,
    @Body() body: { breakpoints?: number[]; formats?: string[]; quality?: number; lazyLoading?: boolean; srcSet?: boolean },
  ) {
    return this.imageOptimizer.updateOptimizationSettings(projectId, body);
  }

  @Post('images/responsive')
  async generateResponsiveHtml(
    @Param('projectId') projectId: string,
    @Body() body: { src: string; alt: string },
  ) {
    const settings = await this.imageOptimizer.getOptimizationSettings(projectId);
    const html = this.imageOptimizer.generateResponsiveHtml(body.src, body.alt, settings);
    return { html };
  }

  @Get('images/audit')
  async auditImages(@Param('projectId') projectId: string) {
    const pages = await this.assets.getProjectPagesForAudit(projectId);
    return this.imageOptimizer.analyzeProjectImages(pages);
  }
}
