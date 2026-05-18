import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { QualityService } from './quality.service';

@Controller('projects/:projectId/pages/:pageId/quality')
@UseGuards(AuthGuard('jwt'))
export class QualityController {
  constructor(private readonly quality: QualityService) {}

  @Get()
  async auditPage(@Param('pageId') pageId: string) {
    return this.quality.auditPage(pageId);
  }
}
