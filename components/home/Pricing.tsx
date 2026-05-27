"use client";

import { useEffect, useRef, useState } from "react";

const plans = [
  {
    emoji: "🚀",
    name: "Starter",
    price: "$299",
    period: "/mo",
    description: "For early-stage startups & small businesses",
    cta: "Get Started",
    featured: false,
    features: [
      "1 active project",
      "Web Dev or AI Automation",
      "AI Marketing (basic)",
      "Basic analytics dashboard",
      "2 revision rounds",
      "Email support · 5-day turnaround",
    ],
  },
  {
    emoji: "⚡",
    name: "Growth",
    price: "$699",
    period: "/mo",
    description: "For scaling businesses that need more firepower",
    cta: "Get Started",
    featured: true,
    features: [
      "3 active projects",
      "Web + SaaS + AI Marketing",
      "Lead generation campaigns",
      "Advanced analytics & reporting",
      "Performance ads management",
      "Unlimited revisions · 3-day turnaround",
      "Priority support (chat + call)",
    ],
  },
  {
    emoji: "🏢",
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large teams, agencies & complex needs",
    cta: "Contact Us",
    featured: false,
    features: [
      "Unlimited projects",
      "Full service suite",
      "Dedicated account manager",
      "Custom AI automation workflows",
      "White-label options",
      "SLA guarantee · 1-day turnaround",
      "24/7 support",
    ],
  },
];

function PlanCard({ plan }: { plan: typeof plans[0] }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: "20px",
        padding: "32px 28px",
        display: "flex",
        flexDirection: "column",
        gap: "28px",
        position: "relative",
        background: plan.featured ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.02)",
        border: plan.featured
          ? `1.5px solid ${hovered ? "#666" : "#4a4a4a"}`
          : `1.5px solid ${hovered ? "#4a4a4a" : "#222"}`,
        transition: "border-color 0.3s ease",
        height: "100%",
        boxSizing: "border-box",
      }}
    >
      {plan.featured && (
        <div style={{
          position: "absolute", top: "-14px", left: "50%",
          transform: "translateX(-50%)",
          background: "#fff", color: "#000",
          fontSize: "11px", fontWeight: 700,
          padding: "4px 14px", borderRadius: "20px",
          letterSpacing: "0.05em", whiteSpace: "nowrap",
        }}>
          Most Popular
        </div>
      )}

      <div>
        <div style={{ fontSize: "22px", marginBottom: "10px" }}>{plan.emoji}</div>
        <div style={{ fontSize: "14px", fontWeight: 600, color: "#fff", marginBottom: "4px" }}>{plan.name}</div>
        <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}>{plan.description}</div>
      </div>

      <div style={{ display: "flex", alignItems: "flex-end", gap: "4px" }}>
        <span style={{ fontSize: plan.price === "Custom" ? "38px" : "52px", fontWeight: 900, color: "#fff", letterSpacing: "-2px", lineHeight: 1 }}>
          {plan.price}
        </span>
        {plan.period && (
          <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", marginBottom: "6px" }}>{plan.period}</span>
        )}
      </div>

      <div style={{ height: "1px", background: "#222" }} />

      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px", flex: 1 }}>
        {plan.features.map((f) => (
          <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
            <span style={{
              width: "16px", height: "16px", borderRadius: "50%",
              background: plan.featured ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.07)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, marginTop: "1px",
            }}>
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
            <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>{f}</span>
          </li>
        ))}
      </ul>

      <a href="#" style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 18px", borderRadius: "12px",
        background: plan.featured ? "#fff" : "transparent",
        border: plan.featured ? "none" : "1.5px solid #333",
        color: plan.featured ? "#000" : "#ccc",
        fontSize: "14px", fontWeight: 600,
        textDecoration: "none", transition: "opacity 0.2s", cursor: "pointer",
      }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
      >
        {plan.cta}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </a>
    </div>
  );
}

export default function Pricing() {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(1);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const check = () => setIsMobile(window.innerWidth < 769);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Scroll to featured (Growth) card on mobile mount
  useEffect(() => {
    if (isMobile && scrollRef.current) {
      const el = scrollRef.current;
      const cardWidth = el.offsetWidth * 0.82;
      const gap = 16;
      // With center snap: scroll position to center card i = i * (cardWidth + gap)
      el.scrollTo({ left: 1 * (cardWidth + gap), behavior: "instant" });
    }
  }, [isMobile]);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    const cardWidth = el.offsetWidth * 0.82;
    const gap = 16;
    const index = Math.round(el.scrollLeft / (cardWidth + gap));
    setActiveIndex(Math.min(Math.max(index, 0), plans.length - 1));
  };

  const scrollTo = (i: number) => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    const cardWidth = el.offsetWidth * 0.82;
    const gap = 16;
    el.scrollTo({ left: i * (cardWidth + gap), behavior: "smooth" });
    setActiveIndex(i);
  };

  if (!mounted) return null;

  return (
    <section style={{
      backgroundColor: "#000000",
      padding: isMobile ? "60px 0 80px" : "100px 48px 120px",
      overflow: "hidden",
      position: "relative",
    }}>
      {/* Background grid */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
        backgroundSize: "48px 48px", pointerEvents: "none",
      }} />

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: isMobile ? "48px" : "72px", position: "relative", padding: "0 24px" }}>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", letterSpacing: "4px", textTransform: "uppercase", marginBottom: "12px", fontWeight: 700 }}>
          PRICING
        </p>
        <h2 style={{
          color: "#ffffff",
          fontSize: isMobile ? "clamp(24px, 6vw, 36px)" : "clamp(32px, 4vw, 42px)",
          fontWeight: 900, letterSpacing: "-1.5px", lineHeight: 1.05, margin: "0 auto",
        }}>
          Simple, transparent pricing.
        </h2>
      </div>

      {/* ── DESKTOP ── */}
      {!isMobile && (
        <div style={{
          display: "flex", flexDirection: "row",
          gap: "16px", maxWidth: "1080px",
          margin: "0 auto", alignItems: "flex-end",
          position: "relative",
        }}>
          {plans.map((plan) => (
            <div key={plan.name} style={{
              flex: "1 1 0", minWidth: "260px", maxWidth: "380px",
              transform: plan.featured ? "translateY(-8px)" : "translateY(0)",
            }}>
              <PlanCard plan={plan} />
            </div>
          ))}
        </div>
      )}

      {/* ── MOBILE: centered swipe slider ── */}
      {isMobile && (
        <div>
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            style={{
              display: "flex",
              gap: "16px",
              overflowX: "auto",
              scrollSnapType: "x mandatory",
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "none",
              // Symmetric padding = (100vw - 82vw) / 2 = 9vw so each card centers
              paddingLeft: "9vw",
              paddingRight: "9vw",
              paddingTop: "24px",
              paddingBottom: "8px",
            }}
          >
            {plans.map((plan) => (
              <div key={plan.name} style={{
                flex: "0 0 82vw",
                maxWidth: "340px",
                scrollSnapAlign: "center",  // ← key fix
                paddingTop: plan.featured ? "10px" : "0",
              }}>
                <PlanCard plan={plan} />
              </div>
            ))}
          </div>

          {/* Dot indicators */}
          <div style={{ display: "flex", justifyContent: "center", gap: "6px", marginTop: "24px" }}>
            {plans.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                style={{
                  width: i === activeIndex ? "20px" : "6px",
                  height: "6px", borderRadius: "100px",
                  background: i === activeIndex ? "#fff" : "rgba(255,255,255,0.2)",
                  border: "none", cursor: "pointer", padding: 0,
                  transition: "width 0.3s ease, background 0.3s ease",
                }}
              />
            ))}
          </div>
        </div>
      )}

      <style>{`div::-webkit-scrollbar { display: none; }`}</style>
    </section>
  );
}