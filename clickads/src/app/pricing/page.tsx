'use client';
import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const plans = [
  {
    name: 'Starter',
    price: { monthly: 29999, yearly: 24999 },
    color: '#52525b',
    desc: 'Perfect for small brands just starting with digital marketing.',
    features: [
      'Google Ads Management',
      'Meta Ads Management',
      'Monthly Strategy Call',
      'Basic Analytics Report',
      'Ad Spend up to ₹1L/mo',
      '2 Ad Creatives/month',
      'Email Support',
    ],
    notIncluded: ['SEO', 'AI Creatives', 'Dedicated Manager', 'Custom CRM'],
    cta: 'Get Started',
  },
  {
    name: 'Growth',
    price: { monthly: 59999, yearly: 49999 },
    color: '#3b82f6',
    desc: 'For growing brands ready to scale with full-funnel marketing.',
    highlight: true,
    badge: 'Most Popular',
    features: [
      'Google + Meta Ads',
      'SEO (10 keywords)',
      'Email Marketing Setup',
      'Bi-weekly Strategy Calls',
      'Advanced Analytics',
      'Ad Spend up to ₹5L/mo',
      '8 AI Creatives/month',
      'Dedicated Account Manager',
      'WhatsApp Support',
    ],
    notIncluded: ['Custom CRM', 'White Label'],
    cta: 'Start Growing',
  },
  {
    name: 'Scale',
    price: { monthly: 99999, yearly: 84999 },
    color: '#a855f7',
    desc: 'For established brands wanting aggressive growth & automation.',
    features: [
      'All Growth features',
      'Full SEO Strategy',
      'AI Creative Engine',
      'Weekly Strategy Calls',
      'Custom Dashboard',
      'Unlimited Ad Spend',
      '20 AI Creatives/month',
      'Priority Support 24/7',
      'Landing Page Development',
      'lidflow or GrwFit included',
    ],
    notIncluded: ['White Label'],
    cta: "Let's Scale",
  },
  {
    name: 'Enterprise',
    price: { monthly: 0, yearly: 0 },
    color: '#f97316',
    desc: 'Custom solutions for large brands, agencies & enterprise clients.',
    features: [
      'Everything in Scale',
      'White Label Services',
      'Custom CRM Integration',
      'Dedicated Team',
      'Custom Reporting',
      'SLA Guarantee',
      'On-site Consultation',
      'Custom Contracts',
      'API Access',
      'Priority Onboarding',
    ],
    notIncluded: [],
    cta: 'Contact Us',
    custom: true,
  },
];

const faqs = [
  { q: 'Is there a setup fee?', a: 'No setup fees on any plan. You only pay the monthly retainer and your ad spend goes directly to the platforms.' },
  { q: 'What is the minimum contract?', a: 'We recommend a 3-month minimum to see meaningful results. Month-to-month options are available at a 20% premium.' },
  { q: 'Do you manage the ad spend?', a: 'Yes. We manage your campaigns but ad spend is billed directly to your card by Google/Meta. We never hold your ad budget.' },
  { q: 'Can I upgrade or downgrade?', a: 'Absolutely. You can change your plan at the start of any billing cycle. No penalties.' },
  { q: 'What makes ClickAds different?', a: 'We are an AI-first agency. Our creative engine, targeting and reporting are all powered by AI — giving you faster results at lower cost.' },
  { q: 'Do lidflow and GrwFit cost extra?', a: 'lidflow and GrwFit are separate SaaS products with their own pricing. The Scale plan includes one of them free for 3 months.' },
];

export default function PricingPage() {
  const [yearly, setYearly] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a' }}>
      <Navbar />

      {/* HERO */}
      <div style={{ padding: '80px 48px 60px', borderBottom: '0.5px solid #1f1f1f', textAlign: 'center' }}>
        <p style={{ color: '#3b82f6', fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase', marginBottom: 16 }}>Transparent Pricing</p>
        <h1 style={{ color: '#fff', fontSize: 'clamp(40px, 6vw, 80px)', fontWeight: 800, textTransform: 'uppercase', lineHeight: 1.0, margin: '0 0 24px' }}>
          SIMPLE.<br /><span style={{ color: '#3b82f6' }}>HONEST.</span><br />PRICING.
        </h1>
        <p style={{ color: '#52525b', fontSize: 14, lineHeight: 1.7, maxWidth: 400, margin: '0 auto 40px' }}>
          No hidden fees. No long-term lock-ins. Just results.
        </p>

        {/* Toggle */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 16, background: '#111', border: '0.5px solid #1f1f1f', borderRadius: 100, padding: '8px 20px' }}>
          <p style={{ color: yearly ? '#52525b' : '#fff', fontSize: 12, margin: 0, cursor: 'pointer' }} onClick={() => setYearly(false)}>Monthly</p>
          <div
            onClick={() => setYearly(!yearly)}
            style={{ width: 40, height: 22, background: yearly ? '#3b82f6' : '#27272a', borderRadius: 100, position: 'relative', cursor: 'pointer', transition: 'background 0.3s' }}
          >
            <div style={{ position: 'absolute', top: 3, left: yearly ? 20 : 3, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left 0.3s' }} />
          </div>
          <p style={{ color: yearly ? '#fff' : '#52525b', fontSize: 12, margin: 0, cursor: 'pointer' }} onClick={() => setYearly(true)}>
            Yearly <span style={{ color: '#22c55e', fontSize: 10 }}>Save 20%</span>
          </p>
        </div>
      </div>

      {/* PLANS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderBottom: '0.5px solid #1f1f1f' }}>
        {plans.map((p, i) => (
          <div
            key={p.name}
            style={{
              padding: '48px 36px',
              borderRight: i < 3 ? '0.5px solid #1f1f1f' : 'none',
              background: p.highlight ? '#050f1a' : 'transparent',
              position: 'relative',
              display: 'flex', flexDirection: 'column',
            }}
          >
            {p.badge && (
              <div style={{ position: 'absolute', top: -1, left: 36, background: '#3b82f6', color: '#fff', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', padding: '4px 14px' }}>
                {p.badge}
              </div>
            )}

            <div style={{ marginBottom: 32 }}>
              <p style={{ color: p.color, fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 8 }}>{p.name}</p>
              {p.custom ? (
                <p style={{ color: '#fff', fontSize: 36, fontWeight: 800, margin: '0 0 8px', lineHeight: 1 }}>Custom</p>
              ) : (
                <div style={{ marginBottom: 8 }}>
                  <p style={{ color: '#fff', fontSize: 36, fontWeight: 800, margin: 0, lineHeight: 1 }}>
                    ₹{(yearly ? p.price.yearly : p.price.monthly).toLocaleString()}
                  </p>
                  <p style={{ color: '#52525b', fontSize: 11, marginTop: 6 }}>/month {yearly ? '(billed yearly)' : '(billed monthly)'}</p>
                </div>
              )}
              <p style={{ color: '#52525b', fontSize: 12, lineHeight: 1.6, margin: 0 }}>{p.desc}</p>
            </div>

            <Link href="/contact" style={{
              display: 'block', textAlign: 'center',
              background: p.highlight ? '#3b82f6' : 'none',
              border: `1px solid ${p.highlight ? '#3b82f6' : '#27272a'}`,
              color: '#fff', textDecoration: 'none',
              fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase',
              padding: '12px 24px', borderRadius: 2, marginBottom: 32,
            }}>{p.cta} →</Link>

            <div style={{ flex: 1 }}>
              <p style={{ color: '#3f3f46', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 16 }}>Included</p>
              {p.features.map(f => (
                <div key={f} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'flex-start' }}>
                  <span style={{ color: p.color, fontSize: 12, flexShrink: 0, marginTop: 1 }}>✓</span>
                  <p style={{ color: '#a0a0a0', fontSize: 12, margin: 0, lineHeight: 1.4 }}>{f}</p>
                </div>
              ))}
              {p.notIncluded.length > 0 && (
                <>
                  <p style={{ color: '#3f3f46', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', margin: '20px 0 12px' }}>Not Included</p>
                  {p.notIncluded.map(f => (
                    <div key={f} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'flex-start' }}>
                      <span style={{ color: '#27272a', fontSize: 12, flexShrink: 0, marginTop: 1 }}>✗</span>
                      <p style={{ color: '#3f3f46', fontSize: 12, margin: 0, lineHeight: 1.4 }}>{f}</p>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* STATS BAR */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderBottom: '0.5px solid #1f1f1f' }}>
        {[
          { value: '150+', label: 'Brands Scaled' },
          { value: '₹3.2M+', label: 'Ad Spend Managed' },
          { value: '10x', label: 'Average ROAS' },
          { value: '98%', label: 'Client Retention' },
        ].map((s, i) => (
          <div key={s.label} style={{ padding: '40px 48px', borderRight: i < 3 ? '0.5px solid #1f1f1f' : 'none', textAlign: 'center' }}>
            <p style={{ color: '#fff', fontSize: 'clamp(28px, 3vw, 40px)', fontWeight: 800, margin: 0, lineHeight: 1 }}>{s.value}</p>
            <p style={{ color: '#52525b', fontSize: 12, marginTop: 8 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div style={{ padding: '80px 48px', borderBottom: '0.5px solid #1f1f1f' }}>
        <p style={{ color: '#3b82f6', fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase', marginBottom: 16 }}>FAQ</p>
        <h2 style={{ color: '#fff', fontSize: 'clamp(28px, 3.5vw, 48px)', fontWeight: 800, textTransform: 'uppercase', lineHeight: 1.1, marginBottom: 48 }}>
          COMMON<br />QUESTIONS
        </h2>
        <div style={{ maxWidth: 720 }}>
          {faqs.map((f, i) => (
            <div key={i} style={{ borderTop: '0.5px solid #1f1f1f' }}>
              <div
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 0', cursor: 'pointer' }}
              >
                <p style={{ color: '#fff', fontSize: 15, fontWeight: 500, margin: 0 }}>{f.q}</p>
                <span style={{ color: '#52525b', fontSize: 20, flexShrink: 0, marginLeft: 24 }}>{openFaq === i ? '−' : '+'}</span>
              </div>
              {openFaq === i && (
                <p style={{ color: '#52525b', fontSize: 13, lineHeight: 1.8, margin: '0 0 24px', maxWidth: 600 }}>{f.a}</p>
              )}
            </div>
          ))}
          <div style={{ borderTop: '0.5px solid #1f1f1f' }} />
        </div>
      </div>

      {/* BOTTOM CTA */}
      <div style={{ padding: '80px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ color: '#52525b', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 12 }}>Still Not Sure?</p>
          <h2 style={{ color: '#fff', fontSize: 'clamp(24px, 3vw, 40px)', fontWeight: 800, textTransform: 'uppercase', margin: 0, lineHeight: 1.1 }}>
            GET A FREE AUDIT<br /><span style={{ color: '#3b82f6' }}>BEFORE YOU DECIDE</span>
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