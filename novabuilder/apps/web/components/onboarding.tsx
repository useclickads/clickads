'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type OnboardingStep = 'welcome' | 'use-case' | 'template' | 'name' | 'done';

const TEMPLATES = [
  { id: 'blank', name: 'Blank Project', desc: 'Start from scratch', icon: '□' },
  { id: 'startup_landing', name: 'Startup Landing', desc: 'Hero, features, pricing, CTA', icon: '★' },
  { id: 'portfolio', name: 'Portfolio', desc: 'Showcase your work', icon: '◇' },
  { id: 'blog', name: 'Blog', desc: 'Posts, categories, authors', icon: 'T' },
  { id: 'ecommerce', name: 'E-Commerce', desc: 'Products, cart, checkout', icon: '$' },
  { id: 'saas_docs', name: 'SaaS Docs', desc: 'Documentation site', icon: '⊟' },
];

const USE_CASES = [
  { id: 'personal', label: 'Personal Website', icon: '○' },
  { id: 'business', label: 'Business/Startup', icon: '★' },
  { id: 'portfolio', label: 'Portfolio', icon: '◇' },
  { id: 'blog', label: 'Blog/Content', icon: 'T' },
  { id: 'ecommerce', label: 'Online Store', icon: '$' },
  { id: 'other', label: 'Other', icon: '…' },
];

export function OnboardingFlow({ onComplete }: { onComplete: (data: { name: string; slug: string; template: string }) => void }) {
  const [step, setStep] = useState<OnboardingStep>('welcome');
  const [useCase, setUseCase] = useState('');
  const [template, setTemplate] = useState('blank');
  const [projectName, setProjectName] = useState('');
  const router = useRouter();

  function generateSlug(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'my-project';
  }

  function handleComplete() {
    const slug = generateSlug(projectName || 'my-project');
    onComplete({ name: projectName || 'My Project', slug, template });
  }

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={progressBar}>
          {['welcome', 'use-case', 'template', 'name'].map((s, i) => (
            <div
              key={s}
              style={{
                ...progressDot,
                background: ['welcome', 'use-case', 'template', 'name'].indexOf(step) >= i ? '#2563eb' : '#e2e8f0',
              }}
            />
          ))}
        </div>

        {step === 'welcome' && (
          <div style={stepContent}>
            <h1 style={headingStyle}>Welcome to NovaBuilder</h1>
            <p style={subheadStyle}>Build beautiful websites with AI-powered tools and a visual editor.</p>
            <button onClick={() => setStep('use-case')} style={nextBtn}>Get Started</button>
          </div>
        )}

        {step === 'use-case' && (
          <div style={stepContent}>
            <h2 style={stepTitle}>What are you building?</h2>
            <div style={optionsGrid}>
              {USE_CASES.map((uc) => (
                <button
                  key={uc.id}
                  onClick={() => { setUseCase(uc.id); setStep('template'); }}
                  style={{ ...optionCard, ...(useCase === uc.id ? optionActive : {}) }}
                >
                  <span style={optionIcon}>{uc.icon}</span>
                  <span style={optionLabel}>{uc.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'template' && (
          <div style={stepContent}>
            <h2 style={stepTitle}>Choose a starting point</h2>
            <div style={templateGrid}>
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTemplate(t.id)}
                  style={{ ...templateCard, ...(template === t.id ? templateActive : {}) }}
                >
                  <span style={templateIcon}>{t.icon}</span>
                  <span style={templateName}>{t.name}</span>
                  <span style={templateDesc}>{t.desc}</span>
                </button>
              ))}
            </div>
            <div style={stepActions}>
              <button onClick={() => setStep('use-case')} style={backBtn}>Back</button>
              <button onClick={() => setStep('name')} style={nextBtn}>Continue</button>
            </div>
          </div>
        )}

        {step === 'name' && (
          <div style={stepContent}>
            <h2 style={stepTitle}>Name your project</h2>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="My Amazing Website"
              style={nameInput}
              autoFocus
            />
            {projectName && (
              <p style={slugPreview}>
                URL: <code style={slugCode}>{generateSlug(projectName)}.novabuilder.app</code>
              </p>
            )}
            <div style={stepActions}>
              <button onClick={() => setStep('template')} style={backBtn}>Back</button>
              <button onClick={handleComplete} style={nextBtn} disabled={!projectName.trim()}>
                Create Project
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const overlayStyle: React.CSSProperties = {
  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)',
  zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
};
const modalStyle: React.CSSProperties = {
  width: 560, maxHeight: '85vh', background: '#fff', borderRadius: 20,
  boxShadow: '0 24px 80px rgba(0,0,0,0.2)', overflow: 'auto', padding: '32px 36px',
};
const progressBar: React.CSSProperties = { display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 28 };
const progressDot: React.CSSProperties = { width: 8, height: 8, borderRadius: 4, transition: 'background 0.2s' };
const stepContent: React.CSSProperties = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 };
const headingStyle: React.CSSProperties = { margin: 0, fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', textAlign: 'center' };
const subheadStyle: React.CSSProperties = { margin: 0, fontSize: '1rem', color: '#64748b', textAlign: 'center', maxWidth: 360 };
const stepTitle: React.CSSProperties = { margin: 0, fontSize: '1.15rem', fontWeight: 700, color: '#0f172a' };
const optionsGrid: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, width: '100%' };
const optionCard: React.CSSProperties = {
  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
  padding: '16px 8px', borderRadius: 12, border: '1px solid #e2e8f0',
  background: '#fff', cursor: 'pointer', transition: 'all 0.15s',
};
const optionActive: React.CSSProperties = { borderColor: '#2563eb', background: '#eff6ff' };
const optionIcon: React.CSSProperties = { fontSize: '1.2rem', color: '#64748b' };
const optionLabel: React.CSSProperties = { fontSize: '0.8rem', fontWeight: 600, color: '#334155' };
const templateGrid: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, width: '100%' };
const templateCard: React.CSSProperties = {
  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
  padding: '14px 8px', borderRadius: 12, border: '1px solid #e2e8f0',
  background: '#fff', cursor: 'pointer',
};
const templateActive: React.CSSProperties = { borderColor: '#2563eb', background: '#eff6ff' };
const templateIcon: React.CSSProperties = {
  width: 36, height: 36, borderRadius: 8, background: '#f1f5f9',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontSize: '0.9rem', fontWeight: 800, color: '#64748b',
};
const templateName: React.CSSProperties = { fontSize: '0.75rem', fontWeight: 600, color: '#334155' };
const templateDesc: React.CSSProperties = { fontSize: '0.6rem', color: '#94a3b8', textAlign: 'center' };
const stepActions: React.CSSProperties = { display: 'flex', gap: 10, width: '100%', justifyContent: 'center', marginTop: 8 };
const nextBtn: React.CSSProperties = {
  padding: '12px 28px', borderRadius: 10, border: 'none', background: '#0f172a',
  color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem',
};
const backBtn: React.CSSProperties = {
  padding: '12px 28px', borderRadius: 10, border: '1px solid #e2e8f0',
  background: '#fff', color: '#475569', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem',
};
const nameInput: React.CSSProperties = {
  width: '100%', padding: '14px 16px', borderRadius: 12, border: '1px solid #e2e8f0',
  fontSize: '1rem', color: '#0f172a', outline: 'none', textAlign: 'center',
};
const slugPreview: React.CSSProperties = { margin: 0, fontSize: '0.8rem', color: '#64748b' };
const slugCode: React.CSSProperties = { background: '#f1f5f9', padding: '2px 6px', borderRadius: 4, fontFamily: 'monospace', fontSize: '0.75rem' };
