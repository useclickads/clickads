"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

function ClickAdsLogo({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="4"  y="4"  width="56" height="11" fill="white" />
      <rect x="4"  y="4"  width="11" height="56" fill="white" />
      <rect x="20" y="20" width="40" height="10" fill="white" />
      <rect x="20" y="20" width="10" height="40" fill="white" />
      <rect x="46" y="46" width="14" height="14" fill="white" />
    </svg>
  );
}

const quickLinks = [
  { label: "Services", href: "/services" },
  { label: "Lidflow", href: "/lidflow" },
  { label: "GrwFit", href: "/grwfit" },
  { label: "Pricing", href: "/pricing" },
];

const resources = [
  { label: "Blog", href: "/blog" },
  { label: "Documentation", href: "/docs" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Help Center", href: "/help" },
];

const company = [
  { label: "Contact", href: "/contact" },
  { label: "Partners", href: "/partners" },
  { label: "Careers", href: "/careers" },
  { label: "Why ClickAds", href: "/why" },
];

const socials = [
  {
    label: "Twitter / X", href: "https://twitter.com",
    icon: <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M12.6 2h2.1L9.9 7.3 15.5 14h-3.9l-3.5-4.6L4 14H1.9l5.2-5.7L1.5 2h4l3.2 4.2L12.6 2Zm-.7 10.8h1.2L4.2 3.2H2.9l9 9.6Z" fill="currentColor" /></svg>,
  },
  {
    label: "LinkedIn", href: "https://linkedin.com",
    icon: <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M3.6 5.5H1.2v9.3h2.4V5.5ZM2.4 4.4a1.4 1.4 0 1 0 0-2.8 1.4 1.4 0 0 0 0 2.8ZM14.8 9.8c0-2.4-1.3-4.5-3.6-4.5-1 0-1.9.5-2.4 1.2V5.5H6.4v9.3h2.4V9.9c0-1 .7-1.8 1.7-1.8s1.9.8 1.9 1.8v4.9h2.4V9.8Z" fill="currentColor" /></svg>,
  },
  {
    label: "Instagram", href: "https://instagram.com",
    icon: <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><rect x="1.5" y="1.5" width="13" height="13" rx="4" stroke="currentColor" strokeWidth="1.4" /><circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.4" /><circle cx="11.8" cy="4.2" r="0.8" fill="currentColor" /></svg>,
  },
  {
    label: "YouTube", href: "https://youtube.com",
    icon: <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M14.5 4.5s-.2-1.2-.7-1.7c-.6-.7-1.3-.7-1.7-.7C10.3 2 8 2 8 2s-2.3 0-4.1.1c-.4 0-1.1 0-1.7.7-.5.5-.7 1.7-.7 1.7S1.3 5.9 1.3 7.3v1.3c0 1.4.2 2.8.2 2.8s.2 1.2.7 1.7c.6.7 1.5.6 1.9.7C5.3 14 8 14 8 14s2.3 0 4.1-.1c.4-.1 1.1-.1 1.7-.7.5-.5.7-1.7.7-1.7s.2-1.4.2-2.8V7.3c0-1.4-.2-2.8-.2-2.8ZM6.5 10V5.7l4.3 2.2L6.5 10Z" fill="currentColor" /></svg>,
  },
  {
    label: "Facebook", href: "https://facebook.com",
    icon: <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M13 1.5H3A1.5 1.5 0 0 0 1.5 3v10A1.5 1.5 0 0 0 3 14.5h4.5V10H6V8h1.5V6.5A2.5 2.5 0 0 1 10 4h1.5v2H10a.5.5 0 0 0-.5.5V8H11.5l-.5 2H9.5v4.5H13A1.5 1.5 0 0 0 14.5 13V3A1.5 1.5 0 0 0 13 1.5Z" fill="currentColor"/></svg>,
  },
];

function BrandBlock() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "9px", textDecoration: "none" }}>
        <ClickAdsLogo size={22} />
        <span style={{ fontSize: "18px", fontWeight: 800, color: "#fff", letterSpacing: "-0.5px", lineHeight: 1 }}>ClickAds</span>
      </Link>
      <p style={{ fontSize: "13px", fontWeight: 400, lineHeight: 1.7, color: "rgba(255,255,255,0.55)", margin: 0, maxWidth: "240px" }}>
        Smarter advertising for brands that want to grow faster and spend better.
      </p>
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {socials.map((s, i) => (
          <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
            style={{ width: "34px", height: "34px", borderRadius: "9px", border: "0.5px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", textDecoration: "none", transition: "all 0.18s ease", flexShrink: 0 }}
            onMouseEnter={(e) => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = "#fff"; el.style.background = "rgba(255,255,255,0.12)"; }}
            onMouseLeave={(e) => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = "rgba(255,255,255,0.2)"; el.style.background = "rgba(255,255,255,0.05)"; }}
          >{s.icon}</a>
        ))}
      </div>
    </div>
  );
}

function FooterColumn({ title, items }: { title: string; items: { label: string; href: string }[] }) {
  return (
    <div>
      <p style={{ fontSize: "10.5px", fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: "#fff", margin: "0 0 22px" }}>{title}</p>
      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "13px" }}>
        {items.map((item, i) => (
          <li key={i}>
            <Link href={item.href}
              style={{ fontSize: "13px", fontWeight: 400, color: "#fff", textDecoration: "none", transition: "opacity 0.18s ease" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = "0.6")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = "1")}
            >{item.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AccordionColumn({ title, items }: { title: string; items: { label: string; href: string }[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "0.5px solid rgba(255,255,255,0.08)" }}>
      <button onClick={() => setOpen(!open)} style={{ width: "100%", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 0" }}>
        <span style={{ fontSize: "10.5px", fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: "#fff" }}>{title}</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ transition: "transform 0.25s ease", transform: open ? "rotate(180deg)" : "rotate(0deg)", flexShrink: 0 }}>
          <path d="M4 6l4 4 4-4" stroke="rgba(255,255,255,0.5)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div style={{ overflow: "hidden", maxHeight: open ? "300px" : "0", transition: "max-height 0.3s ease" }}>
        <ul style={{ listStyle: "none", margin: 0, padding: "0 0 16px", display: "flex", flexDirection: "column", gap: "14px" }}>
          {items.map((item, i) => (
            <li key={i}>
              <Link href={item.href} style={{ fontSize: "14px", fontWeight: 400, color: "#fff", textDecoration: "none", opacity: 0.75 }}>{item.label}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function Footer() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 769);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <footer style={{ background: "#080808", fontFamily: "'DM Sans', sans-serif", position: "relative", overflow: "hidden" }}>
      <div style={{ borderTop: "0.5px solid rgba(255,255,255,0.12)" }} />

      {/* DESKTOP */}
      {!isMobile && (
        <div style={{
          maxWidth: "1120px", margin: "0 auto",
          padding: "72px 32px 56px",
          display: "grid",
          gridTemplateColumns: "minmax(0,2fr) repeat(3, minmax(0,1fr))",
          columnGap: "80px", rowGap: "40px",
        }}>
          <BrandBlock />
          <FooterColumn title="Quick Links" items={quickLinks} />
          <FooterColumn title="Resources" items={resources} />
          <FooterColumn title="Company" items={company} />
        </div>
      )}

      {/* MOBILE */}
      {isMobile && (
        <div style={{ padding: "48px 24px 32px" }}>
          <BrandBlock />
          <div style={{ marginTop: "40px" }}>
            <AccordionColumn title="Quick Links" items={quickLinks} />
            <AccordionColumn title="Resources" items={resources} />
            <AccordionColumn title="Company" items={company} />
          </div>
        </div>
      )}

      {/* Bottom bar */}
      <div style={{ borderTop: "0.5px solid rgba(255,255,255,0.1)" }}>
        <div style={{
          maxWidth: "1120px", margin: "0 auto", padding: "20px 24px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: "12px",
        }}>
          <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", fontWeight: 400 }}>
            © {new Date().getFullYear()} ClickAds, Inc. All rights reserved.
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item, i) => (
              <Link key={i} href="#"
                style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", textDecoration: "none", fontWeight: 400, transition: "opacity 0.18s ease" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = "0.6")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = "1")}
              >{item}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}