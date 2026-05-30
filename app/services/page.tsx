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

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",     item: "https://www.useclickads.com" },
    { "@type": "ListItem", position: 2, name: "Services", item: "https://www.useclickads.com/services" },
  ],
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "ClickAds",
  url: "https://www.useclickads.com",
  logo: "https://www.useclickads.com/icon1.png",
  description: "AI-powered marketing agency offering performance ads, SaaS development, automation, lead generation, analytics and brand design.",
  areaServed: "Worldwide",
  priceRange: "$$",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "ClickAds Services",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "AI Marketing",      description: "AI-powered marketing campaigns with intelligent targeting and optimization." } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "SaaS Development",  description: "Full-stack SaaS product development and deployment." } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Web Development",   description: "Custom web applications and websites." } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "AI Automation",     description: "Workflow automation powered by artificial intelligence." } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Lead Generation",   description: "High-quality lead generation and nurturing." } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Performance Ads",   description: "Data-driven performance advertising campaigns." } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Analytics",         description: "Advanced analytics and data insights." } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Brand Design",      description: "Strategic brand design and visual identity." } },
    ],
  },
};

export default function ServicesPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={serviceSchema} />
      <main id="main-content">
        <Navbar />
        <ServicesHero />
        <ServicesSection />
        <Footer />
      </main>
    </>
  );
}