import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProjectsService } from './projects.service';

@Controller('projects')
@UseGuards(AuthGuard('jwt'))
export class ProjectsController {
  constructor(private readonly projects: ProjectsService) {}

  @Get()
  async list(@Req() req: any) {
    return this.projects.listByOwner(req.user.userId);
  }

  @Post()
  async create(@Req() req: any, @Body() body: { name: string; slug: string; description?: string }) {
    if (!body.name || !body.slug) {
      return { error: 'Name and slug are required.' };
    }

    if (!/^[a-z0-9-]+$/.test(body.slug)) {
      return { error: 'Slug must be lowercase alphanumeric with hyphens only.' };
    }

    const exists = await this.projects.slugExists(body.slug);
    if (exists) {
      return { error: 'A project with this slug already exists.' };
    }

    return this.projects.create(req.user.userId, body);
  }

  @Get(':id')
  async get(@Req() req: any, @Param('id') id: string) {
    const project = await this.projects.getById(id, req.user.userId);
    if (!project) return { error: 'Project not found.' };
    return project;
  }

  @Patch(':id')
  async update(@Req() req: any, @Param('id') id: string, @Body() body: { name?: string; description?: string }) {
    const project = await this.projects.update(id, req.user.userId, body);
    if (!project) return { error: 'Project not found.' };
    return project;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Req() req: any, @Param('id') id: string) {
    const project = await this.projects.softDelete(id, req.user.userId);
    if (!project) return { error: 'Project not found.' };
    return { ok: true };
  }
}
