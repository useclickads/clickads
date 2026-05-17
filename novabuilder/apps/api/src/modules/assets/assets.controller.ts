import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { randomUUID } from 'crypto';
import { AssetsService } from './assets.service';

const UPLOADS_DIR = join(process.cwd(), 'uploads');

@Controller('projects/:projectId/assets')
@UseGuards(AuthGuard('jwt'))
export class AssetsController {
  constructor(private readonly assets: AssetsService) {}

  @Get()
  async list(@Param('projectId') projectId: string, @Query('folderId') folderId?: string) {
    return this.assets.listByProject(projectId, folderId);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: UPLOADS_DIR,
      filename: (_req, file, cb) => {
        const ext = extname(file.originalname);
        cb(null, `${randomUUID()}${ext}`);
      },
    }),
    limits: { fileSize: 10 * 1024 * 1024 },
  }))
  async upload(
    @Param('projectId') projectId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { folderId?: string },
  ) {
    if (!file) return { error: 'No file provided.' };
    const url = `/uploads/${file.filename}`;
    return this.assets.create(projectId, {
      filename: file.originalname,
      url,
      size: file.size,
      mimeType: file.mimetype,
      folderId: body.folderId,
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
}
