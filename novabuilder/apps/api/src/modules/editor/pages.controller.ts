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

  @Patch(':id/publish')
  async publish(@Param('id') id: string) {
    const page = await this.pages.getById(id);
    if (!page) return { error: 'Page not found.' };
    const updated = await this.pages.update(id, { published: true });
    return { ok: true, published: true, updatedAt: updated.updatedAt };
  }

  @Patch(':id/unpublish')
  async unpublish(@Param('id') id: string) {
    const page = await this.pages.getById(id);
    if (!page) return { error: 'Page not found.' };
    const updated = await this.pages.update(id, { published: false });
    return { ok: true, published: false, updatedAt: updated.updatedAt };
  }

  @Put(':id/seo')
  @HttpCode(HttpStatus.OK)
  async saveSeo(@Param('id') id: string, @Body() body: { metaTitle?: string; metaDescription?: string; ogImage?: string; noIndex?: boolean }) {
    const page = await this.pages.getById(id);
    if (!page) return { error: 'Page not found.' };
    const updated = await this.pages.updateSeo(id, body);
    return { ok: true, updatedAt: updated.updatedAt };
  }

  @Get(':id/seo')
  async getSeo(@Param('id') id: string) {
    const page = await this.pages.getById(id);
    if (!page) return { error: 'Page not found.' };
    return page.seo || { metaTitle: '', metaDescription: '', ogImage: '', noIndex: false };
  }

  @Get(':id/versions')
  async listVersions(@Param('projectId') projectId: string, @Param('id') id: string) {
    return this.pages.listVersions(id, projectId);
  }

  @Post(':id/versions/:snapshotId/restore')
  async restoreVersion(@Param('id') id: string, @Param('snapshotId') snapshotId: string) {
    const result = await this.pages.restoreVersion(id, snapshotId);
    if (!result) return { error: 'Snapshot not found.' };
    return { ok: true, updatedAt: result.updatedAt };
  }

  @Patch(':id/schedule')
  async schedule(@Param('id') id: string, @Body() body: { scheduledAt: string }) {
    if (!body.scheduledAt) return { error: 'scheduledAt is required.' };
    const date = new Date(body.scheduledAt);
    if (isNaN(date.getTime()) || date.getTime() <= Date.now()) return { error: 'scheduledAt must be a future date.' };
    const page = await this.pages.getById(id);
    if (!page) return { error: 'Page not found.' };
    const updated = await this.pages.schedule(id, date);
    return { ok: true, scheduledAt: updated.scheduledAt };
  }

  @Patch(':id/unschedule')
  async unschedule(@Param('id') id: string) {
    const page = await this.pages.getById(id);
    if (!page) return { error: 'Page not found.' };
    await this.pages.cancelSchedule(id);
    return { ok: true };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string) {
    await this.pages.softDelete(id);
    return { ok: true };
  }
}
