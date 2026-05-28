"use client";
import { useEffect, useState } from "react";
import "@/styles/products/ProductsHero.css";

export default function ProductsHero() {
  const [visible, setVisible] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      className="ph-section"
      aria-label="Products — Purpose-built CRMs for industries that move fast."
    >
      <div
        className="ph-inner"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(24px)",
          transition: reduceMotion ? "none" : "opacity 0.9s ease, transform 0.9s ease",
        }}
      >
        <p className="ph-label" aria-hidden="true">Built For Your Industry</p>

        <h1 className="ph-h1">
          Software Built for Industries
          <br />
          That Move Fast
        </h1>

        <p className="ph-sub">
          Purpose-built CRMs for industries that move fast.<br />
          Less setup. More growth. Built for how you actually work.
        </p>

        <div className="ph-pills">
          <span className="ph-pill">
            <span className="ph-pill-dot ph-pill-dot--lidflow" />
            Lidflow — Travel CRM
          </span>
          <span className="ph-pill">
            <span className="ph-pill-dot ph-pill-dot--grwfit" />
            GrwFit — Fitness CRM
          </span>
        </div>
      </div>
    </section>
  );
}