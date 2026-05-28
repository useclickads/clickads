"use client";
import { useEffect, useState } from "react";
import "@/styles/contact/Contact.css";

export default function ContactHero() {
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
    <section className="ct-hero" aria-label="Contact ClickAds">
      <div className="ct-hero-grid" aria-hidden="true" />
      <div
        className="ct-hero-inner"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(24px)",
          transition: reduceMotion ? "none" : "opacity 0.9s ease, transform 0.9s ease",
        }}
      >
        <p className="ct-hero-eyebrow">Get In Touch</p>
        <h1 className="ct-hero-h1">
          Let's Build<br />Something Great.
        </h1>
        <p className="ct-hero-sub">
          Tell us where you are and where you want to go.<br />
          We'll map out exactly what needs to happen.
        </p>
      </div>
    </section>
  );
}