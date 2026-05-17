import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { WebhooksService } from './webhooks.service';

@Controller('projects/:projectId/webhooks')
@UseGuards(AuthGuard('jwt'))
export class WebhooksController {
  constructor(private readonly webhooks: WebhooksService) {}

  @Get()
  async list(@Param('projectId') projectId: string) {
    return this.webhooks.list(projectId);
  }

  @Post()
  async create(@Param('projectId') projectId: string, @Body() body: { url: string; events: string[] }) {
    if (!body.url || !body.events?.length) return { error: 'URL and events are required.' };
    return this.webhooks.create(projectId, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    await this.webhooks.delete(id);
    return { ok: true };
  }

  @Post('test')
  async test(@Param('projectId') projectId: string, @Body() body: { event: string }) {
    const results = await this.webhooks.fire(projectId, body.event || 'test', { test: true });
    return { results };
  }
}
