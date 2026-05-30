"use client";

import { useEffect } from "react";

export default function CalendlyWidget() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.head.appendChild(script);
  }, []);

  return (
    <div
      className="calendly-inline-widget"
      data-url="https://calendly.com/useclickads/30min?hide_landing_page_details=1&hide_gdpr_banner=1&background_color=0d0d0d&text_color=ffffff&primary_color=7c3aed"
      style={{ minWidth: "320px", height: "700px" }}
    />
  );
}
