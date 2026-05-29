"use client";
import { useEffect, useRef, useState } from "react";
import "@/styles/company/Company.css";

const partners = [
  {
    icon: "🏢",
    title: "Agency Partners",
    desc: "We work with select agencies to deliver smarter advertising solutions to their clients at scale.",
  },
  {
    icon: "🔧",
    title: "Technology Partners",
    desc: "Our platform integrates with best-in-class tools across analytics, CRM, and marketing infrastructure.",
  },
  {
    icon: "📦",
    title: "Reseller Partners",
    desc: "Resell ClickAds as part of your own offering. We provide full support, training, and co-marketing.",
  },
  {
    icon: "🌍",
    title: "Strategic Partners",
    desc: "For larger collaborations — joint ventures, co-development, and market expansion opportunities.",
  },
];

export default function CompanyPartners() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="partners" ref={ref} className="co-section">
      <div className="co-wrap">
        <div className={`co-fade ${visible ? "co-fade--visible" : ""}`}>
          <p className="co-section-eyebrow">Partners</p>
          <h2 className="co-section-title">Let's Grow Together.</h2>
          <p className="co-section-sub">
            We believe in building long-term partnerships that create value
            for everyone involved. Here's how we work with partners.
          </p>
        </div>
        <div className="co-grid">
          {partners.map((item, i) => (
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
      </div>
    </section>
  );
}