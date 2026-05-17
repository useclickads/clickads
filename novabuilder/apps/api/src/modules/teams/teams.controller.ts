import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TeamsService } from './teams.service';

@Controller('projects/:projectId/team')
@UseGuards(AuthGuard('jwt'))
export class TeamsController {
  constructor(private readonly teams: TeamsService) {}

  @Get('collaborators')
  async listCollaborators(@Param('projectId') projectId: string) {
    return this.teams.listCollaborators(projectId);
  }

  @Post('collaborators')
  async invite(@Param('projectId') projectId: string, @Req() req: any, @Body() body: { email: string; role: string }) {
    if (!body.email || !body.role) return { error: 'Email and role are required.' };
    const result = await this.teams.inviteCollaborator(projectId, body.email, body.role, req.user.userId);
    if (!result) return { error: 'Collaborator already invited.' };
    return result;
  }

  @Patch('collaborators/:id/role')
  async updateRole(@Param('id') id: string, @Body() body: { role: string }) {
    return this.teams.updateCollaboratorRole(id, body.role);
  }

  @Patch('collaborators/:id/accept')
  async acceptInvite(@Param('id') id: string) {
    return this.teams.acceptInvite(id);
  }

  @Delete('collaborators/:id')
  @HttpCode(HttpStatus.OK)
  async removeCollaborator(@Param('id') id: string) {
    await this.teams.removeCollaborator(id);
    return { ok: true };
  }

  @Get('teams')
  async listTeams(@Param('projectId') projectId: string) {
    return this.teams.listTeams(projectId);
  }

  @Post('teams')
  async createTeam(@Param('projectId') projectId: string, @Body() body: { name: string }) {
    if (!body.name) return { error: 'Team name is required.' };
    return this.teams.createTeam(projectId, body.name);
  }

  @Post('teams/:teamId/members')
  async addMember(@Param('teamId') teamId: string, @Body() body: { userId: string; role?: string }) {
    if (!body.userId) return { error: 'User ID is required.' };
    return this.teams.addTeamMember(teamId, body.userId, body.role);
  }

  @Delete('members/:memberId')
  @HttpCode(HttpStatus.OK)
  async removeMember(@Param('memberId') memberId: string) {
    await this.teams.removeTeamMember(memberId);
    return { ok: true };
  }
}
