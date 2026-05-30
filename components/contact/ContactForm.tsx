"use client";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import "@/styles/contact/Contact.css";

function CalendlyEmbed() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);
  return (
    <div
      className="calendly-inline-widget"
      data-url="https://calendly.com/useclickads/30min?hide_landing_page_details=1&hide_gdpr_banner=1&background_color=0d0d0d&text_color=ffffff&primary_color=7c3aed"
      style={{ minWidth: "320px", height: "700px", width: "100%" }}
    />
  );
}

const SERVICES = [
  "AI Marketing","SaaS Development","Web Development","AI Automation",
  "Lead Generation","Performance Ads","Analytics","Brand Design","Multiple Services",
];

const BUDGETS = [
  "Under $500","$500 – $1K","$1K – $5K","$5K – $20K","$20K – $50K","$50K+","Let's discuss",
];

export default function ContactForm() {
  const searchParams = useSearchParams();
  const [form, setForm] = useState({
    name:"",
    email: searchParams.get("email") || "",
    phone:"",
    service:"",
    budget:"",
    message: searchParams.get("goal") ? `Campaign goal: ${searchParams.get("goal")}` : "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.05 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to send");
      setSubmitted(true);
      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", "form_submit", {
          event_category: "Contact",
          event_label: form.service || "Unknown Service",
          value: 1,
        });
      }
      setTimeout(() => {
        successRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    } catch {
      setError("Something went wrong. Please email us directly at contact@useclickads.com");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="ct-form-section">
      {/* Top: Form + Calendly */}
      <div style={{ maxWidth: "1200px", margin: "0 auto 60px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "start" }}>
        {/* Left — Form */}
        <div
          ref={ref}
          className={`ct-form-left ct-fade${visible ? " ct-fade--visible" : ""}`}
        >
          <div>
            <h2 className="ct-form-title">Start Your Project</h2>
            <p className="ct-form-sub">Fill in the details below and we'll get back to you within 24 hours.</p>
          </div>

          {submitted ? (
            <div ref={successRef} className="ct-success">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <circle cx="10" cy="10" r="9" stroke="rgba(99,153,34,0.8)" strokeWidth="1.5"/>
                <path d="M6 10l3 3 5-5" stroke="rgba(99,153,34,0.9)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Message sent! We'll reach out to you within 24 hours at {form.email}.
            </div>
          ) : (
            <form onSubmit={submit} style={{ display:"flex", flexDirection:"column", gap:16 }}>
              <div className="ct-field-row">
                <div className="ct-field">
                  <label htmlFor="ct-name">Full Name *</label>
                  <input id="ct-name" name="name" type="text" placeholder="Your full name" value={form.name} onChange={handle} required />
                </div>
                <div className="ct-field">
                  <label htmlFor="ct-email">Email Address *</label>
                  <input id="ct-email" name="email" type="email" placeholder="you@company.com" value={form.email} onChange={handle} required />
                </div>
              </div>

              <div className="ct-field-row">
                <div className="ct-field">
                  <label htmlFor="ct-phone">Phone Number</label>
                  <input id="ct-phone" name="phone" type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={handle} />
                </div>
                <div className="ct-field">
                  <label htmlFor="ct-service">Service Needed *</label>
                  <select id="ct-service" name="service" value={form.service} onChange={handle} required>
                    <option value="">Select a service</option>
                    {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="ct-field">
                <label htmlFor="ct-budget">Budget Range</label>
                <select id="ct-budget" name="budget" value={form.budget} onChange={handle}>
                  <option value="">Select your budget</option>
                  {BUDGETS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              <div className="ct-field">
                <label htmlFor="ct-message">Tell us about your project *</label>
                <textarea id="ct-message" name="message" placeholder="What are you building? What's the challenge? What does success look like?" value={form.message} onChange={handle} required />
              </div>

              {error && (
                <p style={{ fontSize:12, color:"rgba(220,80,80,0.9)", margin:0 }}>{error}</p>
              )}

              <button type="submit" className="ct-submit" disabled={loading}>
                {loading ? "Sending..." : "Send Message"}
                {!loading && <span>→</span>}
              </button>
            </form>
          )}
        </div>

        {/* Right — Calendly */}
        <div style={{ position: "sticky", top: "100px" }}>
          <p className="ct-label" style={{ marginBottom: "16px" }}>Book a Call</p>
          <CalendlyEmbed />
        </div>
      </div>

      {/* Bottom: Contact Info */}
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div className="ct-info" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
          <div className="ct-card">
            <p className="ct-label">Contact Details</p>
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              {[
                { icon:"✉", title:"Email",         val:<a href="mailto:contact@useclickads.com">contact@useclickads.com</a> },
                { icon:"📞", title:"Phone",         val:<a href="tel:+919334433557">+91 9 33 44 33 557</a> },
                { icon:"📍", title:"Location",      val:"D-12, Akshardham, New Delhi, India, 110092" },
                { icon:"⏱", title:"Response Time", val:"Within 24 hours" },
              ].map(item => (
                <div key={item.title} className="ct-info-item">
                  <div className="ct-info-icon" style={{ fontSize:16 }}>{item.icon}</div>
                  <div>
                    <p className="ct-info-title">{item.title}</p>
                    <p className="ct-info-val">{item.val}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="ct-card">
            <p className="ct-label">Follow Us</p>
            <div className="ct-socials">
              {[
                {
                  label: "Twitter / X",
                  href: "https://twitter.com/useclickads",
                  svg: <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M12.6 2h2.1L9.9 7.3 15.5 14h-3.9l-3.5-4.6L4 14H1.9l5.2-5.7L1.5 2h4l3.2 4.2L12.6 2Zm-.7 10.8h1.2L4.2 3.2H2.9l9 9.6Z" fill="currentColor"/></svg>,
                },
                {
                  label: "LinkedIn",
                  href: "https://www.linkedin.com/company/useclickads",
                  svg: <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M3.6 5.5H1.2v9.3h2.4V5.5ZM2.4 4.4a1.4 1.4 0 1 0 0-2.8 1.4 1.4 0 0 0 0 2.8ZM14.8 9.8c0-2.4-1.3-4.5-3.6-4.5-1 0-1.9.5-2.4 1.2V5.5H6.4v9.3h2.4V9.9c0-1 .7-1.8 1.7-1.8s1.9.8 1.9 1.8v4.9h2.4V9.8Z" fill="currentColor"/></svg>,
                },
                {
                  label: "Instagram",
                  href: "https://www.instagram.com/useclickads/",
                  svg: <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><rect x="1.5" y="1.5" width="13" height="13" rx="4" stroke="currentColor" strokeWidth="1.4"/><circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.4"/><circle cx="11.8" cy="4.2" r="0.8" fill="currentColor"/></svg>,
                },
                {
                  label: "Facebook",
                  href: "https://www.facebook.com/useclickads",
                  svg: <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M15 8a7 7 0 1 0-8.094 6.915V10.31H4.93V8h1.976V6.291c0-1.95 1.164-3.027 2.941-3.027.852 0 1.744.152 1.744.152V5.36h-.983c-.968 0-1.27.6-1.27 1.216V8h2.162l-.345 2.31H9.338v4.605A7.002 7.002 0 0 0 15 8Z" fill="currentColor"/></svg>,
                },
                {
                  label: "YouTube",
                  href: "https://www.youtube.com/@UseClickAds",
                  svg: <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M15.6 4.8s-.2-1.3-.7-1.8c-.7-.7-1.5-.7-1.8-.8C11.1 2 8 2 8 2s-3.1 0-5.1.2c-.4 0-1.2.1-1.8.8C.6 3.5.4 4.8.4 4.8S.2 6.3.2 7.8v1.4c0 1.5.2 3 .2 3s.2 1.3.7 1.8c.7.7 1.6.7 2 .7C4.3 14 8 14 8 14s3.1 0 5.1-.2c.4 0 1.2-.1 1.8-.8.5-.5.7-1.8.7-1.8s.2-1.5.2-3V7.8c0-1.5-.2-3-.2-3ZM6.4 10.2V5.7l4.8 2.3-4.8 2.2Z" fill="currentColor"/></svg>,
                },
              ].map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="ct-social-btn" aria-label={s.label} style={{ color:"#fff" }}>
                  {s.svg}
                </a>
              ))}
            </div>
          </div>

          <div className="ct-card">
            <p className="ct-label">Office Hours</p>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {[["Mon – Fri","9:00 AM – 7:00 PM IST"],["Saturday","10:00 AM – 4:00 PM IST"],["Sunday","Closed"]].map(([day,time]) => (
                <div key={day} style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontSize:12, color:"rgba(255,255,255,0.4)" }}>{day}</span>
                  <span style={{ fontSize:12, color:"rgba(255,255,255,0.65)", fontWeight:600 }}>{time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}