"use client";

import { useState, useEffect } from "react";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem("cookie_consent", "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem("cookie_consent", "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 9999,
      background: "#18181b", color: "#fff", padding: "16px 24px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      flexWrap: "wrap", gap: "12px", borderTop: "1px solid #333"
    }}>
      <p style={{ margin: 0, fontSize: "14px", maxWidth: "700px" }}>
        We use cookies to analyse site traffic and improve your experience. 
        See our <a href="/privacy-policy" style={{ color: "#a78bfa" }}>Privacy Policy</a>.
      </p>
      <div style={{ display: "flex", gap: "10px" }}>
        <button onClick={decline} style={{
          padding: "8px 16px", borderRadius: "6px", border: "1px solid #555",
          background: "transparent", color: "#fff", cursor: "pointer", fontSize: "14px"
        }}>Decline</button>
        <button onClick={accept} style={{
          padding: "8px 16px", borderRadius: "6px", border: "none",
          background: "#7c3aed", color: "#fff", cursor: "pointer", fontSize: "14px"
        }}>Accept</button>
      </div>
    </div>
  );
}
