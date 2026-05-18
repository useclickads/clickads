import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RedirectsService } from './redirects.service';

@Controller('projects/:projectId/redirects')
@UseGuards(AuthGuard('jwt'))
export class RedirectsController {
  constructor(private readonly redirects: RedirectsService) {}

  @Get()
  async list(@Param('projectId') projectId: string) {
    return this.redirects.listRedirects(projectId);
  }

  @Post()
  async add(
    @Param('projectId') projectId: string,
    @Body() body: { source: string; destination: string; statusCode?: number; enabled?: boolean },
  ) {
    if (!body.source || !body.destination) return { error: 'source and destination are required' };
    return this.redirects.addRedirect(projectId, {
      source: body.source,
      destination: body.destination,
      statusCode: (body.statusCode as 301 | 302 | 307 | 308) || 301,
      enabled: body.enabled !== false,
    });
  }

  @Patch(':redirectId')
  async update(
    @Param('projectId') projectId: string,
    @Param('redirectId') redirectId: string,
    @Body() body: Partial<{ source: string; destination: string; statusCode: number; enabled: boolean }>,
  ) {
    const result = await this.redirects.updateRedirect(projectId, redirectId, body as any);
    if (!result) return { error: 'Redirect not found' };
    return result;
  }

  @Delete(':redirectId')
  async remove(@Param('projectId') projectId: string, @Param('redirectId') redirectId: string) {
    return this.redirects.deleteRedirect(projectId, redirectId);
  }

  @Get('resolve')
  async resolve(@Param('projectId') projectId: string, @Query('path') path: string) {
    const rule = await this.redirects.resolveRedirect(projectId, path);
    if (!rule) return { redirect: false };
    return { redirect: true, destination: rule.destination, statusCode: rule.statusCode };
  }
}
