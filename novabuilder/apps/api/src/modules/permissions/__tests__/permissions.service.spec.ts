import { describe, it, expect } from 'vitest';

type Permission = 'read' | 'write' | 'publish' | 'delete' | 'admin' | 'manage_team' | 'manage_settings' | 'manage_billing';

const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  owner: ['read', 'write', 'publish', 'delete', 'admin', 'manage_team', 'manage_settings', 'manage_billing'],
  admin: ['read', 'write', 'publish', 'delete', 'admin', 'manage_team', 'manage_settings'],
  editor: ['read', 'write', 'publish'],
  writer: ['read', 'write'],
  viewer: ['read'],
};

function checkPermission(role: string | null, permission: Permission): boolean {
  if (!role) return false;
  return (ROLE_PERMISSIONS[role] || []).includes(permission);
}

function canAssignRole(requesterRole: string, targetRole: string): boolean {
  const hierarchy = ['viewer', 'writer', 'editor', 'admin', 'owner'];
  const requesterLevel = hierarchy.indexOf(requesterRole);
  const targetLevel = hierarchy.indexOf(targetRole);
  if (requesterLevel === -1 || targetLevel === -1) return false;
  return targetLevel < requesterLevel && ROLE_PERMISSIONS[requesterRole]?.includes('manage_team');
}

describe('PermissionsService', () => {
  it('owner has all permissions', () => {
    expect(checkPermission('owner', 'read')).toBe(true);
    expect(checkPermission('owner', 'manage_billing')).toBe(true);
    expect(checkPermission('owner', 'admin')).toBe(true);
  });

  it('viewer can only read', () => {
    expect(checkPermission('viewer', 'read')).toBe(true);
    expect(checkPermission('viewer', 'write')).toBe(false);
    expect(checkPermission('viewer', 'publish')).toBe(false);
    expect(checkPermission('viewer', 'delete')).toBe(false);
  });

  it('editor can read, write, and publish', () => {
    expect(checkPermission('editor', 'read')).toBe(true);
    expect(checkPermission('editor', 'write')).toBe(true);
    expect(checkPermission('editor', 'publish')).toBe(true);
    expect(checkPermission('editor', 'delete')).toBe(false);
  });

  it('null role has no permissions', () => {
    expect(checkPermission(null, 'read')).toBe(false);
  });

  it('admin cannot assign owner role', () => {
    expect(canAssignRole('admin', 'owner')).toBe(false);
  });

  it('admin can assign editor role', () => {
    expect(canAssignRole('admin', 'editor')).toBe(true);
  });

  it('editor cannot assign roles (no manage_team)', () => {
    expect(canAssignRole('editor', 'viewer')).toBe(false);
  });

  it('owner can assign admin role', () => {
    expect(canAssignRole('owner', 'admin')).toBe(true);
  });

  it('cannot assign same level role', () => {
    expect(canAssignRole('admin', 'admin')).toBe(false);
  });
});
