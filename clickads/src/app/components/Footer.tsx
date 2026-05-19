'use client';
import Link from 'next/link';

const links = {
  Services: [
    { label: 'Google Ads', href: '/services' },
    { label: 'Meta Ads', href: '/services' },
    { label: 'SEO', href: '/services' },
    { label: 'Email Marketing', href: '/services' },
    { label: 'AI Creatives', href: '/services' },
    { label: 'Web Development', href: '/services' },
  ],
  Products: [
    { label: 'lidflow CRM', href: '/products/lidflow' },
    { label: 'GrwFit', href: '/products/grwfit' },
  ],
  Company: [
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
    { label: 'Free Audit', href: '/contact' },
  ],
};

export default function Footer() {
  return (
    <>
      <style>{`
        .footer-grid {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 64px 48px;
          border-bottom: 0.5px solid #1f1f1f;
          flex-wrap: wrap;
          gap: 48px;
        }
        .footer-links-grid {
          display: flex;
          gap: 64px;
          flex-wrap: wrap;
        }
        .footer-cta {
          padding: 40px 48px;
          border-bottom: 0.5px solid #1f1f1f;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
          flex-wrap: wrap;
        }
        .footer-bottom {
          padding: 20px 48px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
          padding-bottom: 56px;
        }
        .footer-legal {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }
        @media (max-width: 768px) {
          .footer-grid { padding: 48px 24px; }
          .footer-links-grid { gap: 32px; }
          .footer-cta { padding: 32px 24px; flex-direction: column; align-items: flex-start; }
          .footer-bottom { padding: 16px 24px 56px; }
          .footer-legal { gap: 12px; }
        }
      `}</style>

      <footer style={{ background: '#050505', borderTop: '0.5px solid #1f1f1f' }}>

        <div className="footer-grid">
          {/* Brand */}
          <div style={{ maxWidth: 280 }}>
            <Link href="/" style={{
              color: '#fff', fontSize: 20, fontWeight: 700,
              letterSpacing: '0.3em', textTransform: 'uppercase',
              textDecoration: 'none', display: 'block', marginBottom: 16,
              fontFamily: 'var(--font-heading)',
            }}>
              <span style={{ color: '#3b82f6' }}>C</span>LICKADS
            </Link>
            <p style={{ color: '#52525b', fontSize: 13, lineHeight: 1.8, marginBottom: 32 }}>
              AI-powered marketing agency helping brands scale with data-driven campaigns, automation & in-house SaaS products.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { handle: '@ClickAdsHQ', platform: 'Instagram', href: '#' },
                { handle: '@ClickAds', platform: 'LinkedIn', href: '#' },
                { handle: '@ClickAdsAI', platform: 'Twitter / X', href: '#' },
              ].map(s => (
                <a key={s.handle} href={s.href} style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
                  <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#3b82f6', flexShrink: 0 }} />
                  <span style={{ color: '#52525b', fontSize: 11 }}>{s.handle}</span>
                  <span style={{ color: '#3f3f46', fontSize: 10 }}>· {s.platform}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="footer-links-grid">
            {Object.entries(links).map(([section, items]) => (
              <div key={section}>
                <p style={{ color: '#3f3f46', fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 16 }}>{section}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {items.map(item => (
                    <Link key={item.label} href={item.href} style={{ color: '#52525b', fontSize: 13, textDecoration: 'none', transition: 'color 0.2s' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#52525b')}
                    >{item.label}</Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="footer-cta">
          <div>
            <p style={{ color: '#3f3f46', fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 8 }}>Ready to scale?</p>
            <h3 style={{ color: '#fff', fontSize: 'clamp(18px, 3vw, 28px)', fontWeight: 800, textTransform: 'uppercase', margin: 0, fontFamily: 'var(--font-heading)', letterSpacing: '0.05em' }}>
              GET YOUR FREE AUDIT TODAY
            </h3>
          </div>
          <Link href="/contact" style={{
            background: '#3b82f6', color: '#fff', textDecoration: 'none',
            fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase',
            padding: '14px 32px', borderRadius: 2, flexShrink: 0,
          }}
            onMouseEnter={e => (e.currentTarget.style.background = '#2563eb')}
            onMouseLeave={e => (e.currentTarget.style.background = '#3b82f6')}
          >Book Free Audit →</Link>
        </div>

        {/* Bottom */}
        <div className="footer-bottom">
          <p style={{ color: '#3f3f46', fontSize: 11, margin: 0 }}>© 2025 ClickAds. All rights reserved.</p>
          <div className="footer-legal">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(item => (
              <Link key={item} href="#" style={{ color: '#3f3f46', fontSize: 11, textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.color = '#3f3f46')}
              >{item}</Link>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', animation: 'blink 2s ease-in-out infinite' }} />
            <p style={{ color: '#3f3f46', fontSize: 11, margin: 0 }}>Accepting new clients</p>
          </div>
        </div>

      </footer>
    </>
  );
}