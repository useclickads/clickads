"use client";

import { useEffect } from "react";

export default function CrispChat() {
  useEffect(() => {
    (window as any).$crisp = [];
    (window as any).CRISP_WEBSITE_ID = "74190479-0369-4ae7-aa5d-ecdef9591eed";
    const script = document.createElement("script");
    script.src = "https://client.crisp.chat/l.js";
    script.async = true;
    document.head.appendChild(script);
  }, []);

  return null;
}
