"use client";

import { useState } from "react";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle"|"loading"|"success"|"error">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section style={{
      background: "rgba(124,58,237,0.08)", borderTop: "1px solid rgba(124,58,237,0.2)",
      padding: "60px 24px", textAlign: "center"
    }}>
      <h2 style={{ color: "#fff", fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
        Get AI Marketing Insights
      </h2>
      <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 15, marginBottom: 24 }}>
        Join 500+ founders getting weekly growth tips. No spam, ever.
      </p>
      {status === "success" ? (
        <p style={{ color: "#7c3aed", fontWeight: 600, fontSize: 16 }}>
          ✓ You're subscribed! Check your inbox.
        </p>
      ) : (
        <form onSubmit={submit} style={{
          display: "flex", gap: 12, justifyContent: "center",
          flexWrap: "wrap", maxWidth: 480, margin: "0 auto"
        }}>
          <input
            type="email" required placeholder="your@email.com"
            value={email} onChange={e => setEmail(e.target.value)}
            style={{
              flex: 1, minWidth: 200, padding: "12px 16px", borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.15)",
              background: "rgba(255,255,255,0.05)", color: "#fff", fontSize: 14, outline: "none"
            }}
          />
          <button type="submit" disabled={status === "loading"} style={{
            padding: "12px 24px", borderRadius: 8, border: "none",
            background: "#7c3aed", color: "#fff", fontSize: 14,
            fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap"
          }}>
            {status === "loading" ? "..." : "Subscribe →"}
          </button>
        </form>
      )}
      {status === "error" && (
        <p style={{ color: "rgba(220,80,80,0.9)", fontSize: 13, marginTop: 8 }}>
          Something went wrong. Please try again.
        </p>
      )}
    </section>
  );
}
