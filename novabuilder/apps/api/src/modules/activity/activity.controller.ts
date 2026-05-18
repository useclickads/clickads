import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ActivityService } from './activity.service';

@Controller()
@UseGuards(AuthGuard('jwt'))
export class ActivityController {
  constructor(private readonly activity: ActivityService) {}

  @Get('projects/:projectId/activity')
  async projectTimeline(
    @Param('projectId') projectId: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('resource') resource?: string,
  ) {
    return this.activity.getProjectTimeline(projectId, {
      limit: limit ? parseInt(limit, 10) : undefined,
      offset: offset ? parseInt(offset, 10) : undefined,
      resource,
    });
  }

  @Get('projects/:projectId/activity/stats')
  async activityStats(
    @Param('projectId') projectId: string,
    @Query('days') days?: string,
  ) {
    return this.activity.getActivityStats(projectId, days ? parseInt(days, 10) : undefined);
  }

  @Get('user/activity')
  async userActivity(@Req() req: any, @Query('limit') limit?: string) {
    return this.activity.getUserActivity(req.user.userId, limit ? parseInt(limit, 10) : undefined);
  }
}
