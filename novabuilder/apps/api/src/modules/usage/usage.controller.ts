import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsageService } from './usage.service';

@Controller('usage')
@UseGuards(AuthGuard('jwt'))
export class UsageController {
  constructor(private readonly usage: UsageService) {}

  @Get()
  async getUserUsage(@Req() req: any) {
    return this.usage.getUsageForUser(req.user.userId);
  }

  @Get('projects/:projectId')
  async getProjectUsage(@Param('projectId') projectId: string) {
    return this.usage.getUsageForProject(projectId);
  }
}
