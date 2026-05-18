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

  validateFields(fields: Record<string, unknown>, rules: ValidationRule[]): { valid: boolean; errors: { field: string; message: string }[] } {
    const errors: { field: string; message: string }[] = [];

    for (const rule of rules) {
      const value = fields[rule.field];

      if (rule.required && (value === undefined || value === null || value === '')) {
        errors.push({ field: rule.field, message: `${rule.field} is required` });
        continue;
      }

      if (value === undefined || value === null || value === '') continue;

      const strValue = String(value);

      if (rule.minLength && strValue.length < rule.minLength) {
        errors.push({ field: rule.field, message: `${rule.field} must be at least ${rule.minLength} characters` });
      }

      if (rule.maxLength && strValue.length > rule.maxLength) {
        errors.push({ field: rule.field, message: `${rule.field} must be at most ${rule.maxLength} characters` });
      }

      if (rule.pattern && !new RegExp(rule.pattern).test(strValue)) {
        errors.push({ field: rule.field, message: rule.patternMessage || `${rule.field} has an invalid format` });
      }

      if (rule.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(strValue)) {
        errors.push({ field: rule.field, message: `${rule.field} must be a valid email address` });
      }

      if (rule.type === 'url' && !/^https?:\/\/.+/.test(strValue)) {
        errors.push({ field: rule.field, message: `${rule.field} must be a valid URL` });
      }

      if (rule.type === 'number') {
        const num = Number(value);
        if (isNaN(num)) {
          errors.push({ field: rule.field, message: `${rule.field} must be a number` });
        } else {
          if (rule.min !== undefined && num < rule.min) errors.push({ field: rule.field, message: `${rule.field} must be at least ${rule.min}` });
          if (rule.max !== undefined && num > rule.max) errors.push({ field: rule.field, message: `${rule.field} must be at most ${rule.max}` });
        }
      }
    }

    return { valid: errors.length === 0, errors };
  }

  async exportSubmissions(projectId: string, formName: string): Promise<string> {
    const submissions = await this.prisma.client.formSubmission.findMany({
      where: { projectId, formName },
      orderBy: { createdAt: 'desc' },
    });

    if (submissions.length === 0) return '';

    const allKeys = new Set<string>();
    for (const sub of submissions) {
      const data = sub.data as Record<string, unknown>;
      for (const key of Object.keys(data)) allKeys.add(key);
    }

    const headers = ['id', 'createdAt', ...allKeys];
    const rows = submissions.map((sub) => {
      const data = sub.data as Record<string, unknown>;
      return headers.map((h) => {
        if (h === 'id') return sub.id;
        if (h === 'createdAt') return sub.createdAt.toISOString();
        const val = data[h];
        const str = val === null || val === undefined ? '' : String(val);
        return str.includes(',') || str.includes('"') || str.includes('\n')
          ? `"${str.replace(/"/g, '""')}"`
          : str;
      }).join(',');
    });

    return [headers.join(','), ...rows].join('\n');
  }
}

type ValidationRule = {
  field: string;
  required?: boolean;
  type?: 'text' | 'email' | 'url' | 'number';
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
  patternMessage?: string;
};
