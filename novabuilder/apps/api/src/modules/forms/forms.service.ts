import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FormsService {
  constructor(private readonly prisma: PrismaService) {}

  async submitForm(projectId: string, data: { formName: string; pageId?: string; fields: Record<string, unknown> }) {
    return this.prisma.client.formSubmission.create({
      data: {
        projectId,
        pageId: data.pageId,
        formName: data.formName,
        data: data.fields as any,
      },
    });
  }

  async listSubmissions(projectId: string, formName?: string) {
    return this.prisma.client.formSubmission.findMany({
      where: {
        projectId,
        ...(formName ? { formName } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  async getSubmission(id: string) {
    return this.prisma.client.formSubmission.findUnique({ where: { id } });
  }

  async deleteSubmission(id: string) {
    return this.prisma.client.formSubmission.delete({ where: { id } });
  }

  async getFormNames(projectId: string) {
    const submissions = await this.prisma.client.formSubmission.findMany({
      where: { projectId },
      select: { formName: true },
      distinct: ['formName'],
    });
    return submissions.map((s) => s.formName);
  }
}
