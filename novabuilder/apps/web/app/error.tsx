'use client';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={iconCircle}>!</div>
        <h2 style={title}>Something went wrong</h2>
        <p style={message}>{error.message || 'An unexpected error occurred.'}</p>
        <div style={actions}>
          <button onClick={reset} style={primaryBtn}>Try Again</button>
          <a href="/dashboard" style={secondaryLink}>Go to Dashboard</a>
        </div>
      </div>
    </div>
  );
}

const containerStyle: React.CSSProperties = {
  minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
  background: '#f8fafc', padding: 24,
};
const cardStyle: React.CSSProperties = {
  maxWidth: 440, textAlign: 'center', padding: 48, borderRadius: 20,
  background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
};
const iconCircle: React.CSSProperties = {
  width: 56, height: 56, borderRadius: 28, background: '#fef2f2', color: '#dc2626',
  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem',
  fontWeight: 800, margin: '0 auto 16px',
};
const title: React.CSSProperties = { margin: '0 0 8px', fontSize: '1.25rem', color: '#0f172a', fontWeight: 700 };
const message: React.CSSProperties = { margin: '0 0 24px', fontSize: '0.9rem', color: '#64748b', lineHeight: 1.5 };
const actions: React.CSSProperties = { display: 'flex', gap: 10, justifyContent: 'center' };
const primaryBtn: React.CSSProperties = {
  padding: '10px 20px', borderRadius: 10, border: 'none', background: '#0f172a',
  color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem',
};
const secondaryLink: React.CSSProperties = {
  padding: '10px 20px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff',
  color: '#475569', fontWeight: 600, fontSize: '0.85rem', textDecoration: 'none',
};
