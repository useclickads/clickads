'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { resetPassword } from '../../../lib/auth';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setStatus(null);

    if (password !== confirm) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      setLoading(false);
      return;
    }

    try {
      const payload = await resetPassword(token, password);
      setStatus(payload.message + ' Redirecting to login...');
      setTimeout(() => router.push('/auth/login'), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to reset password.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 style={titleStyle}>Reset Password</h1>
      <p style={subtitleStyle}>Enter your reset token and choose a new password.</p>
      <form onSubmit={handleSubmit} style={formStyle}>
        <label style={labelStyle}>
          Reset Token
          <input
            type="text"
            required
            value={token}
            onChange={(e) => setToken(e.target.value)}
            style={inputStyle}
          />
        </label>
        <label style={labelStyle}>
          New Password
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />
        </label>
        <label style={labelStyle}>
          Confirm Password
          <input
            type="password"
            required
            minLength={8}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            style={inputStyle}
          />
        </label>
        <button type="submit" style={buttonStyle} disabled={loading}>
          {loading ? 'Resetting…' : 'Reset password'}
        </button>
      </form>
      {status && <p style={successStyle}>{status}</p>}
      {error && <p style={errorStyle}>{error}</p>}
      <div style={footerStyle}>
        <Link href="/auth/login" style={linkStyle}>Back to login</Link>
        <Link href="/auth/forgot-password" style={linkStyle}>Request a reset token</Link>
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
