import { Controller, Get, Header, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
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

  @Get('sitemap')
  @Header('Content-Type', 'application/xml')
  async getSitemap(@Param('projectId') projectId: string) {
    return this.deploy.generateSitemap(projectId);
  }

  @Get('robots')
  @Header('Content-Type', 'text/plain')
  async getRobotsTxt(@Param('projectId') projectId: string) {
    return this.deploy.generateRobotsTxt(projectId);
  }
}
