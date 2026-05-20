import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={code}>404</h1>
        <h2 style={title}>Page not found</h2>
        <p style={message}>The page you're looking for doesn't exist or has been moved.</p>
        <div style={actions}>
          <Link href="/dashboard" style={primaryLink}>Go to Dashboard</Link>
          <Link href="/" style={secondaryLink}>Home</Link>
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
const code: React.CSSProperties = { margin: 0, fontSize: '5rem', fontWeight: 900, color: '#e2e8f0', lineHeight: 1 };
const title: React.CSSProperties = { margin: '8px 0', fontSize: '1.25rem', color: '#0f172a', fontWeight: 700 };
const message: React.CSSProperties = { margin: '0 0 24px', fontSize: '0.9rem', color: '#64748b', lineHeight: 1.5 };
const actions: React.CSSProperties = { display: 'flex', gap: 10, justifyContent: 'center' };
const primaryLink: React.CSSProperties = {
  padding: '10px 20px', borderRadius: 10, background: '#0f172a', color: '#fff',
  fontWeight: 600, fontSize: '0.85rem', textDecoration: 'none',
};
const secondaryLink: React.CSSProperties = {
  padding: '10px 20px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff',
  color: '#475569', fontWeight: 600, fontSize: '0.85rem', textDecoration: 'none',
};
