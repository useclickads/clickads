"use client";
import { useEffect, useRef, useState } from "react";
import "@/styles/resources/Resources.css";

const docs = [
  {
    icon: "📖",
    title: "Getting Started",
    desc: "Set up your ClickAds account, connect your brand, and launch your first campaign in minutes.",
  },
  {
    icon: "⚙️",
    title: "Campaign Configuration",
    desc: "Learn how to configure targeting, budgets, creatives, and scheduling for maximum performance.",
  },
  {
    icon: "📊",
    title: "Analytics & Reporting",
    desc: "Understand your dashboard metrics, export reports, and track what's driving results.",
  },
  {
    icon: "🔗",
    title: "Integrations",
    desc: "Connect ClickAds with your CRM, data warehouse, or marketing stack via our native integrations.",
  },
];

export default function ResourcesDocumentation() {
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
    <section id="documentation" ref={ref} className="rs-section">
      <div className="rs-wrap">
        <div className={`rs-fade ${visible ? "rs-fade--visible" : ""}`}>
          <p className="rs-section-eyebrow">Documentation</p>
          <h2 className="rs-section-title">Everything You Need to Know.</h2>
          <p className="rs-section-sub">
            Step-by-step guides to help you get the most out of every ClickAds feature.
          </p>
        </div>
        <div className="rs-grid">
          {docs.map((item, i) => (
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
      </div>
    </section>
  );
}