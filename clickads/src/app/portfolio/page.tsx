'use client';
import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const cases = [
  {
    num: '01', client: 'TravelNest', industry: 'Travel Agency', color: '#3b82f6',
    service: 'Google Ads + lidflow CRM',
    challenge: 'Low lead quality and no system to track inquiries. Agents were losing leads in WhatsApp chats.',
    solution: 'Built full Google Ads funnel targeting high-intent travel keywords + implemented lidflow CRM for pipeline management.',
    results: [
      { metric: '6.2x', label: 'ROAS' },
      { metric: '340%', label: 'Lead Volume' },
      { metric: '48%', label: 'Cost Per Lead Drop' },
      { metric: '3x', label: 'Bookings' },
    ],
    tags: ['Google Ads', 'lidflow CRM', 'Travel'],
  },
  {
    num: '02', client: 'FitZone Gym', industry: 'Fitness Chain', color: '#f97316',
    service: 'Meta Ads + GrwFit',
    challenge: 'Single location gym struggling to fill membership slots and retain existing members past 3 months.',
    solution: 'Launched Meta Ads targeting local fitness audience + implemented GrwFit for automated renewal reminders.',
    results: [
      { metric: '340%', label: 'New Leads' },
      { metric: '2x', label: 'Member Retention' },
      { metric: '₹4.2L', label: 'Monthly Revenue' },
      { metric: '89%', label: 'Renewal Rate' },
    ],
    tags: ['Meta Ads', 'GrwFit', 'Fitness'],
  },
  {
    num: '03', client: 'LuxStay Hotels', industry: 'Hospitality', color: '#a855f7',
    service: 'Google Ads + SEO',
    challenge: 'Over-reliance on OTA platforms eating 25% commission on every booking.',
    solution: 'Built direct booking funnel via Google Ads + SEO content strategy targeting branded and location keywords.',
    results: [
      { metric: '4.8x', label: 'ROAS' },
      { metric: '62%', label: 'Direct Bookings' },
      { metric: '25%', label: 'Commission Saved' },
      { metric: '₹12L', label: 'Revenue Added' },
    ],
    tags: ['Google Ads', 'SEO', 'Hospitality'],
  },
  {
    num: '04', client: 'StyleCart', industry: 'Fashion E-commerce', color: '#ec4899',
    service: 'Meta Ads + Email Marketing',
    challenge: 'High traffic but low conversion rate. Cart abandonment was killing revenue.',
    solution: 'Rebuilt Meta Ads creative strategy with UGC-style videos + email automation for cart recovery flows.',
    results: [
      { metric: '5.1x', label: 'ROAS' },
      { metric: '38%', label: 'Cart Recovery' },
      { metric: '4.2x', label: 'Email Revenue' },
      { metric: '220%', label: 'Overall Growth' },
    ],
    tags: ['Meta Ads', 'Email', 'E-commerce'],
  },
  {
    num: '05', client: 'EduPrime', industry: 'EdTech', color: '#22c55e',
    service: 'Google Ads + AI Creatives',
    challenge: 'High cost per enrollment from generic ad creatives not resonating with student audience.',
    solution: 'AI-generated personalized creatives for different course categories + Google Ads with smart bidding.',
    results: [
      { metric: '71%', label: 'CPL Reduction' },
      { metric: '8.3x', label: 'ROAS' },
      { metric: '1200+', label: 'Enrollments/Month' },
      { metric: '10x', label: 'Creative Output' },
    ],
    tags: ['Google Ads', 'AI Creatives', 'EdTech'],
  },
  {
    num: '06', client: 'AutoDrive', industry: 'Automotive', color: '#00b4d8',
    service: 'Full Funnel + Web Dev',
    challenge: 'Dealership getting walk-ins only. No digital presence, no lead capture system.',
    solution: 'Built high-converting landing page + full funnel Google & Meta Ads with CRM integration.',
    results: [
      { metric: '180+', label: 'Leads/Month' },
      { metric: '3.2x', label: 'CVR Lift' },
      { metric: '42', label: 'Cars Sold Digitally' },
      { metric: '₹8.4L', label: 'Digital Revenue' },
    ],
    tags: ['Google Ads', 'Meta Ads', 'Web Dev'],
  },
];

const filters = ['All', 'Google Ads', 'Meta Ads', 'SEO', 'lidflow CRM', 'GrwFit', 'E-commerce'];

export default function PortfolioPage() {
  const [active, setActive] = useState('All');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = active === 'All' ? cases : cases.filter(c => c.tags.some(t => t.includes(active)));

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a' }}>
      <Navbar />

      {/* HERO */}
      <div style={{ padding: '80px 48px 60px', borderBottom: '0.5px solid #1f1f1f' }}>
        <p style={{ color: '#3b82f6', fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase', marginBottom: 16 }}>Case Studies</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <h1 style={{ color: '#fff', fontSize: 'clamp(40px, 6vw, 80px)', fontWeight: 800, textTransform: 'uppercase', lineHeight: 1.0, margin: 0 }}>
            OUR<br /><span style={{ color: '#3b82f6' }}>WORK</span>
          </h1>
          <p style={{ color: '#52525b', fontSize: 13, lineHeight: 1.7, maxWidth: 320, margin: 0 }}>
            Real results from real brands. Every case study below is backed by data, not vanity metrics.
          </p>
        </div>
      </div>

      {/* FILTERS */}
      <div style={{ padding: '24px 48px', borderBottom: '0.5px solid #1f1f1f', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {filters.map(f => (
          <button key={f} onClick={() => setActive(f)} style={{
            border: `1px solid ${active === f ? '#3b82f6' : '#27272a'}`,
            color: active === f ? '#3b82f6' : '#52525b',
            background: 'none', fontSize: 10,
            letterSpacing: '0.15em', textTransform: 'uppercase',
            padding: '7px 18px', borderRadius: 100, cursor: 'pointer',
            transition: 'all 0.2s',
          }}>{f}</button>
        ))}
      </div>

      {/* CASE STUDIES */}
      <div>
        {filtered.map(c => (
          <div key={c.num}>
            <div
              onClick={() => setExpanded(expanded === c.num ? null : c.num)}
              style={{
                display: 'flex', alignItems: 'stretch',
                borderBottom: '0.5px solid #1f1f1f', cursor: 'pointer',
                transition: 'background 0.3s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#0f0f0f')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <div style={{ width: 80, padding: '36px 24px', borderRight: '0.5px solid #1f1f1f', display: 'flex', alignItems: 'center' }}>
                <p style={{ color: '#1f1f1f', fontSize: 28, fontWeight: 800, margin: 0 }}>{c.num}</p>
              </div>
              <div style={{ width: 200, padding: '36px 28px', borderRight: '0.5px solid #1f1f1f', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ width: 3, height: 20, background: c.color, marginBottom: 10, borderRadius: 2 }} />
                <p style={{ color: '#fff', fontSize: 17, fontWeight: 700, textTransform: 'uppercase', margin: 0 }}>{c.client}</p>
                <p style={{ color: '#52525b', fontSize: 10, marginTop: 4 }}>{c.industry}</p>
              </div>
              <div style={{ width: 220, padding: '36px 28px', borderRight: '0.5px solid #1f1f1f', display: 'flex', alignItems: 'center' }}>
                <p style={{ color: '#52525b', fontSize: 12, lineHeight: 1.6, margin: 0 }}>{c.service}</p>
              </div>
              <div style={{ flex: 1, padding: '36px 28px', borderRight: '0.5px solid #1f1f1f', display: 'flex', alignItems: 'center', gap: 32 }}>
                {c.results.slice(0, 3).map(r => (
                  <div key={r.label}>
                    <p style={{ color: '#fff', fontSize: 22, fontWeight: 800, margin: 0, lineHeight: 1 }}>{r.metric}</p>
                    <p style={{ color: '#52525b', fontSize: 10, marginTop: 4 }}>{r.label}</p>
                  </div>
                ))}
              </div>
              <div style={{ width: 180, padding: '36px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                  {c.tags.map(t => (
                    <span key={t} style={{ color: c.color, fontSize: 8, letterSpacing: '0.1em', textTransform: 'uppercase', border: `1px solid ${c.color}`, padding: '3px 8px', borderRadius: 100 }}>{t}</span>
                  ))}
                </div>
                <p style={{ color: '#52525b', fontSize: 10, margin: 0 }}>{expanded === c.num ? '↑ Collapse' : '↓ View Case'}</p>
              </div>
            </div>

            {/* Expanded */}
            {expanded === c.num && (
              <div style={{ background: '#050505', borderBottom: '0.5px solid #1f1f1f', padding: '48px 80px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 48 }}>
                <div>
                  <p style={{ color: c.color, fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 12 }}>Challenge</p>
                  <p style={{ color: '#a0a0a0', fontSize: 13, lineHeight: 1.8, margin: 0 }}>{c.challenge}</p>
                </div>
                <div>
                  <p style={{ color: c.color, fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 12 }}>Solution</p>
                  <p style={{ color: '#a0a0a0', fontSize: 13, lineHeight: 1.8, margin: 0 }}>{c.solution}</p>
                </div>
                <div>
                  <p style={{ color: c.color, fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 16 }}>Results</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    {c.results.map(r => (
                      <div key={r.label} style={{ borderLeft: `2px solid ${c.color}`, paddingLeft: 12 }}>
                        <p style={{ color: '#fff', fontSize: 20, fontWeight: 800, margin: 0, lineHeight: 1 }}>{r.metric}</p>
                        <p style={{ color: '#52525b', fontSize: 10, marginTop: 4 }}>{r.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* BOTTOM CTA */}
      <div style={{ padding: '80px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ color: '#52525b', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 12 }}>Want Results Like These?</p>
          <h2 style={{ color: '#fff', fontSize: 'clamp(24px, 3vw, 40px)', fontWeight: 800, textTransform: 'uppercase', margin: 0, lineHeight: 1.1 }}>
            LET'S BUILD YOUR<br /><span style={{ color: '#3b82f6' }}>SUCCESS STORY</span>
          </h2>
        </div>
        <Link href="/contact" style={{
          background: '#3b82f6', color: '#fff', textDecoration: 'none',
          fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase',
          padding: '16px 48px', borderRadius: 2,
        }}>Book Free Audit →</Link>
      </div>

      <Footer />
    </div>
  );
}