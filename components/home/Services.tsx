"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const services = [
  { name: "AI Marketing",     description: "Intelligent campaigns that learn, adapt, and convert. Automated targeting that finds your audience before your competitors do.",                                        animation: "ai-marketing", href: "/services#ai-marketing" },
  { name: "SaaS Development", description: "End-to-end SaaS platforms built for scale. From architecture to deployment — we ship products that retain users.",                                                   animation: "saas-dev",     href: "/services#saas-dev"     },
  { name: "Web Development",  description: "Blazing-fast web experiences engineered for performance. Clean code, modern stack, zero compromise on quality.",                                                      animation: "web-dev",      href: "/services#web-dev"      },
  { name: "AI Automation",    description: "Replace repetitive workflows with intelligent agents. Free your team to focus on what actually moves the needle.",                                                    animation: "ai-automation",href: "/services#ai-automation"},
  { name: "Lead Generation",  description: "Data-driven pipelines that fill your CRM with qualified leads. Not just traffic — buyers ready to convert.",                                                          animation: "lead-gen",     href: "/services#lead-gen"     },
  { name: "Performance Ads",  description: "ROI-obsessed ad campaigns across every major platform. Every rupee tracked, every creative tested, every result optimised.",                                          animation: "perf-ads",     href: "/services#perf-ads"     },
  { name: "Analytics",        description: "Turn raw data into sharp decisions. Custom dashboards, real-time tracking, and insights that drive revenue.",                                                         animation: "analytics",    href: "/services#analytics"    },
  { name: "Brand Design",     description: "Identities that command attention. From logo to full brand system — built to be remembered in a crowded market.",                                                    animation: "brand-design", href: "/services#brand-design" },
];

function AIMarketingAnim() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <style>{`
        @keyframes pulse-ring { 0%,100%{r:18;opacity:0.15} 50%{r:26;opacity:0.05} }
        @keyframes star-spin { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
        @keyframes dot-orbit { 0%{transform:rotate(0deg) translateX(28px) rotate(0deg)} 100%{transform:rotate(360deg) translateX(28px) rotate(-360deg)} }
        @keyframes dot-orbit2 { 0%{transform:rotate(120deg) translateX(22px) rotate(-120deg)} 100%{transform:rotate(480deg) translateX(22px) rotate(-480deg)} }
        @keyframes dot-orbit3 { 0%{transform:rotate(240deg) translateX(16px) rotate(-240deg)} 100%{transform:rotate(600deg) translateX(16px) rotate(-600deg)} }
      `}</style>
      <circle cx="40" cy="40" fill="none" stroke="rgba(255,255,255,0.08)">
        <animate attributeName="r" values="18;26;18" dur="3s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.15;0.05;0.15" dur="3s" repeatCount="indefinite"/>
      </circle>
      <circle cx="40" cy="40" fill="none" stroke="rgba(255,255,255,0.15)">
        <animate attributeName="r" values="10;18;10" dur="3s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.25;0.1;0.25" dur="3s" repeatCount="indefinite"/>
      </circle>
      <g transform="translate(40,40)" style={{animation:"star-spin 8s linear infinite", transformOrigin:"0 0"}}>
        <path d="M0-8L1.5-1.5L8 0L1.5 1.5L0 8L-1.5 1.5L-8 0L-1.5-1.5Z" fill="white"/>
      </g>
      <g transform="translate(40,40)" style={{animation:"dot-orbit 4s linear infinite", transformOrigin:"0 0"}}>
        <circle r="3" fill="white" opacity="0.9"/>
      </g>
      <g transform="translate(40,40)" style={{animation:"dot-orbit2 4s linear infinite", transformOrigin:"0 0"}}>
        <circle r="2" fill="white" opacity="0.6"/>
      </g>
      <g transform="translate(40,40)" style={{animation:"dot-orbit3 4s linear infinite", transformOrigin:"0 0"}}>
        <circle r="1.5" fill="white" opacity="0.4"/>
      </g>
    </svg>
  );
}

function SaasDevAnim() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <style>{`
        @keyframes block-pulse1 { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.9)} }
        @keyframes block-pulse2 { 0%,100%{opacity:0.4;transform:scale(0.9)} 50%{opacity:1;transform:scale(1)} }
        @keyframes block-pulse3 { 0%,100%{opacity:0.7;transform:scale(0.95)} 33%{opacity:1;transform:scale(1)} 66%{opacity:0.3;transform:scale(0.88)} }
        @keyframes block-pulse4 { 0%,100%{opacity:0.3;transform:scale(0.88)} 33%{opacity:0.7;transform:scale(0.95)} 66%{opacity:1;transform:scale(1)} }
      `}</style>
      <g transform="translate(16,16)" style={{animation:"block-pulse1 2s ease-in-out infinite", transformOrigin:"12 12"}}>
        <rect width="22" height="22" rx="4" fill="none" stroke="white" strokeWidth="1.5"/>
      </g>
      <g transform="translate(42,16)" style={{animation:"block-pulse2 2s ease-in-out infinite", transformOrigin:"12 12"}}>
        <rect width="22" height="22" rx="4" fill="none" stroke="white" strokeWidth="1.5"/>
      </g>
      <g transform="translate(16,42)" style={{animation:"block-pulse3 2s ease-in-out infinite", transformOrigin:"12 12"}}>
        <rect width="22" height="22" rx="4" fill="none" stroke="white" strokeWidth="1.5"/>
      </g>
      <g transform="translate(42,42)" style={{animation:"block-pulse4 2s ease-in-out infinite", transformOrigin:"12 12"}}>
        <rect width="22" height="22" rx="4" fill="white" opacity="0.9"/>
      </g>
    </svg>
  );
}

function WebDevAnim() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <style>{`
        @keyframes bracket-glow { 0%,100%{opacity:0.4} 50%{opacity:1} }
      `}</style>
      <g style={{animation:"bracket-glow 2s ease-in-out infinite"}}>
        <path d="M28 22L18 40L28 58" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
      <g style={{animation:"bracket-glow 2s ease-in-out infinite 1s"}}>
        <path d="M52 22L62 40L52 58" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
      <line x1="34" y1="32" x2="46" y2="32" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="12" opacity="0.6">
        <animate attributeName="stroke-dashoffset" values="12;0;12" dur="2s" repeatCount="indefinite"/>
      </line>
      <line x1="32" y1="40" x2="48" y2="40" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="16" opacity="0.9">
        <animate attributeName="stroke-dashoffset" values="16;0;16" dur="2.4s" repeatCount="indefinite"/>
      </line>
      <line x1="36" y1="48" x2="44" y2="48" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="8" opacity="0.5">
        <animate attributeName="stroke-dashoffset" values="8;0;8" dur="1.8s" repeatCount="indefinite"/>
      </line>
    </svg>
  );
}

function AIAutomationAnim() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <style>{`
        @keyframes spin-slow { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
        @keyframes spin-reverse { 0%{transform:rotate(0deg)} 100%{transform:rotate(-360deg)} }
      `}</style>
      <g transform="translate(40,40)" style={{animation:"spin-slow 6s linear infinite", transformOrigin:"0 0"}}>
        <circle r="22" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="4 6"/>
      </g>
      <g transform="translate(40,40)" style={{animation:"spin-reverse 4s linear infinite", transformOrigin:"0 0"}}>
        <circle r="14" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" strokeDasharray="3 4"/>
      </g>
      <circle cx="40" cy="40" r="5" fill="white">
        <animate attributeName="r" values="5;3;5" dur="2s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite"/>
      </circle>
      <g transform="translate(40,40)" style={{animation:"spin-slow 6s linear infinite", transformOrigin:"0 0"}}>
        <circle cx="22" cy="0" r="3.5" fill="white" opacity="0.9"/>
      </g>
    </svg>
  );
}

function LeadGenAnim() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <path d="M16 20H64L50 42H30L16 20Z" fill="none" stroke="white" strokeWidth="1.5" strokeLinejoin="round" opacity="0.5"/>
      <path d="M30 42H50L44 58H36L30 42Z" fill="none" stroke="white" strokeWidth="1.5" strokeLinejoin="round" opacity="0.7"/>
      <circle r="2.5" fill="white" opacity="0.8" cx="28">
        <animate attributeName="cy" values="14;56;14" dur="2s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite"/>
      </circle>
      <circle r="2" fill="white" opacity="0.6" cx="40">
        <animate attributeName="cy" values="14;56;14" dur="2s" begin="0.5s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0;1;0" dur="2s" begin="0.5s" repeatCount="indefinite"/>
      </circle>
      <circle r="2.5" fill="white" opacity="0.8" cx="52">
        <animate attributeName="cy" values="14;56;14" dur="2s" begin="1s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0;1;0" dur="2s" begin="1s" repeatCount="indefinite"/>
      </circle>
    </svg>
  );
}

function PerfAdsAnim() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <line x1="18" y1="64" x2="62" y2="64" stroke="white" strokeWidth="1.2" opacity="0.3"/>
      <rect x="20" width="8" rx="2" fill="white" opacity="0.6">
        <animate attributeName="height" values="16;28;16" dur="2s" repeatCount="indefinite"/>
        <animate attributeName="y" values="48;36;48" dur="2s" repeatCount="indefinite"/>
      </rect>
      <rect x="32" width="8" rx="2" fill="white" opacity="0.75">
        <animate attributeName="height" values="28;36;28" dur="2s" begin="0.3s" repeatCount="indefinite"/>
        <animate attributeName="y" values="36;28;36" dur="2s" begin="0.3s" repeatCount="indefinite"/>
      </rect>
      <rect x="44" width="8" rx="2" fill="white" opacity="0.9">
        <animate attributeName="height" values="36;20;36" dur="2s" begin="0.6s" repeatCount="indefinite"/>
        <animate attributeName="y" values="28;44;28" dur="2s" begin="0.6s" repeatCount="indefinite"/>
      </rect>
      <rect x="56" width="8" rx="2" fill="white">
        <animate attributeName="height" values="20;40;20" dur="2s" begin="0.9s" repeatCount="indefinite"/>
        <animate attributeName="y" values="44;24;44" dur="2s" begin="0.9s" repeatCount="indefinite"/>
      </rect>
    </svg>
  );
}

function AnalyticsAnim() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <polyline points="14,56 26,42 36,48 48,28 62,20" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="100" opacity="0.9">
        <animate attributeName="stroke-dashoffset" values="100;0;100" dur="3s" repeatCount="indefinite"/>
      </polyline>
      <circle cx="14" cy="56" fill="white">
        <animate attributeName="r" values="2;4;2" dur="3s" repeatCount="indefinite"/>
      </circle>
      <circle cx="62" cy="20" fill="white">
        <animate attributeName="r" values="2;4;2" dur="3s" begin="2.4s" repeatCount="indefinite"/>
      </circle>
      <line x1="14" y1="62" x2="62" y2="62" stroke="white" strokeWidth="1" opacity="0.2"/>
      <line x1="14" y1="62" x2="14" y2="16" stroke="white" strokeWidth="1" opacity="0.2"/>
    </svg>
  );
}

function BrandDesignAnim() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <style>{`@keyframes star-scale { 0%,100%{transform:scale(1)} 50%{transform:scale(1.15)} }`}</style>
      <g transform="translate(40,40)" style={{animation:"star-scale 2.5s ease-in-out infinite", transformOrigin:"0 0"}}>
        <path d="M0-22L4-4L22 0L4 4L0 22L-4 4L-22 0L-4-4Z" fill="none" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
      </g>
      <g transform="translate(40,40)" style={{animation:"star-scale 2.5s ease-in-out infinite 0.5s", transformOrigin:"0 0"}}>
        <path d="M0-13L2.5-2.5L13 0L2.5 2.5L0 13L-2.5 2.5L-13 0L-2.5-2.5Z" fill="white" opacity="0.9"/>
      </g>
    </svg>
  );
}

const animationMap: Record<string, React.ReactNode> = {
  "ai-marketing":  <AIMarketingAnim />,
  "saas-dev":      <SaasDevAnim />,
  "web-dev":       <WebDevAnim />,
  "ai-automation": <AIAutomationAnim />,
  "lead-gen":      <LeadGenAnim />,
  "perf-ads":      <PerfAdsAnim />,
  "analytics":     <AnalyticsAnim />,
  "brand-design":  <BrandDesignAnim />,
};

function ServiceCard({ service, index, isMobile }: { service: typeof services[0]; index: number; isMobile: boolean }) {
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.6s ease ${index * 0.08}s, transform 0.6s ease ${index * 0.08}s`,
      }}
    >
    <Link
      href={service.href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.02)",
        border: hovered ? "1px solid rgba(255,255,255,0.2)" : "1px solid rgba(255,255,255,0.07)",
        borderRadius: "16px",
        padding: isMobile ? "20px 16px" : "32px 28px",
        display: "flex",
        flexDirection: "column",
        gap: isMobile ? "12px" : "20px",
        cursor: "pointer",
        minHeight: isMobile ? "auto" : "280px",
        textDecoration: "none",
        transition: "background 0.3s ease, border-color 0.3s ease",
      }}
    >
      {!isMobile && (
        <div style={{
          width: 80, height: 80,
          display: "flex", alignItems: "center", justifyContent: "center",
          transform: hovered ? "scale(1.08)" : "scale(1)",
          transition: "transform 0.3s ease",
        }}>
          {animationMap[service.animation]}
        </div>
      )}
      <div>
        <h3 style={{
          fontSize: isMobile ? "13px" : "17px",
          fontWeight: 700,
          color: "#fff",
          letterSpacing: "-0.3px",
          marginBottom: isMobile ? "6px" : "10px",
          lineHeight: 1.2,
        }}>
          {service.name}
        </h3>
        <p style={{
          fontSize: isMobile ? "11px" : "13px",
          color: "rgba(255,255,255,0.55)",
          lineHeight: 1.6,
          fontWeight: 400,
        }}>
          {service.description}
        </p>
      </div>
      <div style={{
        marginTop: "auto",
        fontSize: isMobile ? "11px" : "12px",
        fontWeight: 600,
        color: hovered ? "#fff" : "rgba(255,255,255,0.35)",
        letterSpacing: "0.3px",
        transition: "color 0.3s ease",
        display: "flex",
        alignItems: "center",
        gap: "4px",
      }}>
        Learn more
        <span style={{
          display: "inline-block",
          transform: hovered ? "translateX(4px)" : "translateX(0)",
          transition: "transform 0.3s ease",
        }}>→</span>
      </div>
    </Link>
    </div>
  );
}

export default function Services() {
  const [isMobile, setIsMobile] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 769);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setHeaderVisible(true); },
      { threshold: 0.1 }
    );
    if (headerRef.current) observer.observe(headerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="services"
      style={{
        background: "#000",
        padding: isMobile ? "56px 16px 64px" : "100px 40px 120px",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
        pointerEvents: "none",
      }}/>

      <div ref={headerRef} style={{
        maxWidth: "1400px",
        margin: isMobile ? "0 auto 40px" : "0 auto 72px",
        textAlign: "center",
        opacity: headerVisible ? 1 : 0,
        transform: headerVisible ? "translateY(0)" : "translateY(24px)",
        transition: "opacity 0.7s ease, transform 0.7s ease",
        position: "relative",
      }}>
        <p style={{ fontSize:"11px", fontWeight:700, color:"rgba(255,255,255,0.4)", letterSpacing:"4px", textTransform:"uppercase", marginBottom:"12px" }}>
          WHAT WE DO
        </p>
        <h2 style={{
          fontSize: isMobile ? "clamp(24px, 6vw, 36px)" : "clamp(32px, 4vw, 42px)",
          fontWeight: 900, color: "#fff", letterSpacing: "-1.5px", lineHeight: 1.05,
          margin: "0 auto", whiteSpace: isMobile ? "normal" : "nowrap",
        }}>
          Every tool you need to grow faster.
        </h2>
      </div>

      <div style={{
        maxWidth: "1400px", margin: "0 auto",
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)",
        gap: "10px",
        position: "relative",
      }}>
        {services.map((service, i) => (
          <ServiceCard key={service.name} service={service} index={i} isMobile={isMobile} />
        ))}
      </div>

      <div style={{
        maxWidth: "1400px",
        margin: isMobile ? "36px auto 0" : "56px auto 0",
        display: "flex", alignItems: "center", justifyContent: "center",
        gap: "16px", flexWrap: "wrap", position: "relative",
      }}>
        <a href="/contact" style={{ background:"#fff", color:"#000", fontSize:"13px", fontWeight:700, padding:"14px 32px", borderRadius:"100px", textDecoration:"none" }}>
          Start Your Project
        </a>
        <a href="/services" style={{ color:"rgba(255,255,255,0.6)", fontSize:"13px", textDecoration:"none", fontWeight:500 }}>
          View all services →
        </a>
      </div>
    </section>
  );
}