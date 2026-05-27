"use client";

const brands: {
  label: string;
  industry: string;
  style: {
    fontSize: number;
    fontWeight: number;
    letterSpacing: string;
  };
  badge?: {
    bg: string;
    color: string;
    letter: string;
    border?: string;
  };
  prefix?: string;
  logoImg?: string;
}[] = [
  {
    label: "NovaPay",
    industry: "Fintech",
    style: { fontSize: 17, fontWeight: 700, letterSpacing: "-0.4px" },
    badge: { bg: "#2563eb", color: "#fff", letter: "NP" },
  },
  {
    label: "Orbis Health",
    industry: "Healthcare",
    style: { fontSize: 15, fontWeight: 300, letterSpacing: "0.3px" },
    badge: { bg: "#16a34a", color: "#fff", letter: "O" },
  },
  {
    label: "STEELMARK",
    industry: "Manufacturing",
    style: { fontSize: 12, fontWeight: 700, letterSpacing: "2.5px" },
    prefix: "▲",
  },
  {
    label: "Cloudrift",
    industry: "Cloud / SaaS",
    style: { fontSize: 17, fontWeight: 400, letterSpacing: "-0.3px" },
    badge: { bg: "#2563eb", color: "#fff", letter: "C" },
  },
  {
    label: "Meridian",
    industry: "Consulting",
    style: { fontSize: 17, fontWeight: 300, letterSpacing: "0.5px" },
  },
  {
    label: "AXIOM",
    industry: "Legal Tech",
    style: { fontSize: 13, fontWeight: 700, letterSpacing: "3px" },
    prefix: "◆",
  },
  {
    label: "Solvex",
    industry: "Logistics",
    style: { fontSize: 17, fontWeight: 600, letterSpacing: "-0.3px" },
    badge: { bg: "#ea580c", color: "#fff", letter: "S" },
  },
  {
    label: "Lumio",
    industry: "EdTech",
    style: { fontSize: 17, fontWeight: 300, letterSpacing: "0.4px" },
    badge: { bg: "#f59e0b", color: "#1a1a1a", letter: "L" },
  },
  {
    label: "Construct",
    industry: "Real Estate",
    style: { fontSize: 16, fontWeight: 400, letterSpacing: "-0.2px" },
    badge: { bg: "#292929", color: "#aaa", letter: "C", border: "0.5px solid #444" },
  },
  {
    label: "VANTIX",
    industry: "Analytics",
    style: { fontSize: 12, fontWeight: 700, letterSpacing: "2px" },
    prefix: "●",
  },
  {
    label: "Fenix AI",
    industry: "Artificial Intelligence",
    style: { fontSize: 17, fontWeight: 500, letterSpacing: "-0.3px" },
    badge: { bg: "#7c3aed", color: "#fff", letter: "F" },
  },
  {
    label: "Harlow",
    industry: "Fashion / Retail",
    style: { fontSize: 17, fontWeight: 300, letterSpacing: "0.5px" },
  },
  {
    label: "Drivebase",
    industry: "Automotive",
    style: { fontSize: 16, fontWeight: 600, letterSpacing: "-0.4px" },
  },
  {
    label: "CRESTLINE",
    industry: "Finance / Banking",
    style: { fontSize: 11, fontWeight: 700, letterSpacing: "3px" },
    prefix: "◇",
  },
  {
    label: "Trellis",
    industry: "AgriTech",
    style: { fontSize: 17, fontWeight: 400, letterSpacing: "0.2px" },
    badge: { bg: "#0d9488", color: "#fff", letter: "T" },
  },
  {
    label: "Get Trip Go",
    industry: "Travel",
    style: { fontSize: 16, fontWeight: 600, letterSpacing: "-0.3px" },
    badge: { bg: "#FFD02B", color: "#1a1a1a", letter: "✈" },
  },
  {
    label: "Trip to Globe",
    industry: "Travel",
    style: { fontSize: 16, fontWeight: 400, letterSpacing: "-0.2px" },
    badge: { bg: "#f97316", color: "#fff", letter: "TG" },
  },
  {
    label: "UTI Holidays",
    industry: "Travel",
    style: { fontSize: 16, fontWeight: 300, letterSpacing: "0.3px" },
    badge: { bg: "#6366f1", color: "#fff", letter: "UH" },
  },
  {
    label: "Travel Counter 24",
    industry: "Travel",
    style: { fontSize: 15, fontWeight: 500, letterSpacing: "-0.2px" },
    badge: { bg: "#e11d48", color: "#fff", letter: "TC" },
  },
];

function Badge({
  bg,
  color,
  letter,
  border,
}: {
  bg: string;
  color: string;
  letter: string;
  border?: string;
}) {
  return (
    <span
      style={{
        width: "24px",
        height: "24px",
        borderRadius: "6px",
        background: bg,
        color,
        border: border ?? "none",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: letter.length > 1 ? "9px" : "11px",
        fontWeight: 700,
        flexShrink: 0,
        letterSpacing: "0px",
      }}
    >
      {letter}
    </span>
  );
}

function BrandItem({ brand }: { brand: (typeof brands)[0] }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        color: "#ffffff",
        lineHeight: 1,
        whiteSpace: "nowrap",
      }}
    >
      {brand.logoImg ? (
        <span
          style={{
            width: "24px",
            height: "24px",
            borderRadius: "6px",
            overflow: "hidden",
            display: "inline-flex",
            flexShrink: 0,
          }}
        >
          <img
            src={brand.logoImg}
            alt={brand.label}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </span>
      ) : brand.badge ? (
        <Badge {...brand.badge} />
      ) : null}
      {brand.prefix && (
        <span style={{ fontSize: "10px", color: "#777", marginRight: "-2px" }}>
          {brand.prefix}
        </span>
      )}
      <span
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: `${brand.style.fontSize}px`,
          fontWeight: brand.style.fontWeight,
          letterSpacing: brand.style.letterSpacing,
        }}
      >
        {brand.label}
      </span>
    </span>
  );
}

export default function TrustMarquee() {
  const doubledBrands = [...brands, ...brands];

  return (
    <div style={{ background: "#080808", fontFamily: "Inter, sans-serif" }}>
      {/* Label row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
          padding: "28px 24px 18px",
        }}
      >
        <div style={{ flex: 1, height: "0.5px", background: "#555555", maxWidth: "180px" }} />
        <span
          style={{
            fontSize: "10px",
            fontWeight: 500,
            letterSpacing: "3.5px",
            textTransform: "uppercase",
            color: "#cccccc",
            whiteSpace: "nowrap",
          }}
        >
          Trusted by industry leaders worldwide
        </span>
        <div style={{ flex: 1, height: "0.5px", background: "#555555", maxWidth: "180px" }} />
      </div>

      {/* Marquee strip */}
      <div
        style={{
          overflow: "hidden",
          position: "relative",
          borderTop: "0.5px solid #222222",
          borderBottom: "0.5px solid #222222",
          padding: "19px 0",
        }}
      >
        {/* Fade left */}
        <div
          style={{
            position: "absolute",
            top: 0, left: 0, bottom: 0,
            width: "100px",
            background: "linear-gradient(to right, #080808 20%, transparent)",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />
        {/* Fade right */}
        <div
          style={{
            position: "absolute",
            top: 0, right: 0, bottom: 0,
            width: "100px",
            background: "linear-gradient(to left, #080808 20%, transparent)",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />

        <style>{`
          @keyframes trust-marquee {
            0%   { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .trust-track {
            display: flex;
            align-items: center;
            width: max-content;
            animation: trust-marquee 48s linear infinite;
          }
          .trust-track:hover {
            animation-play-state: paused;
          }
          .trust-item {
            padding: 0 32px;
            opacity: 1;
            transition: opacity 0.3s;
            cursor: default;
            display: flex;
            align-items: center;
            flex-shrink: 0;
          }
          .trust-item:hover { opacity: 1; }
          .trust-sep {
            width: 0.5px;
            height: 16px;
            background: #333;
            flex-shrink: 0;
          }
        `}</style>

        <div className="trust-track">
          {doubledBrands.map((brand, i) => (
            <span key={i} style={{ display: "inline-flex", alignItems: "center" }}>
              {i > 0 && <span className="trust-sep" />}
              <span className="trust-item">
                <BrandItem brand={brand} />
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}