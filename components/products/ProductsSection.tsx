"use client";
import { useEffect, useRef, useState } from "react";
import "@/styles/products/ProductsSection.css";

/* ── Types ────────────────────────────────────────────────────────────────── */
type Product = {
  id: string;
  eyebrow: string;
  name: string;
  tagline: string;
  target: string;
  color: string;
  bg: string;
  border: string;
  stats: { val: string; label: string }[];
  features: { icon: string; name: string; desc: string }[];
  plans: { name: string; desc: string; price: string; period: string; featured: boolean; features: string[]; ctaText: string; ctaHref: string }[];
  faqs: { q: string; a: string }[];
  ctaTitle: string;
  ctaSub: string;
  ctaHref: string;
  mockup: React.ReactNode;
};

/* ── Lidflow Mockup ───────────────────────────────────────────────────────── */
function LidflowMockup() {
  return (
    <div style={{ padding:"20px", fontFamily:"monospace" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"16px" }}>
        <span style={{ fontSize:"12px", fontWeight:700, color:"#4f8cff", letterSpacing:"0.12em" }}>LIDFLOW</span>
        <div style={{ display:"flex", gap:"6px" }}>
          {["Pipeline","Bookings","Clients"].map((t) => (
            <span key={t} style={{ fontSize:"9px", padding:"2px 8px", borderRadius:"4px", background: t==="Pipeline"?"rgba(79,140,255,0.25)":"rgba(255,255,255,0.06)", color: t==="Pipeline"?"#7ab0ff":"rgba(255,255,255,0.3)" }}>{t}</span>
          ))}
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"8px", marginBottom:"16px" }}>
        {[{label:"New Leads",val:"48",color:"#6aaaff"},{label:"Bookings",val:"21",color:"#b89eff"},{label:"Revenue",val:"₹2.4L",color:"#4eeaaa"}].map((s) => (
          <div key={s.label} style={{ background:"rgba(255,255,255,0.06)", borderRadius:"8px", padding:"10px", border:"1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ fontSize:"18px", fontWeight:700, color:s.color }}>{s.val}</div>
            <div style={{ fontSize:"8px", color:"rgba(255,255,255,0.4)", marginTop:"2px" }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ fontSize:"8px", color:"rgba(255,255,255,0.35)", marginBottom:"8px", letterSpacing:"0.08em" }}>LEAD PIPELINE</div>
      {[{stage:"New Inquiry",count:12,pct:100,color:"#6aaaff"},{stage:"Proposal Sent",count:8,pct:67,color:"#b89eff"},{stage:"Itinerary Ready",count:5,pct:42,color:"#fbbf5a"},{stage:"Booking Confirmed",count:3,pct:25,color:"#4eeaaa"}].map((p) => (
        <div key={p.stage} style={{ marginBottom:"8px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"3px" }}>
            <span style={{ fontSize:"10px", color:"rgba(255,255,255,0.6)" }}>{p.stage}</span>
            <span style={{ fontSize:"10px", color:p.color, fontWeight:700 }}>{p.count}</span>
          </div>
          <div style={{ height:"4px", borderRadius:"2px", background:"rgba(255,255,255,0.08)" }}>
            <div style={{ height:"100%", width:`${p.pct}%`, borderRadius:"2px", background:p.color }} />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── GrwFit Mockup ────────────────────────────────────────────────────────── */
function GrwFitMockup() {
  return (
    <div style={{ padding:"20px", fontFamily:"monospace" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"16px" }}>
        <span style={{ fontSize:"12px", fontWeight:700, color:"#22d68a", letterSpacing:"0.12em" }}>GRWFIT</span>
        <div style={{ display:"flex", gap:"6px" }}>
          {["Members","Payments","Trainers"].map((t) => (
            <span key={t} style={{ fontSize:"9px", padding:"2px 8px", borderRadius:"4px", background: t==="Members"?"rgba(34,214,138,0.2)":"rgba(255,255,255,0.06)", color: t==="Members"?"#4eeaaa":"rgba(255,255,255,0.3)" }}>{t}</span>
          ))}
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"8px", marginBottom:"16px" }}>
        {[{label:"Active Members",val:"312",color:"#4eeaaa"},{label:"Due Renewals",val:"27",color:"#fbbf5a"},{label:"Revenue",val:"₹1.8L",color:"#b89eff"}].map((s) => (
          <div key={s.label} style={{ background:"rgba(255,255,255,0.06)", borderRadius:"8px", padding:"10px", border:"1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ fontSize:"18px", fontWeight:700, color:s.color }}>{s.val}</div>
            <div style={{ fontSize:"8px", color:"rgba(255,255,255,0.4)", marginTop:"2px" }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ fontSize:"8px", color:"rgba(255,255,255,0.35)", marginBottom:"8px", letterSpacing:"0.08em" }}>WEEKLY ATTENDANCE</div>
      <div style={{ display:"flex", alignItems:"flex-end", gap:"5px", height:"52px", marginBottom:"16px" }}>
        {[{day:"M",h:72},{day:"T",h:85},{day:"W",h:60},{day:"T",h:90},{day:"F",h:78},{day:"S",h:100},{day:"S",h:45}].map((b,i) => (
          <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:"3px" }}>
            <div style={{ width:"100%", height:`${b.h}%`, borderRadius:"3px 3px 0 0", background: b.h===100?"#22d68a":"rgba(34,214,138,0.28)" }} />
            <span style={{ fontSize:"7px", color:"rgba(255,255,255,0.3)" }}>{b.day}</span>
          </div>
        ))}
      </div>
      <div style={{ fontSize:"8px", color:"rgba(255,255,255,0.35)", marginBottom:"8px", letterSpacing:"0.08em" }}>CHURN RISK ALERTS</div>
      {[{name:"Vikram T.",days:"12d absent",risk:"High",rc:"#ff7a7a"},{name:"Sneha R.",days:"5d absent",risk:"Med",rc:"#fbbf5a"},{name:"Arjun P.",days:"1d absent",risk:"Low",rc:"#4eeaaa"}].map((m) => (
        <div key={m.name} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"7px 0", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
            <div style={{ width:"24px", height:"24px", borderRadius:"50%", background:"rgba(34,214,138,0.15)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"10px", color:"#4eeaaa", fontWeight:700 }}>{m.name[0]}</div>
            <div>
              <div style={{ fontSize:"11px", color:"rgba(255,255,255,0.85)", fontWeight:600 }}>{m.name}</div>
              <div style={{ fontSize:"9px", color:"rgba(255,255,255,0.38)" }}>{m.days}</div>
            </div>
          </div>
          <span style={{ fontSize:"9px", padding:"2px 8px", borderRadius:"4px", background:m.rc+"22", color:m.rc, fontWeight:700 }}>{m.risk}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Product data ─────────────────────────────────────────────────────────── */
const products: Product[] = [
  {
    id: "lidflow",
    eyebrow: "01 · FOR TRAVEL & HOSPITALITY",
    name: "Lidflow",
    tagline: "Manage leads, bookings & clients — all in one place.",
    target: "Travel agencies · Tour operators · Consultants",
    color: "#4f8cff",
    bg: "rgba(79,140,255,0.1)",
    border: "rgba(79,140,255,0.22)",
    stats: [
      { val:"48%", label:"Faster follow-up" },
      { val:"3×", label:"More bookings" },
      { val:"92%", label:"Client retention" },
    ],
    features: [
      { icon:"👤", name:"Lead tracking & follow-ups", desc:"Capture every enquiry from any source. Auto-assign, set reminders, and never let a lead go cold." },
      { icon:"📅", name:"AI-powered itinerary builder", desc:"Generate detailed travel itineraries in seconds. Customise and share with clients instantly." },
      { icon:"💬", name:"Client communication history", desc:"Every WhatsApp, email, and call logged in one timeline. Always know where the conversation stands." },
      { icon:"📊", name:"Pipeline & deal tracking", desc:"Visual kanban pipeline from enquiry to booking confirmed. See your revenue at every stage." },
      { icon:"📈", name:"Reporting & analytics", desc:"Weekly reports on leads, conversions, revenue, and team performance — auto-generated." },
      { icon:"🔗", name:"Integrations & automation", desc:"Connect with WhatsApp, Gmail, Razorpay, and more. Automate follow-ups and reminders." },
    ],
    plans: [
      { name:"Starter", desc:"For solo agents & small agencies", price:"$49", period:"/mo", featured:false, ctaText:"Start Free Trial", ctaHref:"/signup?product=lidflow",
        features:["Up to 3 team members","500 leads/month","Basic pipeline & CRM","Itinerary builder (10/mo)","Email support"] },
      { name:"Growth", desc:"For growing travel agencies", price:"$99", period:"/mo", featured:true, ctaText:"Start Free Trial", ctaHref:"/signup?product=lidflow",
        features:["Up to 10 team members","Unlimited leads","Full pipeline & CRM","Unlimited itineraries","AI-powered follow-ups","WhatsApp & Gmail integration","Priority support"] },
      { name:"Enterprise", desc:"For large agencies & operators", price:"Custom", period:"", featured:false, ctaText:"Contact Us", ctaHref:"/contact",
        features:["Unlimited team members","Custom integrations","Dedicated account manager","White-label option","SLA guarantee","24/7 support"] },
    ],
    faqs: [
      { q:"Is there a free trial?", a:"Yes — all paid plans come with a 14-day free trial, no credit card required. You get full access to all features during the trial." },
      { q:"Can I import my existing leads?", a:"Absolutely. Lidflow supports CSV import from any existing CRM or spreadsheet. Our onboarding team will help you migrate." },
      { q:"Does it work on mobile?", a:"Yes. Lidflow is fully mobile-responsive and works on any device. A dedicated mobile app is coming soon." },
      { q:"Can multiple team members use it?", a:"Yes. You can invite your entire team, assign leads, set permissions, and track individual performance." },
      { q:"What integrations are available?", a:"WhatsApp Business, Gmail, Razorpay, Stripe, Google Calendar, and more. Zapier integration for connecting any other tool." },
    ],
    ctaTitle: "Ready to grow your travel business?",
    ctaSub: "Join hundreds of travel agencies closing more bookings with Lidflow.",
    ctaHref: "/signup?product=lidflow",
    mockup: <LidflowMockup />,
  },
  {
    id: "grwfit",
    eyebrow: "02 · FOR FITNESS & WELLNESS",
    name: "GrwFit",
    tagline: "Grow your gym, retain members, track performance.",
    target: "Gym owners · Fitness studios · Personal trainers",
    color: "#22d68a",
    bg: "rgba(34,214,138,0.1)",
    border: "rgba(34,214,138,0.22)",
    stats: [
      { val:"↓35%", label:"Churn reduced" },
      { val:"2.4×", label:"Member growth" },
      { val:"98%", label:"Payment success" },
    ],
    features: [
      { icon:"🏅", name:"Member management & attendance", desc:"Track every member, their plan, attendance history, and renewals in one clean dashboard." },
      { icon:"💳", name:"Subscription & payment tracking", desc:"Automate renewals, send payment reminders, and track revenue. Razorpay and Stripe ready." },
      { icon:"🤝", name:"Trainer assignment & scheduling", desc:"Assign trainers to members, manage class schedules, and track trainer performance." },
      { icon:"🔄", name:"Lead to member conversion", desc:"Capture walk-in enquiries and online leads. Track them through trial → paying member." },
      { icon:"🔔", name:"Retention & churn alerts", desc:"AI-powered alerts when members are at risk of dropping off. Trigger automated re-engagement." },
      { icon:"📊", name:"Performance & revenue reports", desc:"Daily, weekly, monthly reports on attendance, revenue, renewals, and churn — all automated." },
    ],
    plans: [
      { name:"Solo", desc:"For personal trainers & small studios", price:"$39", period:"/mo", featured:false, ctaText:"Start Free Trial", ctaHref:"/signup?product=grwfit",
        features:["Up to 50 members","Attendance tracking","Basic payment tracking","Lead management","Email support"] },
      { name:"Studio", desc:"For gyms & fitness studios", price:"$89", period:"/mo", featured:true, ctaText:"Start Free Trial", ctaHref:"/signup?product=grwfit",
        features:["Unlimited members","Full payment automation","Trainer management","Churn risk alerts","Lead to member pipeline","Razorpay & Stripe","Priority support"] },
      { name:"Chain", desc:"For multi-location gym chains", price:"Custom", period:"", featured:false, ctaText:"Contact Us", ctaHref:"/contact",
        features:["Multi-location support","Centralised dashboard","Custom branding","Dedicated account manager","API access","24/7 support"] },
    ],
    faqs: [
      { q:"Is there a free trial?", a:"Yes — 14 days free, no credit card needed. Full access to all Studio plan features during the trial period." },
      { q:"How does payment automation work?", a:"GrwFit integrates with Razorpay and Stripe. Members are auto-charged on renewal dates. Failed payments trigger smart retry logic and member notifications." },
      { q:"Can I track multiple locations?", a:"Yes with the Chain plan. Each location gets its own dashboard with centralised reporting across all branches." },
      { q:"Does it send automated reminders?", a:"Yes. GrwFit sends WhatsApp and email reminders for upcoming renewals, missed sessions, and at-risk members — all fully customisable." },
      { q:"Can members book classes online?", a:"Yes. Members get a self-service portal to book classes, view schedules, and track their own attendance and payments." },
    ],
    ctaTitle: "Ready to run a smarter gym?",
    ctaSub: "Join fitness studios growing faster with GrwFit.",
    ctaHref: "/signup?product=grwfit",
    mockup: <GrwFitMockup />,
  },
];

/* ── FAQ Item ─────────────────────────────────────────────────────────────── */
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="ps-faq-item">
      <button className="ps-faq-btn" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span className="ps-faq-q">{q}</span>
        <span className={`ps-faq-icon${open ? " ps-faq-icon--open" : ""}`} aria-hidden="true">+</span>
      </button>
      <div className={`ps-faq-answer${open ? " ps-faq-answer--open" : ""}`}>
        <p className="ps-faq-answer-inner">{a}</p>
      </div>
    </div>
  );
}

/* ── Product Block ────────────────────────────────────────────────────────── */
function ProductBlock({ product }: { product: Product }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Hash-based scroll
    const hash = window.location.hash.replace("#", "");
    if (hash === product.id) {
      setVisible(true);
      setTimeout(() => ref.current?.scrollIntoView({ behavior:"smooth", block:"start" }), 100);
      return;
    }
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.05 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [product.id]);

  return (
    <div id={product.id} style={{ scrollMarginTop:"80px" }}>
      <div
        ref={ref}
        className={`ps-block${visible ? " ps-block--visible" : ""}`}
      >
        {/* Identity */}
        <div className="ps-identity">
          <p className="ps-eyebrow">{product.eyebrow}</p>
          <h2 className="ps-name" style={{ color: product.color === "#4f8cff" ? "#fff" : "#fff" }}>{product.name}</h2>
          <p className="ps-tagline">{product.tagline}</p>
          <p className="ps-target">{product.target}</p>
        </div>

        {/* Mockup */}
        <div className="ps-mockup-wrap" style={{ border:`1px solid ${product.border}` }}>
          {product.mockup}
        </div>

        {/* Stats */}
        <div className="ps-stats">
          {product.stats.map(s => (
            <div key={s.label} className="ps-stat" style={{ background: product.bg, border:`1px solid ${product.border}` }}>
              <p className="ps-stat-num" style={{ color: product.color }}>{s.val}</p>
              <p className="ps-stat-label" style={{ color:`${product.color}99` }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Features */}
        <p className="ps-section-title">Key Features</p>
        <div className="ps-features">
          {product.features.map(f => (
            <div key={f.name} className="ps-feature-card">
              <div className="ps-feature-icon" style={{ background: product.bg, border:`1px solid ${product.border}` }}>{f.icon}</div>
              <div>
                <p className="ps-feature-name">{f.name}</p>
                <p className="ps-feature-desc">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Pricing */}
        <p className="ps-section-title">Pricing</p>
        <div className="ps-pricing">
          {product.plans.map(plan => (
            <div key={plan.name} className={`ps-plan${plan.featured ? " ps-plan--featured" : ""}`} style={{ border: plan.featured ? `1px solid ${product.border}` : undefined }}>
              {plan.featured && <span className="ps-plan-badge">Most Popular</span>}
              <div className="ps-plan-header">
                <div>
                  <p className="ps-plan-name">{plan.name}</p>
                  <p className="ps-plan-desc">{plan.desc}</p>
                </div>
                <div className="ps-plan-price">
                  <p className="ps-plan-amount" style={{ color: plan.featured ? product.color : "#fff" }}>{plan.price}</p>
                  {plan.period && <p className="ps-plan-period">{plan.period}</p>}
                </div>
              </div>
              <div className="ps-plan-divider" />
              <ul className="ps-plan-features">
                {plan.features.map(f => (
                  <li key={f} className="ps-plan-feature">
                    <span className="ps-plan-check" style={{ background: plan.featured ? product.bg : "rgba(255,255,255,0.06)", border:`1px solid ${plan.featured ? product.border : "rgba(255,255,255,0.08)"}` }}>
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke={plan.featured ? product.color : "rgba(255,255,255,0.5)"} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <a href={plan.ctaHref} className="ps-plan-cta"
                style={{ background: plan.featured ? product.color : "transparent", border: plan.featured ? "none" : "1px solid rgba(255,255,255,0.15)", color: plan.featured ? (product.color === "#22d68a" ? "#051a0e" : "#fff") : "rgba(255,255,255,0.7)" }}>
                {plan.ctaText}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </a>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <p className="ps-section-title">Frequently Asked Questions</p>
        <div className="ps-faq">
          {product.faqs.map(f => <FAQItem key={f.q} q={f.q} a={f.a} />)}
        </div>

        {/* CTA */}
        <div className="ps-cta-wrap" style={{ background: product.bg, border:`1px solid ${product.border}` }}>
          <h3 className="ps-cta-title">{product.ctaTitle}</h3>
          <p className="ps-cta-sub">{product.ctaSub}</p>
          <a href={product.ctaHref} className="ps-cta-btn" style={{ background: product.color, color: product.color === "#22d68a" ? "#051a0e" : "#fff" }}>
            Start Free Trial →
          </a>
          <p className="ps-cta-note">14-day free trial · No credit card required</p>
        </div>
      </div>
    </div>
  );
}

/* ── Main ─────────────────────────────────────────────────────────────────── */
export default function ProductsSection() {
  return (
    <section className="ps-section" aria-label="Our products">
      {products.map((p, i) => (
        <div key={p.id} className="ps-block-outer" style={{ borderBottom: i < products.length - 1 ? "1px solid rgba(255,255,255,0.07)" : "none" }}>
          <ProductBlock product={p} />
        </div>
      ))}
    </section>
  );
}