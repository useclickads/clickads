'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signup } from '../../../lib/auth';
import { useAuth } from '../../providers';

export default function SignupPage() {
  const auth = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      setLoading(false);
      return;
    }

    try {
      const payload = await signup(email, password, name || undefined);
      auth.signIn(payload);
      router.push('/auth/success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create account.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 style={titleStyle}>Create Account</h1>
      <p style={subtitleStyle}>Sign up with your email and password.</p>
      <form onSubmit={handleSubmit} style={formStyle}>
        <label style={labelStyle}>
          Name (optional)
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
          />
        </label>
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
        <label style={labelStyle}>
          Password
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />
        </label>
        <button type="submit" style={buttonStyle} disabled={loading}>
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>
      {error && <p style={errorStyle}>{error}</p>}
      <div style={footerStyle}>
        <Link href="/auth/login" style={linkStyle}>Already have an account?</Link>
        <Link href="/auth/magic-link" style={linkStyle}>Use magic link</Link>
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
const errorStyle: React.CSSProperties = { marginTop: 16, color: '#dc2626' };
