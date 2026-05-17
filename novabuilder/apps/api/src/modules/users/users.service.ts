import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.client.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, avatarUrl: true, createdAt: true },
    });
    return user;
  }

  async updateProfile(userId: string, data: { name?: string; avatarUrl?: string }) {
    return this.prisma.client.user.update({
      where: { id: userId },
      data,
      select: { id: true, email: true, name: true, avatarUrl: true },
    });
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await this.prisma.client.user.findUnique({ where: { id: userId } });
    if (!user || !user.passwordHash) return { error: 'Cannot change password.' };

    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) return { error: 'Current password is incorrect.' };

    const hash = await bcrypt.hash(newPassword, 12);
    await this.prisma.client.user.update({
      where: { id: userId },
      data: { passwordHash: hash },
    });
    return { ok: true };
  }

  async deleteAccount(userId: string) {
    return this.prisma.client.user.update({
      where: { id: userId },
      data: { deletedAt: new Date() },
    });
  }
}
