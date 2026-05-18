import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

type SettingsData = {
  globalHeader?: unknown;
  globalFooter?: unknown;
  headScripts?: string;
  bodyScripts?: string;
  favicon?: string;
  socialImage?: string;
  defaultLocale?: string;
  supportedLocales?: string;
  siteName?: string;
  siteUrl?: string;
  robotsTxt?: string;
};

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async getSettings(projectId: string) {
    const settings = await this.prisma.client.projectSettings.findUnique({
      where: { projectId },
    });
    if (!settings) {
      return { projectId, globalHeader: null, globalFooter: null, headScripts: '', bodyScripts: '', favicon: '', socialImage: '' };
    }
    return settings;
  }

  async updateSettings(projectId: string, data: SettingsData) {
    return this.prisma.client.projectSettings.upsert({
      where: { projectId },
      create: {
        projectId,
        globalHeader: data.globalHeader as any,
        globalFooter: data.globalFooter as any,
        headScripts: data.headScripts,
        bodyScripts: data.bodyScripts,
        favicon: data.favicon,
        socialImage: data.socialImage,
      },
      update: {
        ...(data.globalHeader !== undefined && { globalHeader: data.globalHeader as any }),
        ...(data.globalFooter !== undefined && { globalFooter: data.globalFooter as any }),
        ...(data.headScripts !== undefined && { headScripts: data.headScripts }),
        ...(data.bodyScripts !== undefined && { bodyScripts: data.bodyScripts }),
        ...(data.favicon !== undefined && { favicon: data.favicon }),
        ...(data.socialImage !== undefined && { socialImage: data.socialImage }),
        ...(data.defaultLocale !== undefined && { defaultLocale: data.defaultLocale }),
        ...(data.supportedLocales !== undefined && { supportedLocales: data.supportedLocales }),
        ...(data.siteName !== undefined && { siteName: data.siteName }),
        ...(data.siteUrl !== undefined && { siteUrl: data.siteUrl }),
        ...(data.robotsTxt !== undefined && { robotsTxt: data.robotsTxt }),
      },
    });
  }
}
