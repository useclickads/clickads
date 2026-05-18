import { Injectable } from '@nestjs/common';

type WorkflowTrigger = 'form.submitted' | 'page.published' | 'deployment.created' | 'entry.created' | 'collaborator.invited';
type ActionType = 'send_email' | 'send_webhook' | 'create_notification' | 'update_entry_status' | 'log_audit';

type WorkflowStep = {
  action: ActionType;
  config: Record<string, unknown>;
  condition?: { field: string; operator: 'equals' | 'contains' | 'not_empty' | 'gt' | 'lt'; value?: unknown };
};

type Workflow = {
  id: string;
  projectId: string;
  name: string;
  trigger: WorkflowTrigger;
  steps: WorkflowStep[];
  enabled: boolean;
  createdAt: Date;
  executionCount: number;
  lastExecutedAt: Date | null;
};

@Injectable()
export class WorkflowsService {
  private workflows = new Map<string, Workflow>();
  private executionLog: { workflowId: string; trigger: string; status: 'success' | 'error'; stepsRun: number; timestamp: Date; error?: string }[] = [];

  async create(projectId: string, data: { name: string; trigger: WorkflowTrigger; steps: WorkflowStep[] }): Promise<Workflow> {
    const id = `wf_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
    const workflow: Workflow = {
      id,
      projectId,
      name: data.name,
      trigger: data.trigger,
      steps: data.steps,
      enabled: true,
      createdAt: new Date(),
      executionCount: 0,
      lastExecutedAt: null,
    };
    this.workflows.set(id, workflow);
    return workflow;
  }

  async list(projectId: string): Promise<Workflow[]> {
    return Array.from(this.workflows.values()).filter((w) => w.projectId === projectId);
  }

  async get(id: string): Promise<Workflow | null> {
    return this.workflows.get(id) || null;
  }

  async update(id: string, data: { name?: string; steps?: WorkflowStep[]; enabled?: boolean }): Promise<Workflow | null> {
    const workflow = this.workflows.get(id);
    if (!workflow) return null;
    if (data.name !== undefined) workflow.name = data.name;
    if (data.steps !== undefined) workflow.steps = data.steps;
    if (data.enabled !== undefined) workflow.enabled = data.enabled;
    return workflow;
  }

  async delete(id: string): Promise<boolean> {
    return this.workflows.delete(id);
  }

  async execute(projectId: string, trigger: WorkflowTrigger, payload: Record<string, unknown>): Promise<{ executed: number; results: { workflowId: string; status: string }[] }> {
    const matching = Array.from(this.workflows.values()).filter(
      (w) => w.projectId === projectId && w.trigger === trigger && w.enabled,
    );

    const results: { workflowId: string; status: string }[] = [];

    for (const workflow of matching) {
      try {
        let stepsRun = 0;
        for (const step of workflow.steps) {
          if (step.condition && !this.evaluateCondition(step.condition, payload)) {
            continue;
          }
          await this.executeStep(step, payload);
          stepsRun++;
        }

        workflow.executionCount++;
        workflow.lastExecutedAt = new Date();
        results.push({ workflowId: workflow.id, status: 'success' });
        this.executionLog.push({ workflowId: workflow.id, trigger, status: 'success', stepsRun, timestamp: new Date() });
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error';
        results.push({ workflowId: workflow.id, status: `error: ${errorMsg}` });
        this.executionLog.push({ workflowId: workflow.id, trigger, status: 'error', stepsRun: 0, timestamp: new Date(), error: errorMsg });
      }
    }

    return { executed: results.length, results };
  }

  async getExecutionLog(workflowId?: string, limit = 50) {
    let logs = this.executionLog;
    if (workflowId) logs = logs.filter((l) => l.workflowId === workflowId);
    return logs.slice(-limit).reverse();
  }

  private evaluateCondition(condition: WorkflowStep['condition'], payload: Record<string, unknown>): boolean {
    if (!condition) return true;
    const value = payload[condition.field];

    switch (condition.operator) {
      case 'equals': return value === condition.value;
      case 'contains': return typeof value === 'string' && typeof condition.value === 'string' && value.includes(condition.value);
      case 'not_empty': return value !== undefined && value !== null && value !== '';
      case 'gt': return typeof value === 'number' && typeof condition.value === 'number' && value > condition.value;
      case 'lt': return typeof value === 'number' && typeof condition.value === 'number' && value < condition.value;
      default: return true;
    }
  }

  private async executeStep(step: WorkflowStep, payload: Record<string, unknown>): Promise<void> {
    switch (step.action) {
      case 'send_webhook': {
        const url = step.config.url as string;
        if (!url) return;
        await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, workflow_action: step.action, timestamp: new Date().toISOString() }),
          signal: AbortSignal.timeout(10000),
        }).catch(() => {});
        break;
      }
      case 'send_email':
      case 'create_notification':
      case 'update_entry_status':
      case 'log_audit':
        break;
    }
  }
}
