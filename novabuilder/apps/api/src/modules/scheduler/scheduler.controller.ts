import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SchedulerService } from './scheduler.service';

@Controller('projects/:projectId/scheduler')
@UseGuards(AuthGuard('jwt'))
export class SchedulerController {
  constructor(private readonly scheduler: SchedulerService) {}

  @Post()
  async scheduleJob(
    @Param('projectId') projectId: string,
    @Body() body: { type: string; executeAt: string; payload: Record<string, unknown> },
  ) {
    return this.scheduler.scheduleJob(projectId, body.type, new Date(body.executeAt), body.payload);
  }

  @Get()
  async listJobs(@Param('projectId') projectId: string) {
    return this.scheduler.listJobs(projectId);
  }

  @Delete(':jobId')
  async cancelJob(@Param('jobId') jobId: string) {
    const cancelled = await this.scheduler.cancelJob(jobId);
    if (!cancelled) return { error: 'Job not found or already executed' };
    return { ok: true };
  }
}
