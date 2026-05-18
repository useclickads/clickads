import { Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BackupService } from './backup.service';

@Controller('projects/:projectId/backups')
@UseGuards(AuthGuard('jwt'))
export class BackupController {
  constructor(private readonly backups: BackupService) {}

  @Post()
  async create(@Param('projectId') projectId: string, @Req() req: any) {
    return this.backups.createBackup(projectId, req.user.userId);
  }

  @Get()
  async list(@Param('projectId') projectId: string) {
    return this.backups.listBackups(projectId);
  }

  @Post(':backupId/restore')
  async restore(@Param('projectId') projectId: string, @Param('backupId') backupId: string) {
    const result = await this.backups.restoreBackup(projectId, backupId);
    if (!result) return { error: 'Backup not found.' };
    return { ok: true, ...result };
  }

  @Delete(':backupId')
  async remove(@Param('backupId') backupId: string) {
    return this.backups.deleteBackup(backupId);
  }
}
