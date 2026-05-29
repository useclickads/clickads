"use client";
import { useEffect, useRef, useState } from "react";
import "@/styles/company/Company.css";

const values = [
  {
    icon: "🎯",
    title: "Obsessed with Results",
    desc: "We measure everything. Every decision we make is tied to real outcomes — growth, efficiency, and return on spend.",
  },
  {
    icon: "⚡",
    title: "Move Fast",
    desc: "We ship quickly, iterate often, and never let perfect be the enemy of great. Speed is a competitive advantage.",
  },
  {
    icon: "🤝",
    title: "Partners, Not Vendors",
    desc: "We work alongside our clients as true partners — invested in their success as much as our own.",
  },
  {
    icon: "🧠",
    title: "Always Learning",
    desc: "The advertising landscape never stops evolving. Neither do we. Curiosity and adaptation are core to who we are.",
  },
];

export default function CompanyAbout() {
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
    <section id="about" ref={ref} className="co-section">
      <div className="co-wrap">
        <div className={`co-fade ${visible ? "co-fade--visible" : ""}`}>
          <p className="co-section-eyebrow">About Us</p>
          <h2 className="co-section-title">Who We Are.</h2>
          <p className="co-section-sub">
            ClickAds was built by marketers and engineers who were tired of
            bloated agencies and guesswork. We created a smarter way to advertise —
            one that puts performance, transparency, and speed at the center of everything.
          </p>
        </div>
        <div className="co-grid">
          {values.map((item, i) => (
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