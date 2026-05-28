import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ServicesHero from "@/components/services/ServicesHero";
import ServicesSection from "@/components/services/ServicesSection";
import JsonLd from "@/components/common/JsonLd";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services | ClickAds",
  description: "AI marketing, SaaS development, web development, automation, lead generation, performance ads, analytics and brand design — all under one roof.",
  openGraph: {
    title: "Services | ClickAds",
    description: "AI marketing, SaaS development, web development, automation, lead generation, performance ads, analytics and brand design — all under one roof.",
    url: "https://www.useclickads.com/services",
    type: "website",
  },
  alternates: {
    canonical: "https://www.useclickads.com/services",
  },
};

const services = [
  {
    name: "AI Marketing",
    description: "AI-powered marketing campaigns with intelligent targeting and optimization",
  },
  {
    name: "SaaS Development",
    description: "Full-stack SaaS product development and deployment",
  },
  {
    name: "Web Development",
    description: "Custom web applications and websites",
  },
  {
    name: "AI Automation",
    description: "Workflow automation powered by artificial intelligence",
  },
  {
    name: "Lead Generation",
    description: "High-quality lead generation and nurturing",
  },
  {
    name: "Performance Ads",
    description: "Data-driven performance advertising campaigns",
  },
  {
    name: "Analytics",
    description: "Advanced analytics and data insights",
  },
  {
    name: "Brand Design",
    description: "Strategic brand design and visual identity",
  },
];

export default function ServicesPage() {
  const servicesSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.useclickads.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Services",
        "item": "https://www.useclickads.com/services"
      }
    ]
  };

  return (
    <>
      <JsonLd data={servicesSchema} />
      <main id="main-content">
        <Navbar />
        <ServicesHero />
        <ServicesSection />
        <Footer />
      </main>
    </>
  );
}