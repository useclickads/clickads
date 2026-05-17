'use client';

import { useState } from 'react';
import Link from 'next/link';
import { forgotPassword } from '../../../lib/auth';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setStatus(null);

    try {
      const payload = await forgotPassword(email);
      setStatus(payload.message);
      if (payload.token) setResetToken(payload.token);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to request password reset.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 style={titleStyle}>Forgot Password</h1>
      <p style={subtitleStyle}>Enter your email to receive a password reset link.</p>
      <form onSubmit={handleSubmit} style={formStyle}>
        <label style={labelStyle}>
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />
        </label>
        <button type="submit" style={buttonStyle} disabled={loading}>
          {loading ? 'Requesting…' : 'Send reset link'}
        </button>
      </form>
      {status && <p style={successStyle}>{status}</p>}
      {resetToken && (
        <div style={cardStyle}>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
            Dev mode — use this token on the reset page:
          </p>
          <code style={{ wordBreak: 'break-all', fontSize: '0.8rem' }}>{resetToken}</code>
        </div>
      )}
      {error && <p style={errorStyle}>{error}</p>}
      <div style={footerStyle}>
        <Link href="/auth/login" style={linkStyle}>Back to login</Link>
        <Link href="/auth/reset-password" style={linkStyle}>Have a token?</Link>
      </div>
    </div>
  );
}

const titleStyle: React.CSSProperties = { fontSize: '2rem', margin: 0, color: '#0f172a' };
const subtitleStyle: React.CSSProperties = { marginTop: 10, color: '#475569', lineHeight: 1.7 };
const formStyle: React.CSSProperties = { marginTop: 28, display: 'grid', gap: 16 };
const labelStyle: React.CSSProperties = { display: 'grid', gap: 8, color: '#334155', fontSize: '0.95rem' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '12px 14px', borderRadius: 12, border: '1px solid #cbd5e1', fontSize: '1rem' };
const buttonStyle: React.CSSProperties = { padding: '14px 16px', borderRadius: 14, border: 'none', background: '#0f172a', color: '#ffffff', fontWeight: 700, cursor: 'pointer' };
const footerStyle: React.CSSProperties = { marginTop: 18, display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' };
const linkStyle: React.CSSProperties = { color: '#2563eb', textDecoration: 'none', fontWeight: 600 };
const successStyle: React.CSSProperties = { marginTop: 16, color: '#16a34a' };
const errorStyle: React.CSSProperties = { marginTop: 16, color: '#dc2626' };
const cardStyle: React.CSSProperties = { marginTop: 16, padding: 16, borderRadius: 12, background: '#f8fafc', border: '1px solid #e2e8f0', display: 'grid', gap: 8 };
