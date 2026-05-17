import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ThemeService } from './theme.service';

@Controller('projects/:projectId/theme')
@UseGuards(AuthGuard('jwt'))
export class ThemeController {
  constructor(private readonly theme: ThemeService) {}

  @Get('tokens')
  async getTokens(@Param('projectId') projectId: string) {
    return this.theme.getTokens(projectId);
  }

  @Post('tokens')
  async upsertToken(@Param('projectId') projectId: string, @Body() body: { key: string; value: { type: string; value: string } }) {
    if (!body.key || !body.value) return { error: 'Key and value are required.' };
    return this.theme.upsertToken(projectId, body.key, body.value);
  }

  @Delete('tokens/:id')
  @HttpCode(HttpStatus.OK)
  async deleteToken(@Param('id') id: string) {
    await this.theme.deleteToken(id);
    return { ok: true };
  }

  @Post('versions')
  async saveVersion(@Param('projectId') projectId: string) {
    return this.theme.saveThemeVersion(projectId);
  }

  @Get('versions')
  async listVersions(@Param('projectId') projectId: string) {
    return this.theme.listThemeVersions(projectId);
  }
}
