import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get('profile')
  async getProfile(@Req() req: any) {
    return this.users.getProfile(req.user.userId);
  }

  @Patch('profile')
  async updateProfile(@Req() req: any, @Body() body: { name?: string; avatarUrl?: string }) {
    return this.users.updateProfile(req.user.userId, body);
  }

  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  async changePassword(@Req() req: any, @Body() body: { currentPassword: string; newPassword: string }) {
    if (!body.currentPassword || !body.newPassword) return { error: 'Both passwords are required.' };
    if (body.newPassword.length < 8) return { error: 'Password must be at least 8 characters.' };
    return this.users.changePassword(req.user.userId, body.currentPassword, body.newPassword);
  }

  @Delete('account')
  @HttpCode(HttpStatus.OK)
  async deleteAccount(@Req() req: any) {
    await this.users.deleteAccount(req.user.userId);
    return { ok: true };
  }
}
