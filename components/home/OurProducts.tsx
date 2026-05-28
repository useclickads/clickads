"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function OurProducts() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <section style={{ width:"100%", padding: isMobile ? "60px 20px" : "90px 60px", boxSizing:"border-box", background:"#0d0d18", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize:"48px 48px", pointerEvents:"none" }} />

      <div style={{ textAlign:"center", marginBottom: isMobile ? "36px" : "56px", position:"relative" }}>
        <p style={{ fontSize:"11px", fontWeight:700, letterSpacing:"0.22em", textTransform:"uppercase", color:"#7c6fff", marginBottom:"10px" }}>Built for Your Industry</p>
        <h2 style={{ fontSize: isMobile ? "28px" : "42px", fontWeight:700, color:"#ffffff", margin:0, lineHeight:1.15 }}>Our Products</h2>
        <p style={{ marginTop:"12px", fontSize:"15px", color:"rgba(255,255,255,0.5)", maxWidth:"460px", margin:"12px auto 0", lineHeight:1.6 }}>Purpose-built CRMs for industries that move fast.</p>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:"20px", maxWidth:"1080px", margin:"0 auto", position:"relative" }}>
        <ProductCard isMobile={isMobile} emoji="✈️" accentColor="#4f8cff" accentGlow="rgba(79,140,255,0.2)"
          name="Lidflow" tagline="Manage leads, bookings & clients — all in one place"
          target="Travel agencies · Tour operators · Consultants"
          ctaText="Explore Lidflow →" ctaHref="/products#lidflow"
          mockup={<LidflowMockup />} reverse={false}
          features={[
            { icon:"👤", label:"Lead tracking & follow-ups" },
            { icon:"📅", label:"AI-powered itinerary builder" },
            { icon:"💬", label:"Client communication history" },
            { icon:"📊", label:"Pipeline & deal tracking" },
            { icon:"📈", label:"Reporting & analytics" },
          ]} />

        <ProductCard isMobile={isMobile} emoji="🏋️" accentColor="#22d68a" accentGlow="rgba(34,214,138,0.2)"
          name="GrwFit" tagline="Grow your gym, retain members, track performance"
          target="Gym owners · Fitness studios · Personal trainers"
          ctaText="Explore GrwFit →" ctaHref="/products#grwfit"
          mockup={<GrwFitMockup />} reverse={true}
          features={[
            { icon:"🏅", label:"Member management & attendance" },
            { icon:"💳", label:"Subscription & payment tracking" },
            { icon:"🤝", label:"Trainer assignment" },
            { icon:"🔄", label:"Lead to member conversion" },
            { icon:"🔔", label:"Retention & churn alerts" },
          ]} />
      </div>
    </section>
  );
}

function ProductCard({ isMobile, emoji, accentColor, accentGlow, name, tagline, target, features, ctaText, ctaHref, mockup, reverse }: {
  isMobile: boolean; emoji: string; accentColor: string; accentGlow: string;
  name: string; tagline: string; target: string;
  features: { icon: string; label: string }[];
  ctaText: string; ctaHref: string;
  mockup: React.ReactNode; reverse: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ background:"rgba(255,255,255,0.05)", border:`1px solid ${hovered ? accentColor + "66" : "rgba(255,255,255,0.1)"}`, borderRadius:"22px", padding: isMobile ? "24px 18px" : "32px 36px", display:"flex", flexDirection: isMobile ? "column" : reverse ? "row-reverse" : "row", gap: isMobile ? "24px" : "40px", alignItems:"center", transition:"border-color 0.3s ease, box-shadow 0.3s ease", boxShadow: hovered ? `0 0 60px ${accentGlow}` : "none", cursor:"default" }}>

      <div style={{ flex:"0 0 auto", width: isMobile ? "100%" : "420px", borderRadius:"14px", overflow:"hidden", border:`1px solid ${accentColor}22`, background:"#0f1020" }}>{mockup}</div>

      <div style={{ flex:1, display:"flex", flexDirection:"column", gap:"18px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
          <div style={{ width:"46px", height:"46px", borderRadius:"13px", background:accentGlow, border:`1px solid ${accentColor}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"24px", flexShrink:0 }}>{emoji}</div>
          <div>
            <h3 style={{ margin:0, fontSize:"24px", fontWeight:700, color:"#ffffff", letterSpacing:"-0.3px" }}>{name}</h3>
            <p style={{ margin:0, fontSize:"11px", color:"rgba(255,255,255,0.4)", letterSpacing:"0.04em" }}>{target}</p>
          </div>
        </div>

        <p style={{ margin:0, fontSize:"15px", color:"rgba(255,255,255,0.75)", lineHeight:1.55 }}>{tagline}</p>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px 16px" }}>
          {features.map((f) => (
            <div key={f.label} style={{ display:"flex", alignItems:"center", gap:"8px" }}>
              <span style={{ width:"22px", height:"22px", borderRadius:"6px", background:accentColor + "22", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"12px", flexShrink:0 }}>{f.icon}</span>
              <span style={{ fontSize:"13px", color:"rgba(255,255,255,0.72)" }}>{f.label}</span>
            </div>
          ))}
        </div>

        <Link href={ctaHref}
          style={{ display:"inline-flex", alignItems:"center", gap:"6px", padding:"11px 22px", borderRadius:"10px", background:accentColor, color: accentColor === "#22d68a" ? "#051a0e" : "#fff", fontWeight:700, fontSize:"13px", textDecoration:"none", alignSelf:"flex-start", letterSpacing:"0.02em", transition:"opacity 0.2s, transform 0.2s" }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity="0.88"; e.currentTarget.style.transform="translateY(-1px)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity="1"; e.currentTarget.style.transform="translateY(0)"; }}>
          {ctaText}
        </Link>
      </div>
    </div>
  );
}

function LidflowMockup() {
  return (
    <div style={{ padding:"16px 18px", fontFamily:"monospace" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"14px" }}>
        <span style={{ fontSize:"11px", fontWeight:700, color:"#4f8cff", letterSpacing:"0.12em" }}>LIDFLOW</span>
        <div style={{ display:"flex", gap:"5px" }}>
          {["Pipeline","Bookings","Clients"].map((t) => (
            <span key={t} style={{ fontSize:"9px", padding:"2px 7px", borderRadius:"4px", background: t==="Pipeline" ? "rgba(79,140,255,0.25)" : "rgba(255,255,255,0.06)", color: t==="Pipeline" ? "#7ab0ff" : "rgba(255,255,255,0.3)" }}>{t}</span>
          ))}
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"7px", marginBottom:"14px" }}>
        {[{label:"New Leads",val:"48",color:"#6aaaff"},{label:"Bookings",val:"21",color:"#b89eff"},{label:"Revenue",val:"₹2.4L",color:"#4eeaaa"}].map((s) => (
          <div key={s.label} style={{ background:"rgba(255,255,255,0.06)", borderRadius:"8px", padding:"9px 10px 7px", border:"1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ fontSize:"17px", fontWeight:700, color:s.color }}>{s.val}</div>
            <div style={{ fontSize:"8px", color:"rgba(255,255,255,0.4)", marginTop:"2px" }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ fontSize:"8px", color:"rgba(255,255,255,0.35)", marginBottom:"7px", letterSpacing:"0.08em" }}>LEAD PIPELINE</div>
      {[{stage:"New Inquiry",count:12,pct:100,color:"#6aaaff"},{stage:"Proposal Sent",count:8,pct:67,color:"#b89eff"},{stage:"Itinerary Ready",count:5,pct:42,color:"#fbbf5a"},{stage:"Booking Confirmed",count:3,pct:25,color:"#4eeaaa"}].map((p) => (
        <div key={p.stage} style={{ marginBottom:"6px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"3px" }}>
            <span style={{ fontSize:"9px", color:"rgba(255,255,255,0.6)" }}>{p.stage}</span>
            <span style={{ fontSize:"9px", color:p.color, fontWeight:700 }}>{p.count}</span>
          </div>
          <div style={{ height:"4px", borderRadius:"2px", background:"rgba(255,255,255,0.08)" }}>
            <div style={{ height:"100%", width:`${p.pct}%`, borderRadius:"2px", background:p.color }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function GrwFitMockup() {
  return (
    <div style={{ padding:"16px 18px", fontFamily:"monospace" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"14px" }}>
        <span style={{ fontSize:"11px", fontWeight:700, color:"#22d68a", letterSpacing:"0.12em" }}>GRWFIT</span>
        <div style={{ display:"flex", gap:"5px" }}>
          {["Members","Payments","Trainers"].map((t) => (
            <span key={t} style={{ fontSize:"9px", padding:"2px 7px", borderRadius:"4px", background: t==="Members" ? "rgba(34,214,138,0.2)" : "rgba(255,255,255,0.06)", color: t==="Members" ? "#4eeaaa" : "rgba(255,255,255,0.3)" }}>{t}</span>
          ))}
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"7px", marginBottom:"14px" }}>
        {[{label:"Active Members",val:"312",color:"#4eeaaa"},{label:"Due Renewals",val:"27",color:"#fbbf5a"},{label:"Revenue",val:"₹1.8L",color:"#b89eff"}].map((s) => (
          <div key={s.label} style={{ background:"rgba(255,255,255,0.06)", borderRadius:"8px", padding:"9px 10px 7px", border:"1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ fontSize:"17px", fontWeight:700, color:s.color }}>{s.val}</div>
            <div style={{ fontSize:"8px", color:"rgba(255,255,255,0.4)", marginTop:"2px" }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ fontSize:"8px", color:"rgba(255,255,255,0.35)", marginBottom:"7px", letterSpacing:"0.08em" }}>WEEKLY ATTENDANCE</div>
      <div style={{ display:"flex", alignItems:"flex-end", gap:"5px", height:"48px", marginBottom:"14px" }}>
        {[{day:"M",h:72},{day:"T",h:85},{day:"W",h:60},{day:"T",h:90},{day:"F",h:78},{day:"S",h:100},{day:"S",h:45}].map((b,i) => (
          <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:"3px" }}>
            <div style={{ width:"100%", height:`${b.h}%`, borderRadius:"3px 3px 0 0", background: b.h===100 ? "#22d68a" : "rgba(34,214,138,0.28)" }} />
            <span style={{ fontSize:"7px", color:"rgba(255,255,255,0.3)" }}>{b.day}</span>
          </div>
        ))}
      </div>
      <div style={{ fontSize:"8px", color:"rgba(255,255,255,0.35)", marginBottom:"7px", letterSpacing:"0.08em" }}>CHURN RISK ALERTS</div>
      {[{name:"Vikram T.",days:"12d absent",risk:"High",riskColor:"#ff7a7a"},{name:"Sneha R.",days:"5d absent",risk:"Med",riskColor:"#fbbf5a"},{name:"Arjun P.",days:"1d absent",risk:"Low",riskColor:"#4eeaaa"}].map((m) => (
        <div key={m.name} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"6px 0", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
            <div style={{ width:"22px", height:"22px", borderRadius:"50%", background:"rgba(34,214,138,0.15)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"9px", color:"#4eeaaa", fontWeight:700 }}>{m.name[0]}</div>
            <div>
              <div style={{ fontSize:"10px", color:"rgba(255,255,255,0.85)", fontWeight:600 }}>{m.name}</div>
              <div style={{ fontSize:"8px", color:"rgba(255,255,255,0.38)" }}>{m.days}</div>
            </div>
          </div>
          <span style={{ fontSize:"8px", padding:"2px 7px", borderRadius:"4px", background:m.riskColor+"22", color:m.riskColor, fontWeight:700 }}>{m.risk}</span>
        </div>
      ))}
    </div>
  );
}