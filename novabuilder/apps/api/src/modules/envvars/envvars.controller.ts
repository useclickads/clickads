import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { EnvVarsService } from './envvars.service';

@Controller('projects/:projectId/env')
@UseGuards(AuthGuard('jwt'))
export class EnvVarsController {
  constructor(private readonly envVars: EnvVarsService) {}

  @Get()
  async list(@Param('projectId') projectId: string, @Query('environment') environment?: string) {
    return this.envVars.listVars(projectId, environment);
  }

  @Post()
  async set(
    @Param('projectId') projectId: string,
    @Body() body: { key: string; value: string; environment: string; isSecret?: boolean },
  ) {
    if (!body.key || !body.value || !body.environment) return { error: 'key, value, and environment are required' };
    return this.envVars.setVar(projectId, body.key, body.value, body.environment, body.isSecret || false);
  }

  @Delete(':key')
  async remove(
    @Param('projectId') projectId: string,
    @Param('key') key: string,
    @Query('environment') environment: string,
  ) {
    if (!environment) return { error: 'environment query param is required' };
    return this.envVars.deleteVar(projectId, key, environment);
  }

  @Post('copy')
  async copy(
    @Param('projectId') projectId: string,
    @Body() body: { from: string; to: string },
  ) {
    if (!body.from || !body.to) return { error: 'from and to are required' };
    return this.envVars.copyVars(projectId, body.from, body.to);
  }
}
