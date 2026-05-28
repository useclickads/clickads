import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ServicesHero from "@/components/services/ServicesHero";
import ServicesSection from "@/components/services/ServicesSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services",
  description:
    "From AI-powered campaigns to full-scale SaaS products — ClickAds engineers growth for businesses that refuse to plateau.",
};

export default function ServicesPage() {
  return (
    <main id="main-content">
      <Navbar />
      <ServicesHero />
      <ServicesSection />
      <Footer />
    </main>
  );
}