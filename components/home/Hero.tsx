"use client";
import { useEffect, useState, useRef } from "react";

const words = ["AI Systems", "SaaS Products", "Web Applications", "Automation Tools"];

const PX_PER_SECOND = 55;

interface LogoItem {
  name: string;
  color: string;
  icon: React.ReactNode;
}

const logos: LogoItem[] = [
  {
    name: "Next.js", color: "#ffffff",
    icon: (<svg width="28" height="28" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="13" fill="#000" stroke="#fff" strokeWidth="1.5"/><path d="M9 19.5V8.5l12 14H9z" fill="#fff"/><path d="M17 8.5v7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/></svg>),
  },
  {
    name: "React", color: "#61DAFB",
    icon: (<svg width="28" height="28" viewBox="0 0 28 28" fill="none"><ellipse cx="14" cy="14" rx="3" ry="3" fill="#61DAFB"/><ellipse cx="14" cy="14" rx="12" ry="4.5" stroke="#61DAFB" strokeWidth="1.5" fill="none"/><ellipse cx="14" cy="14" rx="12" ry="4.5" stroke="#61DAFB" strokeWidth="1.5" fill="none" transform="rotate(60 14 14)"/><ellipse cx="14" cy="14" rx="12" ry="4.5" stroke="#61DAFB" strokeWidth="1.5" fill="none" transform="rotate(120 14 14)"/></svg>),
  },
  {
    name: "Tailwind", color: "#38BDF8",
    icon: (<svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M6 11c1-4 3.5-5.5 7-4.5C16.5 7.5 17 10 20 9.5c3-.5 4 1 4 3.5-1 4-3.5 5.5-7 4.5C13.5 16.5 13 14 10 14.5c-3 .5-4-1-4-3.5z" fill="#38BDF8"/><path d="M6 17.5c1-4 3.5-5.5 7-4.5C16.5 14 17 16.5 20 16c3-.5 4 1 4 3.5-1 4-3.5 5.5-7 4.5C13.5 22.5 13 20 10 20.5c-3 .5-4-1-4-3.5z" fill="#38BDF8" opacity="0.5"/></svg>),
  },
  {
    name: "TypeScript", color: "#3178C6",
    icon: (<svg width="28" height="28" viewBox="0 0 28 28" fill="none"><rect x="2" y="2" width="24" height="24" rx="3" fill="#3178C6"/><path d="M6.5 12H14v2H11v8H9v-8H6.5V12z" fill="#fff"/><path d="M15.5 16.5c0-1 .7-1.5 1.5-1.5.8 0 1.5.5 1.5 1.5 0 1-1 1.5-2 2-1 .5-2 1-2 2.5h4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" fill="none"/></svg>),
  },
  {
    name: "Python", color: "#FFD845",
    icon: (<svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M14 3C9.6 3 8 5 8 8v2h6v1H6.5C4.5 11 3 12.5 3 16s1.5 5 3.5 5H8v-2.5c0-2 1.5-3.5 3.5-3.5h5c2 0 3.5-1.5 3.5-3.5V8c0-2.5-2-5-6-5zm-2 3.5a1 1 0 110 2 1 1 0 010-2z" fill="#3776AB"/><path d="M14 25c4.4 0 6-2 6-5v-2h-6v-1h7.5c2 0 3.5-1.5 3.5-5s-1.5-5-3.5-5H20v2.5c0 2-1.5 3.5-3.5 3.5h-5c-2 0-3.5 1.5-3.5 3.5v4.5c0 2.5 2 5 6 5zm2-3.5a1 1 0 110-2 1 1 0 010 2z" fill="#FFD845"/></svg>),
  },
  {
    name: "Node.js", color: "#68A063",
    icon: (<svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M14 3L4 8.5v11L14 25l10-5.5V8.5L14 3z" fill="#68A063"/><text x="14" y="17" textAnchor="middle" fill="#fff" fontSize="7" fontWeight="700" fontFamily="monospace">js</text></svg>),
  },
  {
    name: "PostgreSQL", color: "#6CA0DC",
    icon: (<svg width="28" height="28" viewBox="0 0 28 28" fill="none"><ellipse cx="14" cy="8" rx="8" ry="5" fill="#336791" stroke="#6CA0DC" strokeWidth="1"/><path d="M6 8v12c0 2.8 3.6 5 8 5s8-2.2 8-5V8" stroke="#6CA0DC" strokeWidth="1.5" fill="none"/><path d="M6 14c0 2.8 3.6 5 8 5s8-2.2 8-5" stroke="#6CA0DC" strokeWidth="1" fill="none"/></svg>),
  },
  {
    name: "MongoDB", color: "#47A248",
    icon: (<svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M14 3C10 3 7 7 7 12c0 4 2 7 5 8.5V25h4v-4.5C19 19 21 16 21 12c0-5-3-9-7-9z" fill="#47A248"/><path d="M14 3v22" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/></svg>),
  },
  {
    name: "GraphQL", color: "#E535AB",
    icon: (<svg width="28" height="28" viewBox="0 0 28 28" fill="none"><polygon points="14,3 24,8.5 24,19.5 14,25 4,19.5 4,8.5" stroke="#E535AB" strokeWidth="1.5" fill="none"/><circle cx="14" cy="14" r="3" fill="#E535AB"/></svg>),
  },
  {
    name: "Prisma", color: "#A5B4FC",
    icon: (<svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M14 3L24 22H4L14 3z" stroke="#A5B4FC" strokeWidth="1.5" fill="none"/><path d="M14 3L24 22L14 17L14 3z" fill="#A5B4FC" opacity="0.3"/><path d="M14 17L4 22" stroke="#A5B4FC" strokeWidth="1.5"/><path d="M14 17L24 22" stroke="#A5B4FC" strokeWidth="1.5"/></svg>),
  },
  {
    name: "Zustand", color: "#FF6B35",
    icon: (<svg width="28" height="28" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="15" r="9" fill="#FF6B35" opacity="0.15" stroke="#FF6B35" strokeWidth="1.5"/><circle cx="10" cy="8" r="3" fill="#FF6B35"/><circle cx="18" cy="8" r="3" fill="#FF6B35"/><circle cx="14" cy="14" r="4" fill="#FF6B35"/><circle cx="11" cy="13" r="1" fill="#fff"/><circle cx="17" cy="13" r="1" fill="#fff"/></svg>),
  },
  {
    name: "Redux", color: "#764ABC",
    icon: (<svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M18.5 7C17 5 15 4 12.5 4.5 10 5 8 7 7.5 9.5" stroke="#764ABC" strokeWidth="2" strokeLinecap="round" fill="none"/><path d="M7 12c-.5 2 0 4 1.5 5.5" stroke="#764ABC" strokeWidth="2" strokeLinecap="round" fill="none"/><path d="M11 21c2 1.5 4.5 1.5 6.5.5 2-1 3.5-3 3.5-5.5" stroke="#764ABC" strokeWidth="2" strokeLinecap="round" fill="none"/><circle cx="19" cy="6.5" r="2" fill="#764ABC"/><circle cx="7" cy="12.5" r="2" fill="#764ABC"/><circle cx="21.5" cy="14" r="2" fill="#764ABC"/></svg>),
  },
];

export default function Hero() {
  const [visible, setVisible] = useState(false);
  const [displayed, setDisplayed] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [marqueeStyle, setMarqueeStyle] = useState<React.CSSProperties>({});
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 769);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const measure = () => {
      if (!trackRef.current) return;
      const halfWidth = trackRef.current.scrollWidth / 2;
      const duration = halfWidth / PX_PER_SECOND;
      setMarqueeStyle({ animation: `marquee-left ${duration}s linear infinite` });
    };
    const raf = requestAnimationFrame(() => setTimeout(measure, 50));
    window.addEventListener("resize", measure);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", measure); };
  }, [isMobile]);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const current = words[wordIndex];
    let timeout: ReturnType<typeof setTimeout>;
    if (!deleting && charIndex <= current.length) {
      timeout = setTimeout(() => { setDisplayed(current.slice(0, charIndex)); setCharIndex(c => c + 1); }, 90);
    } else if (!deleting && charIndex > current.length) {
      timeout = setTimeout(() => setDeleting(true), 1800);
    } else if (deleting && charIndex >= 0) {
      timeout = setTimeout(() => { setDisplayed(current.slice(0, charIndex)); setCharIndex(c => c - 1); }, 45);
    } else {
      setDeleting(false);
      setWordIndex(w => (w + 1) % words.length);
      setCharIndex(0);
    }
    return () => clearTimeout(timeout);
  }, [visible, charIndex, deleting, wordIndex]);

  const fontSize = isMobile ? "clamp(27.9px, 7.74vw, 36px)" : "clamp(48px, 5vw, 72px)";

  return (
    <section style={{
      minHeight: isMobile ? "auto" : "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: isMobile ? "flex-start" : "space-between",
      alignItems: "center",
      textAlign: "center",
      padding: isMobile ? "72px 0 0" : "80px 60px 0",
      borderBottom: "1px solid rgba(255,255,255,0.08)",
      overflowX: "hidden",
    }}>

      <div style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: "opacity 0.9s ease, transform 0.9s ease",
        width: "100%",
        maxWidth: "1200px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        flex: isMobile ? "none" : 1,
        justifyContent: "center",
        padding: isMobile ? "32px 24px 28px" : "0",
      }}>

        <p style={{
          fontSize: "10px", fontWeight: 700,
          color: "rgba(255,255,255,0.5)",
          letterSpacing: "3.5px", textTransform: "uppercase",
          marginBottom: isMobile ? "20px" : "20px",
        }}>
          AI Studio · Est. 2021
        </p>

        {/* Single h1 — all 3 lines scale together, no overflow */}
        <h1 style={{
          fontSize,
          fontWeight: 900,
          color: "#fff",
          lineHeight: 1.12,
          letterSpacing: isMobile ? "-0.5px" : "-2px",
          marginBottom: isMobile ? "28px" : "20px",
          wordBreak: "break-word",
          maxWidth: "100%",
        }}>
          We Build
          <br />
          <span style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "1.15em",
          }}>
            {displayed}
            <span style={{
              display: "inline-block",
              width: "2px",
              height: "0.8em",
              background: "#fff",
              marginLeft: "3px",
              animation: "blink 1s step-end infinite",
              flexShrink: 0,
            }} />
          </span>
          <br />
          That Grow Your Business
        </h1>

        <p style={{
          fontSize: isMobile ? "13px" : "17px",
          color: "rgba(255,255,255,0.6)",
          maxWidth: isMobile ? "300px" : "520px",
          lineHeight: 1.65,
          fontWeight: 400,
          marginBottom: isMobile ? "32px" : "32px",
        }}>
          From intelligent marketing automation to full-scale SaaS products —
          ClickAds architects digital growth engines for ambitious businesses.
        </p>

        {/* Buttons: stacked on mobile, row on desktop */}
        <div style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: "center",
          justifyContent: "center",
          gap: isMobile ? "10px" : "14px",
          paddingBottom: isMobile ? "0" : "48px",
        }}>
          <a href="/contact" style={{
            background: "#fff", color: "#000",
            fontSize: "13px", fontWeight: 700,
            padding: "12px 28px", borderRadius: "100px",
            textDecoration: "none",
            display: "inline-block",
            whiteSpace: "nowrap",
          }}>
            Start Your Project
          </a>
          <a href="#services" style={{
            color: "rgba(255,255,255,0.6)",
            fontSize: "13px", textDecoration: "none",
            fontWeight: 500,
            padding: isMobile ? "4px 0" : "0",
          }}>
            Our Services →
          </a>
        </div>
      </div>

      {/* LOGO MARQUEE STRIP */}
      <div style={{
        width: "100%",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        overflow: "hidden",
        padding: "16px 0",
        position: "relative",
        marginTop: isMobile ? "24px" : "0",
      }}>
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0, width: "60px",
          background: "linear-gradient(to right, #000, transparent)",
          zIndex: 2, pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", right: 0, top: 0, bottom: 0, width: "60px",
          background: "linear-gradient(to left, #000, transparent)",
          zIndex: 2, pointerEvents: "none",
        }} />

        <div ref={trackRef} style={{ display: "flex", width: "max-content", ...marqueeStyle }}>
          {[...logos, ...logos].map((logo, i) => (
            <div key={i} style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: isMobile ? "6px 16px" : "10px 28px",
              borderRight: "1px solid rgba(255,255,255,0.07)",
              flexShrink: 0,
            }}>
              <span style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                {logo.icon}
              </span>
              <span style={{
                fontSize: isMobile ? "11px" : "13px",
                fontWeight: 600,
                color: logo.color,
                whiteSpace: "nowrap",
                letterSpacing: "0.2px",
              }}>
                {logo.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes marquee-left {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}