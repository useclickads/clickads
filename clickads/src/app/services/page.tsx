'use client';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const services = [
  {
    num: '01', title: 'Google Ads', color: '#3b82f6',
    desc: 'Search, Shopping, Display & Performance Max campaigns built to dominate your category.',
    features: ['Keyword Research', 'Ad Copywriting', 'Bid Management', 'Conversion Tracking'],
    metric: '4.8x', metricLabel: 'Average ROAS',
  },
  {
    num: '02', title: 'Meta Ads', color: '#a855f7',
    desc: 'Facebook & Instagram full-funnel campaigns from awareness to conversion.',
    features: ['Audience Building', 'Creative Strategy', 'Retargeting', 'Lookalike Audiences'],
    metric: '3.9x', metricLabel: 'Average ROAS',
  },
  {
    num: '03', title: 'SEO', color: '#00b4d8',
    desc: 'Technical SEO, content strategy & link building that compounds over time.',
    features: ['Technical Audit', 'Content Strategy', 'Link Building', 'Rank Tracking'],
    metric: '220%', metricLabel: 'Avg Traffic Growth',
  },
  {
    num: '04', title: 'Email Marketing', color: '#f97316',
    desc: 'Automated flows & broadcast campaigns that turn subscribers into buyers.',
    features: ['Flow Automation', 'Segmentation', 'A/B Testing', 'Revenue Attribution'],
    metric: '42%', metricLabel: 'Avg Open Rate',
  },
  {
    num: '05', title: 'AI Creatives', color: '#ec4899',
    desc: 'AI-generated ad copy, visuals & video creatives at 10x the speed.',
    features: ['AI Copywriting', 'Visual Generation', 'Video Ads', 'Creative Testing'],
    metric: '10x', metricLabel: 'Faster Output',
  },
  {
    num: '06', title: 'Web Development', color: '#22c55e',
    desc: 'High-converting landing pages & full websites built for performance.',
    features: ['Landing Pages', 'CRO Design', 'Next.js Development', 'A/B Testing'],
    metric: '3.2x', metricLabel: 'Avg CVR Lift',
  },
  {
    num: '07', title: 'lidflow CRM', color: '#00b4d8',
    desc: 'Our in-house Travel CRM — built for travel agencies, tour operators & OTAs.',
    features: ['Lead Management', 'Booking Pipeline', 'Agent Dashboard', 'Auto Follow-ups'],
    metric: 'SaaS', metricLabel: 'Travel Industry',
    link: '/products/lidflow',
  },
  {
    num: '08', title: 'GrwFit', color: '#f97316',
    desc: 'Our in-house Gym Management SaaS — members, billing & retention in one place.',
    features: ['Member Management', 'Billing & Payments', 'Attendance Tracking', 'Retention Tools'],
    metric: 'SaaS', metricLabel: 'Fitness Industry',
    link: '/products/grwfit',
  },
];

export default function ServicesPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a' }}>
      <Navbar />

      {/* HERO */}
      <div style={{ padding: '80px 48px 60px', borderBottom: '0.5px solid #1f1f1f' }}>
        <p style={{ color: '#3b82f6', fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase', marginBottom: 16 }}>What We Offer</p>
        <h1 style={{ color: '#fff', fontSize: 'clamp(40px, 6vw, 80px)', fontWeight: 800, textTransform: 'uppercase', lineHeight: 1.0, margin: 0 }}>
          OUR<br /><span style={{ color: '#3b82f6' }}>SERVICES</span>
        </h1>
      </div>

      {/* SERVICES LIST */}
      <div>
        {services.map((s) => (
          <div
            key={s.num}
            style={{
              display: 'flex', alignItems: 'stretch',
              borderBottom: '0.5px solid #1f1f1f',
              transition: 'background 0.3s', cursor: 'pointer',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#0f0f0f')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            {/* Number */}
            <div style={{ width: 100, padding: '40px 32px', borderRight: '0.5px solid #1f1f1f', display: 'flex', alignItems: 'center' }}>
              <p style={{ color: '#1f1f1f', fontSize: 32, fontWeight: 800, margin: 0 }}>{s.num}</p>
            </div>

            {/* Title */}
            <div style={{ width: 220, padding: '40px 32px', borderRight: '0.5px solid #1f1f1f', display: 'flex', alignItems: 'center' }}>
              <div>
                <div style={{ width: 3, height: 24, background: s.color, marginBottom: 12, borderRadius: 2 }} />
                <p style={{ color: '#fff', fontSize: 18, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>{s.title}</p>
              </div>
            </div>

            {/* Desc */}
            <div style={{ flex: 1, padding: '40px 32px', borderRight: '0.5px solid #1f1f1f', display: 'flex', alignItems: 'center' }}>
              <p style={{ color: '#52525b', fontSize: 13, lineHeight: 1.7, margin: 0, maxWidth: 400 }}>{s.desc}</p>
            </div>

            {/* Features */}
            <div style={{ width: 260, padding: '40px 32px', borderRight: '0.5px solid #1f1f1f', display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {s.features.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 4, height: 4, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
                    <p style={{ color: '#52525b', fontSize: 11, margin: 0 }}>{f}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Metric + CTA */}
            <div style={{ width: 160, padding: '40px 32px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', gap: 16 }}>
              <div>
                <p style={{ color: '#fff', fontSize: 28, fontWeight: 800, margin: 0, lineHeight: 1 }}>{s.metric}</p>
                <p style={{ color: '#52525b', fontSize: 10, marginTop: 4 }}>{s.metricLabel}</p>
              </div>
              {s.link ? (
                <Link href={s.link} style={{ color: s.color, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none' }}>
                  Learn More →
                </Link>
              ) : (
                <Link href="/contact" style={{ color: s.color, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none' }}>
                  Get Started →
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* BOTTOM CTA */}
      <div style={{ padding: '80px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ color: '#fff', fontSize: 'clamp(24px, 3vw, 40px)', fontWeight: 800, textTransform: 'uppercase', margin: 0, lineHeight: 1.1 }}>
            READY TO<br /><span style={{ color: '#3b82f6' }}>SCALE?</span>
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