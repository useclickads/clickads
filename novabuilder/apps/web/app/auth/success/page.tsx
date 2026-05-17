'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '../../providers';

export default function AuthSuccessPage() {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (auth.isAuthenticated) {
      const t = setTimeout(() => router.push('/dashboard'), 1500);
      return () => clearTimeout(t);
    }
  }, [auth.isAuthenticated, router]);

  if (!auth.isAuthenticated) {
    return (
      <div>
        <h1 style={titleStyle}>Not signed in</h1>
        <p style={subtitleStyle}>You are not authenticated yet.</p>
        <Link href="/auth/login" style={linkStyle}>
          Go to login
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 style={titleStyle}>Welcome back</h1>
      <p style={subtitleStyle}>You are signed in as {auth.user?.email}. Redirecting to dashboard...</p>
      <Link href="/dashboard" style={linkStyle}>
        Go to dashboard now
      </Link>
    </div>
  );
}

const titleStyle: React.CSSProperties = { fontSize: '2rem', margin: 0, color: '#0f172a' };
const subtitleStyle: React.CSSProperties = { marginTop: 10, color: '#475569', lineHeight: 1.7 };
const linkStyle: React.CSSProperties = { marginTop: 20, display: 'inline-block', color: '#2563eb', textDecoration: 'none', fontWeight: 600 };
