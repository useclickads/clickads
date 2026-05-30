"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const platforms = [
  { name: "Meta", color: "#1877f2", icon: "f" },
  { name: "Google", color: "#ea4335", icon: "G" },
  { name: "TikTok", color: "#69C9D0", icon: "♪" },
  { name: "LinkedIn", color: "#0a66c2", icon: "in" },
  { name: "X", color: "#aaa", icon: "𝕏" },
  { name: "YouTube", color: "#ff0000", icon: "▶" },
];

const results = [
  { platform: "Meta", platformColor: "#1877f2", platformIcon: "f", label: "Reach Campaign", metric: "CTR", value: "4.8%", impressions: "2.1M", score: 97, tags: ["Travel", "Lead Gen"], bars: [60, 75, 55, 80, 90, 72, 95] },
  { platform: "Google", platformColor: "#ea4335", platformIcon: "G", label: "Search Ads", metric: "Conv. Rate", value: "8.2%", impressions: "890K", score: 99, tags: ["Search", "Intent"], bars: [40, 65, 80, 70, 85, 90, 88] },
  { platform: "TikTok", platformColor: "#69C9D0", platformIcon: "♪", label: "Viral Push", metric: "Engagement", value: "12.4%", impressions: "3.4M", score: 95, tags: ["Video", "Brand"], bars: [50, 60, 90, 75, 95, 80, 98] },
  { platform: "LinkedIn", platformColor: "#0a66c2", platformIcon: "in", label: "B2B Outreach", metric: "Lead Rate", value: "6.1%", impressions: "420K", score: 98, tags: ["B2B", "Decision Makers"], bars: [70, 65, 75, 80, 72, 88, 85] },
  { platform: "X", platformColor: "#aaa", platformIcon: "𝕏", label: "Trend Hijack", metric: "Replies", value: "3.2K", impressions: "1.8M", score: 93, tags: ["Viral", "Organic"], bars: [45, 55, 70, 60, 75, 65, 80] },
  { platform: "YouTube", platformColor: "#ff0000", platformIcon: "▶", label: "Pre-Roll Ads", metric: "View Rate", value: "34.6%", impressions: "5.2M", score: 96, tags: ["Video", "Awareness"], bars: [55, 65, 72, 80, 78, 88, 92] },
];

function MiniBar({ bars, color }: { bars: number[]; color: string }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: "3px", height: "32px" }}>
      {bars.map((h, i) => (
        <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: "2px 2px 0 0", background: i === bars.length - 1 ? color : `${color}55` }} />
      ))}
    </div>
  );
}

function ResultCard({ result }: { result: typeof results[0] }) {
  return (
    <div style={{ flex: "0 0 200px", background: "#111", borderRadius: "16px", border: "1.5px solid #2a2a2a", padding: "16px", display: "flex", flexDirection: "column", gap: "12px", position: "relative", scrollSnapAlign: "start" }}>
      <div style={{ position: "absolute", top: "-14px", left: "16px", width: "28px", height: "28px", borderRadius: "50%", background: "#222", border: "2px solid #111", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, color: result.platformColor }}>
        {result.platformIcon}
      </div>
      <div style={{ marginTop: "8px" }}>
        <div style={{ fontSize: "12px", fontWeight: 600, color: "#fff", marginBottom: "4px" }}>{result.label}</div>
        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
          {result.tags.map((t) => (
            <span key={t} style={{ fontSize: "9px", padding: "2px 6px", borderRadius: "4px", background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.7)", border: "1px solid #2a2a2a" }}>{t}</span>
          ))}
        </div>
      </div>
      <MiniBar bars={result.bars} color={result.platformColor} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.7)", marginBottom: "2px" }}>{result.metric}</div>
          <div style={{ fontSize: "18px", fontWeight: 700, color: "#fff", letterSpacing: "-0.5px" }}>{result.value}</div>
          <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.65)" }}>{result.impressions} impressions</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", background: "#0a0a0a", border: "1.5px solid #2a2a2a", borderRadius: "8px", padding: "6px 10px" }}>
          <span style={{ fontSize: "8px", color: "rgba(255,255,255,0.7)", letterSpacing: "0.05em" }}>SCORE</span>
          <span style={{ fontSize: "18px", fontWeight: 900, color: "#c8f135", letterSpacing: "-0.5px", lineHeight: 1 }}>{result.score}</span>
        </div>
      </div>
    </div>
  );
}

export default function CampaignDemo() {
  const [isMobile, setIsMobile] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const router = useRouter();

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 769);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleLaunch = () => {
    const dest = inputVal.trim()
      ? `/contact?goal=${encodeURIComponent(inputVal.trim())}`
      : "/contact";
    router.push(dest);
  };

  return (
    <section style={{ backgroundColor: "#0a0a0a", padding: isMobile ? "60px 0 72px" : "100px 0 120px", overflow: "hidden", position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "48px 48px", pointerEvents: "none" }} />

      <div style={{ textAlign: "center", marginBottom: isMobile ? "32px" : "60px", padding: "0 24px", position: "relative" }}>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "11px", letterSpacing: "4px", textTransform: "uppercase", marginBottom: "12px", fontWeight: 700 }}>SEE IT IN ACTION</p>
        <h2 style={{ color: "#ffffff", fontSize: isMobile ? "clamp(24px, 7vw, 34px)" : "clamp(32px, 4vw, 42px)", fontWeight: 900, letterSpacing: "-1.5px", lineHeight: 1.05, margin: "0 auto" }}>
          Your goal in. Results out.
        </h2>
      </div>

      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "0 20px", position: "relative" }}>
        <div style={{ background: "#111", border: "1.5px solid #2a2a2a", borderRadius: "20px", padding: isMobile ? "16px" : "20px 24px", marginBottom: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div style={{ display: "flex", gap: "6px" }}>
              {["#ff5f57", "#febc2e", "#28c840"].map((c) => <div key={c} style={{ width: "10px", height: "10px", borderRadius: "50%", background: c }} />)}
            </div>
            <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.65)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Campaign Brief</span>
            <span style={{ fontSize: "10px", padding: "3px 8px", borderRadius: "6px", background: "rgba(200,241,53,0.1)", color: "#c8f135", border: "1px solid rgba(200,241,53,0.2)" }}>AI Ready</span>
          </div>
          <div style={{ background: "#0a0a0a", borderRadius: "12px", padding: "14px 16px", border: "1.5px solid #1e1e1e", marginBottom: "12px", overflowX: "auto" }}>
            <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.65)", marginBottom: "8px", letterSpacing: "0.08em" }}>GOAL</div>
            <div style={{ fontFamily: "monospace", fontSize: isMobile ? "11px" : "13px", lineHeight: 1.7, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
              <span style={{ color: "#666" }}>// campaign goal</span>{"\n"}
              <span style={{ color: "#c8f135" }}>const</span>
              <span style={{ color: "#fff" }}> goal</span>
              <span style={{ color: "#666" }}> = </span>
              <span style={{ color: "#ce9178" }}>"Drive 50 premium real estate inquiries for luxury apartments in Bangalore"</span>
              <span style={{ color: "#666" }}>;</span>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
            {[{ label: "Budget", val: "$1,200" }, { label: "Duration", val: "30 days" }, { label: "Platforms", val: "All 5" }].map((m) => (
              <div key={m.label} style={{ background: "#0a0a0a", border: "1.5px solid #1e1e1e", borderRadius: "8px", padding: isMobile ? "8px 10px" : "10px 12px" }}>
                <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.65)", marginBottom: "4px" }}>{m.label}</div>
                <div style={{ fontSize: isMobile ? "12px" : "14px", fontWeight: 700, color: "#fff" }}>{m.val}</div>
              </div>
            ))}
          </div>
        </div>

        {isMobile ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#111", border: "1.5px solid #2a2a2a", borderRadius: "100px", padding: "10px 16px" }}>
              <span style={{ fontSize: "16px", opacity: 0.5 }}>⚡</span>
              <input value={inputVal} onChange={(e) => setInputVal(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLaunch()}
                placeholder="Enter your campaign goal..."
                style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#fff", fontSize: "14px", fontFamily: "inherit" }} />
            </div>
            <button onClick={handleLaunch} style={{ background: "#fff", color: "#000", fontSize: "13px", fontWeight: 700, padding: "12px", borderRadius: "100px", border: "none", cursor: "pointer", width: "100%" }}>
              Launch Campaign →
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#111", border: "1.5px solid #2a2a2a", borderRadius: "100px", padding: "8px 8px 8px 20px", marginBottom: "24px" }}>
            <span style={{ fontSize: "16px", opacity: 0.5 }}>⚡</span>
            <input value={inputVal} onChange={(e) => setInputVal(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLaunch()}
              placeholder="Enter your campaign goal..."
              style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#fff", fontSize: "14px", fontFamily: "inherit" }} />
            <button onClick={handleLaunch}
              style={{ background: "#fff", color: "#000", fontSize: "13px", fontWeight: 700, padding: "10px 22px", borderRadius: "100px", border: "none", cursor: "pointer", whiteSpace: "nowrap" }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Launch Campaign →
            </button>
          </div>
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <div className="demo-scroll" style={{ display: "flex", gap: "14px", padding: isMobile ? "16px 20px 8px" : "16px 48px 8px", overflowX: "auto", scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch", scrollbarWidth: "none", msOverflowStyle: "none", maxWidth: "100%" }}>
          {results.map((r) => <ResultCard key={r.platform} result={r} />)}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: isMobile ? "8px" : "12px", marginTop: "32px", padding: "0 24px", flexWrap: "wrap" }}>
        {platforms.map((p) => (
          <div key={p.name} style={{ width: isMobile ? "32px" : "36px", height: isMobile ? "32px" : "36px", borderRadius: "50%", background: "#111", border: "1.5px solid #2a2a2a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, color: p.color }}>
            {p.icon}
          </div>
        ))}
        <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.65)", marginLeft: "4px" }}>& more platforms</span>
      </div>

      <style>{".demo-scroll::-webkit-scrollbar { display: none; }"}</style>
    </section>
  );
}