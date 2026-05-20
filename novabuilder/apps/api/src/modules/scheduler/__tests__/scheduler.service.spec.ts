import { describe, it, expect, vi } from 'vitest';

type JobType = 'publish_page' | 'unpublish_page' | 'create_backup' | 'expire_abtest';
type JobStatus = 'pending' | 'running' | 'completed' | 'failed';

type ScheduledJob = {
  id: string;
  type: JobType;
  projectId: string;
  scheduledAt: Date;
  status: JobStatus;
  payload: Record<string, unknown>;
  createdAt: Date;
};

function createJob(
  type: JobType,
  projectId: string,
  scheduledAt: Date,
  payload: Record<string, unknown> = {},
): ScheduledJob {
  return {
    id: Math.random().toString(36).slice(2),
    type,
    projectId,
    scheduledAt,
    status: 'pending',
    payload,
    createdAt: new Date(),
  };
}

function getReadyJobs(jobs: ScheduledJob[], now: Date): ScheduledJob[] {
  return jobs.filter((j) => j.status === 'pending' && j.scheduledAt <= now);
}

function cancelJob(jobs: ScheduledJob[], id: string): ScheduledJob[] {
  return jobs.filter((j) => j.id !== id || j.status !== 'pending');
}

function getJobsByProject(jobs: ScheduledJob[], projectId: string): ScheduledJob[] {
  return jobs.filter((j) => j.projectId === projectId).sort((a, b) => a.scheduledAt.getTime() - b.scheduledAt.getTime());
}

describe('SchedulerService', () => {
  it('creates a job with pending status', () => {
    const job = createJob('publish_page', 'p1', new Date('2026-06-01'));
    expect(job.status).toBe('pending');
    expect(job.type).toBe('publish_page');
    expect(job.projectId).toBe('p1');
  });

  it('finds ready jobs', () => {
    const now = new Date('2026-05-20T12:00:00Z');
    const jobs = [
      createJob('publish_page', 'p1', new Date('2026-05-20T11:00:00Z')),
      createJob('publish_page', 'p2', new Date('2026-05-20T13:00:00Z')),
      createJob('create_backup', 'p1', new Date('2026-05-20T12:00:00Z')),
    ];
    const ready = getReadyJobs(jobs, now);
    expect(ready).toHaveLength(2);
  });

  it('does not return non-pending jobs', () => {
    const jobs: ScheduledJob[] = [
      { ...createJob('publish_page', 'p1', new Date('2026-05-01')), status: 'completed' },
      { ...createJob('publish_page', 'p2', new Date('2026-05-01')), status: 'failed' },
      createJob('publish_page', 'p3', new Date('2026-05-01')),
    ];
    const ready = getReadyJobs(jobs, new Date('2026-06-01'));
    expect(ready).toHaveLength(1);
    expect(ready[0].projectId).toBe('p3');
  });

  it('cancels pending job', () => {
    const job = createJob('publish_page', 'p1', new Date('2026-06-01'));
    const jobs = [job];
    const remaining = cancelJob(jobs, job.id);
    expect(remaining).toHaveLength(0);
  });

  it('does not cancel non-pending job', () => {
    const job: ScheduledJob = { ...createJob('publish_page', 'p1', new Date('2026-06-01')), status: 'completed' };
    const jobs = [job];
    const remaining = cancelJob(jobs, job.id);
    expect(remaining).toHaveLength(1);
  });

  it('filters jobs by project', () => {
    const jobs = [
      createJob('publish_page', 'p1', new Date('2026-06-01')),
      createJob('create_backup', 'p1', new Date('2026-06-02')),
      createJob('publish_page', 'p2', new Date('2026-06-01')),
    ];
    const p1Jobs = getJobsByProject(jobs, 'p1');
    expect(p1Jobs).toHaveLength(2);
    expect(p1Jobs[0].scheduledAt <= p1Jobs[1].scheduledAt).toBe(true);
  });

  it('sorts project jobs by scheduled time', () => {
    const jobs = [
      createJob('create_backup', 'p1', new Date('2026-06-03')),
      createJob('publish_page', 'p1', new Date('2026-06-01')),
      createJob('unpublish_page', 'p1', new Date('2026-06-02')),
    ];
    const sorted = getJobsByProject(jobs, 'p1');
    expect(sorted[0].type).toBe('publish_page');
    expect(sorted[1].type).toBe('unpublish_page');
    expect(sorted[2].type).toBe('create_backup');
  });

  it('handles empty job list', () => {
    expect(getReadyJobs([], new Date())).toEqual([]);
    expect(getJobsByProject([], 'p1')).toEqual([]);
  });
});
