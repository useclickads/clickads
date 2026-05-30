import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "ClickAds — AI Marketing Agency & SaaS Studio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0d0d0d",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
          fontFamily: "Inter, sans-serif",
        }}
      >
        {/* Purple accent line */}
        <div style={{ width: 60, height: 4, background: "#7c3aed", borderRadius: 2, marginBottom: 32 }} />

        {/* Logo / Brand */}
        <div style={{ fontSize: 28, color: "#7c3aed", fontWeight: 700, marginBottom: 24, letterSpacing: "-0.5px" }}>
          clickAds
        </div>

        {/* Headline */}
        <div style={{ fontSize: 64, color: "#ffffff", fontWeight: 700, lineHeight: 1.1, marginBottom: 24, letterSpacing: "-2px", maxWidth: 900 }}>
          AI Marketing Agency & SaaS Studio
        </div>

        {/* Subtext */}
        <div style={{ fontSize: 24, color: "rgba(255,255,255,0.5)", fontWeight: 400, maxWidth: 700 }}>
          We build AI-powered growth engines for ambitious businesses.
        </div>

        {/* URL */}
        <div style={{ position: "absolute", bottom: 80, right: 80, fontSize: 18, color: "rgba(255,255,255,0.3)" }}>
          useclickads.com
        </div>
      </div>
    ),
    { ...size }
  );
}
