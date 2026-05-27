"use client";
import { useEffect, useState, useRef } from "react";

const WORDS = ["AI Systems", "SaaS Products", "Web Applications", "Automation Tools"];
const PX_PER_SECOND = 55;

const LOGOS = [
  {
    name: "Next.js", color: "#ffffff",
    icon: (<svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true"><circle cx="14" cy="14" r="13" fill="#000" stroke="#fff" strokeWidth="1.5"/><path d="M9 19.5V8.5l12 14H9z" fill="#fff"/><path d="M17 8.5v7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/></svg>),
  },
  {
    name: "React", color: "#61DAFB",
    icon: (<svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true"><ellipse cx="14" cy="14" rx="3" ry="3" fill="#61DAFB"/><ellipse cx="14" cy="14" rx="12" ry="4.5" stroke="#61DAFB" strokeWidth="1.5" fill="none"/><ellipse cx="14" cy="14" rx="12" ry="4.5" stroke="#61DAFB" strokeWidth="1.5" fill="none" transform="rotate(60 14 14)"/><ellipse cx="14" cy="14" rx="12" ry="4.5" stroke="#61DAFB" strokeWidth="1.5" fill="none" transform="rotate(120 14 14)"/></svg>),
  },
  {
    name: "Tailwind", color: "#38BDF8",
    icon: (<svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true"><path d="M6 11c1-4 3.5-5.5 7-4.5C16.5 7.5 17 10 20 9.5c3-.5 4 1 4 3.5-1 4-3.5 5.5-7 4.5C13.5 16.5 13 14 10 14.5c-3 .5-4-1-4-3.5z" fill="#38BDF8"/><path d="M6 17.5c1-4 3.5-5.5 7-4.5C16.5 14 17 16.5 20 16c3-.5 4 1 4 3.5-1 4-3.5 5.5-7 4.5C13.5 22.5 13 20 10 20.5c-3 .5-4-1-4-3.5z" fill="#38BDF8" opacity="0.5"/></svg>),
  },
  {
    name: "TypeScript", color: "#3178C6",
    icon: (<svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true"><rect x="2" y="2" width="24" height="24" rx="3" fill="#3178C6"/><path d="M6.5 12H14v2H11v8H9v-8H6.5V12z" fill="#fff"/><path d="M15.5 16.5c0-1 .7-1.5 1.5-1.5.8 0 1.5.5 1.5 1.5 0 1-1 1.5-2 2-1 .5-2 1-2 2.5h4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" fill="none"/></svg>),
  },
  {
    name: "Python", color: "#FFD845",
    icon: (<svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true"><path d="M14 3C9.6 3 8 5 8 8v2h6v1H6.5C4.5 11 3 12.5 3 16s1.5 5 3.5 5H8v-2.5c0-2 1.5-3.5 3.5-3.5h5c2 0 3.5-1.5 3.5-3.5V8c0-2.5-2-5-6-5zm-2 3.5a1 1 0 110 2 1 1 0 010-2z" fill="#3776AB"/><path d="M14 25c4.4 0 6-2 6-5v-2h-6v-1h7.5c2 0 3.5-1.5 3.5-5s-1.5-5-3.5-5H20v2.5c0 2-1.5 3.5-3.5 3.5h-5c-2 0-3.5 1.5-3.5 3.5v4.5c0 2.5 2 5 6 5zm2-3.5a1 1 0 110-2 1 1 0 010 2z" fill="#FFD845"/></svg>),
  },
  {
    name: "Node.js", color: "#68A063",
    icon: (<svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true"><path d="M14 3L4 8.5v11L14 25l10-5.5V8.5L14 3z" fill="#68A063"/><text x="14" y="17" textAnchor="middle" fill="#fff" fontSize="7" fontWeight="700" fontFamily="monospace">js</text></svg>),
  },
  {
    name: "PostgreSQL", color: "#6CA0DC",
    icon: (<svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true"><ellipse cx="14" cy="8" rx="8" ry="5" fill="#336791" stroke="#6CA0DC" strokeWidth="1"/><path d="M6 8v12c0 2.8 3.6 5 8 5s8-2.2 8-5V8" stroke="#6CA0DC" strokeWidth="1.5" fill="none"/><path d="M6 14c0 2.8 3.6 5 8 5s8-2.2 8-5" stroke="#6CA0DC" strokeWidth="1" fill="none"/></svg>),
  },
  {
    name: "MongoDB", color: "#47A248",
    icon: (<svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true"><path d="M14 3C10 3 7 7 7 12c0 4 2 7 5 8.5V25h4v-4.5C19 19 21 16 21 12c0-5-3-9-7-9z" fill="#47A248"/><path d="M14 3v22" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/></svg>),
  },
  {
    name: "GraphQL", color: "#E535AB",
    icon: (<svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true"><polygon points="14,3 24,8.5 24,19.5 14,25 4,19.5 4,8.5" stroke="#E535AB" strokeWidth="1.5" fill="none"/><circle cx="14" cy="14" r="3" fill="#E535AB"/></svg>),
  },
  {
    name: "Prisma", color: "#A5B4FC",
    icon: (<svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true"><path d="M14 3L24 22H4L14 3z" stroke="#A5B4FC" strokeWidth="1.5" fill="none"/><path d="M14 3L24 22L14 17L14 3z" fill="#A5B4FC" opacity="0.3"/><path d="M14 17L4 22" stroke="#A5B4FC" strokeWidth="1.5"/><path d="M14 17L24 22" stroke="#A5B4FC" strokeWidth="1.5"/></svg>),
  },
  {
    name: "Zustand", color: "#FF6B35",
    icon: (<svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true"><circle cx="14" cy="15" r="9" fill="#FF6B35" opacity="0.15" stroke="#FF6B35" strokeWidth="1.5"/><circle cx="10" cy="8" r="3" fill="#FF6B35"/><circle cx="18" cy="8" r="3" fill="#FF6B35"/><circle cx="14" cy="14" r="4" fill="#FF6B35"/><circle cx="11" cy="13" r="1" fill="#fff"/><circle cx="17" cy="13" r="1" fill="#fff"/></svg>),
  },
  {
    name: "Redux", color: "#764ABC",
    icon: (<svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true"><path d="M18.5 7C17 5 15 4 12.5 4.5 10 5 8 7 7.5 9.5" stroke="#764ABC" strokeWidth="2" strokeLinecap="round" fill="none"/><path d="M7 12c-.5 2 0 4 1.5 5.5" stroke="#764ABC" strokeWidth="2" strokeLinecap="round" fill="none"/><path d="M11 21c2 1.5 4.5 1.5 6.5.5 2-1 3.5-3 3.5-5.5" stroke="#764ABC" strokeWidth="2" strokeLinecap="round" fill="none"/><circle cx="19" cy="6.5" r="2" fill="#764ABC"/><circle cx="7" cy="12.5" r="2" fill="#764ABC"/><circle cx="21.5" cy="14" r="2" fill="#764ABC"/></svg>),
  },
];

const MARQUEE_LOGOS = [...LOGOS, ...LOGOS];

export default function Hero() {
  const [visible, setVisible] = useState(false);
  const [displayed, setDisplayed] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [marqueeStyle, setMarqueeStyle] = useState<React.CSSProperties>({});
  const trackRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const measure = () => {
      if (!trackRef.current) return;
      const halfWidth = trackRef.current.scrollWidth / 2;
      const duration = halfWidth / PX_PER_SECOND;
      setMarqueeStyle({
        animation: reduceMotion ? "none" : `marquee-left ${duration}s linear infinite`,
      });
    };
    const raf = requestAnimationFrame(() => setTimeout(measure, 50));
    window.addEventListener("resize", measure);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", measure); };
  }, [reduceMotion]);

  useEffect(() => {
    if (!visible) return;
    if (reduceMotion) { setDisplayed(WORDS[wordIndex]); return; }
    const current = WORDS[wordIndex];
    let timeout: ReturnType<typeof setTimeout>;
    if (!deleting && charIndex <= current.length) {
      timeout = setTimeout(() => { setDisplayed(current.slice(0, charIndex)); setCharIndex(c => c + 1); }, 90);
    } else if (!deleting && charIndex > current.length) {
      timeout = setTimeout(() => setDeleting(true), 1800);
    } else if (deleting && charIndex >= 0) {
      timeout = setTimeout(() => { setDisplayed(current.slice(0, charIndex)); setCharIndex(c => c - 1); }, 45);
    } else {
      setDeleting(false);
      setWordIndex(w => (w + 1) % WORDS.length);
      setCharIndex(0);
    }
    return () => clearTimeout(timeout);
  }, [visible, charIndex, deleting, wordIndex, reduceMotion]);

  return (
    <section
      className="hero-section"
      aria-label="Hero — We Build AI Systems That Grow Your Business"
    >
      <div
        className="hero-inner"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(24px)",
          transition: reduceMotion ? "none" : "opacity 0.9s ease, transform 0.9s ease",
        }}
      >
        <p className="hero-label" aria-hidden="true">AI Studio · Est. 2021</p>

        <h1
          className="hero-h1"
          aria-label={`We Build ${WORDS[wordIndex]} That Grow Your Business`}
        >
          We Build
          <br />
          <span className="hero-typing-wrap" aria-hidden="true">
            {displayed}
            <span className="hero-cursor" />
          </span>
          <br />
          That Grow Your Business
        </h1>

        <p className="hero-sub">
          From intelligent marketing automation to full-scale SaaS products —
          ClickAds architects digital growth engines for ambitious businesses.
        </p>

        <div className="hero-btns">
          <a href="/contact" className="hero-btn-primary" aria-label="Start your project with ClickAds">
            Start Your Project
          </a>
          <a href="#services" className="hero-btn-secondary" aria-label="View our services">
            Our Services →
          </a>
        </div>
      </div>

      <div className="hero-marquee-wrap" role="region" aria-label="Technologies we work with">
        <div className="hero-marquee-fade-left" aria-hidden="true" />
        <div className="hero-marquee-fade-right" aria-hidden="true" />
        <div ref={trackRef} style={marqueeStyle} aria-hidden="true" className="hero-marquee-track">
          {MARQUEE_LOGOS.map((logo, i) => (
            <div key={`${logo.name}-${i}`} className="hero-marquee-item">
              <span className="hero-marquee-icon">{logo.icon}</span>
              <span className="hero-marquee-name" style={{ color: logo.color }}>{logo.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}