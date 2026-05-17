'use client';

import Link from 'next/link';
import { useAuth } from './providers';

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div style={pageStyle}>
      <nav style={navStyle}>
        <span style={brand}>NovaBuilder</span>
        <div style={navLinks}>
          {isAuthenticated ? (
            <Link href="/dashboard" style={navLink}>Dashboard</Link>
          ) : (
            <>
              <Link href="/auth/login" style={navLink}>Login</Link>
              <Link href="/auth/signup" style={ctaSmall}>Get Started</Link>
            </>
          )}
        </div>
      </nav>

      <main style={heroSection}>
        <h1 style={heroTitle}>Build websites visually,<br />ship with confidence</h1>
        <p style={heroSubtitle}>
          NovaBuilder is an AI-native no-code website builder for teams.
          Drag-and-drop blocks, collaborate in real-time, and publish in seconds.
        </p>
        <div style={heroCtas}>
          <Link href={isAuthenticated ? '/dashboard' : '/auth/signup'} style={primaryCta}>
            {isAuthenticated ? 'Go to Dashboard' : 'Start Building Free'}
          </Link>
          <Link href="/auth/login" style={secondaryCta}>
            Live Demo
          </Link>
        </div>
      </main>

      <section style={featuresSection}>
        <div style={featureGrid}>
          <div style={featureCard}>
            <span style={featureIcon}>◆</span>
            <h3 style={featureTitle}>Visual Editor</h3>
            <p style={featureDesc}>Drag-and-drop blocks to compose pages. 11+ block types with live preview and responsive design.</p>
          </div>
          <div style={featureCard}>
            <span style={featureIcon}>⚡</span>
            <h3 style={featureTitle}>Instant Publish</h3>
            <p style={featureDesc}>Go from draft to live in one click. Custom domains, SSL, and edge deployment included.</p>
          </div>
          <div style={featureCard}>
            <span style={featureIcon}>👥</span>
            <h3 style={featureTitle}>Team Collaboration</h3>
            <p style={featureDesc}>Invite team members, assign roles, and build together with real-time presence.</p>
          </div>
          <div style={featureCard}>
            <span style={featureIcon}>🤖</span>
            <h3 style={featureTitle}>AI-Powered</h3>
            <p style={featureDesc}>Generate pages from prompts, get smart block suggestions, and auto-optimize content.</p>
          </div>
        </div>
      </section>

      <footer style={footerStyle}>
        <span style={footerText}>© 2026 NovaBuilder. All rights reserved.</span>
      </footer>
    </div>
  );
}

const pageStyle: React.CSSProperties = { minHeight: '100vh', fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif' };
const navStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 32px', maxWidth: 1200, margin: '0 auto' };
const brand: React.CSSProperties = { fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' };
const navLinks: React.CSSProperties = { display: 'flex', gap: 16, alignItems: 'center' };
const navLink: React.CSSProperties = { color: '#475569', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' };
const ctaSmall: React.CSSProperties = { padding: '8px 18px', borderRadius: 8, background: '#0f172a', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: '0.85rem' };
const heroSection: React.CSSProperties = { textAlign: 'center', padding: '80px 32px 64px', maxWidth: 800, margin: '0 auto' };
const heroTitle: React.CSSProperties = { fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.15, color: '#0f172a', fontWeight: 800, margin: 0 };
const heroSubtitle: React.CSSProperties = { marginTop: 20, fontSize: '1.1rem', color: '#475569', lineHeight: 1.7, maxWidth: 600, marginLeft: 'auto', marginRight: 'auto' };
const heroCtas: React.CSSProperties = { marginTop: 32, display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' };
const primaryCta: React.CSSProperties = { padding: '16px 32px', borderRadius: 12, background: '#0f172a', color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: '1rem' };
const secondaryCta: React.CSSProperties = { padding: '16px 32px', borderRadius: 12, border: '2px solid #e2e8f0', color: '#475569', textDecoration: 'none', fontWeight: 700, fontSize: '1rem' };
const featuresSection: React.CSSProperties = { padding: '64px 32px', maxWidth: 1200, margin: '0 auto' };
const featureGrid: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24 };
const featureCard: React.CSSProperties = { padding: 28, borderRadius: 16, background: '#f8fafc', border: '1px solid #e2e8f0' };
const featureIcon: React.CSSProperties = { fontSize: '1.5rem' };
const featureTitle: React.CSSProperties = { margin: '12px 0 0', fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' };
const featureDesc: React.CSSProperties = { margin: '8px 0 0', fontSize: '0.9rem', color: '#475569', lineHeight: 1.6 };
const footerStyle: React.CSSProperties = { padding: '32px', textAlign: 'center', borderTop: '1px solid #e2e8f0' };
const footerText: React.CSSProperties = { color: '#94a3b8', fontSize: '0.85rem' };
