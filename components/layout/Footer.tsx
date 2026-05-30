"use client";

import Link from "next/link";
import NewsletterSignup from "@/components/NewsletterSignup";
import { useState } from "react";

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

const quickLinks = [
  { label: "Services", href: "/services" },
  { label: "Lidflow",  href: "/products#lidflow" },
  { label: "GrwFit",   href: "/products#grwfit" },
  { label: "Pricing",  href: "/services#pricing" },
];
const resources = [
  { label: "Blog",          href: "/blog" },
  { label: "Documentation", href: "/resources#documentation" },
  { label: "FAQs",          href: "/resources#faqs" },
  { label: "Help Center",   href: "/resources#help-center" },
];
const company = [
  { label: "Contact",  href: "/contact" },
  { label: "About Us", href: "/company#about" },
  { label: "Careers",  href: "/company#careers" },
  { label: "Partners", href: "/company#partners" },
];
const legalLinks = [
  { label: "Privacy Policy",   href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Cookie Policy",    href: "/cookies" },
];

const socials = [
  {
    label: "Twitter / X",
    href: "https://twitter.com/useclickads",
    icon: (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M12.6 2h2.1L9.9 7.3 15.5 14h-3.9l-3.5-4.6L4 14H1.9l5.2-5.7L1.5 2h4l3.2 4.2L12.6 2Zm-.7 10.8h1.2L4.2 3.2H2.9l9 9.6Z" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/useclickads",
    icon: (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M3.6 5.5H1.2v9.3h2.4V5.5ZM2.4 4.4a1.4 1.4 0 1 0 0-2.8 1.4 1.4 0 0 0 0 2.8ZM14.8 9.8c0-2.4-1.3-4.5-3.6-4.5-1 0-1.9.5-2.4 1.2V5.5H6.4v9.3h2.4V9.9c0-1 .7-1.8 1.7-1.8s1.9.8 1.9 1.8v4.9h2.4V9.8Z" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/useclickads/",
    icon: (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <rect x="1.5" y="1.5" width="13" height="13" rx="4" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="11.8" cy="4.2" r="0.8" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/useclickads",
    icon: (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M15 8a7 7 0 1 0-8.094 6.915V10.31H4.93V8h1.976V6.291c0-1.95 1.164-3.027 2.941-3.027.852 0 1.744.152 1.744.152V5.36h-.983c-.968 0-1.27.6-1.27 1.216V8h2.162l-.345 2.31H9.338v4.605A7.002 7.002 0 0 0 15 8Z" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@UseClickAds",
    icon: (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M15.6 4.8s-.2-1.3-.7-1.8c-.7-.7-1.5-.7-1.8-.8C11.1 2 8 2 8 2s-3.1 0-5.1.2c-.4 0-1.2.1-1.8.8C.6 3.5.4 4.8.4 4.8S.2 6.3.2 7.8v1.4c0 1.5.2 3 .2 3s.2 1.3.7 1.8c.7.7 1.6.7 2 .7C4.3 14 8 14 8 14s3.1 0 5.1-.2c.4 0 1.2-.1 1.8-.8.5-.5.7-1.8.7-1.8s.2-1.5.2-3V7.8c0-1.5-.2-3-.2-3ZM6.4 10.2V5.7l4.8 2.3-4.8 2.2Z" fill="currentColor" />
      </svg>
    ),
  },
];

function BrandBlock() {
  return (
    <div className="footer-brand">
      <Link href="/" className="footer-logo-link" aria-label="ClickAds — go to homepage">
        <ClickAdsLogo size={22} />
        <span className="footer-logo-text">ClickAds</span>
      </Link>
      <p className="footer-tagline">
        Smarter advertising for brands that want to grow faster and spend better.
      </p>
      <div className="footer-socials" role="list" aria-label="Social media links">
        {socials.map((s) => (
          <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
            aria-label={`Follow us on ${s.label}`} role="listitem" className="footer-social-btn">
            {s.icon}
          </a>
        ))}
      </div>
    </div>
  );
}

function FooterColumn({ title, items }: { title: string; items: { label: string; href: string }[] }) {
  return (
    <div>
      <p className="footer-col-title">{title}</p>
      <ul className="footer-col-list">
        {items.map((item) => (
          <li key={item.label}>
            <Link href={item.href} className="footer-col-link">{item.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AccordionColumn({ title, items }: { title: string; items: { label: string; href: string }[] }) {
  const [open, setOpen] = useState(false);
  const id = `accordion-${title.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <div className="accordion">
      <button onClick={() => setOpen(!open)} aria-expanded={open} aria-controls={id} aria-label={`Toggle ${title} menu`} className="accordion-btn">
        <span className="footer-col-title" style={{ margin: 0 }}>{title}</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"
          className={`accordion-icon ${open ? "accordion-icon--open" : ""}`}>
          <path d="M4 6l4 4 4-4" stroke="rgba(255,255,255,0.5)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div id={id} className={`accordion-body ${open ? "accordion-body--open" : ""}`}>
        <ul className="footer-col-list" style={{ paddingBottom: "16px" }}>
          {items.map((item) => (
            <li key={item.label}>
              <Link href={item.href} className="footer-col-link">{item.label}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function Footer() {
  return (
    <>
      <NewsletterSignup />
      <footer className="footer" aria-label="Site footer">
      <div className="footer-divider" />
      <div className="footer-desktop">
        <BrandBlock />
        <FooterColumn title="Quick Links" items={quickLinks} />
        <FooterColumn title="Resources"   items={resources} />
        <FooterColumn title="Company"     items={company} />
      </div>
      <div className="footer-mobile">
        <BrandBlock />
        <div className="footer-mobile-accordions">
          <AccordionColumn title="Quick Links" items={quickLinks} />
          <AccordionColumn title="Resources"   items={resources} />
          <AccordionColumn title="Company"     items={company} />
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <span className="footer-copyright">
            © {new Date().getFullYear()} ClickAds, Inc. All rights reserved.
          </span>
          <nav aria-label="Legal links" className="footer-legal">
            {legalLinks.map((item) => (
              <Link key={item.label} href={item.href} className="footer-legal-link">{item.label}</Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
    </> 
  );
}