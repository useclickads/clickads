import { Controller, Get, Header, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExportService } from './export.service';

@Controller('projects/:projectId/export')
@UseGuards(AuthGuard('jwt'))
export class ExportController {
  constructor(private readonly exportService: ExportService) {}

  @Get()
  async exportProject(@Param('projectId') projectId: string) {
    return this.exportService.exportProject(projectId);
  }

  @Get('download')
  @Header('Content-Type', 'application/json')
  @Header('Content-Disposition', 'attachment; filename="project-export.json"')
  async download(@Param('projectId') projectId: string) {
    return this.exportService.exportProject(projectId);
  }
}
