import { Body, Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AnalyticsService } from './analytics.service';

@Controller('projects/:projectId/analytics')
export class AnalyticsController {
  constructor(private readonly analytics: AnalyticsService) {}

  @Post('track')
  async track(@Param('projectId') projectId: string, @Body() body: { type: string; payload?: Record<string, unknown> }) {
    if (!body.type) return { error: 'Event type is required.' };
    await this.analytics.trackEvent(projectId, { type: body.type, payload: body.payload || {} });
    return { ok: true };
  }

  @Post('pageview')
  async trackPageView(
    @Param('projectId') projectId: string,
    @Req() req: any,
    @Body() body: { path: string; referrer?: string; visitorId?: string; sessionId?: string },
  ) {
    if (!body.path) return { error: 'Path is required.' };
    await this.analytics.trackPageView(projectId, {
      path: body.path,
      referrer: body.referrer,
      userAgent: req.headers['user-agent'],
      visitorId: body.visitorId,
      sessionId: body.sessionId,
    });
    return { ok: true };
  }

  @Get('events')
  @UseGuards(AuthGuard('jwt'))
  async getEvents(@Param('projectId') projectId: string, @Query('type') type?: string, @Query('days') days?: string) {
    return this.analytics.getEvents(projectId, type, days ? parseInt(days) : 30);
  }

  @Get('summary')
  @UseGuards(AuthGuard('jwt'))
  async getSummary(@Param('projectId') projectId: string, @Query('days') days?: string) {
    return this.analytics.getSummary(projectId, days ? parseInt(days) : 30);
  }

  @Post('heatmap')
  async trackClick(
    @Param('projectId') projectId: string,
    @Body() body: { pageId: string; x: number; y: number; elementSelector?: string; viewportWidth: number; viewportHeight: number; visitorId?: string },
  ) {
    if (!body.pageId || body.x === undefined || body.y === undefined) return { error: 'pageId, x, y are required.' };
    await this.analytics.trackHeatmapClick(projectId, body);
    return { ok: true };
  }

  @Get('heatmap/:pageId')
  @UseGuards(AuthGuard('jwt'))
  async getHeatmap(@Param('projectId') projectId: string, @Param('pageId') pageId: string, @Query('days') days?: string) {
    return this.analytics.getHeatmapData(projectId, pageId, days ? parseInt(days) : 30);
  }

  @Post('funnels')
  @UseGuards(AuthGuard('jwt'))
  async createFunnel(
    @Param('projectId') projectId: string,
    @Body() body: { name: string; steps: { name: string; eventType: string; eventFilter?: Record<string, unknown> }[] },
  ) {
    if (!body.name || !body.steps?.length) return { error: 'Name and steps are required.' };
    return this.analytics.createFunnel(projectId, body);
  }

  @Get('funnels')
  @UseGuards(AuthGuard('jwt'))
  async listFunnels(@Param('projectId') projectId: string) {
    return this.analytics.listFunnels(projectId);
  }

  @Get('funnels/:funnelId/compute')
  @UseGuards(AuthGuard('jwt'))
  async computeFunnel(@Param('projectId') projectId: string, @Param('funnelId') funnelId: string, @Query('days') days?: string) {
    const result = await this.analytics.computeFunnel(projectId, funnelId, days ? parseInt(days) : 30);
    if (!result) return { error: 'Funnel not found.' };
    return result;
  }

  @Delete('funnels/:funnelId')
  @UseGuards(AuthGuard('jwt'))
  async deleteFunnel(@Param('funnelId') funnelId: string) {
    return this.analytics.deleteFunnel(funnelId);
  }
}
