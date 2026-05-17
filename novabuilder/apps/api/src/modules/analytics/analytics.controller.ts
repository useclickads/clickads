import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
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
}
