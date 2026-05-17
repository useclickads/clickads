import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../../prisma/prisma.service';
import { ROLES_KEY } from '../decorators/permissions.decorator';

@Injectable()
export class RbacGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler()) || [];
    if (requiredRoles.length === 0) {
      return true;
    }

    const req = context.switchToHttp().getRequest();
    const user = req.user;
    if (!user?.userId) {
      return false;
    }

    const assignments = await this.prisma.client.roleAssignment.findMany({
      where: { userId: user.userId },
      include: { role: true }
    });

    const userRoles = assignments.map((assignment) => assignment.role.name.toUpperCase());
    const allowed = requiredRoles.some((required) => userRoles.includes(required.toUpperCase()));

    if (allowed) {
      req.userRoles = userRoles;
    }

    return allowed;
  }
}
