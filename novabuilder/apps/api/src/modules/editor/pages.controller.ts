import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PagesService } from './pages.service';

@Controller('projects/:projectId/pages')
@UseGuards(AuthGuard('jwt'))
export class PagesController {
  constructor(private readonly pages: PagesService) {}

  @Get()
  async list(@Param('projectId') projectId: string) {
    return this.pages.listByProject(projectId);
  }

  @Post()
  async create(@Param('projectId') projectId: string, @Body() body: { title: string; slug: string; path: string }) {
    if (!body.title || !body.slug || !body.path) {
      return { error: 'Title, slug, and path are required.' };
    }
    return this.pages.create(projectId, body);
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    const page = await this.pages.getById(id);
    if (!page) return { error: 'Page not found.' };
    return page;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: { title?: string; slug?: string; path?: string; published?: boolean }) {
    return this.pages.update(id, body);
  }

  @Put(':id/content')
  @HttpCode(HttpStatus.OK)
  async saveContent(@Param('id') id: string, @Body() body: { blocks: unknown[] }) {
    const page = await this.pages.getById(id);
    if (!page) return { error: 'Page not found.' };
    const updated = await this.pages.updateContent(id, { blocks: body.blocks });
    return { ok: true, updatedAt: updated.updatedAt };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string) {
    await this.pages.softDelete(id);
    return { ok: true };
  }
}
