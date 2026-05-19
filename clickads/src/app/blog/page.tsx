'use client';
import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const posts = [
  {
    slug: '10x-roas-google-ads',
    num: '01',
    title: 'How We Achieved 10x ROAS on Google Ads for a Travel Brand',
    excerpt: 'A deep dive into the exact campaign structure, bidding strategy and landing page setup that took TravelNest from 1.2x to 10x ROAS in 90 days.',
    category: 'Google Ads',
    color: '#3b82f6',
    date: 'Jan 12, 2025',
    readTime: '8 min read',
    featured: true,
  },
  {
    slug: 'meta-ads-ugc-strategy',
    num: '02',
    title: 'Why UGC-Style Creatives Outperform Polished Ads on Meta in 2025',
    excerpt: 'Our analysis of 200+ ad creatives across 40 brands shows that raw, authentic UGC content consistently beats high-production studio ads by 3-5x.',
    category: 'Meta Ads',
    color: '#a855f7',
    date: 'Jan 28, 2025',
    readTime: '6 min read',
    featured: true,
  },
  {
    slug: 'lidflow-travel-crm-guide',
    num: '03',
    title: 'The Complete Guide to Managing Travel Leads with lidflow CRM',
    excerpt: 'How travel agencies are using lidflow to cut lead response time from 24 hours to 8 minutes and triple their booking conversion rate.',
    category: 'lidflow',
    color: '#00b4d8',
    date: 'Feb 5, 2025',
    readTime: '10 min read',
    featured: false,
  },
  {
    slug: 'gym-member-retention',
    num: '04',
    title: 'The Gym Member Retention Playbook: How GrwFit Reduces Churn by 60%',
    excerpt: "Member churn kills gym profitability. Here's the exact automation sequence we built inside GrwFit that keeps members coming back.",
    category: 'GrwFit',
    color: '#f97316',
    date: 'Feb 14, 2025',
    readTime: '7 min read',
    featured: false,
  },
  {
    slug: 'ai-ad-creatives-2025',
    num: '05',
    title: "AI Ad Creatives in 2025: What Works, What Doesn't",
    excerpt: "We generated 10,000 AI ad creatives last year. Here's our honest breakdown of which AI tools, prompts and styles actually drive conversions.",
    category: 'AI Creatives',
    color: '#ec4899',
    date: 'Feb 22, 2025',
    readTime: '9 min read',
    featured: true,
  },
  {
    slug: 'seo-vs-paid-ads',
    num: '06',
    title: 'SEO vs Paid Ads: Which Should You Invest In First?',
    excerpt: "The classic debate — but the answer depends entirely on your business stage, budget and timeline. Here's our decision framework.",
    category: 'SEO',
    color: '#22c55e',
    date: 'Mar 3, 2025',
    readTime: '5 min read',
    featured: false,
  },
  {
    slug: 'email-marketing-flows',
    num: '07',
    title: '7 Email Automation Flows Every E-commerce Brand Needs in 2025',
    excerpt: 'Welcome series, cart abandonment, post-purchase, win-back — the exact flows we set up for every new client and the results they generate.',
    category: 'Email Marketing',
    color: '#f97316',
    date: 'Mar 11, 2025',
    readTime: '11 min read',
    featured: false,
  },
  {
    slug: 'landing-page-cro',
    num: '08',
    title: "Landing Page CRO: 12 Changes That Doubled Our Clients' Conversion Rates",
    excerpt: 'Small changes, massive impact. Here are the 12 landing page tweaks we tested across 50+ clients that consistently lift conversions.',
    category: 'Web Dev',
    color: '#22c55e',
    date: 'Mar 19, 2025',
    readTime: '8 min read',
    featured: false,
  },
];

const categories = ['All', 'Google Ads', 'Meta Ads', 'SEO', 'Email Marketing', 'AI Creatives', 'lidflow', 'GrwFit', 'Web Dev'];

export default function BlogPage() {
  const [active, setActive] = useState('All');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const filtered = active === 'All' ? posts : posts.filter(p => p.category === active);
  const featured = posts.filter(p => p.featured).slice(0, 2);

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a' }}>
      <Navbar />

      {/* HERO */}
      <div style={{ padding: '80px 48px 60px', borderBottom: '0.5px solid #1f1f1f' }}>
        <p style={{ color: '#3b82f6', fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase', marginBottom: 16 }}>Insights & Guides</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <h1 style={{ color: '#fff', fontSize: 'clamp(40px, 6vw, 80px)', fontWeight: 800, textTransform: 'uppercase', lineHeight: 1.0, margin: 0 }}>
            THE<br /><span style={{ color: '#3b82f6' }}>BLOG</span>
          </h1>
          <p style={{ color: '#52525b', fontSize: 13, lineHeight: 1.7, maxWidth: 320, margin: 0 }}>
            Actionable marketing strategies, case studies and product updates from the ClickAds team.
          </p>
        </div>
      </div>

      {/* FEATURED */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: '0.5px solid #1f1f1f' }}>
        {featured.map((p, i) => (
          <div
            key={p.slug}
            style={{
              padding: '48px',
              borderRight: i === 0 ? '0.5px solid #1f1f1f' : 'none',
              cursor: 'pointer', transition: 'background 0.3s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#0a0f1a')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <span style={{ color: p.color, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', border: `1px solid ${p.color}`, padding: '4px 12px', borderRadius: 100 }}>{p.category}</span>
              <span style={{ color: '#3f3f46', fontSize: 11 }}>{p.date} · {p.readTime}</span>
            </div>
            <h2 style={{ color: '#fff', fontSize: 'clamp(18px, 2vw, 26px)', fontWeight: 700, lineHeight: 1.3, marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.02em' }}>{p.title}</h2>
            <p style={{ color: '#52525b', fontSize: 13, lineHeight: 1.8, marginBottom: 24 }}>{p.excerpt}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: p.color, opacity: 0.3 }} />
              <p style={{ color: p.color, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', margin: 0 }}>Read Article →</p>
            </div>
          </div>
        ))}
      </div>

      {/* FILTER */}
      <div style={{ padding: '24px 48px', borderBottom: '0.5px solid #1f1f1f', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {categories.map(c => (
          <button key={c} onClick={() => setActive(c)} style={{
            border: `1px solid ${active === c ? '#3b82f6' : '#27272a'}`,
            color: active === c ? '#3b82f6' : '#52525b',
            background: 'none', fontSize: 10,
            letterSpacing: '0.15em', textTransform: 'uppercase',
            padding: '7px 18px', borderRadius: 100, cursor: 'pointer',
            transition: 'all 0.2s',
          }}>{c}</button>
        ))}
      </div>

      {/* ALL POSTS */}
      <div>
        {filtered.map((p) => (
          <div
            key={p.slug}
            style={{
              display: 'flex', alignItems: 'stretch',
              borderBottom: '0.5px solid #1f1f1f', cursor: 'pointer',
              transition: 'background 0.3s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#0f0f0f')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <div style={{ width: 80, padding: '32px 24px', borderRight: '0.5px solid #1f1f1f', display: 'flex', alignItems: 'center' }}>
              <p style={{ color: '#1f1f1f', fontSize: 24, fontWeight: 800, margin: 0 }}>{p.num}</p>
            </div>
            <div style={{ width: 160, padding: '32px 24px', borderRight: '0.5px solid #1f1f1f', display: 'flex', alignItems: 'center' }}>
              <div>
                <div style={{ width: 3, height: 16, background: p.color, marginBottom: 8, borderRadius: 2 }} />
                <p style={{ color: p.color, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', margin: 0 }}>{p.category}</p>
              </div>
            </div>
            <div style={{ flex: 1, padding: '32px 32px', borderRight: '0.5px solid #1f1f1f', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <h3 style={{ color: '#fff', fontSize: 15, fontWeight: 600, lineHeight: 1.4, margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.02em' }}>{p.title}</h3>
              <p style={{ color: '#52525b', fontSize: 12, lineHeight: 1.7, margin: 0, maxWidth: 560 }}>{p.excerpt}</p>
            </div>
            <div style={{ width: 160, padding: '32px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8 }}>
              <p style={{ color: '#3f3f46', fontSize: 11, margin: 0 }}>{p.date}</p>
              <p style={{ color: '#3f3f46', fontSize: 11, margin: 0 }}>{p.readTime}</p>
              <p style={{ color: p.color, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', margin: '8px 0 0' }}>Read →</p>
            </div>
          </div>
        ))}
      </div>

      {/* NEWSLETTER */}
      <div style={{ padding: '80px 48px', borderTop: '0.5px solid #1f1f1f', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#050505' }}>
        <div>
          <p style={{ color: '#3b82f6', fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase', marginBottom: 12 }}>Newsletter</p>
          <h2 style={{ color: '#fff', fontSize: 'clamp(24px, 3vw, 40px)', fontWeight: 800, textTransform: 'uppercase', margin: 0, lineHeight: 1.1 }}>
            GET MARKETING TIPS<br /><span style={{ color: '#3b82f6' }}>EVERY WEEK</span>
          </h2>
        </div>
        {subscribed ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 18 }}>✓</div>
            <p style={{ color: '#22c55e', fontSize: 13, fontWeight: 600, margin: 0 }}>You're subscribed!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 0, maxWidth: 420, flex: 1, marginLeft: 80 }}>
            <input
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{
                flex: 1, background: 'none', border: '1px solid #27272a',
                borderRight: 'none', color: '#fff', fontSize: 13,
                padding: '14px 20px', outline: 'none',
              }}
            />
            <button
              onClick={() => { if (email) setSubscribed(true); }}
              style={{
                background: '#3b82f6', color: '#fff', border: 'none',
                fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase',
                padding: '14px 24px', cursor: 'pointer', whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#2563eb')}
              onMouseLeave={e => (e.currentTarget.style.background = '#3b82f6')}
            >Subscribe →</button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}