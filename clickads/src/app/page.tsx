'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

const WORDS = ['AI ADS', 'PAID MEDIA', 'AUTOMATION', 'CRM'];
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%';
const TAGLINE = 'CLICK. TARGET. CONVERT';

const services = [
  { num: '01', title: 'Google Ads', desc: 'Search, Display & Performance Max', metric: '4.8x ROAS', color: '#3b82f6', href: '/services' },
  { num: '02', title: 'Meta Ads', desc: 'Facebook & Instagram full-funnel', metric: '3.9x ROAS', color: '#a855f7', href: '/services' },
  { num: '03', title: 'SEO', desc: 'Technical SEO & content strategy', metric: '220% traffic', color: '#00b4d8', href: '/services' },
  { num: '04', title: 'Email Marketing', desc: 'Automated flows & campaigns', metric: '42% open rate', color: '#f97316', href: '/services' },
  { num: '05', title: 'AI Creatives', desc: 'AI-generated ads & visuals', metric: '10x faster', color: '#ec4899', href: '/services' },
  { num: '06', title: 'Web Development', desc: 'Landing pages & conversion sites', metric: '3.2x CVR', color: '#22c55e', href: '/services' },
  { num: '07', title: 'lidflow CRM', desc: 'Travel CRM — leads & bookings', metric: 'Travel SaaS', color: '#00b4d8', href: '/products/lidflow' },
  { num: '08', title: 'GrwFit', desc: 'Gym management & retention', metric: 'Fitness SaaS', color: '#f97316', href: '/products/grwfit' },
];

const results = [
  { brand: 'TravelNest', metric: '6.2x ROAS', channel: 'Google Ads', color: '#3b82f6' },
  { brand: 'FitZone Gym', metric: '340% leads', channel: 'Meta Ads', color: '#f97316' },
  { brand: 'LuxStay', metric: '4.8x ROAS', channel: 'lidflow CRM', color: '#00b4d8' },
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

export default function Home() {
  const [phase, setPhase] = useState<'loader' | 'wipe' | 'hero'>('loader');
  const [typed, setTyped] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [displayed, setDisplayed] = useState(WORDS[0]);
  const [glitching, setGlitching] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (phase !== 'loader') return;
    let i = 0;
    const type = setInterval(() => {
      i++;
      setTyped(TAGLINE.slice(0, i));
      if (i >= TAGLINE.length) {
        clearInterval(type);
        setTimeout(() => setPhase('wipe'), 900);
        setTimeout(() => setPhase('hero'), 1700);
      }
    }, 80);
    return () => clearInterval(type);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'hero') return;
    const interval = setInterval(() => {
      setGlitching(true);
      let count = 0;
      const next = (wordIndex + 1) % WORDS.length;
      const target = WORDS[next];
      const glitch = setInterval(() => {
        setDisplayed(
          target.split('').map((c, i) =>
            c === ' ' ? ' ' : count > i
              ? target[i]
              : CHARS[Math.floor(Math.random() * CHARS.length)]
          ).join('')
        );
        count++;
        if (count > target.length + 2) {
          clearInterval(glitch);
          setDisplayed(target);
          setWordIndex(next);
          setGlitching(false);
        }
      }, 60);
    }, 2800);
    return () => clearInterval(interval);
  }, [phase, wordIndex]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let target = 0;
    let current = 0;
    let rafId: number;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      target += (e.deltaY + e.deltaX) * 5;
      target = Math.max(0, Math.min(target, el.scrollWidth - el.clientWidth));
    };
    const animate = () => {
      current += (target - current) * 0.12;
      el.scrollLeft = current;
      rafId = requestAnimationFrame(animate);
    };
    target = el.scrollLeft;
    current = el.scrollLeft;
    rafId = requestAnimationFrame(animate);
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', onWheel);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const wordColors: Record<string, string> = {
    'AI ADS': '#3b82f6',
    'PAID MEDIA': '#00b4d8',
    'AUTOMATION': '#f97316',
    'CRM': '#a855f7',
  };

  const skipToHero = () => {
    setPhase('wipe');
    setTimeout(() => setPhase('hero'), 700);
  };

  const doubled = [...tickerItems, ...tickerItems];

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', background: '#0a0a0a', position: 'relative' }}>

      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .hp-ticker {
          animation: ticker 30s linear infinite;
          display: flex;
          width: max-content;
          align-items: center;
        }
        .hp-ticker:hover { animation-play-state: paused; }
      `}</style>

      {/* LOADER */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#f4efe5',
        opacity: phase === 'loader' ? 1 : 0,
        pointerEvents: phase === 'loader' ? 'auto' : 'none',
        transition: 'opacity 0.3s',
      }}>
        <p style={{
          color: '#1a1a1a', fontSize: 'clamp(20px, 3.5vw, 48px)',
          fontWeight: 300, letterSpacing: '0.25em',
          textTransform: 'uppercase', fontFamily: 'Georgia, serif', margin: 0,
        }}>
          {typed}
          <span style={{ animation: 'blink 1s step-end infinite', marginLeft: 2 }}>|</span>
        </p>
        <button onClick={skipToHero} style={{
          position: 'absolute', bottom: 24, right: 24,
          color: '#a0a0a0', fontSize: 11, letterSpacing: '0.2em',
          textTransform: 'uppercase', background: 'none', border: 'none', cursor: 'pointer',
        }}>Skip →</button>
      </div>

      {/* CINEMATIC WIPE */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 40,
        background: '#0a0a0a', pointerEvents: 'none',
        transform:
          phase === 'loader' ? 'translateX(100%)' :
          phase === 'wipe' ? 'translateX(0%)' : 'translateX(-100%)',
        transition: 'transform 0.75s cubic-bezier(0.76, 0, 0.24, 1)',
      }} />

      {/* HORIZONTAL SCROLL */}
      <div
        ref={scrollRef}
        style={{
          display: 'flex', flexDirection: 'row',
          width: '100vw', height: '100vh',
          overflowX: 'auto', overflowY: 'hidden',
          scrollbarWidth: 'none', scrollBehavior: 'auto',
          opacity: phase === 'hero' ? 1 : 0,
          transition: 'opacity 0.5s ease',
        }}
      >

        {/* PANEL 1 — HERO LEFT */}
        <div style={{
          minWidth: '50vw', height: '100vh', background: '#0a0a0a',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          padding: '36px 40px 36px 56px',
          boxSizing: 'border-box', position: 'relative', flexShrink: 0,
        }}>
          <div style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: 18 }}>
            {[{ label: 'TW', href: '#' }, { label: 'LI', href: '#' }, { label: 'IG', href: '#' }].map(s => (
              <a key={s.label} href={s.href} style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontSize: 9, letterSpacing: '0.2em', color: '#3f3f46', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.color = '#3f3f46')}
              >{s.label}</a>
            ))}
          </div>

          <div>
            <p style={{ color: '#3f3f46', fontSize: 9, letterSpacing: '0.35em', textTransform: 'uppercase', margin: 0 }}>AI Marketing Agency</p>
            <h1 style={{ color: '#fff', fontSize: 20, fontWeight: 300, letterSpacing: '0.3em', textTransform: 'uppercase', margin: '6px 0 0' }}>
              <span style={{ color: '#3b82f6', fontWeight: 800 }}>C</span>lickAds
            </h1>
          </div>

          <div>
            <p style={{ color: '#3f3f46', fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 14 }}>We Make Your Brand</p>
            <p style={{ color: '#fff', fontSize: 'clamp(40px, 5vw, 68px)', fontWeight: 800, textTransform: 'uppercase', margin: 0, lineHeight: 1 }}>GO</p>
            <p style={{ color: '#fff', fontSize: 'clamp(40px, 5vw, 68px)', fontWeight: 800, textTransform: 'uppercase', margin: 0, lineHeight: 1 }}>VIRAL</p>
            <p style={{ color: '#3f3f46', fontSize: 'clamp(20px, 2.5vw, 36px)', fontWeight: 300, textTransform: 'uppercase', letterSpacing: '0.15em', margin: '6px 0' }}>WITH</p>
            <p style={{
              fontSize: 'clamp(28px, 3.5vw, 52px)', fontWeight: 800,
              textTransform: 'uppercase', fontFamily: 'monospace', margin: 0,
              color: glitching ? '#d97706' : (wordColors[displayed] ?? '#3b82f6'),
              transition: 'color 0.15s', minHeight: '1.1em',
            }}>{displayed}</p>

            <div style={{ display: 'flex', gap: 14, marginTop: 20, alignItems: 'flex-start' }}>
              <div style={{ width: 1, height: 44, background: '#27272a', flexShrink: 0, marginTop: 2 }} />
              <p style={{ color: '#52525b', fontSize: 11, lineHeight: 1.7, maxWidth: 260, margin: 0 }}>
                Data-driven campaigns, AI-powered creatives & full-funnel automation for brands that want to scale.
              </p>
            </div>

            <button
              onClick={() => router.push('/contact')}
              style={{ marginTop: 24, border: '1px solid #fff', color: '#fff', background: 'none', fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', padding: '11px 28px', cursor: 'pointer' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#000'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#fff'; }}
            >Start Your Campaign →</button>
          </div>

          <p style={{ color: '#27272a', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', margin: 0, textAlign: 'right' }}>Scroll / Drag ——→</p>
        </div>

        {/* PANEL 2 — HERO RIGHT */}
        <div style={{
          minWidth: '50vw', height: '100vh', background: '#e9e4d9',
          position: 'relative', display: 'flex', alignItems: 'flex-end',
          padding: 16, boxSizing: 'border-box', flexShrink: 0,
        }}>
          <div style={{ position: 'absolute', top: 20, right: 20, display: 'flex', alignItems: 'center', gap: 12, zIndex: 10 }}>
            <button onClick={() => router.push('/contact')} style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#44403c', border: '1px solid #a8a29e', background: 'none', padding: '7px 14px', cursor: 'pointer' }}>Watch Demo</button>
            <span onClick={() => router.push('/services')} style={{ fontSize: 20, color: '#44403c', cursor: 'pointer' }}>≡</span>
          </div>
          <div style={{ display: 'flex', width: '100%', height: 'calc(100% - 32px)', gap: 8 }}>
            {[
              { letter: 'B', label: 'Brands', color: '#3b82f6', bg: '#1e1b4b', href: '/portfolio' },
              { letter: 'A', label: 'Agencies', color: '#00b4d8', bg: '#0c2a35', href: '/services' },
              { letter: 'S', label: 'Startups', color: '#f97316', bg: '#2a1200', href: '/contact' },
            ].map(card => (
              <div key={card.letter}
                onClick={() => router.push(card.href)}
                style={{ flex: 1, borderRadius: 4, background: card.bg, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 14, cursor: 'pointer', overflow: 'hidden', transition: 'flex 0.5s ease' }}
                onMouseEnter={e => (e.currentTarget.style.flex = '1.5')}
                onMouseLeave={e => (e.currentTarget.style.flex = '1')}
              >
                <p style={{ color: card.color, fontSize: 64, fontWeight: 700, opacity: 0.25, lineHeight: 1, margin: 0 }}>{card.letter}</p>
                <div>
                  <p style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', color: card.color, fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 8 }}>{card.label}</p>
                  <div style={{ width: '100%', height: 70, borderRadius: 3, background: card.color, opacity: 0.25 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PANEL 3 — HOW WE GROW YOU */}
        <div style={{
          minWidth: '100vw', height: '100vh', background: '#0a0a0a',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: '80px 120px 80px 80px', boxSizing: 'border-box',
          position: 'relative', flexShrink: 0,
        }}>
          <div style={{
            position: 'absolute', right: 20, top: '50%',
            transform: 'translateY(-50%) rotate(90deg)',
            color: 'transparent', WebkitTextStroke: '1px #1f1f1f',
            fontSize: 80, fontWeight: 700, letterSpacing: '0.1em',
            textTransform: 'uppercase', userSelect: 'none', whiteSpace: 'nowrap',
          }}>SERVICES</div>

          <p style={{ color: '#52525b', fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 14 }}>What We Do</p>
          <h2 style={{ color: '#fff', fontSize: 'clamp(32px, 4vw, 56px)', fontWeight: 800, textTransform: 'uppercase', lineHeight: 1.1, marginBottom: 48 }}>
            HOW WE<br /><span style={{ color: '#3b82f6' }}>GROW YOU?</span>
          </h2>

          <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', marginBottom: 48 }}>
            <div style={{ border: '1px solid #1f1f1f', borderRadius: 4, padding: 28, maxWidth: 300, boxSizing: 'border-box' }}>
              <p style={{ color: '#3b82f6', fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 10 }}>ClickAds AI Engine</p>
              <p style={{ color: '#fff', fontSize: 17, fontWeight: 500, lineHeight: 1.4, marginBottom: 14 }}>AI-Powered Ad Creation & Campaign Automation</p>
              <p style={{ color: '#3b82f6', fontSize: 11 }}>Computational Performance Marketing</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              {[
                { value: '10x', label: 'Average ROAS' },
                { value: '3.2M+', label: 'Ad Spend Managed' },
                { value: '150+', label: 'Brands Scaled' },
                { value: '98%', label: 'Client Retention' },
              ].map(s => (
                <div key={s.value} style={{ borderLeft: '1px solid #1f1f1f', paddingLeft: 20 }}>
                  <p style={{ color: '#fff', fontSize: 'clamp(28px, 3vw, 44px)', fontWeight: 700, margin: 0, lineHeight: 1 }}>{s.value}</p>
                  <p style={{ color: '#52525b', fontSize: 12, marginTop: 6 }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {[
              { text: 'Zero Waste Spend', color: '#a855f7' },
              { text: 'Full Automation', color: '#ec4899' },
              { text: '10x ROAS Guarantee', color: '#3b82f6' },
              { text: 'AI Creative Engine', color: '#f97316' },
            ].map(p => (
              <span key={p.text} style={{ border: `1px solid ${p.color}`, color: p.color, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', padding: '7px 18px', borderRadius: 100 }}>{p.text}</span>
            ))}
          </div>
        </div>

        {/* SERVICES CARDS */}
        {services.map((s) => (
          <div key={s.num}
            onClick={() => router.push(s.href)}
            style={{
              minWidth: 260, height: '100vh', background: '#f4efe5',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              padding: '40px 28px', boxSizing: 'border-box', flexShrink: 0,
              borderLeft: '0.5px solid #e0dbd0', cursor: 'pointer',
              transition: 'background 0.3s', position: 'relative', overflow: 'hidden',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.background = '#f4efe5')}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, width: 3, height: '100%', background: s.color, opacity: 0.5 }} />
            <p style={{ color: '#d4cfc8', fontSize: 56, fontWeight: 800, lineHeight: 1, margin: 0 }}>{s.num}</p>
            <div>
              <p style={{ color: '#0a0a0a', fontSize: 15, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>{s.title}</p>
              <p style={{ color: '#78716c', fontSize: 12, lineHeight: 1.6, marginBottom: 20 }}>{s.desc}</p>
              <span style={{ border: `1px solid ${s.color}`, color: s.color, fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '5px 12px', borderRadius: 100 }}>{s.metric}</span>
            </div>
          </div>
        ))}

        {/* RESULTS PANEL */}
        <div style={{
          minWidth: '40vw', height: '100vh', background: '#f4efe5',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: '80px 48px', boxSizing: 'border-box', flexShrink: 0,
        }}>
          <p style={{ color: '#a8a29e', fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase', marginBottom: 16 }}>Portfolio</p>
          <h2 style={{ color: '#0a0a0a', fontSize: 'clamp(24px, 3vw, 42px)', fontWeight: 800, textTransform: 'uppercase', lineHeight: 1.1, marginBottom: 40 }}>
            RESULTS OUR<br />CLIENTS ARE<br />SEEING
          </h2>
          {results.map(r => (
            <div key={r.brand}
              onClick={() => router.push('/portfolio')}
              style={{ borderLeft: `3px solid ${r.color}`, paddingLeft: 20, marginBottom: 28, cursor: 'pointer' }}>
              <p style={{ color: '#0a0a0a', fontSize: 22, fontWeight: 800, margin: 0 }}>{r.metric}</p>
              <p style={{ color: '#78716c', fontSize: 12, margin: '4px 0 0' }}>{r.brand} · {r.channel}</p>
            </div>
          ))}
          <button
            onClick={() => router.push('/portfolio')}
            style={{ alignSelf: 'flex-start', background: 'none', border: '1px solid #0a0a0a', color: '#0a0a0a', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', padding: '10px 24px', cursor: 'pointer', marginTop: 8 }}
            onMouseEnter={e => { e.currentTarget.style.background = '#0a0a0a'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#0a0a0a'; }}
          >View All Case Studies →</button>
        </div>

        {/* SOCIAL + CTA PANEL */}
        <div style={{
          minWidth: '45vw', height: '100vh', background: '#0a0a0a',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: '80px 64px', boxSizing: 'border-box', flexShrink: 0, position: 'relative',
        }}>
          <div style={{
            position: 'absolute', left: -36, top: '50%',
            transform: 'translateY(-50%) rotate(-90deg)',
            color: '#1f1f1f', fontSize: 10, letterSpacing: '0.4em',
            textTransform: 'uppercase', whiteSpace: 'nowrap',
          }}>Follow Us</div>

          <p style={{ color: '#52525b', fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 16 }}>Keep Up To Date</p>
          <h2 style={{ color: '#fff', fontSize: 'clamp(22px, 2.8vw, 40px)', fontWeight: 800, textTransform: 'uppercase', lineHeight: 1.1, marginBottom: 36 }}>
            THE LATEST FROM<br /><span style={{ color: '#3b82f6' }}>CLICKADS</span><br />COMMUNITY
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 44 }}>
            {[
              { handle: '@ClickAdsHQ', platform: 'Instagram', href: '#' },
              { handle: '@ClickAds', platform: 'LinkedIn', href: '#' },
              { handle: '@ClickAdsAI', platform: 'Twitter / X', href: '#' },
            ].map(s => (
              <a key={s.handle} href={s.href} style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#3b82f6', flexShrink: 0 }} />
                <p style={{ color: '#fff', fontSize: 14, fontWeight: 600, margin: 0 }}>{s.handle}</p>
                <p style={{ color: '#52525b', fontSize: 11, margin: 0 }}>· {s.platform}</p>
              </a>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 16 }}>
            <button
              onClick={() => router.push('/contact')}
              style={{ background: '#3b82f6', color: '#fff', border: 'none', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', padding: '14px 32px', cursor: 'pointer', borderRadius: 2 }}
              onMouseEnter={e => (e.currentTarget.style.background = '#2563eb')}
              onMouseLeave={e => (e.currentTarget.style.background = '#3b82f6')}
            >Book a Free Audit →</button>
            <button
              onClick={() => router.push('/blog')}
              style={{ background: 'none', color: '#52525b', border: '1px solid #27272a', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', padding: '14px 32px', cursor: 'pointer', borderRadius: 2 }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={e => (e.currentTarget.style.color = '#52525b')}
            >Read Blog →</button>
          </div>
        </div>

      </div>

      {/* BOTTOM STICKY TICKER NAV */}
      {phase === 'hero' && (
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
          background: 'rgba(10,10,10,0.97)',
          backdropFilter: 'blur(16px)',
          borderTop: '0.5px solid #1f1f1f',
          height: 52, overflow: 'hidden',
          display: 'flex', alignItems: 'center',
        }}>
          {/* Live indicator */}
          <div style={{
            position: 'absolute', left: 0, top: 0, bottom: 0, width: 100, zIndex: 2,
            background: 'linear-gradient(to right, #0a0a0a 70%, transparent)',
            display: 'flex', alignItems: 'center', paddingLeft: 20, gap: 8, flexShrink: 0,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#3b82f6', animation: 'blink 2s ease-in-out infinite' }} />
            <p style={{ color: '#3b82f6', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', margin: 0, whiteSpace: 'nowrap' }}>Home</p>
          </div>

          {/* Ticker */}
          <div style={{ overflow: 'hidden', width: '100%', paddingLeft: 100 }}>
            <div className="hp-ticker">
              {doubled.map((item, i) => (
                <a key={i} href={item.href} style={{
                  color: item.color, fontSize: 10,
                  letterSpacing: '0.2em', textTransform: 'uppercase',
                  textDecoration: 'none', whiteSpace: 'nowrap',
                  padding: '0 20px', height: 52,
                  display: 'inline-flex', alignItems: 'center',
                  transition: 'color 0.2s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={e => (e.currentTarget.style.color = item.color)}
                >{item.label}</a>
              ))}
            </div>
          </div>

          {/* Fade right */}
          <div style={{
            position: 'absolute', right: 0, top: 0, bottom: 0, width: 80,
            background: 'linear-gradient(to left, #0a0a0a 70%, transparent)', zIndex: 2,
          }} />
        </div>
      )}

    </div>
  );
}