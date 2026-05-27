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
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
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
  const menuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && menuOpen) {
        setMenuOpen(false);
        hamburgerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen || !menuRef.current) return;
    const focusable = menuRef.current.querySelectorAll<HTMLElement>(
      'a, button, [tabindex]:not([tabindex="-1"])'
    );
    focusable[0]?.focus();
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav
        role="navigation"
        aria-label="Main navigation"
        className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}
      >
        <Link href="/" onClick={closeMenu} aria-label="ClickAds — go to homepage" className="navbar-logo">
          <ClickAdsLogo size={22} />
          <span className="navbar-logo-text">ClickAds</span>
        </Link>

        {!isMobile && (
          <div className="navbar-links" role="list">
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href} role="listitem" className="navbar-link">
                {link.label}
              </Link>
            ))}
          </div>
        )}

        {!isMobile && (
          <Link href="/contact" aria-label="Get started with ClickAds" className="navbar-cta">
            Get Started
          </Link>
        )}

        {isMobile && (
          <button
            ref={hamburgerRef}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="navbar-hamburger"
          >
            <span className={`navbar-bar ${menuOpen ? "navbar-bar--top-open" : ""}`} aria-hidden="true" />
            <span className={`navbar-bar ${menuOpen ? "navbar-bar--mid-open" : ""}`} aria-hidden="true" />
            <span className={`navbar-bar ${menuOpen ? "navbar-bar--bot-open" : ""}`} aria-hidden="true" />
          </button>
        )}
      </nav>

      {isMobile && (
        <div
          id="mobile-menu"
          ref={menuRef}
          role="dialog"
          aria-label="Mobile navigation menu"
          aria-modal="true"
          aria-hidden={!menuOpen}
          className={`mobile-menu ${menuOpen ? "mobile-menu--open" : ""}`}
        >
          <div className="mobile-menu-links">
            {navLinks.map((link, i) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={closeMenu}
                tabIndex={menuOpen ? 0 : -1}
                className={`mobile-menu-link ${menuOpen ? "mobile-menu-link--visible" : ""}`}
                style={{ transitionDelay: `${i * 0.07}s` }}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="mobile-menu-footer">
            <Link
              href="/contact"
              onClick={closeMenu}
              tabIndex={menuOpen ? 0 : -1}
              aria-label="Get started with ClickAds"
              className="mobile-menu-cta"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </>
  );
}