'use client';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const features = [
  { icon: '◈', title: 'Member Management', desc: 'Complete member profiles, membership plans, renewals and attendance history in one place.' },
  { icon: '◉', title: 'Billing & Payments', desc: 'Automated billing, online payments, EMI plans and revenue tracking for your gym.' },
  { icon: '◎', title: 'Attendance Tracking', desc: 'QR code & biometric check-in, daily attendance reports and peak hour analytics.' },
  { icon: '◐', title: 'Retention Tools', desc: 'Auto reminders for renewals, birthday messages and win-back campaigns for churned members.' },
  { icon: '◑', title: 'Trainer Management', desc: 'Assign trainers to members, track PT sessions, trainer earnings and performance.' },
  { icon: '◒', title: 'Business Analytics', desc: 'Revenue reports, member growth, churn rate, occupancy and profitability dashboards.' },
];

const stats = [
  { value: '2x', label: 'Member Retention' },
  { value: '60%', label: 'Less Admin Work' },
  { value: '1000+', label: 'Gyms Onboarded' },
  { value: '99%', label: 'Uptime' },
];

export default function GrwFitPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a' }}>
      <Navbar />

      {/* HERO */}
      <div style={{ display: 'flex', minHeight: '90vh' }}>

        {/* LEFT */}
        <div style={{ width: '55%', padding: '80px 64px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'center', borderRight: '0.5px solid #1f1f1f' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 24, border: '1px solid #f97316', padding: '6px 16px', borderRadius: 100, width: 'fit-content' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#f97316' }} />
            <p style={{ color: '#f97316', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', margin: 0 }}>Gym Management SaaS</p>
          </div>

          <h1 style={{ color: '#fff', fontSize: 'clamp(48px, 6vw, 88px)', fontWeight: 800, textTransform: 'uppercase', lineHeight: 1.0, margin: '0 0 24px' }}>
            GRW<span style={{ color: '#f97316' }}>FIT</span>
          </h1>

          <p style={{ color: '#52525b', fontSize: 16, lineHeight: 1.8, maxWidth: 480, marginBottom: 40 }}>
            The all-in-one gym management software built for fitness entrepreneurs. Manage members, automate billing, track attendance and grow your gym — without the chaos.
          </p>

          <div style={{ display: 'flex', gap: 16, marginBottom: 64 }}>
            <Link href="/contact" style={{ background: '#f97316', color: '#fff', textDecoration: 'none', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', padding: '14px 32px', borderRadius: 2 }}>
              Start Free Trial →
            </Link>
            <Link href="/contact" style={{ border: '1px solid #27272a', color: '#fff', textDecoration: 'none', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', padding: '14px 32px', borderRadius: 2 }}>
              Watch Demo
            </Link>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, borderTop: '0.5px solid #1f1f1f', paddingTop: 40 }}>
            {stats.map(s => (
              <div key={s.value}>
                <p style={{ color: '#f97316', fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 800, margin: 0, lineHeight: 1 }}>{s.value}</p>
                <p style={{ color: '#52525b', fontSize: 11, marginTop: 6 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — MOCK UI */}
        <div style={{ flex: 1, padding: '80px 48px', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#050505' }}>
          <div style={{ width: '100%', maxWidth: 420, background: '#111', borderRadius: 12, border: '0.5px solid #1f1f1f', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '0.5px solid #1f1f1f', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ color: '#f97316', fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', margin: 0 }}>GRWFIT</p>
              <div style={{ display: 'flex', gap: 6 }}>
                {['#ff5f57', '#ffbd2e', '#28ca41'].map(c => (
                  <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: '#1f1f1f', margin: '1px 0' }}>
              {[
                { label: 'Active Members', value: '248', color: '#f97316' },
                { label: 'Due Today', value: '12', color: '#ec4899' },
                { label: 'Revenue MTD', value: '₹1.8L', color: '#22c55e' },
              ].map(s => (
                <div key={s.label} style={{ background: '#111', padding: '14px 16px' }}>
                  <p style={{ color: s.color, fontSize: 18, fontWeight: 800, margin: 0 }}>{s.value}</p>
                  <p style={{ color: '#3f3f46', fontSize: 9, margin: '4px 0 0' }}>{s.label}</p>
                </div>
              ))}
            </div>

            <div style={{ padding: 16 }}>
              <p style={{ color: '#52525b', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 10 }}>Recent Check-ins</p>
              {[
                { name: 'Vikram Singh', plan: 'Premium · 3 months left', status: 'Active', color: '#22c55e' },
                { name: 'Pooja Mehta', plan: 'Basic · Renewal due', status: 'Due', color: '#f97316' },
                { name: 'Arjun Kapoor', plan: 'Premium · 1 month left', status: 'Active', color: '#22c55e' },
                { name: 'Sneha Reddy', plan: 'PT Package · 5 sessions left', status: 'PT', color: '#00b4d8' },
              ].map(m => (
                <div key={m.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '0.5px solid #1a1a1a' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <p style={{ color: '#f97316', fontSize: 10, fontWeight: 700, margin: 0 }}>{m.name[0]}</p>
                    </div>
                    <div>
                      <p style={{ color: '#fff', fontSize: 11, fontWeight: 500, margin: 0 }}>{m.name}</p>
                      <p style={{ color: '#3f3f46', fontSize: 9, margin: '2px 0 0' }}>{m.plan}</p>
                    </div>
                  </div>
                  <span style={{ color: m.color, fontSize: 8, letterSpacing: '0.1em', textTransform: 'uppercase', border: `1px solid ${m.color}`, padding: '3px 8px', borderRadius: 100 }}>{m.status}</span>
                </div>
              ))}
            </div>

            <div style={{ padding: '12px 20px', borderTop: '0.5px solid #1f1f1f', display: 'flex', justifyContent: 'space-between' }}>
              <p style={{ color: '#3f3f46', fontSize: 9, margin: 0 }}>Today's check-ins</p>
              <p style={{ color: '#f97316', fontSize: 9, fontWeight: 700, margin: 0 }}>87 members</p>
            </div>
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <div style={{ padding: '80px 48px', borderTop: '0.5px solid #1f1f1f' }}>
        <p style={{ color: '#f97316', fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase', marginBottom: 16 }}>Features</p>
        <h2 style={{ color: '#fff', fontSize: 'clamp(28px, 3.5vw, 48px)', fontWeight: 800, textTransform: 'uppercase', lineHeight: 1.1, marginBottom: 64 }}>
          EVERYTHING YOUR<br />GYM NEEDS
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: '#1f1f1f' }}>
          {features.map(f => (
            <div key={f.title} style={{ background: '#0a0a0a', padding: '40px 36px' }}>
              <p style={{ color: '#f97316', fontSize: 24, margin: '0 0 16px' }}>{f.icon}</p>
              <p style={{ color: '#fff', fontSize: 15, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>{f.title}</p>
              <p style={{ color: '#52525b', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* PRICING */}
      <div style={{ padding: '80px 48px', borderTop: '0.5px solid #1f1f1f', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ color: '#52525b', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 12 }}>Simple Pricing</p>
          <h2 style={{ color: '#fff', fontSize: 'clamp(24px, 3vw, 40px)', fontWeight: 800, textTransform: 'uppercase', margin: 0 }}>
            GROW YOUR GYM<br /><span style={{ color: '#f97316' }}>WITHOUT LIMITS.</span>
          </h2>
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          {[
            { plan: 'Starter', price: '₹1,999', period: '/mo', features: 'Up to 100 Members' },
            { plan: 'Growth', price: '₹4,999', period: '/mo', features: 'Up to 500 Members', highlight: true },
            { plan: 'Pro', price: '₹9,999', period: '/mo', features: 'Unlimited Members' },
          ].map(p => (
            <div key={p.plan} style={{
              border: `1px solid ${p.highlight ? '#f97316' : '#1f1f1f'}`,
              borderRadius: 4, padding: '24px 28px', minWidth: 160,
              background: p.highlight ? '#1a0a00' : 'transparent',
            }}>
              <p style={{ color: p.highlight ? '#f97316' : '#52525b', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 8 }}>{p.plan}</p>
              <p style={{ color: '#fff', fontSize: 22, fontWeight: 800, margin: '0 0 4px' }}>{p.price}<span style={{ fontSize: 11, color: '#52525b' }}>{p.period}</span></p>
              <p style={{ color: '#52525b', fontSize: 11, margin: '0 0 16px' }}>{p.features}</p>
              <Link href="/contact" style={{ color: p.highlight ? '#f97316' : '#52525b', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none' }}>
                Get Started →
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* BOTTOM CTA */}
      <div style={{ padding: '60px 48px', background: '#050505', borderTop: '0.5px solid #1f1f1f', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ color: '#fff', fontSize: 'clamp(20px, 2.5vw, 32px)', fontWeight: 800, textTransform: 'uppercase', margin: 0 }}>
          READY TO GROW YOUR GYM?
        </h2>
        <Link href="/contact" style={{ background: '#f97316', color: '#fff', textDecoration: 'none', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', padding: '14px 36px', borderRadius: 2 }}>
          Start Free Trial →
        </Link>
      </div>

      <Footer />
    </div>
  );
}