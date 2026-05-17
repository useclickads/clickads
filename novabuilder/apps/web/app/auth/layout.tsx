import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Auth | NovaBuilder',
  description: 'Login, signup, and magic link authentication for NovaBuilder.'
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '24px', background: '#f8fafc', fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif' }}>
      <div style={{ width: '100%', maxWidth: 480, padding: '32px', borderRadius: 24, background: '#ffffff', boxShadow: '0 20px 60px rgba(15, 23, 42, 0.12)' }}>
        <header style={{ marginBottom: 24 }}>
          <Link href="/" style={{ color: '#0f172a', textDecoration: 'none', fontSize: 24, fontWeight: 700 }}>
            NovaBuilder
          </Link>
        </header>
        {children}
      </div>
    </div>
  );
}
