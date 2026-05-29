"use client";
import { useEffect, useRef, useState } from "react";
import "@/styles/contact/Contact.css";

const stats = [
  { num:"50+",  label:"Clients served across India & globally" },
  { num:"3×",   label:"Average revenue lift within 90 days" },
  { num:"98%",  label:"Client satisfaction & retention rate" },
  { num:"4yr",  label:"Building growth systems since 2021" },
];

const PhoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7a2 2 0 0 1 1.72 2.02z"/>
  </svg>
);

const BulbIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z"/>
    <path d="M9 21h6"/>
  </svg>
);

const RocketIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
    <path d="m3.5 11.5 5 5"/>
    <path d="M20.4 3.6a2 2 0 0 1 0 2.8L9.8 16.8a4 4 0 0 1-5.6-5.6L14.6 0.6a2 2 0 0 1 2.8 0l3 3z"/>
  </svg>
);

const TrendingIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
    <polyline points="17 6 23 6 23 12"/>
  </svg>
);

const steps = [
  { num:"01", icon:<PhoneIcon />,    title:"Discovery Call",       desc:"You tell us what you're building and where you're stuck. We listen, ask the right questions, and map out exactly what needs to happen. No pitch, no fluff — just clarity." },
  { num:"02", icon:<BulbIcon />,     title:"Strategy & Proposal",  desc:"Within 48 hours, we send a detailed proposal — scope, timeline, deliverables, and pricing. No surprises, no hidden costs. You know exactly what you're getting." },
  { num:"03", icon:<RocketIcon />,   title:"Build & Execute",      desc:"We get to work. Weekly updates, async communication, and a shared dashboard so you always know where things stand. You're never in the dark." },
  { num:"04", icon:<TrendingIcon />, title:"Launch & Scale",       desc:"We don't disappear at launch. We monitor performance, fix issues fast, and identify the next lever to pull. Growth doesn't stop — neither do we." },
];

const faqs = [
  { q:"How quickly can you start?",               a:"For most projects, we can begin within 5–7 business days of signing. For urgent projects, we have a fast-track option — reach out and let us know your timeline." },
  { q:"Do you work with early-stage startups?",   a:"Yes. We work with businesses at all stages — from pre-revenue startups to established companies scaling aggressively. What matters is that you're serious about growth." },
  { q:"What's your pricing model?",               a:"We offer both project-based pricing and monthly retainers depending on the scope. After the discovery call, we'll recommend the model that makes the most sense for your goals." },
  { q:"Can I hire you for just one service?",     a:"Absolutely. You can engage us for a single service or the full stack. Many clients start with one and expand as they see results." },
  { q:"How do you measure success?",              a:"We agree on clear KPIs before we start — ROAS, CAC, conversion rate, velocity, or whatever metrics matter most to your business. We report against those weekly." },
  { q:"Do you sign NDAs?",                        a:"Yes, always. We treat your business information with complete confidentiality and are happy to sign an NDA before any discussions begin." },
];

type SiteConfig = {
  email: string;
  emailDisplay: string;
  phone: string;
  phoneDisplay: string;
};

function FadeBlock({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.05 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className={`ct-fade${visible ? " ct-fade--visible" : ""}`} style={{ transitionDelay:`${delay}s` }}>
      {children}
    </div>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="ct-faq-item">
      <button className="ct-faq-btn" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span className="ct-faq-q">{q}</span>
        <span className={`ct-faq-icon${open ? " ct-faq-icon--open" : ""}`} aria-hidden="true" style={{ fontSize:20, color:"rgba(255,255,255,0.4)", flexShrink:0, transition:"transform 0.25s ease", display:"inline-block" }}>+</span>
      </button>
      <div className={`ct-faq-answer${open ? " ct-faq-answer--open" : ""}`} aria-hidden={!open}>
        <p className="ct-faq-answer-inner">{a}</p>
      </div>
    </div>
  );
}

export default function ContactProcess() {
  const [config, setConfig] = useState<SiteConfig>({
    email: "",
    emailDisplay: "",
    phone: "",
    phoneDisplay: "",
  });

  useEffect(() => {
    fetch("/api/config")
      .then(res => res.json())
      .then(data => setConfig(data))
      .catch(() => {
        // fallback — silently keep empty strings
      });
  }, []);

  return (
    <>
      {/* Stats */}
      <section className="ct-stats-section">
        <div className="ct-stats-wrap">
          <FadeBlock>
            <div className="ct-section-header">
              <p className="ct-label">Why ClickAds</p>
              <h2 className="ct-section-title">Numbers that speak for themselves.</h2>
            </div>
          </FadeBlock>
          <div className="ct-stats-grid">
            {stats.map((s, i) => (
              <FadeBlock key={s.num} delay={i * 0.08}>
                <div className="ct-stat-card">
                  <p className="ct-stat-num">{s.num}</p>
                  <p className="ct-stat-label">{s.label}</p>
                </div>
              </FadeBlock>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="ct-process-section">
        <div className="ct-process-wrap">
          <FadeBlock>
            <div className="ct-section-header">
              <p className="ct-label">How It Works</p>
              <h2 className="ct-section-title">From first message to measurable results.</h2>
            </div>
          </FadeBlock>
          <div className="ct-process-grid">
            {steps.map((s, i) => (
              <FadeBlock key={s.num} delay={i * 0.08}>
                <div className="ct-process-card">
                  <span className="ct-process-num">{s.num}</span>
                  <div className="ct-process-icon">{s.icon}</div>
                  <div className="ct-process-body">
                    <h3 className="ct-process-title">{s.title}</h3>
                    <p className="ct-process-desc">{s.desc}</p>
                  </div>
                </div>
              </FadeBlock>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="ct-faq-section">
        <div className="ct-faq-wrap">
          <FadeBlock>
            <div className="ct-section-header">
              <p className="ct-label">FAQ</p>
              <h2 className="ct-section-title">Questions we get a lot.</h2>
            </div>
          </FadeBlock>
          <div className="ct-faq-list">
            {faqs.map((f) => (
              <FAQItem key={f.q} q={f.q} a={f.a} />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="ct-cta-section">
        <div className="ct-cta-grid" aria-hidden="true" />
        <FadeBlock>
          <div className="ct-cta-inner">
            <p className="ct-label" style={{ marginBottom:16 }}>Ready When You Are</p>
            <h2 className="ct-cta-h2">Let's build something that scales.</h2>
            <p className="ct-cta-sub">No long-term contracts. No hidden fees. Just results.</p>
            <div className="ct-cta-btns">
              {config.email && (
                <a href={`mailto:${config.email}`} className="hero-btn-primary">
                  {config.emailDisplay || config.email}
                </a>
              )}
              {config.phone && (
                <a href={`tel:${config.phone}`} className="hero-btn-secondary">
                  {config.phoneDisplay ? `${config.phoneDisplay} →` : "Call Us →"}
                </a>
              )}
            </div>
          </div>
        </FadeBlock>
      </section>
    </>
  );
}