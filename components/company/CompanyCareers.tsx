"use client";
import { useEffect, useRef, useState } from "react";
import "@/styles/company/Company.css";

const openings = [
  {
    icon: "📣",
    title: "Performance Marketing Manager",
    desc: "Lead paid media strategy across Google and Meta for a portfolio of fast-growing brands.",
  },
  {
    icon: "💻",
    title: "Full Stack Engineer",
    desc: "Build and scale the core ClickAds platform — from campaign tooling to analytics infrastructure.",
  },
  {
    icon: "📈",
    title: "Growth Analyst",
    desc: "Dig into data, identify opportunities, and turn insights into action across our client campaigns.",
  },
  {
    icon: "🎨",
    title: "Creative Strategist",
    desc: "Develop winning ad creative concepts backed by data — bridging the gap between art and performance.",
  },
];

const positions = [
  "Performance Marketing Manager",
  "Full Stack Engineer",
  "Growth Analyst",
  "Creative Strategist",
  "Other",
];

type FormState = "idle" | "loading" | "success" | "error";

export default function CompanyCareers() {
  const [visible, setVisible] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [form, setForm] = useState({
    name: "", email: "", phone: "", position: "", message: "",
  });
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormState("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          position: form.position,
          message: form.message,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send");
      setFormState("success");
      setForm({ name: "", email: "", phone: "", position: "", message: "" });
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setFormState("error");
    }
  }

  return (
    <section id="careers" ref={ref} className="co-section">
      <div className="co-wrap">
        <div className={`co-fade ${visible ? "co-fade--visible" : ""}`}>
          <p className="co-section-eyebrow">Careers</p>
          <h2 className="co-section-title">Join the Team.</h2>
          <p className="co-section-sub">
            We're always looking for sharp, driven people who want to do the best
            work of their careers. Here's what we're hiring for right now.
          </p>
        </div>

        <div className="co-grid">
          {openings.map((item, i) => (
            <div
              key={item.title}
              className={`co-card co-fade ${visible ? "co-fade--visible" : ""}`}
              style={{ transitionDelay: visible ? `${i * 80}ms` : "0ms" }}
            >
              <div className="co-card-icon">{item.icon}</div>
              <div className="co-card-body">
                <p className="co-card-title">{item.title}</p>
                <p className="co-card-desc">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Row */}
        <div
          className={`co-careers-cta co-fade ${visible ? "co-fade--visible" : ""}`}
          style={{ transitionDelay: visible ? "360ms" : "0ms" }}
        >
          <p className="co-careers-cta-label">Interested in joining us?</p>
          <div className="co-careers-btns">
            <button className="co-btn-primary" onClick={() => { setShowForm(!showForm); setFormState("idle"); setErrorMsg(""); }}>
              {showForm ? "Close Form" : "Apply Now"}
            </button>
            <a href="mailto:contact@useclickads.com?subject=Careers%20Enquiry" className="co-btn-secondary">
              Send Mail
            </a>
            <a href="tel:+919334433557" className="co-btn-secondary">
              Call Us
            </a>
          </div>
        </div>

        {/* Inline Form */}
        {showForm && (
          <div className="co-form-wrap">
            {formState === "success" ? (
              <div className="co-form-success">
                ✅ Application sent! We'll get back to you within 24 hours.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="co-form">
                <div className="co-field-row">
                  <div className="co-field">
                    <label htmlFor="co-name">Full Name *</label>
                    <input id="co-name" name="name" type="text" placeholder="Your name"
                      value={form.name} onChange={handleChange} required />
                  </div>
                  <div className="co-field">
                    <label htmlFor="co-email">Email *</label>
                    <input id="co-email" name="email" type="email" placeholder="you@email.com"
                      value={form.email} onChange={handleChange} required />
                  </div>
                </div>
                <div className="co-field-row">
                  <div className="co-field">
                    <label htmlFor="co-phone">Phone</label>
                    <input id="co-phone" name="phone" type="tel" placeholder="+91 00000 00000"
                      value={form.phone} onChange={handleChange} />
                  </div>
                  <div className="co-field">
                    <label htmlFor="co-position">Position *</label>
                    <select id="co-position" name="position" value={form.position} onChange={handleChange} required>
                      <option value="">Select a position</option>
                      {positions.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="co-field">
                  <label htmlFor="co-message">Cover Note</label>
                  <textarea id="co-message" name="message"
                    placeholder="Tell us about yourself and why you'd be a great fit..."
                    value={form.message} onChange={handleChange} />
                </div>
                {formState === "error" && (
                  <p className="co-form-error">{errorMsg || "Something went wrong. Please try again or email us directly."}</p>
                )}
                <button type="submit" className="co-btn-primary" disabled={formState === "loading"}>
                  {formState === "loading" ? "Sending…" : "Submit Application"}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </section>
  );
}