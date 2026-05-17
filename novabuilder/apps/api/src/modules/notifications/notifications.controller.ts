import { Controller, Get, Param, Patch, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
@UseGuards(AuthGuard('jwt'))
export class NotificationsController {
  constructor(private readonly notifications: NotificationsService) {}

  @Get()
  async list(@Req() req: any, @Query('unread') unread?: string) {
    return this.notifications.list(req.user.userId, unread === 'true');
  }

  @Get('count')
  async unreadCount(@Req() req: any) {
    const count = await this.notifications.unreadCount(req.user.userId);
    return { count };
  }

  @Patch(':id/read')
  async markRead(@Param('id') id: string) {
    return this.notifications.markRead(id);
  }

  @Patch('read-all')
  async markAllRead(@Req() req: any) {
    await this.notifications.markAllRead(req.user.userId);
    return { ok: true };
  }
}
