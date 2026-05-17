import Link from 'next/link';

export default function AuthIndexPage() {
  return (
    <main>
      <div style={{ textAlign: 'center' }}>
        <p style={{ marginBottom: 8, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.14em' }}>
          Welcome back
        </p>
        <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 700, color: '#0f172a' }}>
          Choose how you want to authenticate
        </h1>
        <p style={{ marginTop: 12, color: '#475569', lineHeight: 1.7 }}>
          Use password login, signup via magic link, or request a one-time email link to sign in.
        </p>
      </div>

      <div style={{ marginTop: 32, display: 'grid', gap: 14 }}>
        <Link href="/auth/login" style={cardStyle}>
          <h2 style={cardTitle}>Login</h2>
          <p style={cardText}>Sign in with email and password.</p>
        </Link>
        <Link href="/auth/signup" style={cardStyle}>
          <h2 style={cardTitle}>Signup</h2>
          <p style={cardText}>Create an account and request a magic link.</p>
        </Link>
        <Link href="/auth/magic-link" style={cardStyle}>
          <h2 style={cardTitle}>Magic link</h2>
          <p style={cardText}>Request a one-time sign-in link via email.</p>
        </Link>
      </div>
    </main>
  );
}

const cardStyle: React.CSSProperties = {
  display: 'block',
  padding: '20px 24px',
  borderRadius: 18,
  border: '1px solid #e2e8f0',
  background: '#f8fafc',
  color: '#0f172a',
  textDecoration: 'none'
};

const cardTitle: React.CSSProperties = {
  margin: 0,
  fontSize: '1.15rem',
  fontWeight: 700
};

const cardText: React.CSSProperties = {
  marginTop: 8,
  color: '#475569',
  lineHeight: 1.6
};
