"use client";
import { useEffect, useState } from "react";
import "@/styles/resources/Resources.css";

export default function ResourcesHero() {
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
    <section className="rs-hero" aria-label="ClickAds Resources">
      <div className="rs-hero-grid" aria-hidden="true" />
      <div
        className="rs-hero-inner"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(24px)",
          transition: reduceMotion ? "none" : "opacity 0.9s ease, transform 0.9s ease",
        }}
      >
        <p className="rs-hero-eyebrow">AI Studio · Est. 2021</p>
        <h1 className="rs-hero-h1">
          Everything You Need<br />to Succeed
        </h1>
        <p className="rs-hero-sub">
          The tools, guides, and answers —<br />
          to keep you moving fast and growing smarter
        </p>
      </div>
    </section>
  );
}