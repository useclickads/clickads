import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

type ScheduledJob = {
  id: string;
  projectId: string;
  type: string;
  executeAt: Date;
  payload: Record<string, unknown>;
  status: 'pending' | 'completed' | 'failed';
};

@Injectable()
export class SchedulerService implements OnModuleInit, OnModuleDestroy {
  private timer: ReturnType<typeof setInterval> | null = null;
  private jobs: ScheduledJob[] = [];

  constructor(private readonly prisma: PrismaService) {}

  onModuleInit() {
    this.timer = setInterval(() => this.tick(), 30_000);
  }

  onModuleDestroy() {
    if (this.timer) clearInterval(this.timer);
  }

  async scheduleJob(
    projectId: string,
    type: string,
    executeAt: Date,
    payload: Record<string, unknown>,
  ): Promise<ScheduledJob> {
    const job: ScheduledJob = {
      id: `job_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      projectId,
      type,
      executeAt,
      payload,
      status: 'pending',
    };
    this.jobs.push(job);
    return job;
  }

  async listJobs(projectId: string): Promise<ScheduledJob[]> {
    return this.jobs
      .filter((j) => j.projectId === projectId)
      .sort((a, b) => a.executeAt.getTime() - b.executeAt.getTime());
  }

  async cancelJob(jobId: string): Promise<boolean> {
    const idx = this.jobs.findIndex((j) => j.id === jobId && j.status === 'pending');
    if (idx === -1) return false;
    this.jobs.splice(idx, 1);
    return true;
  }

  private async tick() {
    const now = new Date();
    const pending = this.jobs.filter((j) => j.status === 'pending' && j.executeAt <= now);

    for (const job of pending) {
      try {
        await this.executeJob(job);
        job.status = 'completed';
      } catch {
        job.status = 'failed';
      }
    }

    this.jobs = this.jobs.filter(
      (j) => j.status === 'pending' || Date.now() - j.executeAt.getTime() < 86_400_000,
    );
  }

  private async executeJob(job: ScheduledJob) {
    switch (job.type) {
      case 'publish_page': {
        const pageId = job.payload.pageId as string;
        await this.prisma.client.page.update({
          where: { id: pageId },
          data: { published: true },
        });
        break;
      }
      case 'unpublish_page': {
        const pageId = job.payload.pageId as string;
        await this.prisma.client.page.update({
          where: { id: pageId },
          data: { published: false },
        });
        break;
      }
      case 'create_backup': {
        const pages = await this.prisma.client.page.findMany({
          where: { projectId: job.projectId, deletedAt: null },
        });
        await this.prisma.client.snapshot.create({
          data: {
            projectId: job.projectId,
            data: {
              type: 'backup',
              userId: 'scheduler',
              backup: {
                version: '1.0',
                projectId: job.projectId,
                timestamp: new Date().toISOString(),
                pages: pages.map((p) => ({
                  id: p.id, title: p.title, slug: p.slug, path: p.path,
                  content: p.content, seo: p.seo, published: p.published,
                })),
              },
            } as any,
          },
        });
        break;
      }
      case 'expire_abtest': {
        const testId = job.payload.testId as string;
        await this.prisma.client.aBTest.update({
          where: { id: testId },
          data: { status: 'completed' },
        });
        break;
      }
      default:
        break;
    }
  }
}
