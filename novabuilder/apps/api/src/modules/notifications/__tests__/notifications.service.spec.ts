import { describe, it, expect } from 'vitest';

type NotificationType =
  | 'project_published' | 'deploy_success' | 'deploy_failed'
  | 'form_submission' | 'team_invite' | 'comment_mention' | 'system';

type NotificationPreferences = {
  email: boolean;
  inApp: boolean;
  mutedTypes: NotificationType[];
};

const DEFAULT_PREFERENCES: NotificationPreferences = {
  email: true,
  inApp: true,
  mutedTypes: [],
};

function getPreferences(
  store: Map<string, NotificationPreferences>,
  userId: string,
): NotificationPreferences {
  return store.get(userId) || { ...DEFAULT_PREFERENCES };
}

function updatePreferences(
  store: Map<string, NotificationPreferences>,
  userId: string,
  updates: Partial<NotificationPreferences>,
): NotificationPreferences {
  const current = getPreferences(store, userId);
  const updated = { ...current, ...updates };
  store.set(userId, updated);
  return updated;
}

function shouldNotify(prefs: NotificationPreferences, type: NotificationType): boolean {
  if (!prefs.inApp) return false;
  if (prefs.mutedTypes.includes(type)) return false;
  return true;
}

function batchNotifications(
  items: { userId: string; type: string; payload: Record<string, unknown> }[],
): Map<string, { userId: string; type: string; payload: Record<string, unknown>; count: number }> {
  const batched = new Map<string, { userId: string; type: string; payload: Record<string, unknown>; count: number }>();
  for (const item of items) {
    const key = `${item.userId}:${item.type}`;
    const existing = batched.get(key);
    if (existing) {
      existing.count++;
      existing.payload = { ...existing.payload, batchCount: existing.count };
    } else {
      batched.set(key, { ...item, count: 1 });
    }
  }
  return batched;
}

describe('NotificationsService', () => {
  it('returns default preferences for unknown user', () => {
    const store = new Map<string, NotificationPreferences>();
    const prefs = getPreferences(store, 'user1');
    expect(prefs.email).toBe(true);
    expect(prefs.inApp).toBe(true);
    expect(prefs.mutedTypes).toEqual([]);
  });

  it('updates preferences', () => {
    const store = new Map<string, NotificationPreferences>();
    const updated = updatePreferences(store, 'user1', { email: false });
    expect(updated.email).toBe(false);
    expect(updated.inApp).toBe(true);
  });

  it('persists preference updates', () => {
    const store = new Map<string, NotificationPreferences>();
    updatePreferences(store, 'user1', { email: false });
    const prefs = getPreferences(store, 'user1');
    expect(prefs.email).toBe(false);
  });

  it('should notify for unmuted types', () => {
    const prefs: NotificationPreferences = { email: true, inApp: true, mutedTypes: [] };
    expect(shouldNotify(prefs, 'deploy_success')).toBe(true);
  });

  it('should not notify for muted types', () => {
    const prefs: NotificationPreferences = { email: true, inApp: true, mutedTypes: ['form_submission'] };
    expect(shouldNotify(prefs, 'form_submission')).toBe(false);
    expect(shouldNotify(prefs, 'deploy_success')).toBe(true);
  });

  it('should not notify when inApp is disabled', () => {
    const prefs: NotificationPreferences = { email: true, inApp: false, mutedTypes: [] };
    expect(shouldNotify(prefs, 'deploy_success')).toBe(false);
  });

  it('batches notifications by user and type', () => {
    const items = [
      { userId: 'u1', type: 'form_submission', payload: { formName: 'contact' } },
      { userId: 'u1', type: 'form_submission', payload: { formName: 'contact' } },
      { userId: 'u1', type: 'form_submission', payload: { formName: 'contact' } },
      { userId: 'u1', type: 'deploy_success', payload: {} },
    ];
    const batched = batchNotifications(items);
    expect(batched.size).toBe(2);
    expect(batched.get('u1:form_submission')?.count).toBe(3);
    expect(batched.get('u1:deploy_success')?.count).toBe(1);
  });

  it('keeps separate batches for different users', () => {
    const items = [
      { userId: 'u1', type: 'deploy_success', payload: {} },
      { userId: 'u2', type: 'deploy_success', payload: {} },
    ];
    const batched = batchNotifications(items);
    expect(batched.size).toBe(2);
  });

  it('muting and unmuting types works correctly', () => {
    const store = new Map<string, NotificationPreferences>();
    updatePreferences(store, 'user1', { mutedTypes: ['system', 'team_invite'] });
    let prefs = getPreferences(store, 'user1');
    expect(shouldNotify(prefs, 'system')).toBe(false);
    expect(shouldNotify(prefs, 'team_invite')).toBe(false);

    prefs.mutedTypes = prefs.mutedTypes.filter((t) => t !== 'team_invite');
    store.set('user1', prefs);
    prefs = getPreferences(store, 'user1');
    expect(shouldNotify(prefs, 'team_invite')).toBe(true);
    expect(shouldNotify(prefs, 'system')).toBe(false);
  });
});
