"use client";
import { useEffect, useRef, useState } from "react";
import "@/styles/services/ServicesSection.css";

const ACCENTS = [
  { color:"#639922", bg:"rgba(99,153,34,0.1)",   border:"rgba(99,153,34,0.22)"   },
  { color:"#7F77DD", bg:"rgba(127,119,221,0.1)", border:"rgba(127,119,221,0.22)" },
  { color:"#1D9E75", bg:"rgba(29,158,117,0.1)",  border:"rgba(29,158,117,0.22)"  },
  { color:"#EF9F27", bg:"rgba(239,159,39,0.1)",  border:"rgba(239,159,39,0.22)"  },
  { color:"#378ADD", bg:"rgba(55,138,221,0.1)",  border:"rgba(55,138,221,0.22)"  },
  { color:"#D85A30", bg:"rgba(216,90,48,0.1)",   border:"rgba(216,90,48,0.22)"   },
  { color:"#534AB7", bg:"rgba(83,74,183,0.1)",   border:"rgba(83,74,183,0.22)"   },
  { color:"#D4537E", bg:"rgba(212,83,126,0.1)",  border:"rgba(212,83,126,0.22)"  },
];

type Accent = typeof ACCENTS[0];

/* ── Process Cards ─────────────────────────────────────────────────────── */

function AIMarketingProcess({ a }: { a: Accent }) {
  return (
    <div className="ss-process-card" style={{ border:`1px solid ${a.border}` }}>
      <div className="ss-process-dot" style={{ background: a.color }} />
      <span className="ss-process-num">01</span>
      <p className="ss-section-label">Audience signals</p>
      <div className="ss-signal-grid">
        {(["ti-click","ti-eye","ti-shopping-cart"] as const).map((icon, i) => (
          <div key={i} className="ss-signal-item">
            <i className={`ti ${icon}`} style={{ fontSize:16, color: a.color }} aria-hidden="true" />
            <p className="ss-signal-label">{["Clicks","Views","Buys"][i]}</p>
          </div>
        ))}
      </div>
      <div style={{ display:"flex", justifyContent:"center", margin:"6px 0 8px" }}>
        <svg width="70" height="26" viewBox="0 0 70 26" fill="none">
          {[12,35,58].map((cx,i) => (
            <g key={cx}>
              <line x1={cx} y1="0" x2={cx} y2="26" stroke={a.color} strokeOpacity="0.2" strokeWidth="1" strokeDasharray="3 3"/>
              <circle cx={cx} cy="0" r="3" fill={a.color}>
                <animate attributeName="cy" values="0;26;26" dur="1.8s" begin={`${i*0.3}s`} repeatCount="indefinite" keyTimes="0;0.6;1"/>
                <animate attributeName="opacity" values="0;1;0" dur="1.8s" begin={`${i*0.3}s`} repeatCount="indefinite" keyTimes="0;0.5;1"/>
              </circle>
            </g>
          ))}
          <line x1="12" y1="26" x2="35" y2="26" stroke={a.color} strokeOpacity="0.2" strokeWidth="1"/>
          <line x1="58" y1="26" x2="35" y2="26" stroke={a.color} strokeOpacity="0.2" strokeWidth="1"/>
        </svg>
      </div>
      <div className="ss-ai-node" style={{ background: a.bg, border:`1px solid ${a.border}` }}>
        <i className="ti ti-cpu" style={{ fontSize:18, color: a.color, display:"block", marginBottom:3 }} aria-hidden="true" />
        <p className="ss-ai-node-title" style={{ color: a.color }}>AI Engine</p>
        <p className="ss-ai-node-sub" style={{ color:`${a.color}99` }}>learning & optimising</p>
      </div>
      <div style={{ display:"flex", justifyContent:"center", margin:"6px 0 10px" }}>
        <svg width="70" height="20" viewBox="0 0 70 20" fill="none">
          {[12,35,58].map((cx,i) => (
            <g key={cx}>
              <line x1={cx} y1="0" x2={cx} y2="20" stroke={a.color} strokeOpacity="0.2" strokeWidth="1" strokeDasharray="3 3"/>
              <circle cx={cx} cy="0" r="3" fill={a.color}>
                <animate attributeName="cy" values="0;20" dur="1.4s" begin={`${i*0.2}s`} repeatCount="indefinite"/>
                <animate attributeName="opacity" values="1;0" dur="1.4s" begin={`${i*0.2}s`} repeatCount="indefinite"/>
              </circle>
            </g>
          ))}
        </svg>
      </div>
      <p className="ss-section-label">Budget distribution</p>
      {(["Google","Meta","Email"] as const).map((name, i) => (
        <div key={name} className="ss-bar-row">
          <div className="ss-bar-header">
            <span className="ss-bar-name">{name}</span>
            <span className="ss-bar-val" style={{ color: a.color, animation:`ss-tick 2s ease-in-out infinite ${i*0.4}s` }}>
              {["↑ 45%","↓ 30%","→ 25%"][i]}
            </span>
          </div>
          <div className="ss-bar-track">
            <div className="ss-bar-fill" style={{ background: a.color, opacity: 1 - i*0.28, animation:`ss-bar${i+1} 3s ease-in-out infinite` }}/>
          </div>
        </div>
      ))}
    </div>
  );
}

function SaasDevProcess({ a }: { a: Accent }) {
  const layers = [
    {label:"Frontend",     icon:"ti-layout",       anim:"ss-blk1"},
    {label:"API Layer",    icon:"ti-api",           anim:"ss-blk2"},
    {label:"Database",     icon:"ti-database",      anim:"ss-blk3"},
    {label:"Infrastructure",icon:"ti-cloud",        anim:"ss-blk4"},
  ];
  return (
    <div className="ss-process-card" style={{ border:`1px solid ${a.border}` }}>
      <div className="ss-process-dot" style={{ background: a.color }} />
      <span className="ss-process-num">02</span>
      <p className="ss-section-label">Architecture stack</p>
      <div style={{ display:"flex", flexDirection:"column", gap:7, marginBottom:14 }}>
        {layers.map((l,i) => (
          <div key={l.label} style={{ background: i===3?a.bg:"rgba(255,255,255,0.04)", border:`1px solid ${i===3?a.border:"rgba(255,255,255,0.07)"}`, borderRadius:10, padding:"9px 12px", display:"flex", alignItems:"center", gap:10, animation:`${l.anim} 2.4s ease-in-out infinite` }}>
            <i className={`ti ${l.icon}`} style={{ fontSize:15, color: i===3?a.color:"rgba(255,255,255,0.45)" }} aria-hidden="true"/>
            <span style={{ fontSize:11, color: i===3?a.color:"rgba(255,255,255,0.55)", fontWeight:600 }}>{l.label}</span>
            {i===3 && <span style={{ fontSize:9, color:`${a.color}99`, marginLeft:"auto", letterSpacing:1 }}>LIVE</span>}
          </div>
        ))}
      </div>
      <p className="ss-section-label">Ship metrics</p>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
        {[["ti-rocket","Deploy","< 2 weeks"],["ti-test-pipe","Test","99% coverage"],["ti-shield-check","Security","SOC2 ready"],["ti-trending-up","Uptime","99.9% SLA"]].map(([icon,label,val]) => (
          <div key={label} style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:9, padding:"8px 10px" }}>
            <i className={`ti ${icon}`} style={{ fontSize:13, color: a.color }} aria-hidden="true"/>
            <p style={{ fontSize:9, color:"rgba(255,255,255,0.3)", margin:"3px 0 1px", textTransform:"uppercase", letterSpacing:1.5 }}>{label}</p>
            <p style={{ fontSize:11, color:"rgba(255,255,255,0.65)", margin:0, fontWeight:600 }}>{val}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function WebDevProcess({ a }: { a: Accent }) {
  return (
    <div className="ss-process-card" style={{ border:`1px solid ${a.border}` }}>
      <div className="ss-process-dot" style={{ background: a.color }} />
      <span className="ss-process-num">03</span>
      <p className="ss-section-label">Lighthouse score</p>
      <div style={{ display:"flex", justifyContent:"center", marginBottom:12 }}>
        <svg width="130" height="75" viewBox="0 0 130 75">
          <path d="M10 70 A55 55 0 0 1 120 70" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="10" strokeLinecap="round"/>
          <path d="M10 70 A55 55 0 0 1 120 70" fill="none" stroke={a.color} strokeWidth="10" strokeLinecap="round" strokeDasharray="173" style={{ animation:"ss-meter 2.5s ease forwards" }}/>
          <text x="65" y="65" textAnchor="middle" fill="#fff" fontSize="24" fontWeight="900">97</text>
        </svg>
      </div>
      <p className="ss-section-label">Core Web Vitals</p>
      <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:12 }}>
        {[["LCP","1.2s","52%"],["FID","8ms","8%"],["CLS","0.02","20%"]].map(([label,val,pct]) => (
          <div key={label} style={{ display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ fontSize:10, color:"rgba(255,255,255,0.35)", width:28, flexShrink:0 }}>{label}</span>
            <div style={{ flex:1, background:"rgba(255,255,255,0.06)", borderRadius:4, height:5, overflow:"hidden" }}>
              <div style={{ height:"100%", background:a.color, borderRadius:4, width:pct }}/>
            </div>
            <span style={{ fontSize:10, color: a.color, fontWeight:700, width:38, textAlign:"right", flexShrink:0 }}>{val}</span>
          </div>
        ))}
      </div>
      <p className="ss-section-label">Tech stack</p>
      <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
        {["Next.js","TypeScript","Tailwind","Framer","Sanity","Vercel"].map(t => (
          <span key={t} style={{ fontSize:10, color:"rgba(255,255,255,0.5)", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:100, padding:"3px 9px" }}>{t}</span>
        ))}
      </div>
    </div>
  );
}

function AIAutomationProcess({ a }: { a: Accent }) {
  const steps = [
    {icon:"ti-mail",label:"Email inbox"},{icon:"ti-cpu",label:"AI triage"},
    {icon:"ti-arrows-split-2",label:"Route"},{icon:"ti-check",label:"Resolved"},
  ];
  return (
    <div className="ss-process-card" style={{ border:`1px solid ${a.border}` }}>
      <div className="ss-process-dot" style={{ background: a.color }} />
      <span className="ss-process-num">04</span>
      <p className="ss-section-label">Automation pipeline</p>
      <div style={{ display:"flex", flexDirection:"column", gap:0, marginBottom:14 }}>
        {steps.map((s,i) => (
          <div key={s.label}>
            <div style={{ background: i===1?a.bg:"rgba(255,255,255,0.04)", border:`1px solid ${i===1?a.border:"rgba(255,255,255,0.07)"}`, borderRadius:10, padding:"9px 12px", display:"flex", alignItems:"center", gap:10, animation:`ss-step-on 3s ease-in-out infinite`, animationDelay:`${i*0.6}s` }}>
              <i className={`ti ${s.icon}`} style={{ fontSize:15, color: i===1?a.color:"rgba(255,255,255,0.45)" }} aria-hidden="true"/>
              <span style={{ fontSize:11, color: i===1?a.color:"rgba(255,255,255,0.55)", fontWeight:600 }}>{s.label}</span>
              {i===1 && <span style={{ fontSize:9, color:`${a.color}99`, marginLeft:"auto", letterSpacing:1 }}>AI</span>}
            </div>
            {i < steps.length-1 && (
              <div style={{ display:"flex", justifyContent:"center", height:14 }}>
                <svg width="12" height="14" viewBox="0 0 12 14">
                  <line x1="6" y1="0" x2="6" y2="14" stroke={a.color} strokeWidth="1.5" strokeOpacity="0.4" strokeDasharray="3 2">
                    <animate attributeName="stroke-dashoffset" values="10;0" dur="1s" repeatCount="indefinite"/>
                  </line>
                  <polygon points="6,14 3,9 9,9" fill={a.color} opacity="0.5"/>
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
      <p className="ss-section-label">Time saved per week</p>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
        {[["ti-mail","Email","14 hrs"],["ti-file-text","Docs","8 hrs"],["ti-chart-bar","Reports","6 hrs"],["ti-database","CRM","10 hrs"]].map(([icon,label,val]) => (
          <div key={label} style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:9, padding:"8px 10px" }}>
            <i className={`ti ${icon}`} style={{ fontSize:13, color: a.color }} aria-hidden="true"/>
            <p style={{ fontSize:9, color:"rgba(255,255,255,0.3)", margin:"3px 0 1px", textTransform:"uppercase", letterSpacing:1.5 }}>{label}</p>
            <p style={{ fontSize:12, color: a.color, margin:0, fontWeight:900 }}>{val}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function LeadGenProcess({ a }: { a: Accent }) {
  return (
    <div className="ss-process-card" style={{ border:`1px solid ${a.border}` }}>
      <div className="ss-process-dot" style={{ background: a.color }} />
      <span className="ss-process-num">05</span>
      <p className="ss-section-label">Lead funnel</p>
      <div style={{ marginBottom:14 }}>
        <svg width="100%" height="130" viewBox="0 0 200 130">
          <polygon points="10,10 190,10 150,50 50,50" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
          <text x="100" y="34" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="10">Universe — 10,000</text>
          <polygon points="50,55 150,55 130,90 70,90" fill={`${a.color}18`} stroke={a.border} strokeWidth="1"/>
          <text x="100" y="76" textAnchor="middle" fill={a.color} fontSize="10" fontWeight="700">Qualified — 420</text>
          <polygon points="70,95 130,95 115,125 85,125" fill={a.bg} stroke={a.border} strokeWidth="1.5"/>
          <text x="100" y="116" textAnchor="middle" fill={a.color} fontSize="10" fontWeight="900">Meetings — 38</text>
          {[40,100,160].map((cx,i) => (
            <circle key={cx} cx={cx} cy="10" r="3.5" fill={a.color}>
              <animate attributeName="cy" values="10;125;125" dur="2.2s" begin={`${i*0.4}s`} repeatCount="indefinite" keyTimes="0;0.85;1"/>
              <animate attributeName="opacity" values="0;1;0" dur="2.2s" begin={`${i*0.4}s`} repeatCount="indefinite" keyTimes="0;0.7;1"/>
            </circle>
          ))}
        </svg>
      </div>
      <p className="ss-section-label">Channels</p>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:5 }}>
        {[["ti-brand-linkedin","LinkedIn"],["ti-mail","Cold Email"],["ti-phone","Calls"],["ti-database","CRM"]].map(([icon,label]) => (
          <div key={label} style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:9, padding:"7px 10px", display:"flex", alignItems:"center", gap:7 }}>
            <i className={`ti ${icon}`} style={{ fontSize:14, color: a.color }} aria-hidden="true"/>
            <span style={{ fontSize:11, color:"rgba(255,255,255,0.5)" }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PerfAdsProcess({ a }: { a: Accent }) {
  return (
    <div className="ss-process-card" style={{ border:`1px solid ${a.border}` }}>
      <div className="ss-process-dot" style={{ background: a.color }} />
      <span className="ss-process-num">06</span>
      <p className="ss-section-label">ROAS performance</p>
      <div style={{ display:"flex", justifyContent:"center", marginBottom:12 }}>
        <svg width="180" height="80" viewBox="0 0 180 80">
          <line x1="10" y1="68" x2="170" y2="68" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
          {[{x:25,h:20,d:"0s"},{x:55,h:32,d:"0.15s"},{x:85,h:28,d:"0.3s"},{x:115,h:44,d:"0.45s"},{x:145,h:36,d:"0.6s"}].map((b,i) => (
            <rect key={i} x={b.x-12} y={68-b.h} width="24" height={b.h} rx="3" fill={a.color} opacity={0.4+i*0.12}
              style={{ animation:`ss-grow${(i%4)+1} 2.5s ease-in-out infinite`, animationDelay:b.d }}/>
          ))}
        </svg>
      </div>
      <p className="ss-section-label">Platforms</p>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:5, marginBottom:10 }}>
        {[["ti-brand-google","Google"],["ti-brand-meta","Meta"],["ti-brand-youtube","YouTube"]].map(([icon,label]) => (
          <div key={label} style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:9, padding:"8px 6px", textAlign:"center" }}>
            <i className={`ti ${icon}`} style={{ fontSize:16, color: a.color }} aria-hidden="true"/>
            <p style={{ fontSize:9, color:"rgba(255,255,255,0.35)", margin:"3px 0 0" }}>{label}</p>
          </div>
        ))}
      </div>
      <p className="ss-section-label">Live metrics</p>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:5 }}>
        {[["ROAS","4.2×"],["CAC","↓38%"],["CTR","↑62%"],["Conv","↑29%"]].map(([label,val]) => (
          <div key={label} style={{ background: a.bg, border:`1px solid ${a.border}`, borderRadius:9, padding:"8px 10px", textAlign:"center" }}>
            <p style={{ fontSize:16, fontWeight:900, color: a.color, margin:0 }}>{val}</p>
            <p style={{ fontSize:9, color:`${a.color}99`, margin:"2px 0 0", letterSpacing:1.5, textTransform:"uppercase" }}>{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function AnalyticsProcess({ a }: { a: Accent }) {
  return (
    <div className="ss-process-card" style={{ border:`1px solid ${a.border}` }}>
      <div className="ss-process-dot" style={{ background: a.color }} />
      <span className="ss-process-num">07</span>
      <p className="ss-section-label">Revenue trend</p>
      <div style={{ marginBottom:12 }}>
        <svg width="100%" height="80" viewBox="0 0 200 80">
          <line x1="10" y1="70" x2="190" y2="70" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
          <line x1="10" y1="10" x2="10"  y2="70" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
          <polyline points="10,62 50,48 90,52 130,30 170,20 190,12" fill="none" stroke={a.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="250" style={{ animation:"ss-line-draw 2.5s ease forwards" }}/>
          {[[10,62],[50,48],[90,52],[130,30],[170,20],[190,12]].map(([cx,cy],i) => (
            <circle key={i} cx={cx} cy={cy} fill={a.color}>
              <animate attributeName="r" values="0;4;3" dur="0.4s" begin={`${i*0.35}s`} fill="freeze"/>
            </circle>
          ))}
        </svg>
      </div>
      <p className="ss-section-label">Sources</p>
      <div style={{ display:"flex", flexDirection:"column", gap:5, marginBottom:10 }}>
        {[["GA4","Events & conversions","100%"],["GTM","Tag firing","98%"],["Looker","Custom dashboards","live"]].map(([name,desc,val]) => (
          <div key={name} style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:9, padding:"7px 10px", display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ fontSize:10, fontWeight:700, color: a.color, width:38, flexShrink:0 }}>{name}</span>
            <span style={{ fontSize:10, color:"rgba(255,255,255,0.35)", flex:1 }}>{desc}</span>
            <span style={{ fontSize:10, fontWeight:700, color: a.color }}>{val}</span>
          </div>
        ))}
      </div>
      <p className="ss-section-label">Key insights</p>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:5 }}>
        {[["Attribution","Multi-touch"],["Cohorts","LTV tracked"],["Funnels","Drop-offs ID'd"],["Reports","Auto weekly"]].map(([label,val]) => (
          <div key={label} style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:9, padding:"7px 9px" }}>
            <p style={{ fontSize:9, color:"rgba(255,255,255,0.28)", margin:"0 0 2px", textTransform:"uppercase", letterSpacing:1.5 }}>{label}</p>
            <p style={{ fontSize:11, color:"rgba(255,255,255,0.6)", margin:0, fontWeight:600 }}>{val}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function BrandDesignProcess({ a }: { a: Accent }) {
  return (
    <div className="ss-process-card" style={{ border:`1px solid ${a.border}` }}>
      <div className="ss-process-dot" style={{ background: a.color }} />
      <span className="ss-process-num">08</span>
      <p className="ss-section-label">Brand system</p>
      <div style={{ display:"flex", justifyContent:"center", marginBottom:12 }}>
        <svg width="120" height="100" viewBox="0 0 120 100">
          <g transform="translate(60,52)" style={{ animation:"ss-brand-scale 2.5s ease-in-out infinite", transformOrigin:"0 0" }}>
            <path d="M0-38L6-6L38 0L6 6L0 38L-6 6L-38 0L-6-6Z" fill="none" stroke={a.color} strokeWidth="1.5" strokeLinejoin="round" opacity="0.5"/>
          </g>
          <g transform="translate(60,52)" style={{ animation:"ss-brand-scale 2.5s ease-in-out 0.5s infinite", transformOrigin:"0 0" }}>
            <path d="M0-22L4-4L22 0L4 4L0 22L-4 4L-22 0L-4-4Z" fill={a.color} opacity="0.85"/>
          </g>
        </svg>
      </div>
      <p className="ss-section-label">Deliverables</p>
      <div style={{ display:"flex", flexDirection:"column", gap:5, marginBottom:10 }}>
        {[["ti-palette","Color system","Primary + secondary palette"],["ti-letter-case","Typography","Type scale & hierarchy"],["ti-mood-happy","Tone of voice","Copy guidelines"],["ti-layout","Collateral","Decks, social, print"]].map(([icon,label,desc]) => (
          <div key={label} style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:9, padding:"7px 10px", display:"flex", alignItems:"center", gap:10 }}>
            <i className={`ti ${icon}`} style={{ fontSize:14, color: a.color, flexShrink:0 }} aria-hidden="true"/>
            <div>
              <p style={{ fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.6)", margin:0 }}>{label}</p>
              <p style={{ fontSize:9, color:"rgba(255,255,255,0.3)", margin:0 }}>{desc}</p>
            </div>
          </div>
        ))}
      </div>
      <div style={{ background: a.bg, border:`1px solid ${a.border}`, borderRadius:10, padding:"10px 12px", textAlign:"center" }}>
        <p style={{ fontSize:11, color: a.color, margin:0, fontWeight:700 }}>Full Figma file + PDF guidelines handoff</p>
      </div>
    </div>
  );
}

const PROCESS_CARDS = [
  AIMarketingProcess, SaasDevProcess, WebDevProcess, AIAutomationProcess,
  LeadGenProcess, PerfAdsProcess, AnalyticsProcess, BrandDesignProcess,
];

/* ── Service data ─────────────────────────────────────────────────────────── */
const services = [
  { id:"ai-marketing", num:"01", name:"AI Marketing", tagline:"Campaigns that think for themselves.",
    pricing:{ type:"monthly", tiers:[{name:"Starter",price:"$299"},{name:"Growth",price:"$799"},{name:"Scale",price:"$1,799"}] },
    description:"We build intelligent marketing systems that learn from every impression, click, and conversion your audience makes. These systems continuously iterate on creative, shift budget toward the highest-performing channels in real time, and get measurably smarter week over week — without anyone touching a dashboard.",
    whoFor:"Growth-stage startups and scaling businesses that are tired of guessing and ready to let data drive every marketing decision.",
    stats:[{val:"3×",label:"ROAS"},{val:"↓40%",label:"CAC"},{val:"+60%",label:"CTR"}],
    bullets:["Behavioural audience modelling & lookalike expansion","Automated A/B creative rotation across channels","Cross-channel budget reallocation in real time","Predictive churn & re-engagement targeting","Dynamic ad personalisation by segment & intent","Funnel drop-off detection & automated recovery flows","Multi-touch attribution modelling","Weekly performance reports with plain-English insight"] },
  { id:"saas-dev", num:"02", name:"SaaS Development", tagline:"Products built to retain, not just acquire.",
    pricing:{ type:"project", tiers:[{name:"Starter",price:"$2,799"},{name:"Growth",price:"$7,799"},{name:"Scale",price:"$19,799"}] },
    description:"From zero to production-ready SaaS platform. We handle every architectural decision — database design, multi-tenant isolation, auth flows, subscription billing, and deployment infrastructure. Shipped fast, built to scale without rewrites.",
    whoFor:"Founders with a validated idea who need a technical partner to own the build end-to-end, or existing teams who need to accelerate a stalled roadmap.",
    stats:[{val:"<2w",label:"MVP"},{val:"99.9%",label:"Uptime"},{val:"0",label:"Rewrites"}],
    bullets:["Full-stack Next.js / Node.js / TypeScript architecture","Stripe & Razorpay subscription billing integration","Multi-tenant data isolation & role-based access control","OAuth & magic link authentication (NextAuth / Clerk)","REST & GraphQL API design with full documentation","Automated testing suite (unit, integration, E2E)","CI/CD pipelines with zero-downtime deployments","Cloud infrastructure setup on AWS, GCP, or Vercel"] },
  { id:"web-dev", num:"03", name:"Web Development", tagline:"Performance-engineered, pixel-perfect.",
    pricing:{ type:"project", tiers:[{name:"Starter",price:"$799"},{name:"Growth",price:"$2,299"},{name:"Scale",price:"$4,799"}] },
    description:"We build web experiences that load in under a second and convert. Every project ships with a Lighthouse score above 95, passes Core Web Vitals, and looks exactly like the design — down to the last pixel. No compromises.",
    whoFor:"Businesses that want their website to be a growth asset — agencies, SaaS products, e-commerce brands, and founders who care about first impressions.",
    stats:[{val:"97",label:"Lighthouse"},{val:"<1.2s",label:"Load"},{val:"95+",label:"CWV"}],
    bullets:["Next.js with React Server Components & App Router","Core Web Vitals — LCP, CLS, FID all in green","Lighthouse performance score above 95 guaranteed","Headless CMS integration (Sanity, Contentful, Notion)","Framer Motion animations — smooth, no jank","Full mobile responsiveness across all breakpoints","SEO-optimised semantic markup & structured data","Accessibility-first development (WCAG 2.1 AA compliant)"] },
  { id:"ai-automation", num:"04", name:"AI Automation", tagline:"Turn repetitive work into automated pipelines.",
    pricing:{ type:"monthly", tiers:[{name:"Starter",price:"$599"},{name:"Growth",price:"$1,299"},{name:"Scale",price:"$2,799"}] },
    description:"We audit your workflows, identify every process that is rules-based or pattern-driven, and replace them with AI agents that run continuously, make zero errors, and cost a fraction of the manual equivalent. Your team gets their week back.",
    whoFor:"Operations-heavy teams, agencies, and businesses with high-volume repetitive workflows — from document processing to internal reporting.",
    stats:[{val:"38h",label:"Saved/wk"},{val:"0",label:"Errors"},{val:"24/7",label:"Runtime"}],
    bullets:["Full workflow audit & automation opportunity scoring","LLM-powered document reading, extraction & classification","Email & inbox triage agents with smart routing","Automated CRM data enrichment & update pipelines","API-connected multi-agent task execution systems","Zapier / Make / n8n workflow design & optimisation","Custom internal tools to replace manual spreadsheet work","Human-in-the-loop escalation design for edge cases"] },
  { id:"lead-gen", num:"05", name:"Lead Generation", tagline:"Not leads — buyers.",
    pricing:{ type:"monthly", tiers:[{name:"Starter",price:"$399"},{name:"Growth",price:"$999"},{name:"Scale",price:"$2,299"}] },
    description:"We build outbound and inbound systems that identify decision-ready prospects precisely — using ICP modelling, intent data, and personalised multi-channel sequences — and deliver them to your calendar as qualified meetings.",
    whoFor:"B2B companies, agencies, and consultancies that sell high-ticket services and need a consistent, predictable pipeline of qualified prospects every month.",
    stats:[{val:"38",label:"Meetings/mo"},{val:"4.2%",label:"Reply rate"},{val:"2.8×",label:"Pipeline"}],
    bullets:["ICP definition & account scoring","LinkedIn Sales Navigator prospecting & sequences","Personalised cold email with A/B subject testing","Intent data integration (G2 Buyer Intent, Bombora)","Multi-channel outreach (email + LinkedIn + calls)","CRM enrichment with firmographic & technographic data","Lead scoring model setup & automated qualification","Monthly pipeline reporting with conversion analysis"] },
  { id:"perf-ads", num:"06", name:"Performance Ads", tagline:"Every rupee tracked, every creative tested.",
    pricing:{ type:"monthly", tiers:[{name:"Starter",price:"$299"},{name:"Growth",price:"$799"},{name:"Scale",price:"$1,799"}] },
    description:"ROI-obsessed paid media across Google, Meta, and YouTube. Every rupee of spend is tracked to a measurable outcome, every creative goes through systematic testing, and scaling decisions are driven by data — never instinct.",
    whoFor:"E-commerce brands, SaaS companies, and service businesses ready to invest ₹1L+ per month in paid media and want a clear, auditable return.",
    stats:[{val:"4.2×",label:"ROAS"},{val:"↓38%",label:"CAC"},{val:"+62%",label:"CTR"}],
    bullets:["Google Search, Shopping, Display & YouTube campaigns","Meta (Facebook & Instagram) prospecting & retargeting","Full-funnel creative strategy — static, video & carousel","Landing page design & conversion rate optimisation","Systematic creative testing framework","Audience segmentation & lookalike audience building","Weekly spend pacing, budget allocation & ROAS reporting","Monthly performance review with scaling recommendations"] },
  { id:"analytics", num:"07", name:"Analytics", tagline:"Raw data into revenue decisions.",
    pricing:{ type:"monthly", tiers:[{name:"Starter",price:"$99"},{name:"Growth",price:"$399"},{name:"Scale",price:"$999"}] },
    description:"We instrument your full digital stack from first touch to post-purchase, fix your broken GA4, and build dashboards that surface the numbers that actually matter. No more guessing why conversions dropped last Tuesday.",
    whoFor:"Marketing teams and founders making decisions on gut feel because their data is unreliable — ready to replace guesswork with a single source of truth.",
    stats:[{val:"1wk",label:"Setup"},{val:"100%",label:"Tracked"},{val:"Auto",label:"Reports"}],
    bullets:["GA4 full audit, configuration & event tracking setup","Google Tag Manager with custom trigger library","Custom Looker Studio dashboards by channel & funnel","Metabase / Retool internal data dashboards","Multi-touch attribution modelling (first, last, data-driven)","Conversion funnel analysis & drop-off identification","Cohort analysis & customer lifetime value tracking","Automated weekly insight reports to your inbox"] },
  { id:"brand-design", num:"08", name:"Brand Design", tagline:"Identities built to be remembered.",
    pricing:{ type:"project", tiers:[{name:"Starter",price:"$1,299"},{name:"Growth",price:"$3,299"},{name:"Scale",price:"$6,799"}] },
    description:"We build brand systems from the ground up — positioning strategy, visual identity, and a complete guidelines system your team can execute consistently. The result is a brand that commands attention before a single word is read.",
    whoFor:"Startups preparing to launch, businesses that have outgrown their original identity, and companies entering new markets who need to signal credibility immediately.",
    stats:[{val:"Full",label:"System"},{val:"Figma",label:"Handoff"},{val:"∞",label:"Scalable"}],
    bullets:["Brand strategy workshop — positioning & differentiation","Competitive landscape audit & whitespace identification","Naming & tagline development with trademark guidance","Logo design system — primary, secondary & icon variants","Full colour palette, typography system & spacing","Tone of voice guidelines with copy examples","Marketing collateral — decks, brochures, social templates","Brand guidelines PDF + Figma file handoff"] },
];


/* ── Pricing Card ─────────────────────────────────────────────────────────── */
function PricingCard({ pricing, accent }: { pricing: { type: string; tiers: { name: string; price: string }[] }; accent: Accent }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      border: `1px solid ${accent.border}`,
      borderRadius: 16,
      padding: "16px",
      marginTop: 10,
    }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
        <p style={{ fontSize:9, fontWeight:700, color:"rgba(255,255,255,0.25)", letterSpacing:"2.5px", textTransform:"uppercase", margin:0 }}>Pricing</p>
        <span style={{ fontSize:9, fontWeight:700, color:`${accent.color}99`, letterSpacing:"1.5px", textTransform:"uppercase",
          background: accent.bg, border:`1px solid ${accent.border}`, borderRadius:100, padding:"2px 8px" }}>
          {pricing.type === "monthly" ? "Per Month" : "One-time"}
        </span>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:6 }}>
        {pricing.tiers.map((tier, i) => (
          <div key={tier.name} style={{
            background: i === 1 ? accent.bg : "rgba(255,255,255,0.02)",
            border: `1px solid ${i === 1 ? accent.border : "rgba(255,255,255,0.07)"}`,
            borderRadius: 10,
            padding: "10px 8px",
            textAlign: "center",
          }}>
            <p style={{ fontSize:9, color: i===1 ? `${accent.color}99` : "rgba(255,255,255,0.28)", margin:"0 0 5px", textTransform:"uppercase", letterSpacing:1.5 }}>{tier.name}</p>
            <p style={{ fontSize:15, fontWeight:900, color: i===1 ? accent.color : "rgba(255,255,255,0.7)", margin:0, letterSpacing:"-0.5px" }}>{tier.price}</p>
          </div>
        ))}
      </div>
      <p style={{ fontSize:10, color:"rgba(255,255,255,0.25)", margin:"10px 0 0", textAlign:"center" }}>
        Custom pricing available — <a href="/contact" style={{ color:"rgba(255,255,255,0.45)", textDecoration:"none" }}>talk to us</a>
      </p>
    </div>
  );
}

/* ── Block component ──────────────────────────────────────────────────────── */
function ServiceBlock({ service, index }: { service: typeof services[0]; index: number }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const accent = ACCENTS[index];
  const ProcessCard = PROCESS_CARDS[index];

  useEffect(() => {
    // If URL hash matches this service, make it visible immediately
    const hash = window.location.hash.replace("#", "");
    if (hash === service.id) {
      setVisible(true);
      setTimeout(() => {
        ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.05 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [service.id]);

  return (
    <>
      {index > 0 && <hr className="ss-block-divider" />}
      <div id={service.id} style={{ scrollMarginTop: "80px" }}>
      <div
        ref={ref}
        className={`ss-block${visible ? " ss-block--visible" : ""}`}
        style={{ transitionDelay: `${index * 0.04}s` }}
      >
        {/* Service identity — full width above grid */}
        <div className="ss-identity">
          <h2 className="ss-name">{service.name}</h2>
          <p className="ss-tagline">{service.tagline}</p>
        </div>

        <div className="ss-grid">

          {/* Left — process card */}
          <div className="ss-left">
            <ProcessCard a={accent} />
            <PricingCard pricing={service.pricing} accent={accent} />
          </div>

          {/* Right — detail */}
          <div className="ss-right">
            <div className="ss-desc-card">
              <p className="ss-desc">{service.description}</p>
            </div>

            <div className="ss-stats">
              {service.stats.map(st => (
                <div key={st.label} className="ss-stat" style={{ background: accent.bg, border:`1px solid ${accent.border}` }}>
                  <p className="ss-stat-num" style={{ color: accent.color }}>{st.val}</p>
                  <p className="ss-stat-label" style={{ color:`${accent.color}99` }}>{st.label}</p>
                </div>
              ))}
            </div>

            <div className="ss-bestfor-card">
              <i className="ti ti-target ss-bestfor-icon" style={{ color: accent.color }} aria-hidden="true"/>
              <div>
                <p className="ss-bestfor-label">Best for</p>
                <p className="ss-bestfor-text">{service.whoFor}</p>
              </div>
            </div>

            <div>
              <p className="ss-included-label">What's included</p>
              <div className="ss-cards-grid">
                {service.bullets.map((b, bi) => (
                  <div key={bi} className="ss-card">
                    <i className="ti ti-check" style={{ fontSize:12, color: accent.color, flexShrink:0, marginTop:1 }} aria-hidden="true"/>
                    <p className="ss-card-text">{b}</p>
                  </div>
                ))}
              </div>
            </div>

            <a href="/contact" className="ss-cta">
              Start this service <span className="ss-cta-arrow">→</span>
            </a>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}

/* ── Main ─────────────────────────────────────────────────────────────────── */
export default function ServicesSection() {
  return (
    <section id="services-list" className="ss-section" aria-label="Our services">
      <div id="pricing" style={{ position:"absolute", top:"-80px" }} aria-hidden="true" />
      {services.map((s, i) => (
        <ServiceBlock key={s.id} service={s} index={i} />
      ))}
    </section>
  );
}