import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CmsService } from './cms.service';

@Controller('projects/:projectId/cms')
@UseGuards(AuthGuard('jwt'))
export class CmsController {
  constructor(private readonly cms: CmsService) {}

  @Get('collections')
  async listCollections(@Param('projectId') projectId: string) {
    return this.cms.listCollections(projectId);
  }

  @Post('collections')
  async createCollection(@Param('projectId') projectId: string, @Body() body: { name: string; slug: string }) {
    if (!body.name || !body.slug) return { error: 'Name and slug are required.' };
    return this.cms.createCollection(projectId, body);
  }

  @Get('collections/:id')
  async getCollection(@Param('id') id: string) {
    const col = await this.cms.getCollection(id);
    if (!col) return { error: 'Collection not found.' };
    return col;
  }

  @Delete('collections/:id')
  @HttpCode(HttpStatus.OK)
  async deleteCollection(@Param('id') id: string) {
    await this.cms.deleteCollection(id);
    return { ok: true };
  }

  @Post('collections/:id/fields')
  async addField(@Param('id') id: string, @Body() body: { name: string; type: string; options?: unknown; validations?: unknown }) {
    if (!body.name || !body.type) return { error: 'Name and type are required.' };
    return this.cms.addField(id, body);
  }

  @Delete('fields/:fieldId')
  @HttpCode(HttpStatus.OK)
  async removeField(@Param('fieldId') fieldId: string) {
    await this.cms.removeField(fieldId);
    return { ok: true };
  }

  @Get('collections/:id/entries')
  async listEntries(@Param('id') id: string) {
    return this.cms.listEntries(id);
  }

  @Post('collections/:id/entries')
  async createEntry(@Param('id') id: string, @Body() body: { data: Record<string, unknown>; locale?: string }) {
    return this.cms.createEntry(id, body.data, body.locale);
  }

  @Patch('entries/:entryId')
  async updateEntry(@Param('entryId') entryId: string, @Body() body: { data: Record<string, unknown> }) {
    return this.cms.updateEntry(entryId, body.data);
  }

  @Patch('entries/:entryId/publish')
  async publishEntry(@Param('entryId') entryId: string) {
    return this.cms.publishEntry(entryId);
  }

  @Delete('entries/:entryId')
  @HttpCode(HttpStatus.OK)
  async deleteEntry(@Param('entryId') entryId: string) {
    await this.cms.deleteEntry(entryId);
    return { ok: true };
  }
}
