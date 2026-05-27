"use client";
import { useEffect, useState } from "react";

const TEXT = "The AI Studio";

export default function IntroAnimation() {
  const [displayed, setDisplayed] = useState("");
  const [charIndex, setCharIndex] = useState(0);
  const [doneTyping, setDoneTyping] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [done, setDone] = useState(false);

  // Respect reduce motion — skip animation entirely
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
  }, []);

  // If reduce motion — skip straight to done, show nothing
  useEffect(() => {
    if (reduceMotion) setDone(true);
  }, [reduceMotion]);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => setMounted(true));
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  // 30ms per char
  useEffect(() => {
    if (reduceMotion) return;
    if (charIndex < TEXT.length) {
      const t = setTimeout(() => {
        setDisplayed(TEXT.slice(0, charIndex + 1));
        setCharIndex((c) => c + 1);
      }, 30);
      return () => clearTimeout(t);
    } else {
      setDoneTyping(true);
    }
  }, [charIndex, reduceMotion]);

  // Wait 150ms, fade 0.5s, unmount at 700ms
  useEffect(() => {
    if (!doneTyping) return;
    const t1 = setTimeout(() => setFadeOut(true), 150);
    const t2 = setTimeout(() => setDone(true), 700);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [doneTyping]);

  if (done) return null;

  return (
    <div
      role="status"
      aria-label="Loading ClickAds"
      aria-live="polite"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: fadeOut ? 0 : 1,
        transition: mounted ? "opacity 0.5s cubic-bezier(0.76,0,0.24,1)" : "none",
        willChange: "opacity",
        pointerEvents: fadeOut ? "none" : "auto",
      }}
    >
      <span
        style={{
          fontSize: "clamp(32px, 6vw, 56px)",
          fontWeight: 900,
          color: "#000",
          letterSpacing: "-2px",
          // FIXED: use CSS variable from next/font instead of hardcoded font
          fontFamily: "var(--font-inter, 'Helvetica Neue', Arial, sans-serif)",
        }}
      >
        {displayed}
        <span style={{
          display: "inline-block",
          width: "3px",
          height: "0.8em",
          background: "#000",
          marginLeft: "3px",
          verticalAlign: "middle",
          animation: "blink 1s step-end infinite",
        }} aria-hidden="true" />
      </span>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}