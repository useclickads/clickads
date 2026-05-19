'use client';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const features = [
  { icon: '◈', title: 'Lead Management', desc: 'Capture, qualify and track every travel lead from inquiry to booking in one unified pipeline.' },
  { icon: '◉', title: 'Booking Pipeline', desc: 'Visual kanban-style pipeline to move prospects from inquiry → quote → booked → travelled.' },
  { icon: '◎', title: 'Agent Dashboard', desc: 'Each travel agent gets their own dashboard with targets, pipeline value and task reminders.' },
  { icon: '◐', title: 'Auto Follow-ups', desc: 'Automated WhatsApp, email & SMS follow-up sequences so no lead goes cold.' },
  { icon: '◑', title: 'Quote Builder', desc: 'Build beautiful itinerary quotes with packages, markup & PDF export in minutes.' },
  { icon: '◒', title: 'Revenue Analytics', desc: 'Real-time revenue reports, conversion rates, agent performance & booking trends.' },
];

const stats = [
  { value: '3x', label: 'More Bookings' },
  { value: '80%', label: 'Less Manual Work' },
  { value: '500+', label: 'Travel Agents' },
  { value: '98%', label: 'Retention Rate' },
];

export default function LidflowPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a' }}>
      <Navbar />

      {/* HERO */}
      <div style={{ display: 'flex', minHeight: '90vh' }}>

        {/* LEFT */}
        <div style={{ width: '55%', padding: '80px 64px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'center', borderRight: '0.5px solid #1f1f1f' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 24, border: '1px solid #00b4d8', padding: '6px 16px', borderRadius: 100, width: 'fit-content' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#00b4d8' }} />
            <p style={{ color: '#00b4d8', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', margin: 0 }}>Travel CRM SaaS</p>
          </div>

          <h1 style={{ color: '#fff', fontSize: 'clamp(48px, 6vw, 88px)', fontWeight: 800, textTransform: 'uppercase', lineHeight: 1.0, margin: '0 0 24px' }}>
            LID<span style={{ color: '#00b4d8' }}>FLOW</span>
          </h1>

          <p style={{ color: '#52525b', fontSize: 16, lineHeight: 1.8, maxWidth: 480, marginBottom: 40 }}>
            The only CRM built exclusively for travel agencies, tour operators & OTAs. Close more bookings, automate follow-ups, and grow your travel business — all from one dashboard.
          </p>

          <div style={{ display: 'flex', gap: 16, marginBottom: 64 }}>
            <Link href="/contact" style={{ background: '#00b4d8', color: '#fff', textDecoration: 'none', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', padding: '14px 32px', borderRadius: 2 }}>
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
                <p style={{ color: '#00b4d8', fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 800, margin: 0, lineHeight: 1 }}>{s.value}</p>
                <p style={{ color: '#52525b', fontSize: 11, marginTop: 6 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — MOCK UI */}
        <div style={{ flex: 1, padding: '80px 48px', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#050505' }}>
          <div style={{ width: '100%', maxWidth: 420, background: '#111', borderRadius: 12, border: '0.5px solid #1f1f1f', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '0.5px solid #1f1f1f', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ color: '#00b4d8', fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', margin: 0 }}>LIDFLOW</p>
              <div style={{ display: 'flex', gap: 6 }}>
                {['#ff5f57', '#ffbd2e', '#28ca41'].map(c => (
                  <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
                ))}
              </div>
            </div>
            <div style={{ padding: 16, display: 'flex', gap: 10 }}>
              {[
                { stage: 'Inquiry', count: 12, color: '#52525b', leads: ['Raj Sharma', 'Priya Nair', 'Ahmed Ali'] },
                { stage: 'Quote Sent', count: 7, color: '#f97316', leads: ['Sarah K.', 'John M.'] },
                { stage: 'Booked', count: 4, color: '#00b4d8', leads: ['Anjali S.', 'Ravi T.'] },
                { stage: 'Travelled', count: 19, color: '#22c55e', leads: ['Kumar P.'] },
              ].map(col => (
                <div key={col.stage} style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <p style={{ color: col.color, fontSize: 8, letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>{col.stage}</p>
                    <span style={{ color: '#3f3f46', fontSize: 8 }}>{col.count}</span>
                  </div>
                  {col.leads.map(l => (
                    <div key={l} style={{ background: '#1a1a1a', borderRadius: 4, padding: '8px 10px', marginBottom: 6, borderLeft: `2px solid ${col.color}` }}>
                      <p style={{ color: '#fff', fontSize: 9, margin: 0, fontWeight: 500 }}>{l}</p>
                      <p style={{ color: '#3f3f46', fontSize: 8, margin: '2px 0 0' }}>Travel inquiry</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div style={{ padding: '12px 20px', borderTop: '0.5px solid #1f1f1f', display: 'flex', justifyContent: 'space-between' }}>
              <p style={{ color: '#3f3f46', fontSize: 9, margin: 0 }}>Pipeline value</p>
              <p style={{ color: '#00b4d8', fontSize: 9, fontWeight: 700, margin: 0 }}>₹48.2L this month</p>
            </div>
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <div style={{ padding: '80px 48px', borderTop: '0.5px solid #1f1f1f' }}>
        <p style={{ color: '#00b4d8', fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase', marginBottom: 16 }}>Features</p>
        <h2 style={{ color: '#fff', fontSize: 'clamp(28px, 3.5vw, 48px)', fontWeight: 800, textTransform: 'uppercase', lineHeight: 1.1, marginBottom: 64 }}>
          EVERYTHING YOUR<br />TRAVEL BUSINESS NEEDS
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: '#1f1f1f' }}>
          {features.map(f => (
            <div key={f.title} style={{ background: '#0a0a0a', padding: '40px 36px' }}>
              <p style={{ color: '#00b4d8', fontSize: 24, margin: '0 0 16px' }}>{f.icon}</p>
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
            START FREE.<br /><span style={{ color: '#00b4d8' }}>SCALE AS YOU GROW.</span>
          </h2>
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          {[
            { plan: 'Starter', price: '₹2,999', period: '/mo', features: '1 Agent · 100 Leads' },
            { plan: 'Growth', price: '₹7,999', period: '/mo', features: '5 Agents · Unlimited Leads', highlight: true },
            { plan: 'Enterprise', price: 'Custom', period: '', features: 'Unlimited · White Label' },
          ].map(p => (
            <div key={p.plan} style={{
              border: `1px solid ${p.highlight ? '#00b4d8' : '#1f1f1f'}`,
              borderRadius: 4, padding: '24px 28px', minWidth: 160,
              background: p.highlight ? '#001a20' : 'transparent',
            }}>
              <p style={{ color: p.highlight ? '#00b4d8' : '#52525b', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 8 }}>{p.plan}</p>
              <p style={{ color: '#fff', fontSize: 22, fontWeight: 800, margin: '0 0 4px' }}>{p.price}<span style={{ fontSize: 11, color: '#52525b' }}>{p.period}</span></p>
              <p style={{ color: '#52525b', fontSize: 11, margin: '0 0 16px' }}>{p.features}</p>
              <Link href="/contact" style={{ color: p.highlight ? '#00b4d8' : '#52525b', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none' }}>
                Get Started →
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* BOTTOM CTA */}
      <div style={{ padding: '60px 48px', background: '#050505', borderTop: '0.5px solid #1f1f1f', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ color: '#fff', fontSize: 'clamp(20px, 2.5vw, 32px)', fontWeight: 800, textTransform: 'uppercase', margin: 0 }}>
          READY TO CLOSE MORE BOOKINGS?
        </h2>
        <Link href="/contact" style={{ background: '#00b4d8', color: '#fff', textDecoration: 'none', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', padding: '14px 36px', borderRadius: 2 }}>
          Start Free Trial →
        </Link>
      </div>

      <Footer />
    </div>
  );
}