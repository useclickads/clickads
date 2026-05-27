"use client";
import { useEffect, useState } from "react";

const text = "The AI Studio";

export default function IntroAnimation() {
  const [displayed, setDisplayed] = useState("");
  const [charIndex, setCharIndex] = useState(0);
  const [doneTyping, setDoneTyping] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [slideOut, setSlideOut] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => setMounted(true));
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  // 30ms per char
  useEffect(() => {
    if (charIndex < text.length) {
      const t = setTimeout(() => {
        setDisplayed(text.slice(0, charIndex + 1));
        setCharIndex(c => c + 1);
      }, 30);
      return () => clearTimeout(t);
    } else {
      setDoneTyping(true);
    }
  }, [charIndex]);

  // Wait 150ms, curtain 0.5s, done at 700ms
  useEffect(() => {
    if (!doneTyping) return;
    const t1 = setTimeout(() => setSlideOut(true), 150);
    const t2 = setTimeout(() => setDone(true), 700);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [doneTyping]);

  if (done) return null;

  const curtainStyle = (side: "left" | "right"): React.CSSProperties => ({
    position: "fixed",
    top: 0,
    bottom: 0,
    width: "50%",
    [side]: 0,
    background: "#fff",
    zIndex: 9999,
    transform: slideOut
      ? `translateX(${side === "left" ? "-100%" : "100%"})`
      : "translateX(0)",
    transition: mounted ? "transform 0.5s cubic-bezier(0.76,0,0.24,1)" : "none",
    willChange: "transform",
  });

  return (
    <>
      <div style={curtainStyle("left")} />
      <div style={curtainStyle("right")} />

      <div style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        opacity: slideOut ? 0 : 1,
        transition: mounted ? "opacity 0.15s ease" : "none",
      }}>
        <span style={{
          fontSize: "clamp(32px, 6vw, 56px)",
          fontWeight: 900,
          color: "#000",
          letterSpacing: "-2px",
          fontFamily: "'Helvetica Neue', Arial, sans-serif",
        }}>
          {displayed}
        </span>
      </div>
    </>
  );
}