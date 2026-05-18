import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

type Permission = 'read' | 'write' | 'publish' | 'delete' | 'admin' | 'manage_team' | 'manage_settings' | 'manage_billing';

const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  owner: ['read', 'write', 'publish', 'delete', 'admin', 'manage_team', 'manage_settings', 'manage_billing'],
  admin: ['read', 'write', 'publish', 'delete', 'admin', 'manage_team', 'manage_settings'],
  editor: ['read', 'write', 'publish'],
  writer: ['read', 'write'],
  viewer: ['read'],
};

@Injectable()
export class PermissionsService {
  constructor(private readonly prisma: PrismaService) {}

  async checkPermission(projectId: string, userId: string, permission: Permission): Promise<boolean> {
    const role = await this.getUserRole(projectId, userId);
    if (!role) return false;
    return (ROLE_PERMISSIONS[role] || []).includes(permission);
  }

  async getUserRole(projectId: string, userId: string): Promise<string | null> {
    const project = await this.prisma.client.project.findUnique({
      where: { id: projectId },
      select: { ownerId: true },
    });

    if (project?.ownerId === userId) return 'owner';

    const member = await this.prisma.client.teamMember.findFirst({
      where: {
        userId,
        deletedAt: null,
        team: { projectId, deletedAt: null },
      },
    });

    return member?.role || null;
  }

  async getProjectPermissions(projectId: string, userId: string): Promise<Permission[]> {
    const role = await this.getUserRole(projectId, userId);
    if (!role) return [];
    return ROLE_PERMISSIONS[role] || [];
  }

  async updateMemberRole(projectId: string, targetUserId: string, newRole: string, requesterId: string) {
    const requesterRole = await this.getUserRole(projectId, requesterId);
    if (!requesterRole || !ROLE_PERMISSIONS[requesterRole]?.includes('manage_team')) {
      return { error: 'Insufficient permissions to manage team' };
    }

    if (!ROLE_PERMISSIONS[newRole]) {
      return { error: `Invalid role: ${newRole}. Valid roles: ${Object.keys(ROLE_PERMISSIONS).join(', ')}` };
    }

    const roleHierarchy = ['viewer', 'writer', 'editor', 'admin', 'owner'];
    const requesterLevel = roleHierarchy.indexOf(requesterRole);
    const newLevel = roleHierarchy.indexOf(newRole);

    if (newLevel >= requesterLevel) {
      return { error: 'Cannot assign a role equal to or higher than your own' };
    }

    const member = await this.prisma.client.teamMember.findFirst({
      where: {
        userId: targetUserId,
        deletedAt: null,
        team: { projectId, deletedAt: null },
      },
    });

    if (!member) return { error: 'User is not a member of this project' };

    await this.prisma.client.teamMember.update({
      where: { id: member.id },
      data: { role: newRole },
    });

    return { ok: true, role: newRole };
  }

  getRoleDefinitions() {
    return Object.entries(ROLE_PERMISSIONS).map(([role, permissions]) => ({
      role,
      permissions,
      description: this.describeRole(role),
    }));
  }

  private describeRole(role: string): string {
    const descriptions: Record<string, string> = {
      owner: 'Full control over the project including billing and deletion',
      admin: 'Can manage team, settings, and all content operations',
      editor: 'Can read, edit, and publish content',
      writer: 'Can read and edit content but cannot publish',
      viewer: 'Read-only access to the project',
    };
    return descriptions[role] || role;
  }
}
