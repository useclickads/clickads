'use client';

import { useAuth } from '../providers';
import { ProtectedRoute } from '../../components/protected-route';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const { user, signOut } = useAuth();

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <h1 style={titleStyle}>Dashboard</h1>
        <button onClick={signOut} style={logoutStyle}>Sign out</button>
      </header>
      <div style={cardStyle}>
        <p style={{ margin: 0, fontWeight: 600, color: '#0f172a' }}>
          Welcome, {user?.name || user?.email}
        </p>
        <p style={{ margin: '8px 0 0', color: '#64748b', fontSize: '0.9rem' }}>
          You are authenticated and viewing a protected route.
        </p>
      </div>
      <div style={gridStyle}>
        <div style={statCard}>
          <span style={statLabel}>Projects</span>
          <span style={statValue}>0</span>
        </div>
        <div style={statCard}>
          <span style={statLabel}>Pages</span>
          <span style={statValue}>0</span>
        </div>
        <div style={statCard}>
          <span style={statLabel}>Deployments</span>
          <span style={statValue}>0</span>
        </div>
      </div>
    </div>
  );
}

const containerStyle: React.CSSProperties = { maxWidth: 960, margin: '0 auto', padding: '40px 24px' };
const headerStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const titleStyle: React.CSSProperties = { fontSize: '1.75rem', margin: 0, color: '#0f172a' };
const logoutStyle: React.CSSProperties = { padding: '10px 16px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontWeight: 600, color: '#475569' };
const cardStyle: React.CSSProperties = { marginTop: 24, padding: 24, borderRadius: 16, background: '#f8fafc', border: '1px solid #e2e8f0' };
const gridStyle: React.CSSProperties = { marginTop: 24, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 };
const statCard: React.CSSProperties = { padding: 20, borderRadius: 14, background: '#fff', border: '1px solid #e2e8f0', display: 'grid', gap: 4 };
const statLabel: React.CSSProperties = { fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' };
const statValue: React.CSSProperties = { fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' };
