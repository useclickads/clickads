'use client';
import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', company: '', budget: '', service: '', message: ''
  });

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a' }}>
      <Navbar />

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 73px)' }}>

        {/* LEFT */}
        <div style={{ width: '40%', padding: '80px 48px', boxSizing: 'border-box', borderRight: '0.5px solid #1f1f1f', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <p style={{ color: '#3b82f6', fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase', marginBottom: 16 }}>Free Audit</p>
            <h1 style={{ color: '#fff', fontSize: 'clamp(32px, 4vw, 56px)', fontWeight: 800, textTransform: 'uppercase', lineHeight: 1.05, marginBottom: 24 }}>
              LET'S<br />GROW<br /><span style={{ color: '#3b82f6' }}>YOUR</span><br />BRAND
            </h1>
            <p style={{ color: '#52525b', fontSize: 13, lineHeight: 1.8, maxWidth: 280 }}>
              Get a free audit of your current marketing setup. We'll identify gaps, opportunities, and a clear roadmap to scale.
            </p>
          </div>
          <div>
            {[
              { label: 'Response Time', value: '< 2 hours' },
              { label: 'Free Audit Value', value: '$500' },
              { label: 'No Commitment', value: '100%' },
            ].map(s => (
              <div key={s.label} style={{ borderLeft: '2px solid #1f1f1f', paddingLeft: 16, marginBottom: 24 }}>
                <p style={{ color: '#fff', fontSize: 20, fontWeight: 700, margin: 0 }}>{s.value}</p>
                <p style={{ color: '#52525b', fontSize: 11, marginTop: 4 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div style={{ flex: 1, padding: '80px 64px', boxSizing: 'border-box', overflowY: 'auto' }}>
          {submitted ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, color: '#fff', marginBottom: 24 }}>✓</div>
              <h2 style={{ color: '#fff', fontSize: 32, fontWeight: 800, textTransform: 'uppercase', marginBottom: 16 }}>You're In!</h2>
              <p style={{ color: '#52525b', fontSize: 14, lineHeight: 1.7, maxWidth: 320 }}>We'll review your details and send your free audit within 2 hours.</p>
            </div>
          ) : (
            <div>
              <h2 style={{ color: '#fff', fontSize: 24, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 48 }}>Book Your Free Audit</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
                {[
                  { key: 'name', label: 'Full Name', placeholder: 'Your Name' },
                  { key: 'email', label: 'Email Address', placeholder: 'you@company.com' },
                  { key: 'company', label: 'Company Name', placeholder: 'Your Brand' },
                ].map(f => (
                  <div key={f.key}>
                    <p style={{ color: '#52525b', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 8 }}>{f.label}</p>
                    <input
                      placeholder={f.placeholder}
                      value={form[f.key as keyof typeof form]}
                      onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                      style={{ width: '100%', background: 'none', border: 'none', borderBottom: '1px solid #27272a', color: '#fff', fontSize: 14, padding: '10px 0', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                ))}
                <div>
                  <p style={{ color: '#52525b', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 8 }}>Monthly Budget</p>
                  <select
                    value={form.budget}
                    onChange={e => setForm({ ...form, budget: e.target.value })}
                    style={{ width: '100%', background: '#0a0a0a', border: 'none', borderBottom: '1px solid #27272a', color: form.budget ? '#fff' : '#52525b', fontSize: 14, padding: '10px 0', outline: 'none', boxSizing: 'border-box', cursor: 'pointer' }}
                  >
                    <option value="" disabled>Select budget</option>
                    <option value="<10k">Under $10,000</option>
                    <option value="10-50k">$10,000 – $50,000</option>
                    <option value="50-100k">$50,000 – $100,000</option>
                    <option value="100k+">$100,000+</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: 24 }}>
                <p style={{ color: '#52525b', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 16 }}>Service Interested In</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {['Google Ads', 'Meta Ads', 'SEO', 'Email Marketing', 'AI Creatives', 'Web Dev', 'lidflow CRM', 'GrwFit'].map(s => (
                    <button key={s} onClick={() => setForm({ ...form, service: s })}
                      style={{ border: `1px solid ${form.service === s ? '#3b82f6' : '#27272a'}`, color: form.service === s ? '#3b82f6' : '#52525b', background: 'none', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '7px 16px', borderRadius: 100, cursor: 'pointer', transition: 'all 0.2s' }}
                    >{s}</button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 40 }}>
                <p style={{ color: '#52525b', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 8 }}>Tell Us About Your Goals</p>
                <textarea
                  placeholder="What are you trying to achieve? Current challenges?"
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  rows={4}
                  style={{ width: '100%', background: 'none', border: 'none', borderBottom: '1px solid #27272a', color: '#fff', fontSize: 14, padding: '10px 0', outline: 'none', resize: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
                />
              </div>

              <button
                onClick={() => setSubmitted(true)}
                style={{ background: '#3b82f6', color: '#fff', border: 'none', fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', padding: '16px 48px', cursor: 'pointer', borderRadius: 2 }}
                onMouseEnter={e => (e.currentTarget.style.background = '#2563eb')}
                onMouseLeave={e => (e.currentTarget.style.background = '#3b82f6')}
              >Get My Free Audit →</button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}