"use client";

import { useState, useEffect } from "react";

export default function CalendlyWidget() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div style={{ width: "100%", height: "900px" }} />;

  return (
    <div style={{ width: "100%", height: "900px" }}>
      <iframe
        src="https://calendly.com/useclickads/30min?hide_landing_page_details=1&hide_gdpr_banner=1&background_color=0d0d0d&text_color=ffffff&primary_color=7c3aed"
        width="100%"
        height="100%"
        style={{ border: "none" }}
        title="Schedule a meeting with ClickAds"
      />
    </div>
  );
}
