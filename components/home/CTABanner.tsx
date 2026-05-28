"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CTABanner() {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (!mounted) return null;

  const handleGetStarted = () => {
    const dest = email.trim()
      ? `/contact?email=${encodeURIComponent(email.trim())}`
      : "/contact";
    router.push(dest);
  };

  const stats = [
    { value: "2,400+", label: "Campaigns launched", icon: "🚀" },
    { value: "98%",    label: "Client retention",   icon: "♾️" },
    { value: "40+",    label: "Countries reached",  icon: "🌍" },
    { value: "12M+",   label: "Impressions served", icon: "📈" },
  ];

  const EmailIcon = () => (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" style={{ flexShrink: 0 }}>
      <path d="M1.5 3.5h12v8a1 1 0 0 1-1 1h-10a1 1 0 0 1-1-1v-8Z" stroke="rgba(255,255,255,0.25)" strokeWidth="1.1" />
      <path d="M1.5 3.5l6 5 6-5" stroke="rgba(255,255,255,0.25)" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );

  const btnStyle: React.CSSProperties = {
    background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
    color: "#fff", border: "none", borderRadius: "100px",
    fontSize: "13px", fontWeight: 600, letterSpacing: "-0.2px",
    cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0,
    boxShadow: "0 2px 20px rgba(124,58,237,0.5)",
    transition: "opacity 0.2s, transform 0.15s",
  };

  return (
    <section style={{ background: "#080808", padding: isMobile ? "40px 16px 60px" : "60px 24px 80px", fontFamily: "Inter, sans-serif" }}>
      <div style={{
        maxWidth: "1100px", margin: "0 auto",
        borderRadius: isMobile ? "20px" : "28px",
        position: "relative", overflow: "hidden",
        background: "#0d0b14",
        border: "0.5px solid rgba(255,255,255,0.07)",
        boxShadow: "0 0 0 1px rgba(124,58,237,0.08), inset 0 1px 0 rgba(255,255,255,0.05)",
      }}>
        {/* Blobs */}
        <div style={{ position:"absolute", inset:0, pointerEvents:"none", zIndex:0 }}>
          <div style={{ position:"absolute", top:"-80px", left:"-100px", width: isMobile?"320px":"540px", height: isMobile?"280px":"440px", background:"radial-gradient(ellipse, rgba(109,40,217,0.55) 0%, transparent 68%)", filter:"blur(72px)" }} />
          <div style={{ position:"absolute", bottom:"-100px", right:"-80px", width: isMobile?"280px":"500px", height: isMobile?"260px":"420px", background:"radial-gradient(ellipse, rgba(167,139,250,0.35) 0%, transparent 68%)", filter:"blur(72px)" }} />
          <div style={{ position:"absolute", top:"35%", left:"38%", width:"380px", height:"280px", background:"radial-gradient(ellipse, rgba(192,38,211,0.12) 0%, transparent 70%)", filter:"blur(55px)" }} />
        </div>

        {/* Noise */}
        <div style={{ position:"absolute", inset:0, zIndex:1, pointerEvents:"none", backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E")`, backgroundRepeat:"repeat", backgroundSize:"180px 180px", opacity:0.7 }} />

        {/* Top glowing border */}
        <div style={{ position:"absolute", top:0, left:"10%", right:"10%", height:"1px", background:"linear-gradient(to right, transparent, rgba(139,92,246,0.6) 40%, rgba(192,132,252,0.6) 60%, transparent)", zIndex:2 }} />

        {/* Main content */}
        <div style={{ position:"relative", zIndex:3, padding: isMobile ? "40px 20px 0" : "64px 48px 0" }}>

          {/* Eyebrow */}
          <div style={{ display:"flex", justifyContent:"center", marginBottom:"24px" }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:"8px", background:"rgba(139,92,246,0.12)", border:"0.5px solid rgba(139,92,246,0.35)", borderRadius:"100px", padding:"5px 14px" }}>
              <span style={{ width:"5px", height:"5px", borderRadius:"50%", background:"#a78bfa", boxShadow:"0 0 8px rgba(167,139,250,0.95)", display:"inline-block" }} />
              <span style={{ fontSize: isMobile?"10px":"11px", fontWeight:500, letterSpacing: isMobile?"1.5px":"2px", textTransform:"uppercase", color:"#c4b5fd" }}>
                No contracts · Cancel anytime
              </span>
            </div>
          </div>

          {/* Headline */}
          <h2 style={{ fontSize: isMobile?"32px":"clamp(32px, 5vw, 58px)", fontWeight:700, letterSpacing: isMobile?"-0.8px":"-1.5px", color:"#fff", margin:"0 0 16px", textAlign:"center", lineHeight:1.15 }}>
            Ready to grow your brand?
          </h2>

          {/* Subtext */}
          <p style={{ fontSize: isMobile?"14px":"15px", fontWeight:300, lineHeight:1.7, color:"rgba(255,255,255,0.45)", margin:"0 auto 40px", maxWidth:"440px", textAlign:"center", padding: isMobile?"0 4px":"0" }}>
            Join thousands of businesses running smarter campaigns with ClickAds. Launch in minutes, scale without limits.
          </p>

          {/* Input pill */}
          <div style={{ display:"flex", justifyContent:"center", marginBottom:"16px", padding: isMobile?"0 4px":"0" }}>
            {isMobile ? (
              <div style={{ display:"flex", flexDirection:"column", gap:"10px", width:"100%", maxWidth:"460px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:"8px", background:"rgba(255,255,255,0.05)", border:"0.5px solid rgba(255,255,255,0.09)", borderRadius:"100px", padding:"13px 20px", width:"100%", boxSizing:"border-box" }}>
                  <EmailIcon />
                  <input type="email" placeholder="Enter your work email" value={email} onChange={e => setEmail(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleGetStarted()}
                    style={{ flex:1, background:"transparent", border:"none", outline:"none", fontSize:"14px", color:"#fff", fontFamily:"Inter, sans-serif", fontWeight:300, minWidth:0 }} />
                </div>
                <button onClick={handleGetStarted} style={{ ...btnStyle, padding:"15px 24px", fontSize:"14px", width:"100%" }}>
                  Get Started
                </button>
              </div>
            ) : (
              <div style={{ display:"inline-flex", alignItems:"center", background:"rgba(255,255,255,0.05)", border:"0.5px solid rgba(255,255,255,0.09)", borderRadius:"100px", padding:"5px 5px 5px 20px", gap:"8px", backdropFilter:"blur(16px)", width:"100%", maxWidth:"460px" }}>
                <EmailIcon />
                <input type="email" placeholder="Enter your work email" value={email} onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleGetStarted()}
                  style={{ flex:1, background:"transparent", border:"none", outline:"none", fontSize:"13.5px", color:"#fff", fontFamily:"Inter, sans-serif", fontWeight:300, minWidth:0 }} />
                <button onClick={handleGetStarted}
                  style={{ ...btnStyle, padding:"11px 24px" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity="0.88"; (e.currentTarget as HTMLButtonElement).style.transform="scale(0.97)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity="1"; (e.currentTarget as HTMLButtonElement).style.transform="scale(1)"; }}
                >
                  Get Started
                </button>
              </div>
            )}
          </div>

          {/* Book a demo */}
          <div style={{ textAlign:"center", marginBottom: isMobile?"36px":"52px" }}>
            <a href="/contact" style={{ fontSize:"12.5px", color:"rgba(255,255,255,0.3)", textDecoration:"none", display:"inline-flex", alignItems:"center", gap:"5px", transition:"color 0.2s" }}
              onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color="rgba(255,255,255,0.65)"}
              onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color="rgba(255,255,255,0.3)"}
            >
              Or book a demo
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <path d="M2 5.5h7M6 2.5l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>

          {/* Stat cards */}
          <div style={{ display:"grid", gridTemplateColumns: isMobile?"repeat(2, 1fr)":"repeat(4, 1fr)", gap: isMobile?"10px":"12px", paddingBottom: isMobile?"32px":"48px" }}>
            {stats.map((stat, i) => (
              <div key={i} style={{ background:"rgba(139,92,246,0.07)", backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)", border:"0.5px solid rgba(167,139,250,0.22)", borderRadius:"16px", padding: isMobile?"20px 14px 16px":"24px 20px 20px", textAlign:"center", position:"relative", overflow:"hidden", boxShadow:"inset 0 1px 0 rgba(255,255,255,0.07)", transition:"border-color 0.25s, box-shadow 0.25s, transform 0.2s", cursor:"default" }}
                onMouseEnter={e => { const el=e.currentTarget as HTMLDivElement; el.style.borderColor="rgba(167,139,250,0.5)"; el.style.boxShadow="0 0 28px rgba(124,58,237,0.22), inset 0 1px 0 rgba(255,255,255,0.09)"; el.style.transform="translateY(-2px)"; }}
                onMouseLeave={e => { const el=e.currentTarget as HTMLDivElement; el.style.borderColor="rgba(167,139,250,0.22)"; el.style.boxShadow="inset 0 1px 0 rgba(255,255,255,0.07)"; el.style.transform="translateY(0)"; }}
              >
                <div style={{ position:"absolute", top:0, left:"20%", right:"20%", height:"1px", background:"linear-gradient(to right, transparent, rgba(167,139,250,0.45), transparent)" }} />
                <div style={{ fontSize: isMobile?"18px":"22px", marginBottom:"10px", lineHeight:1 }}>{stat.icon}</div>
                <div style={{ fontSize: isMobile?"22px":"30px", fontWeight:700, letterSpacing:"-1px", color:"#c4b5fd", marginBottom:"6px", lineHeight:1 }}>{stat.value}</div>
                <div style={{ fontSize: isMobile?"10px":"11px", fontWeight:400, color:"rgba(255,255,255,0.35)", letterSpacing:"0.3px", textTransform:"uppercase" }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}