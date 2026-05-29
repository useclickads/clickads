"use client";
import { useEffect, useState } from "react";
import "@/styles/company/Company.css";

export default function CompanyHero() {
  const [visible, setVisible] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const h = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="co-hero" aria-label="ClickAds Company">
      <div className="co-hero-grid" aria-hidden="true" />
      <div
        className="co-hero-inner"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(24px)",
          transition: reduceMotion ? "none" : "opacity 0.9s ease, transform 0.9s ease",
        }}
      >
        <p className="co-hero-eyebrow">AI Studio · Est. 2021</p>
        <h1 className="co-hero-h1">
          Built to<br />Help Brands Win
        </h1>
        <p className="co-hero-sub">
          We're a team obsessed with smarter advertising —<br />
          helping brands grow faster and spend better.
        </p>
      </div>
    </section>
  );
}