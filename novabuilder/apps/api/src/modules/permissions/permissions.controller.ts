import { Body, Controller, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PermissionsService } from './permissions.service';

@Controller('projects/:projectId/permissions')
@UseGuards(AuthGuard('jwt'))
export class PermissionsController {
  constructor(private readonly permissions: PermissionsService) {}

  @Get()
  async myPermissions(@Param('projectId') projectId: string, @Req() req: any) {
    const role = await this.permissions.getUserRole(projectId, req.user.userId);
    const perms = await this.permissions.getProjectPermissions(projectId, req.user.userId);
    return { role, permissions: perms };
  }

  @Get('roles')
  async roles() {
    return this.permissions.getRoleDefinitions();
  }

  @Get('check/:permission')
  async check(
    @Param('projectId') projectId: string,
    @Param('permission') permission: string,
    @Req() req: any,
  ) {
    const allowed = await this.permissions.checkPermission(projectId, req.user.userId, permission as any);
    return { permission, allowed };
  }

  @Patch('members/:userId/role')
  async updateRole(
    @Param('projectId') projectId: string,
    @Param('userId') userId: string,
    @Req() req: any,
    @Body() body: { role: string },
  ) {
    return this.permissions.updateMemberRole(projectId, userId, body.role, req.user.userId);
  }
}
