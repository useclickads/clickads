import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DeployService } from './deploy.service';

@Controller('projects/:projectId/deploy')
@UseGuards(AuthGuard('jwt'))
export class DeployController {
  constructor(private readonly deploy: DeployService) {}

  @Post()
  async deployProject(@Param('projectId') projectId: string, @Req() req: any) {
    const result = await this.deploy.deployProject(projectId, req.user.userId);
    return result;
  }

  @Get('history')
  async listDeployments(@Param('projectId') projectId: string) {
    return this.deploy.listDeployments(projectId);
  }
}
