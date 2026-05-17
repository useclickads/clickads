import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { MagicLinkService } from './magiclink.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(MagicLinkService) private readonly magicLinkService: MagicLinkService
  ) {}

  async validateUserByEmail(email: string, password: string) {
    const user = await this.prisma.client.user.findUnique({ where: { email } });
    if (!user) return null;
    if (!user.passwordHash) return null;
    const ok = await bcrypt.compare(password, user.passwordHash);
    return ok ? user : null;
  }

  async signupWithEmail(email: string, password: string, name?: string) {
    const existing = await this.prisma.client.user.findUnique({ where: { email } });
    if (existing?.passwordHash) return null;

    const passwordHash = await bcrypt.hash(password, 12);

    const user = existing
      ? await this.prisma.client.user.update({ where: { email }, data: { passwordHash, name } })
      : await this.prisma.client.user.create({ data: { email, passwordHash, name } });

    const accessToken = this.signAccessToken(user);
    const refreshToken = await this.createRefreshToken(user);
    return { accessToken, refreshToken, user };
  }

  async requestPasswordReset(email: string) {
    const user = await this.prisma.client.user.findUnique({ where: { email } });
    if (!user) return null;

    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    await this.prisma.client.passwordReset.create({ data: { email, token, expiresAt } });
    return token;
  }

  async resetPassword(token: string, newPassword: string) {
    const entry = await this.prisma.client.passwordReset.findUnique({ where: { token } });
    if (!entry || entry.usedAt) return null;
    if (new Date() > entry.expiresAt) return null;

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await this.prisma.client.user.update({ where: { email: entry.email }, data: { passwordHash } });
    await this.prisma.client.passwordReset.update({ where: { token }, data: { usedAt: new Date() } });
    return true;
  }

  signAccessToken(user: any) {
    const secret = process.env.JWT_SECRET || 'change-me';
    const expiresIn = process.env.ACCESS_TOKEN_EXPIRES || '15m';
    return jwt.sign(
      { sub: user.id, email: user.email },
      secret as jwt.Secret,
      { expiresIn } as jwt.SignOptions
    );
  }

  async createRefreshToken(user: any) {
    const token = randomBytes(48).toString('hex');
    const expiresDays = parseInt(process.env.REFRESH_TOKEN_DAYS || '30', 10);
    const expiresAt = new Date(Date.now() + expiresDays * 24 * 60 * 60 * 1000);
    await this.prisma.client.session.create({ data: { userId: user.id, token, expiresAt } });
    return token;
  }

  async rotateRefreshToken(oldToken: string) {
    const existing = await this.prisma.client.session.findUnique({ where: { token: oldToken } });
    if (!existing) return null;
    await this.prisma.client.session.delete({ where: { token: oldToken } });
    const user = await this.prisma.client.user.findUnique({ where: { id: existing.userId } });
    if (!user) return null;
    const newToken = await this.createRefreshToken(user);
    return { user, refreshToken: newToken };
  }

  async loginWithEmail(email: string, password: string) {
    const user = await this.validateUserByEmail(email, password);
    if (!user) return null;
    const accessToken = this.signAccessToken(user);
    const refreshToken = await this.createRefreshToken(user);
    return { accessToken, refreshToken, user };
  }

  async logout(refreshToken: string) {
    try {
      await this.prisma.client.session.deleteMany({ where: { token: refreshToken } });
    } catch (e) {
      // swallow
    }
  }

  async requestMagicLink(email: string) {
    const token = await this.magicLinkService.createToken(email);
    const user = await this.prisma.client.user.findUnique({ where: { email } });
    if (!user) {
      await this.prisma.client.user.create({ data: { email } });
    }
    return token;
  }

  async verifyMagicLink(token: string) {
    const email = await this.magicLinkService.validateToken(token);
    if (!email) return null;
    let user = await this.prisma.client.user.findUnique({ where: { email } });
    if (!user) {
      user = await this.prisma.client.user.create({ data: { email } });
    }
    const accessToken = this.signAccessToken(user);
    const refreshToken = await this.createRefreshToken(user);
    return { accessToken, refreshToken, user };
  }

  async getUserRoles(userId: string) {
    const assignments = await this.prisma.client.roleAssignment.findMany({
      where: { userId },
      include: { role: true }
    });
    return assignments.map((assignment) => assignment.role.name.toUpperCase());
  }

  async userHasRole(userId: string, roleNames: string[]) {
    const roles = await this.getUserRoles(userId);
    return roleNames.some((roleName) => roles.includes(roleName.toUpperCase()));
  }
}

