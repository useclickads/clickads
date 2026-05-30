export const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "ClickAds",
  "url": "https://www.useclickads.com",
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "ClickAds Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "AI Marketing",
          "description": "AI-powered marketing campaigns that learn and optimize in real-time to maximize ROI."
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "SaaS Development",
          "description": "Full-stack SaaS products built to retain users and scale without rewrites."
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Performance Ads",
          "description": "Data-driven ad campaigns across Google, Meta, and LinkedIn that drive qualified leads."
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Web Development",
          "description": "Fast, modern websites and web applications built with Next.js and TypeScript."
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "AI Automation",
          "description": "Custom AI workflows and automations that save time and reduce operational costs."
        }
      }
    ]
  }
};
