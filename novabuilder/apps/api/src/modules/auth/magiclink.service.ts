import { Inject, Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class MagicLinkService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async createToken(email: string) {
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    await this.prisma.client.magicLink.create({ data: { email, token, expiresAt } });
    return token;
  }

  async validateToken(token: string) {
    const entry = await this.prisma.client.magicLink.findUnique({ where: { token } });
    if (!entry || entry.usedAt) return null;
    if (new Date() > entry.expiresAt) return null;

    await this.prisma.client.magicLink.update({
      where: { token },
      data: { usedAt: new Date() },
    });
    return entry.email;
  }
}
