import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TeamsService {
  constructor(private readonly prisma: PrismaService) {}

  async listCollaborators(projectId: string) {
    return this.prisma.client.collaborator.findMany({
      where: { projectId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
  }

  async inviteCollaborator(projectId: string, email: string, role: string, invitedBy: string) {
    const existing = await this.prisma.client.collaborator.findFirst({
      where: { projectId, email, deletedAt: null },
    });
    if (existing) return null;
    return this.prisma.client.collaborator.create({
      data: { projectId, email, role, invitedBy },
    });
  }

  async removeCollaborator(id: string) {
    return this.prisma.client.collaborator.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async updateCollaboratorRole(id: string, role: string) {
    return this.prisma.client.collaborator.update({
      where: { id },
      data: { role },
    });
  }

  async acceptInvite(id: string) {
    return this.prisma.client.collaborator.update({
      where: { id },
      data: { accepted: true },
    });
  }

  async listTeams(projectId: string) {
    return this.prisma.client.team.findMany({
      where: { projectId, deletedAt: null },
      include: { members: { include: { user: { select: { id: true, email: true, name: true } } } } },
    });
  }

  async createTeam(projectId: string, name: string) {
    return this.prisma.client.team.create({
      data: { projectId, name },
    });
  }

  async addTeamMember(teamId: string, userId: string, role?: string) {
    return this.prisma.client.teamMember.create({
      data: { teamId, userId, role },
    });
  }

  async removeTeamMember(memberId: string) {
    return this.prisma.client.teamMember.update({
      where: { id: memberId },
      data: { deletedAt: new Date() },
    });
  }
}
