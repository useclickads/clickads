"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const navLinks = [
  { label: "Services", href: "/services" },
  { label: "Products", href: "/products" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

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

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Hide on scroll down, show on scroll up — works on both mobile & desktop
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <nav style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        height: "60px",
        background: scrolled ? "rgba(0,0,0,0.92)" : "rgba(0,0,0,0.75)",
        backdropFilter: "blur(12px)",
        borderBottom: scrolled
          ? "1px solid rgba(255,255,255,0.1)"
          : "1px solid transparent",
        // Never hide when menu is open
        transition: "background 0.3s ease, border-color 0.3s ease",
      }}>

        {/* LOGO — always visible */}
        <Link href="/" onClick={() => setMenuOpen(false)} style={{
          display: "flex", alignItems: "center",
          gap: "9px", textDecoration: "none", zIndex: 1,
        }}>
          <ClickAdsLogo size={22} />
          <span style={{
            fontSize: "18px", fontWeight: 800,
            color: "#fff", letterSpacing: "-0.5px", lineHeight: 1,
          }}>
            ClickAds
          </span>
        </Link>

        {/* DESKTOP LINKS — hidden on mobile via JS */}
        {!isMobile && (
          <div style={{ display: "flex", gap: "36px" }}>
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href} style={{
                fontSize: "13px", color: "rgba(255,255,255,0.75)",
                textDecoration: "none", transition: "color 0.2s ease",
              }}
                onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.75)")}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}

        {/* DESKTOP CTA — hidden on mobile via JS */}
        {!isMobile && (
          <Link href="/contact" style={{
            fontSize: "12px", fontWeight: 600,
            color: "#fff", textDecoration: "none",
            padding: "8px 20px",
            border: "1px solid rgba(255,255,255,0.25)",
            borderRadius: "100px",
            transition: "border-color 0.2s ease",
          }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = "#fff")}
            onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)")}
          >
            Get Started
          </Link>
        )}

        {/* HAMBURGER — only on mobile via JS */}
        {isMobile && (
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            style={{
              background: "none", border: "none",
              cursor: "pointer", padding: "4px",
              display: "flex", flexDirection: "column",
              justifyContent: "center", alignItems: "center",
              gap: "5px", width: "36px", height: "36px",
            }}
          >
            <span style={{
              display: "block", width: "22px", height: "1.5px", background: "#fff",
              transition: "transform 0.3s ease, opacity 0.3s ease",
              transform: menuOpen ? "translateY(6.5px) rotate(45deg)" : "none",
            }} />
            <span style={{
              display: "block", width: "22px", height: "1.5px", background: "#fff",
              transition: "opacity 0.3s ease",
              opacity: menuOpen ? 0 : 1,
            }} />
            <span style={{
              display: "block", width: "22px", height: "1.5px", background: "#fff",
              transition: "transform 0.3s ease, opacity 0.3s ease",
              transform: menuOpen ? "translateY(-6.5px) rotate(-45deg)" : "none",
            }} />
          </button>
        )}
      </nav>

      {/* MOBILE FULL-SCREEN MENU */}
      {isMobile && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 999,
          background: "#000",
          display: "flex", flexDirection: "column",
          justifyContent: "center", padding: "0 32px",
          transition: "opacity 0.35s ease, transform 0.35s ease",
          opacity: menuOpen ? 1 : 0,
          transform: menuOpen ? "translateY(0)" : "translateY(-12px)",
          pointerEvents: menuOpen ? "auto" : "none",
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {navLinks.map((link, i) => (
              <Link key={link.label} href={link.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  fontSize: "clamp(22px, 6vw, 32px)", fontWeight: 600,
                  color: "#fff", textDecoration: "none",
                  letterSpacing: "-1.5px", lineHeight: 1.15,
                  opacity: menuOpen ? 1 : 0,
                  transform: menuOpen ? "translateY(0)" : "translateY(16px)",
                  transition: `opacity 0.4s ease ${i * 0.07}s, transform 0.4s ease ${i * 0.07}s`,
                  display: "block",
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div style={{
            marginTop: "48px", paddingTop: "32px",
            borderTop: "1px solid rgba(255,255,255,0.1)",
          }}>
            <Link href="/contact" onClick={() => setMenuOpen(false)} style={{
              display: "inline-block",
              fontSize: "13px", fontWeight: 600,
              color: "#000", background: "#fff",
              padding: "12px 28px", borderRadius: "100px",
              textDecoration: "none",
            }}>
              Get Started
            </Link>
          </div>
        </div>
      )}
    </>
  );
}