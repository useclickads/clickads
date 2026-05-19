'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { label: 'Services', href: '/services' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Blog', href: '/blog' },
  { label: 'lidflow', href: '/products/lidflow', color: '#00b4d8' },
  { label: 'GrwFit', href: '/products/grwfit', color: '#f97316' },
  { label: 'Contact', href: '/contact' },
];

const tickerItems = [
  { label: 'Services', href: '/services', color: '#52525b' },
  { label: 'Portfolio', href: '/portfolio', color: '#52525b' },
  { label: 'Pricing', href: '/pricing', color: '#52525b' },
  { label: 'Blog', href: '/blog', color: '#52525b' },
  { label: 'lidflow CRM', href: '/products/lidflow', color: '#00b4d8' },
  { label: 'GrwFit', href: '/products/grwfit', color: '#f97316' },
  { label: 'Contact', href: '/contact', color: '#52525b' },
  { label: '· AI-Powered Marketing', href: '/', color: '#27272a' },
  { label: '· 10x ROAS Guaranteed', href: '/', color: '#27272a' },
  { label: '· 150+ Brands Scaled', href: '/', color: '#27272a' },
  { label: '· Free Audit Available', href: '/', color: '#27272a' },
  { label: '· Trusted Across India', href: '/', color: '#27272a' },
  { label: '· 3 SaaS Platforms', href: '/', color: '#27272a' },
  { label: '· 100% Client Retention', href: '/', color: '#27272a' },
];

const doubled = [...tickerItems, ...tickerItems];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .nav-audit { display: none !important; }
        }
      `}</style>

      {/* TOP NAV */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '16px 24px',
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(10,10,10,0.97)',
        backdropFilter: 'blur(12px)',
        borderBottom: '0.5px solid #1f1f1f',
        boxSizing: 'border-box', width: '100%',
      }}>
        <Link href="/" style={{
          color: '#fff',
          fontSize: 18,
          fontWeight: 700,
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          textDecoration: 'none',
          fontFamily: 'var(--font-heading)',
        }}>
          <span style={{ color: '#3b82f6' }}>C</span>LICKADS
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/contact" className="nav-audit" style={{
            color: '#fff', fontSize: 10, letterSpacing: '0.2em',
            textTransform: 'uppercase', textDecoration: 'none',
            border: '1px solid #3b82f6', padding: '8px 20px',
            transition: 'all 0.3s',
          }}
            onMouseEnter={e => (e.currentTarget.style.background = '#3b82f6')}
            onMouseLeave={e => (e.currentTarget.style.background = 'none')}
          >Free Audit</Link>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8 }}
            aria-label="Menu"
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <div style={{ width: 22, height: 1.5, background: menuOpen ? '#3b82f6' : '#fff', transition: 'all 0.3s', transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
              <div style={{ width: 22, height: 1.5, background: '#fff', opacity: menuOpen ? 0 : 1, transition: 'all 0.3s' }} />
              <div style={{ width: 22, height: 1.5, background: menuOpen ? '#3b82f6' : '#fff', transition: 'all 0.3s', transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
            </div>
          </button>
        </div>
      </nav>

      {/* BOTTOM STICKY TICKER */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(10,10,10,0.97)',
        backdropFilter: 'blur(16px)',
        borderTop: '0.5px solid #1f1f1f',
        height: 44, overflow: 'hidden',
        display: 'flex', alignItems: 'center',
      }}>
        {/* Current page indicator */}
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: 90, zIndex: 2,
          background: 'linear-gradient(to right, #0a0a0a 70%, transparent)',
          display: 'flex', alignItems: 'center', paddingLeft: 16, gap: 6,
        }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#3b82f6', flexShrink: 0, animation: 'blink 2s ease-in-out infinite' }} />
          <p style={{ color: '#3b82f6', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', margin: 0, whiteSpace: 'nowrap', fontFamily: 'var(--font-body)' }}>
            {navLinks.find(l => l.href === pathname)?.label ?? 'Home'}
          </p>
        </div>

        {/* Ticker */}
        <div style={{ overflow: 'hidden', width: '100%', paddingLeft: 90 }}>
          <div className="ticker-track">
            {doubled.map((item, i) => (
              <Link key={i} href={item.href} className={`ticker-link${pathname === item.href ? ' active' : ''}`}
                style={{ color: pathname === item.href ? '#3b82f6' : item.color }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Fade right */}
        <div style={{
          position: 'absolute', right: 0, top: 0, bottom: 0, width: 60,
          background: 'linear-gradient(to left, #0a0a0a 70%, transparent)', zIndex: 2,
        }} />
      </div>

      {/* FULL SCREEN MENU */}
      {menuOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 99,
          background: '#0a0a0a',
          display: 'flex', flexDirection: 'column',
          justifyContent: 'center',
          padding: '48px 32px',
        }}>
          <button
            onClick={() => setMenuOpen(false)}
            style={{ position: 'absolute', top: 20, right: 24, background: 'none', border: 'none', color: '#fff', fontSize: 28, cursor: 'pointer', lineHeight: 1 }}
          >✕</button>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  color: link.color ?? '#fff',
                  fontSize: 'clamp(32px, 8vw, 64px)',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  lineHeight: 1,
                  fontFamily: 'var(--font-heading)',
                  letterSpacing: '0.05em',
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.5')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setMenuOpen(false)}
              style={{
                color: '#3b82f6',
                fontSize: 'clamp(32px, 8vw, 64px)',
                fontWeight: 800,
                textTransform: 'uppercase',
                textDecoration: 'none',
                lineHeight: 1,
                fontFamily: 'var(--font-heading)',
                letterSpacing: '0.05em',
              }}
            >Free Audit →</Link>
          </div>

          <div style={{ position: 'absolute', bottom: 44, right: 32, display: 'flex', gap: 24 }}>
            {[
              { value: '150+', label: 'Brands' },
              { value: '10x', label: 'ROAS' },
              { value: '98%', label: 'Retention' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'right' }}>
                <p style={{ color: '#fff', fontSize: 20, fontWeight: 800, margin: 0, fontFamily: 'var(--font-heading)' }}>{s.value}</p>
                <p style={{ color: '#52525b', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', margin: '4px 0 0' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}