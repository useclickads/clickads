"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const posts = [
  {
    category: "Strategy",
    categoryColor: "#8b5cf6",
    categoryBg: "rgba(139,92,246,0.12)",
    title: "How to Build a High-Converting Ad Campaign in 2026",
    excerpt: "Learn the exact framework top brands use to structure campaigns that drive clicks, conversions, and measurable ROI from day one.",
    date: "May 12, 2026",
    readTime: "5 min read",
    slug: "high-converting-ad-campaign-2026",
  },
  {
    category: "Analytics",
    categoryColor: "#06b6d4",
    categoryBg: "rgba(6,182,212,0.12)",
    title: "Understanding Click-Through Rates: What's Good and What Isn't",
    excerpt: "CTR benchmarks vary wildly by industry and format. Here's how to read your numbers and know when to optimize vs. when to stay the course.",
    date: "Apr 28, 2026",
    readTime: "4 min read",
    slug: "understanding-click-through-rates",
  },
  {
    category: "Growth",
    categoryColor: "#10b981",
    categoryBg: "rgba(16,185,129,0.12)",
    title: "Retargeting Done Right: Turn Visitors Into Paying Customers",
    excerpt: "Most retargeting campaigns waste budget. Discover the targeting windows, creative strategies, and frequency caps that actually work.",
    date: "Apr 14, 2026",
    readTime: "6 min read",
    slug: "retargeting-done-right",
  },
];

function BlogCard({ post }: { post: typeof posts[0] }) {
  return (
    <Link href={`/blog/${post.slug}`} style={{ textDecoration: "none", display: "block", height: "100%" }}>
      <div
        style={{
          background: "#0f0f0f", border: "0.5px solid #1e1e1e",
          borderRadius: "18px", padding: "28px", height: "100%",
          display: "flex", flexDirection: "column", gap: "16px",
          transition: "border-color 0.25s, transform 0.2s, background 0.2s",
          cursor: "pointer", boxSizing: "border-box",
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.borderColor = "#2e2e2e";
          el.style.background = "#131313";
          el.style.transform = "translateY(-3px)";
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.borderColor = "#1e1e1e";
          el.style.background = "#0f0f0f";
          el.style.transform = "translateY(0)";
        }}
      >
        <div style={{ display: "inline-flex", alignItems: "center", alignSelf: "flex-start", background: post.categoryBg, borderRadius: "100px", padding: "4px 12px" }}>
          <span style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.3px", color: post.categoryColor }}>{post.category}</span>
        </div>
        <h3 style={{ fontSize: "16px", fontWeight: 600, letterSpacing: "-0.3px", lineHeight: 1.4, color: "#fff", margin: 0, flex: 1 }}>
          {post.title}
        </h3>
        <p style={{ fontSize: "13.5px", fontWeight: 300, lineHeight: 1.65, color: "rgba(255,255,255,0.4)", margin: 0 }}>
          {post.excerpt}
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "16px", borderTop: "0.5px solid #1a1a1a" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "11.5px", color: "#444" }}>{post.date}</span>
            <span style={{ fontSize: "11.5px", color: "#333" }}>·</span>
            <span style={{ fontSize: "11.5px", color: "#444" }}>{post.readTime}</span>
          </div>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 7h8M7.5 3.5L11 7l-3.5 3.5" stroke="#333" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </Link>
  );
}

export default function BlogPreview() {
  const [isMobile, setIsMobile] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 769);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    const index = Math.round(el.scrollLeft / (el.offsetWidth * 0.82 + 12));
    setActiveIndex(Math.min(index, posts.length - 1));
  };

  const scrollTo = (i: number) => {
    if (!scrollRef.current) return;
    const cardWidth = scrollRef.current.offsetWidth * 0.82 + 12;
    scrollRef.current.scrollTo({ left: i * cardWidth, behavior: "smooth" });
    setActiveIndex(i);
  };

  return (
    <section style={{ background: "#080808", padding: isMobile ? "60px 0 72px" : "80px 0 90px", fontFamily: "Inter, sans-serif" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{
          display: "flex", alignItems: "flex-end", justifyContent: "space-between",
          marginBottom: "48px", flexWrap: "wrap", gap: "16px", padding: "0 24px",
        }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
              <div style={{ width: "20px", height: "0.5px", background: "#555" }} />
              <span style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "3px", textTransform: "uppercase", color: "#666" }}>
                Insights & Resources
              </span>
            </div>
            <h2 style={{ fontSize: "clamp(24px, 3.5vw, 36px)", fontWeight: 700, letterSpacing: "-0.8px", color: "#fff", margin: 0, lineHeight: 1.15 }}>
              Latest from the blog
            </h2>
          </div>
          <Link href="/blog" style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            fontSize: "13px", fontWeight: 500, color: "rgba(255,255,255,0.4)",
            textDecoration: "none", border: "0.5px solid #222", borderRadius: "100px", padding: "8px 16px", transition: "color 0.2s, border-color 0.2s",
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#fff"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "#444"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.4)"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "#222"; }}
          >
            View all posts
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2.5 6h7M6.5 3L9.5 6l-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        {/* DESKTOP: 3-col grid */}
        {!isMobile && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", padding: "0 24px" }}>
            {posts.map((post, i) => <BlogCard key={i} post={post} />)}
          </div>
        )}

        {/* MOBILE: swipe slider */}
        {isMobile && (
          <div>
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              style={{
                display: "flex", gap: "12px",
                overflowX: "auto", scrollSnapType: "x mandatory",
                WebkitOverflowScrolling: "touch", scrollbarWidth: "none",
                paddingLeft: "24px", paddingRight: "24px", paddingBottom: "4px",
              }}
            >
              {posts.map((post, i) => (
                <div key={i} style={{ flex: "0 0 82vw", maxWidth: "320px", scrollSnapAlign: "start" }}>
                  <BlogCard post={post} />
                </div>
              ))}
            </div>

            {/* Dots */}
            <div style={{ display: "flex", justifyContent: "center", gap: "6px", marginTop: "20px" }}>
              {posts.map((_, i) => (
                <button key={i} onClick={() => scrollTo(i)} style={{
                  width: i === activeIndex ? "20px" : "6px", height: "6px",
                  borderRadius: "100px",
                  background: i === activeIndex ? "#fff" : "rgba(255,255,255,0.2)",
                  border: "none", cursor: "pointer", padding: 0,
                  transition: "width 0.3s ease, background 0.3s ease",
                }} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}