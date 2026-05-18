import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { createHash } from 'crypto';

type EnvVar = {
  key: string;
  value: string;
  environment: 'development' | 'staging' | 'production';
  isSecret: boolean;
};

@Injectable()
export class EnvVarsService {
  constructor(private readonly prisma: PrismaService) {}

  async listVars(projectId: string, environment?: string) {
    const settings = await this.prisma.client.projectSettings.findUnique({
      where: { projectId },
    });

    const raw = settings?.globalFooter as any;
    const vars: EnvVar[] = raw?.envVars || [];

    const filtered = environment ? vars.filter((v) => v.environment === environment) : vars;

    return filtered.map((v) => ({
      key: v.key,
      value: v.isSecret ? '••••••••' : v.value,
      environment: v.environment,
      isSecret: v.isSecret,
      hash: createHash('sha256').update(v.value).digest('hex').slice(0, 8),
    }));
  }

  async setVar(projectId: string, key: string, value: string, environment: string, isSecret: boolean) {
    const settings = await this.prisma.client.projectSettings.findUnique({
      where: { projectId },
    });

    const raw = (settings?.globalFooter as any) || {};
    const vars: EnvVar[] = raw.envVars || [];

    const idx = vars.findIndex((v) => v.key === key && v.environment === environment);
    const entry: EnvVar = { key, value, environment: environment as EnvVar['environment'], isSecret };

    if (idx >= 0) {
      vars[idx] = entry;
    } else {
      vars.push(entry);
    }

    await this.prisma.client.projectSettings.upsert({
      where: { projectId },
      create: { projectId, globalFooter: { ...raw, envVars: vars } as any },
      update: { globalFooter: { ...raw, envVars: vars } as any },
    });

    return { ok: true, total: vars.length };
  }

  async deleteVar(projectId: string, key: string, environment: string) {
    const settings = await this.prisma.client.projectSettings.findUnique({
      where: { projectId },
    });

    const raw = (settings?.globalFooter as any) || {};
    const vars: EnvVar[] = raw.envVars || [];
    const filtered = vars.filter((v) => !(v.key === key && v.environment === environment));

    await this.prisma.client.projectSettings.upsert({
      where: { projectId },
      create: { projectId, globalFooter: { ...raw, envVars: filtered } as any },
      update: { globalFooter: { ...raw, envVars: filtered } as any },
    });

    return { ok: true, removed: vars.length - filtered.length };
  }

  async copyVars(projectId: string, fromEnv: string, toEnv: string) {
    const settings = await this.prisma.client.projectSettings.findUnique({
      where: { projectId },
    });

    const raw = (settings?.globalFooter as any) || {};
    const vars: EnvVar[] = raw.envVars || [];

    const sourceVars = vars.filter((v) => v.environment === fromEnv);
    let copied = 0;

    for (const sv of sourceVars) {
      const exists = vars.find((v) => v.key === sv.key && v.environment === toEnv);
      if (!exists) {
        vars.push({ ...sv, environment: toEnv as EnvVar['environment'] });
        copied++;
      }
    }

    await this.prisma.client.projectSettings.upsert({
      where: { projectId },
      create: { projectId, globalFooter: { ...raw, envVars: vars } as any },
      update: { globalFooter: { ...raw, envVars: vars } as any },
    });

    return { ok: true, copied, skipped: sourceVars.length - copied };
  }
}
