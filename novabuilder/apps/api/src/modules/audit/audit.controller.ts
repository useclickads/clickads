import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuditService } from './audit.service';

@Controller('audit')
@UseGuards(AuthGuard('jwt'))
export class AuditController {
  constructor(private readonly audit: AuditService) {}

  @Get()
  async list(@Req() req: any, @Query('resource') resource?: string, @Query('resourceId') resourceId?: string) {
    if (resource && resourceId) {
      return this.audit.listByResource(resource, resourceId);
    }
    return this.audit.listByActor(req.user.userId);
  }
}
