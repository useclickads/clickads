"use client";

import { useEffect, useRef, useState } from "react";

const steps = [
  {
    number: "01",
    label: "Step one",
    title: "Discovery Call",
    description:
      "You tell us what you're building and where you're stuck. We listen, ask the right questions, and map out exactly what needs to happen.",
    dots: 1,
    action: "Schedule a free session",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.1a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.29 6.29l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
        <path d="M14.05 2a9 9 0 0 1 8 7.94" />
        <path d="M14.05 6A5 5 0 0 1 18 10" />
      </svg>
    ),
  },
  {
    number: "02",
    label: "Step two",
    title: "Strategy & Scope",
    description:
      "We put together a clear plan — tech stack, timeline, deliverables. No vague proposals, just a precise roadmap you can hold us to.",
    dots: 2,
    action: "See a sample roadmap",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
        <line x1="9" y1="3" x2="9" y2="18" />
        <line x1="15" y1="6" x2="15" y2="21" />
      </svg>
    ),
  },
  {
    number: "03",
    label: "Step three",
    title: "Design & Build",
    description:
      "Our team ships fast. Weekly updates, real previews, and zero radio silence. You see progress, not just promises.",
    dots: 3,
    action: "View our recent work",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    number: "04",
    label: "Step four",
    title: "Launch & Grow",
    description:
      "We don't disappear after go-live. Monitoring, iterations, and growth support — we stay in the loop as long as you need us.",
    dots: 4,
    action: "See growth results",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
        <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
        <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
      </svg>
    ),
  },
];

export default function OurProcess() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 769);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <section
      style={{
        backgroundColor: "#0a0a0a",
        padding: "80px 0 100px",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Background grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          pointerEvents: "none",
        }}
      />

      {/* Header — centered */}
      <div
        style={{
          padding: isMobile ? "0 16px" : "0 48px",
          marginBottom: "56px",
          textAlign: "center",
          position: "relative",
        }}
      >
        <p
          style={{
            color: "rgba(255,255,255,0.4)",
            fontSize: "11px",
            letterSpacing: "4px",
            textTransform: "uppercase",
            marginBottom: "12px",
            fontFamily: "inherit",
            fontWeight: 700,
          }}
        >
          OUR PROCESS
        </p>
        <h2
          style={{
            color: "#ffffff",
            fontSize: isMobile ? "clamp(24px, 6vw, 36px)" : "clamp(32px, 4vw, 42px)",
            fontWeight: 900,
            letterSpacing: "-1.5px",
            lineHeight: 1.05,
            margin: "0 auto",
            fontFamily: "inherit",
            whiteSpace: isMobile ? "normal" : "nowrap",
          }}
        >
          Fast ideas for the AI era.
        </h2>
      </div>

      {/* Cards Row */}
      <div
        ref={scrollRef}
        style={{
          display: "flex",
          gap: "16px",
          padding: isMobile ? "0 16px" : "0 48px",
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          position: "relative",
        }}
        className="process-scroll"
      >
        {steps.map((step) => (
          <div
            key={step.number}
            style={{
              flex: "1 0 calc(25% - 12px)",
              minWidth: "280px",
              maxWidth: "400px",
              backgroundColor: "#111111",
              borderRadius: "20px",
              padding: "28px",
              display: "flex",
              flexDirection: "column",
              gap: "0",
              scrollSnapAlign: "start",
              border: "1.5px solid #3a3a3a",
            }}
          >
            {/* Top Row */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "24px",
              }}
            >
              {/* Icon Box */}
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  backgroundColor: "#1e1e1e",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1.5px solid #3a3a3a",
                }}
              >
                {step.icon}
              </div>

              {/* Right: number + step label pill */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: "8px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ color: "#aaa", fontSize: "13px", fontWeight: 500 }}>
                    {step.number}
                  </span>
                  <span
                    style={{
                      width: "20px",
                      height: "1px",
                      backgroundColor: "#555",
                      display: "inline-block",
                    }}
                  />
                </div>
                <span
                  style={{
                    backgroundColor: "#1e1e1e",
                    color: "#ddd",
                    fontSize: "12px",
                    padding: "5px 12px",
                    borderRadius: "20px",
                    border: "1.5px solid #3a3a3a",
                  }}
                >
                  {step.label}
                </span>
              </div>
            </div>

            {/* Inner card */}
            <div
              style={{
                backgroundColor: "#0d0d0d",
                borderRadius: "14px",
                padding: "20px",
                marginBottom: "10px",
                flex: 1,
                border: "1.5px solid #3a3a3a",
              }}
            >
              <h3
                style={{
                  color: "#ffffff",
                  fontSize: "18px",
                  fontWeight: 700,
                  margin: "0 0 12px",
                  fontFamily: "inherit",
                }}
              >
                {step.title}
              </h3>
              <p
                style={{
                  color: "#bbb",
                  fontSize: "14px",
                  lineHeight: 1.65,
                  margin: "0 0 24px",
                  fontFamily: "inherit",
                }}
              >
                {step.description}
              </p>

              {/* Dots */}
              <div style={{ display: "flex", gap: "6px" }}>
                {[1, 2, 3, 4].map((i) => (
                  <span
                    key={i}
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      backgroundColor: i <= step.dots ? "#ffffff" : "#3a3a3a",
                      display: "inline-block",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Action Link */}
            <div
              style={{
                backgroundColor: "#0d0d0d",
                borderRadius: "14px",
                padding: "14px 18px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                border: "1.5px solid #3a3a3a",
                cursor: "pointer",
              }}
            >
              <span style={{ color: "#ccc", fontSize: "14px" }}>
                {step.action} →
              </span>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  backgroundColor: "#1e1e1e",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1.5px solid #3a3a3a",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .process-scroll::-webkit-scrollbar {
          display: none;
        }
        @media (max-width: 768px) {
          .process-scroll {
            padding: 0 16px !important;
          }
          .process-scroll > div {
            flex: 0 0 85vw !important;
            max-width: 85vw !important;
          }
        }
      `}</style>
    </section>
  );
}