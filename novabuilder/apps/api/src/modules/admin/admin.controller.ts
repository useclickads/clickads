import { Controller, Delete, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminService } from './admin.service';

@Controller('admin')
@UseGuards(AuthGuard('jwt'))
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  async getStats() {
    return this.adminService.getStats();
  }

  @Get('users')
  async listUsers(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.adminService.listUsers(Number(page) || 1, Number(limit) || 20);
  }

  @Get('projects')
  async listProjects(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.adminService.listProjects(Number(page) || 1, Number(limit) || 20);
  }

  @Delete('users/:id')
  async deleteUser(@Param('id') id: string) {
    await this.adminService.deleteUser(id);
    return { ok: true };
  }

  @Delete('projects/:id')
  async deleteProject(@Param('id') id: string) {
    await this.adminService.deleteProject(id);
    return { ok: true };
  }

  @Get('activity')
  async getActivity(@Query('limit') limit?: string) {
    return this.adminService.getRecentActivity(Number(limit) || 50);
  }

  @Get('stats/detailed')
  async getDetailedStats() {
    return this.adminService.getDetailedStats();
  }

  @Get('health')
  async getHealth() {
    return this.adminService.getSystemHealth();
  }

  @Get('users/search')
  async searchUsers(@Query('q') query: string) {
    if (!query) return [];
    return this.adminService.searchUsers(query);
  }
}
