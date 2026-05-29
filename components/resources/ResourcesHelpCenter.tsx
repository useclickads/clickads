"use client";
import { useEffect, useRef, useState } from "react";
import "@/styles/resources/Resources.css";

const topics = [
  {
    icon: "🚀",
    title: "Quick Start Guide",
    desc: "New to ClickAds? This guide walks you through everything from account setup to your first live campaign.",
  },
  {
    icon: "💳",
    title: "Billing & Plans",
    desc: "Understand your invoice, upgrade your plan, or manage payment methods from your account settings.",
  },
  {
    icon: "🔒",
    title: "Account & Security",
    desc: "Manage team access, reset credentials, enable two-factor authentication, and keep your account secure.",
  },
  {
    icon: "🛠️",
    title: "Troubleshooting",
    desc: "Running into an issue? Browse common fixes or reach out to our support team directly.",
  },
];

const subjects = [
  "Quick Start Guide",
  "Billing & Plans",
  "Account & Security",
  "Troubleshooting",
  "Other",
];

type FormState = "idle" | "loading" | "success" | "error";

export default function ResourcesHelpCenter() {
  const [visible, setVisible] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [form, setForm] = useState({
    name: "", email: "", subject: "", message: "",
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
          subject: form.subject,
          message: form.message,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send");
      setFormState("success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setFormState("error");
    }
  }

  return (
    <section id="help-center" ref={ref} className="rs-section">
      <div className="rs-wrap">
        <div className={`rs-fade ${visible ? "rs-fade--visible" : ""}`}>
          <p className="rs-section-eyebrow">Help Center</p>
          <h2 className="rs-section-title">We're Here to Help.</h2>
          <p className="rs-section-sub">
            Browse topics below or reach out directly — we typically respond within 24 hours.
          </p>
        </div>

        <div className="rs-grid">
          {topics.map((item, i) => (
            <div
              key={item.title}
              className={`rs-card rs-fade ${visible ? "rs-fade--visible" : ""}`}
              style={{ transitionDelay: visible ? `${i * 80}ms` : "0ms" }}
            >
              <div className="rs-card-icon">{item.icon}</div>
              <div className="rs-card-body">
                <p className="rs-card-title">{item.title}</p>
                <p className="rs-card-desc">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Row */}
        <div
          className={`rs-help-cta rs-fade ${visible ? "rs-fade--visible" : ""}`}
          style={{ transitionDelay: visible ? "360ms" : "0ms" }}
        >
          <p className="rs-help-cta-label">Still need help? Get in touch.</p>
          <div className="rs-help-btns">
            <button className="rs-btn-primary" onClick={() => { setShowForm(!showForm); setFormState("idle"); setErrorMsg(""); }}>
              {showForm ? "Close Form" : "Fill a Form"}
            </button>
            <a href="mailto:contact@useclickads.com?subject=Help%20Center%20Enquiry" className="rs-btn-secondary">
              Send Mail
            </a>
            <a href="tel:+919334433557" className="rs-btn-secondary">
              Call Us
            </a>
          </div>
        </div>

        {/* Inline Form */}
        {showForm && (
          <div className="rs-form-wrap">
            {formState === "success" ? (
              <div className="rs-form-success">
                ✅ Message sent! We'll get back to you within 24 hours.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="rs-form">
                <div className="rs-field-row">
                  <div className="rs-field">
                    <label htmlFor="rs-name">Full Name *</label>
                    <input id="rs-name" name="name" type="text" placeholder="Your name"
                      value={form.name} onChange={handleChange} required />
                  </div>
                  <div className="rs-field">
                    <label htmlFor="rs-email">Email *</label>
                    <input id="rs-email" name="email" type="email" placeholder="you@email.com"
                      value={form.email} onChange={handleChange} required />
                  </div>
                </div>
                <div className="rs-field">
                  <label htmlFor="rs-subject">Topic *</label>
                  <select id="rs-subject" name="subject" value={form.subject} onChange={handleChange} required>
                    <option value="">Select a topic</option>
                    {subjects.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="rs-field">
                  <label htmlFor="rs-message">Message *</label>
                  <textarea id="rs-message" name="message"
                    placeholder="Describe your issue or question in detail..."
                    value={form.message} onChange={handleChange} required />
                </div>
                {formState === "error" && (
                  <p className="rs-form-error">{errorMsg || "Something went wrong. Please try again or email us directly."}</p>
                )}
                <button type="submit" className="rs-btn-primary" disabled={formState === "loading"}>
                  {formState === "loading" ? "Sending…" : "Submit"}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </section>
  );
}