import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class DomainsService {
  constructor(private readonly prisma: PrismaService) {}

  async listDomains(projectId: string) {
    return this.prisma.client.domain.findMany({
      where: { projectId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
  }

  async addDomain(projectId: string, domain: string) {
    const existing = await this.prisma.client.domain.findUnique({ where: { domain } });
    if (existing) return null;
    return this.prisma.client.domain.create({
      data: { projectId, domain, verified: false },
    });
  }

  async removeDomain(id: string) {
    return this.prisma.client.domain.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async verifyDomain(id: string) {
    return this.prisma.client.domain.update({
      where: { id },
      data: { verified: true },
    });
  }

  async checkSslStatus(id: string) {
    const domain = await this.prisma.client.domain.findUnique({ where: { id } });
    if (!domain || !domain.verified) return { status: 'pending', message: 'Domain not verified yet' };
    return { status: 'active', issuedAt: new Date().toISOString(), expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString() };
  }

  getDnsInstructions(domain: string) {
    const verificationToken = crypto.createHash('sha256').update(domain + '-novabuilder').digest('hex').slice(0, 16);
    return {
      domain,
      records: [
        { type: 'CNAME', name: domain, value: 'sites.novabuilder.app' },
        { type: 'TXT', name: `_verify.${domain}`, value: `nova-verify=${verificationToken}` },
      ],
      instructions: `Add both DNS records to your domain provider. The CNAME points your domain to our servers. The TXT record proves ownership.`,
    };
  }
}
