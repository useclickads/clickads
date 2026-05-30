"use client";

import { useEffect, useState } from "react";

export default function ExitIntent() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("exit_intent_dismissed");
    if (dismissed) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) setShow(true);
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, []);

  const dismiss = () => {
    sessionStorage.setItem("exit_intent_dismissed", "true");
    setShow(false);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    sessionStorage.setItem("exit_intent_dismissed", "true");
    setTimeout(() => setShow(false), 2000);
  };

  if (!show) return null;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 99999,
      background: "rgba(0,0,0,0.7)", display: "flex",
      alignItems: "center", justifyContent: "center", padding: 24
    }}>
      <div style={{
        background: "#0d0d0d", borderRadius: 16, padding: "48px 40px",
        maxWidth: 480, width: "100%", border: "1px solid rgba(255,255,255,0.1)",
        position: "relative", textAlign: "center"
      }}>
        <button onClick={dismiss} style={{
          position: "absolute", top: 16, right: 16, background: "none",
          border: "none", color: "rgba(255,255,255,0.4)", fontSize: 20, cursor: "pointer"
        }}>✕</button>

        <div style={{ fontSize: 40, marginBottom: 16 }}>⚡</div>
        <h2 style={{ color: "#fff", fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
          Wait! Before you go...
        </h2>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, marginBottom: 24 }}>
          Get a free AI marketing audit for your business. No strings attached.
        </p>

        {submitted ? (
          <p style={{ color: "#7c3aed", fontWeight: 600 }}>✓ We'll be in touch soon!</p>
        ) : (
          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input
              type="email" required placeholder="Enter your email"
              value={email} onChange={e => setEmail(e.target.value)}
              style={{
                padding: "12px 16px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.15)",
                background: "rgba(255,255,255,0.05)", color: "#fff", fontSize: 14, outline: "none"
              }}
            />
            <button type="submit" style={{
              padding: "12px 16px", borderRadius: 8, border: "none",
              background: "#7c3aed", color: "#fff", fontSize: 14,
              fontWeight: 600, cursor: "pointer"
            }}>
              Get My Free Audit →
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
