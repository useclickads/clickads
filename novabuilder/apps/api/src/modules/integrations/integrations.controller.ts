import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IntegrationsService } from './integrations.service';

@Controller('projects/:projectId/integrations')
@UseGuards(AuthGuard('jwt'))
export class IntegrationsController {
  constructor(private readonly integrations: IntegrationsService) {}

  @Get()
  async list(@Param('projectId') projectId: string) {
    return this.integrations.list(projectId);
  }

  @Post()
  async create(
    @Param('projectId') projectId: string,
    @Body() body: { provider: 'slack' | 'zapier' | 'discord' | 'custom_webhook'; config: Record<string, unknown> },
  ) {
    if (!body.provider || !body.config) return { error: 'Provider and config are required.' };
    return this.integrations.create(projectId, body.provider, body.config);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: { config: Record<string, unknown> }) {
    return this.integrations.update(id, body.config);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.integrations.delete(id);
  }

  @Post(':id/test')
  async test(@Param('id') id: string) {
    return this.integrations.testIntegration(id);
  }
}
