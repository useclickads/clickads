import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { StagingService } from './staging.service';

@Controller('projects/:projectId/staging')
@UseGuards(AuthGuard('jwt'))
export class StagingController {
  constructor(private readonly staging: StagingService) {}

  @Post()
  async create(
    @Param('projectId') projectId: string,
    @Req() req: any,
    @Body() body: { name: string },
  ) {
    return this.staging.createStagingEnvironment(projectId, req.user.userId, body.name);
  }

  @Get()
  async list(@Param('projectId') projectId: string) {
    return this.staging.listStagingEnvironments(projectId);
  }

  @Get(':stagingId')
  async details(@Param('stagingId') stagingId: string) {
    return this.staging.getStagingDetails(stagingId);
  }

  @Post(':stagingId/stage')
  async stageChange(
    @Param('stagingId') stagingId: string,
    @Body() body: { pageId: string; title?: string; content?: unknown; seo?: unknown },
  ) {
    return this.staging.stagePageChange(stagingId, body.pageId, body);
  }

  @Post(':stagingId/publish')
  async publish(@Param('stagingId') stagingId: string, @Req() req: any) {
    return this.staging.publishStaging(stagingId, req.user.userId);
  }

  @Post(':stagingId/discard')
  async discard(@Param('stagingId') stagingId: string) {
    return this.staging.discardStaging(stagingId);
  }
}
