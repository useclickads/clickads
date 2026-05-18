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
        <h2 style={sectionHeading}>Everything you need to build and ship</h2>
        <div style={featureGrid}>
          <div style={featureCard}>
            <h3 style={featureTitle}>Visual Editor</h3>
            <p style={featureDesc}>19 block types with drag-and-drop, live preview, responsive toggle, and keyboard shortcuts.</p>
          </div>
          <div style={featureCard}>
            <h3 style={featureTitle}>Instant Publish</h3>
            <p style={featureDesc}>One-click deploy with custom domains, SSL, sitemap generation, and scheduled publishing.</p>
          </div>
          <div style={featureCard}>
            <h3 style={featureTitle}>Real-time Collaboration</h3>
            <p style={featureDesc}>Live cursors, presence tracking, and OT-based conflict resolution for concurrent editing.</p>
          </div>
          <div style={featureCard}>
            <h3 style={featureTitle}>AI-Powered</h3>
            <p style={featureDesc}>Generate pages from prompts with Claude or GPT-4o. Smart block suggestions and copy generation.</p>
          </div>
          <div style={featureCard}>
            <h3 style={featureTitle}>Analytics & Funnels</h3>
            <p style={featureDesc}>Page views, heatmaps, funnel tracking, A/B testing, and conversion rate analysis.</p>
          </div>
          <div style={featureCard}>
            <h3 style={featureTitle}>Integrations</h3>
            <p style={featureDesc}>Connect Slack, Discord, Zapier, and custom webhooks. Workflow automation for event-driven actions.</p>
          </div>
          <div style={featureCard}>
            <h3 style={featureTitle}>CMS & i18n</h3>
            <p style={featureDesc}>Headless CMS with collections, entries, localization, and translation coverage tracking.</p>
          </div>
          <div style={featureCard}>
            <h3 style={featureTitle}>Quality Audits</h3>
            <p style={featureDesc}>Automated accessibility, SEO, performance, and content checks with actionable suggestions.</p>
          </div>
          <div style={featureCard}>
            <h3 style={featureTitle}>Plugin Marketplace</h3>
            <p style={featureDesc}>Browse, install, and publish plugins. Version management with changelog and rollback support.</p>
          </div>
        </div>
      </section>

      <section style={pricingSection}>
        <h2 style={sectionHeading}>Simple, transparent pricing</h2>
        <p style={pricingSubtitle}>Start free. Scale when you&apos;re ready.</p>
        <div style={pricingGrid}>
          <div style={pricingCard}>
            <h3 style={pricingPlanName}>Free</h3>
            <p style={pricingAmount}>$0<span style={pricingPeriod}>/mo</span></p>
            <ul style={pricingFeatures}>
              <li>3 projects</li>
              <li>10 pages per project</li>
              <li>100MB storage</li>
              <li>Community support</li>
            </ul>
            <Link href="/auth/signup" style={pricingCta}>Get Started</Link>
          </div>
          <div style={pricingCardPro}>
            <span style={popularBadge}>Most Popular</span>
            <h3 style={pricingPlanName}>Pro</h3>
            <p style={pricingAmount}>$29<span style={pricingPeriod}>/mo</span></p>
            <ul style={pricingFeatures}>
              <li>20 projects</li>
              <li>100 pages per project</li>
              <li>5GB storage</li>
              <li>Custom domains</li>
              <li>Priority support</li>
            </ul>
            <Link href="/auth/signup" style={pricingCtaPro}>Start Free Trial</Link>
          </div>
          <div style={pricingCard}>
            <h3 style={pricingPlanName}>Business</h3>
            <p style={pricingAmount}>$99<span style={pricingPeriod}>/mo</span></p>
            <ul style={pricingFeatures}>
              <li>Unlimited projects</li>
              <li>Unlimited pages</li>
              <li>50GB storage</li>
              <li>Team collaboration</li>
              <li>API access</li>
              <li>Dedicated support</li>
            </ul>
            <Link href="/auth/signup" style={pricingCta}>Contact Sales</Link>
          </div>
        </div>
      </section>

      <section style={ctaSection}>
        <h2 style={ctaHeading}>Ready to build something great?</h2>
        <p style={ctaSubtext}>Join thousands of teams using NovaBuilder to ship faster.</p>
        <Link href="/auth/signup" style={primaryCta}>Start Building Free</Link>
      </section>

      <footer style={footerStyle}>
        <div style={footerInner}>
          <span style={footerBrand}>NovaBuilder</span>
          <div style={footerLinks}>
            <Link href="/auth/login" style={footerLink}>Login</Link>
            <Link href="/auth/signup" style={footerLink}>Sign Up</Link>
          </div>
        </div>
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
const sectionHeading: React.CSSProperties = { textAlign: 'center', fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: '#0f172a', margin: '0 0 8px' };
const pricingSection: React.CSSProperties = { padding: '80px 32px', maxWidth: 1200, margin: '0 auto' };
const pricingSubtitle: React.CSSProperties = { textAlign: 'center', color: '#64748b', fontSize: '1rem', margin: '0 0 40px' };
const pricingGrid: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24, alignItems: 'start' };
const pricingCard: React.CSSProperties = { padding: 28, borderRadius: 16, border: '1px solid #e2e8f0', background: '#fff', display: 'flex', flexDirection: 'column', gap: 12 };
const pricingCardPro: React.CSSProperties = { ...pricingCard, border: '2px solid #2563eb', background: '#f0f9ff', position: 'relative' as const };
const popularBadge: React.CSSProperties = { position: 'absolute' as const, top: -12, left: '50%', transform: 'translateX(-50%)', padding: '4px 12px', borderRadius: 20, background: '#2563eb', color: '#fff', fontSize: '0.75rem', fontWeight: 700 };
const pricingPlanName: React.CSSProperties = { margin: 0, fontSize: '1.2rem', fontWeight: 700, color: '#0f172a' };
const pricingAmount: React.CSSProperties = { margin: 0, fontSize: '2.5rem', fontWeight: 800, color: '#0f172a' };
const pricingPeriod: React.CSSProperties = { fontSize: '1rem', fontWeight: 400, color: '#64748b' };
const pricingFeatures: React.CSSProperties = { margin: 0, padding: '0 0 0 16px', fontSize: '0.9rem', color: '#475569', lineHeight: 2 };
const pricingCta: React.CSSProperties = { marginTop: 'auto', padding: '12px 24px', borderRadius: 10, border: '2px solid #0f172a', color: '#0f172a', textDecoration: 'none', fontWeight: 700, textAlign: 'center' };
const pricingCtaPro: React.CSSProperties = { marginTop: 'auto', padding: '12px 24px', borderRadius: 10, background: '#0f172a', color: '#fff', textDecoration: 'none', fontWeight: 700, textAlign: 'center' };
const ctaSection: React.CSSProperties = { textAlign: 'center', padding: '80px 32px', background: '#f8fafc' };
const ctaHeading: React.CSSProperties = { fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: '#0f172a', margin: 0 };
const ctaSubtext: React.CSSProperties = { margin: '12px 0 24px', color: '#475569', fontSize: '1rem' };
const footerStyle: React.CSSProperties = { padding: '32px', borderTop: '1px solid #e2e8f0', maxWidth: 1200, margin: '0 auto' };
const footerInner: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 };
const footerBrand: React.CSSProperties = { fontWeight: 800, color: '#0f172a', fontSize: '1.1rem' };
const footerLinks: React.CSSProperties = { display: 'flex', gap: 16 };
const footerLink: React.CSSProperties = { color: '#64748b', textDecoration: 'none', fontSize: '0.85rem' };
const footerText: React.CSSProperties = { color: '#94a3b8', fontSize: '0.85rem' };
