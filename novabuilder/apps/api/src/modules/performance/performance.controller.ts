import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PerformanceService } from './performance.service';

@Controller('projects/:projectId/performance')
export class PerformanceController {
  constructor(private readonly performance: PerformanceService) {}

  @Post('collect')
  async collect(
    @Param('projectId') projectId: string,
    @Body() body: any,
  ) {
    await this.performance.recordMetrics(projectId, body);
    return { ok: true };
  }

  @Get('pages/:pageId')
  @UseGuards(AuthGuard('jwt'))
  async pagePerformance(
    @Param('projectId') projectId: string,
    @Param('pageId') pageId: string,
    @Query('days') days?: string,
  ) {
    return this.performance.getPagePerformance(projectId, pageId, days ? parseInt(days, 10) : undefined);
  }

  @Get('overview')
  @UseGuards(AuthGuard('jwt'))
  async overview(@Param('projectId') projectId: string) {
    return this.performance.getProjectPerformanceOverview(projectId);
  }

  @Get('script')
  async script(@Param('projectId') projectId: string) {
    const js = this.performance.generatePerformanceScript(projectId);
    return { contentType: 'application/javascript', script: js };
  }
}
