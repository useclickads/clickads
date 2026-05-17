import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SettingsService } from './settings.service';

@Controller('projects/:projectId/settings')
@UseGuards(AuthGuard('jwt'))
export class SettingsController {
  constructor(private readonly settings: SettingsService) {}

  @Get()
  async get(@Param('projectId') projectId: string) {
    return this.settings.getSettings(projectId);
  }

  @Put()
  async update(@Param('projectId') projectId: string, @Body() body: {
    globalHeader?: unknown;
    globalFooter?: unknown;
    headScripts?: string;
    bodyScripts?: string;
    favicon?: string;
    socialImage?: string;
  }) {
    return this.settings.updateSettings(projectId, body);
  }
}
