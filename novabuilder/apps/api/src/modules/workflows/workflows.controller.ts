import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { WorkflowsService } from './workflows.service';

@Controller('projects/:projectId/workflows')
@UseGuards(AuthGuard('jwt'))
export class WorkflowsController {
  constructor(private readonly workflows: WorkflowsService) {}

  @Get()
  async list(@Param('projectId') projectId: string) {
    return this.workflows.list(projectId);
  }

  @Post()
  async create(
    @Param('projectId') projectId: string,
    @Body() body: { name: string; trigger: any; steps: any[] },
  ) {
    if (!body.name || !body.trigger || !body.steps?.length) {
      return { error: 'Name, trigger, and steps are required.' };
    }
    return this.workflows.create(projectId, body);
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    const workflow = await this.workflows.get(id);
    if (!workflow) return { error: 'Workflow not found.' };
    return workflow;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: { name?: string; steps?: any[]; enabled?: boolean }) {
    const result = await this.workflows.update(id, body);
    if (!result) return { error: 'Workflow not found.' };
    return result;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deleted = await this.workflows.delete(id);
    return { ok: deleted };
  }

  @Post('trigger')
  async trigger(
    @Param('projectId') projectId: string,
    @Body() body: { trigger: string; payload: Record<string, unknown> },
  ) {
    if (!body.trigger) return { error: 'Trigger is required.' };
    return this.workflows.execute(projectId, body.trigger as any, body.payload || {});
  }

  @Get(':id/log')
  async executionLog(@Param('id') id: string, @Query('limit') limit?: string) {
    return this.workflows.getExecutionLog(id, limit ? parseInt(limit) : 50);
  }
}
