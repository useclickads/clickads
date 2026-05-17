'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { requestMagicLink, verifyMagicLink } from '../../../lib/auth';
import { useAuth } from '../../providers';

export default function MagicLinkPage() {
  const auth = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingRequest, setLoadingRequest] = useState(false);
  const [loadingVerify, setLoadingVerify] = useState(false);

  async function handleRequestMagicLink(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoadingRequest(true);
    setError(null);
    setStatus(null);

    try {
      const payload = await requestMagicLink(email);
      setStatus(`Magic link created. Use this token to verify: ${payload.token}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to request magic link.');
    } finally {
      setLoadingRequest(false);
    }
  }

  async function verifyMagicLinkToken(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoadingVerify(true);
    setError(null);
    setStatus(null);

    try {
      const payload = await verifyMagicLink(token);
      auth.signIn(payload);
      setStatus('Magic link verified successfully. Redirecting...');
      router.push('/auth/success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to verify magic link.');
    } finally {
      setLoadingVerify(false);
    }
  }

  return (
    <div>
      <h1 style={titleStyle}>Magic Link Authentication</h1>
      <p style={subtitleStyle}>Request a one-time sign-in token, then verify it below.</p>
      <form onSubmit={handleRequestMagicLink} style={formStyle}>
        <label style={labelStyle}>
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            style={inputStyle}
          />
        </label>
        <button type="submit" style={buttonStyle} disabled={loadingRequest}>
          {loadingRequest ? 'Requesting…' : 'Request magic link'}
        </button>
      </form>

      <form onSubmit={verifyMagicLinkToken} style={{ ...formStyle, marginTop: 24 }}>
        <label style={labelStyle}>
          Magic link token
          <input
            type="text"
            required
            value={token}
            onChange={(event) => setToken(event.target.value)}
            style={inputStyle}
          />
        </label>
        <button type="submit" style={buttonStyle} disabled={loadingVerify}>
          {loadingVerify ? 'Verifying…' : 'Verify token'}
        </button>
      </form>

      {status && <p style={successStyle}>{status}</p>}
      {error && <p style={errorStyle}>{error}</p>}
      <div style={footerStyle}>
        <Link href="/auth/login" style={linkStyle}>Return to login</Link>
        <Link href="/auth/signup" style={linkStyle}>Request signup link</Link>
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
