'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '../../../components/protected-route';
import { useApi } from '../../../lib/use-api';

type Plan = { name: string; price: number; limits: { projects: number; pages: number; storage: number } };
type Subscription = { id?: string; plan: string; status: string };

export default function BillingPage() {
  return (
    <ProtectedRoute>
      <BillingSettings />
    </ProtectedRoute>
  );
}

function BillingSettings() {
  const api = useApi();
  const [plans, setPlans] = useState<Record<string, Plan>>({});
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [switching, setSwitching] = useState(false);

  const load = useCallback(async () => {
    try {
      const [p, s] = await Promise.all([
        api.get<Record<string, Plan>>('/billing/plans'),
        api.get<Subscription>('/billing/subscription'),
      ]);
      setPlans(p);
      setSubscription(s);
    } catch {}
    setLoading(false);
  }, [api]);

  useEffect(() => { load(); }, [load]);

  async function handleSwitch(plan: string) {
    setSwitching(true);
    try {
      await api.post('/billing/subscribe', { plan });
      load();
    } catch {}
    setSwitching(false);
  }

  async function handleCancel() {
    if (!confirm('Cancel your subscription? You will be downgraded to the free plan.')) return;
    try {
      await api.delete('/billing/subscription');
      load();
    } catch {}
  }

  if (loading) return <div style={containerStyle}><p style={muted}>Loading...</p></div>;

  const currentPlan = subscription?.plan || 'free';

  return (
    <div style={containerStyle}>
      <nav style={navStyle}>
        <Link href="/dashboard" style={linkStyle}>Dashboard</Link>
        <span style={muted}>/</span>
        <span style={{ color: '#0f172a', fontWeight: 600 }}>Billing</span>
      </nav>

      <h1 style={titleStyle}>Plans & Billing</h1>
      <p style={muted}>Current plan: <strong>{plans[currentPlan]?.name || currentPlan}</strong></p>

      <div style={plansGrid}>
        {Object.entries(plans).map(([key, plan]) => (
          <div key={key} style={planCard(key === currentPlan)}>
            <h3 style={planName}>{plan.name}</h3>
            <p style={planPrice}>${plan.price}<span style={planPeriod}>/mo</span></p>
            <ul style={featureList}>
              <li>{plan.limits.projects === -1 ? 'Unlimited' : plan.limits.projects} projects</li>
              <li>{plan.limits.pages === -1 ? 'Unlimited' : plan.limits.pages} pages per project</li>
              <li>{plan.limits.storage >= 1000 ? `${plan.limits.storage / 1000}GB` : `${plan.limits.storage}MB`} storage</li>
            </ul>
            {key === currentPlan ? (
              <span style={currentBadge}>Current Plan</span>
            ) : (
              <button onClick={() => handleSwitch(key)} style={switchBtn} disabled={switching}>
                {switching ? 'Switching…' : key === 'free' ? 'Downgrade' : 'Upgrade'}
              </button>
            )}
          </div>
        ))}
      </div>

      {currentPlan !== 'free' && (
        <button onClick={handleCancel} style={cancelBtn}>Cancel Subscription</button>
      )}
    </div>
  );
}

const containerStyle: React.CSSProperties = { maxWidth: 900, margin: '0 auto', padding: '40px 24px' };
const navStyle: React.CSSProperties = { display: 'flex', gap: 8, alignItems: 'center', fontSize: '0.9rem' };
const titleStyle: React.CSSProperties = { fontSize: '1.5rem', margin: '20px 0 4px', color: '#0f172a' };
const muted: React.CSSProperties = { color: '#64748b', fontSize: '0.9rem' };
const linkStyle: React.CSSProperties = { color: '#2563eb', textDecoration: 'none', fontWeight: 600 };
const plansGrid: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginTop: 24 };
const planCard = (active: boolean): React.CSSProperties => ({ padding: 24, borderRadius: 16, border: active ? '2px solid #2563eb' : '1px solid #e2e8f0', background: active ? '#f0f9ff' : '#fff', display: 'flex', flexDirection: 'column', gap: 12 });
const planName: React.CSSProperties = { margin: 0, fontSize: '1.1rem', color: '#0f172a' };
const planPrice: React.CSSProperties = { margin: 0, fontSize: '2rem', fontWeight: 700, color: '#0f172a' };
const planPeriod: React.CSSProperties = { fontSize: '0.9rem', fontWeight: 400, color: '#64748b' };
const featureList: React.CSSProperties = { margin: 0, padding: '0 0 0 16px', fontSize: '0.85rem', color: '#475569', lineHeight: 1.8 };
const currentBadge: React.CSSProperties = { padding: '8px 16px', borderRadius: 8, background: '#dcfce7', color: '#16a34a', fontWeight: 600, fontSize: '0.85rem', textAlign: 'center' };
const switchBtn: React.CSSProperties = { padding: '10px 20px', borderRadius: 10, border: 'none', background: '#0f172a', color: '#fff', fontWeight: 600, cursor: 'pointer' };
const cancelBtn: React.CSSProperties = { marginTop: 24, padding: '10px 20px', borderRadius: 10, border: '1px solid #fecaca', background: '#fff', color: '#dc2626', fontWeight: 600, cursor: 'pointer' };
