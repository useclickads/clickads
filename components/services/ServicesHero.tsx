"use client";
import { useEffect, useState } from "react";
import "@/styles/services/ServicesHero.css";

export default function ServicesHero() {
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
      className="sh-section"
      aria-label="Services — One Studio. Every Tool You Need To Dominate Your Market."
    >
      <div
        className="sh-inner"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(24px)",
          transition: reduceMotion ? "none" : "opacity 0.9s ease, transform 0.9s ease",
        }}
      >
        <p className="sh-label" aria-hidden="true">AI Studio · Est. 2021</p>

        <h1 className="sh-h1">
          One Studio.
          <br />
          Every Tool You Need
          <br />
          To Dominate Your Market.
        </h1>

        <p className="sh-sub">
          From AI-powered campaigns to full-scale SaaS products —<br />
          ClickAds engineers growth for businesses that refuse to plateau.
        </p>

        <div className="sh-btns">
          <a
            href="/contact"
            className="hero-btn-primary"
            aria-label="Start your project with ClickAds"
          >
            Start Your Project
          </a>
          <a
            href="#services-list"
            className="hero-btn-secondary"
            aria-label="Explore our services"
          >
            Explore Services
          </a>
        </div>
      </div>
    </section>
  );
}