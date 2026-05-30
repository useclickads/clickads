import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ResourcesHero from "@/components/resources/ResourcesHero";
import ResourcesDocumentation from "@/components/resources/ResourcesDocumentation";
import ResourcesFaqs from "@/components/resources/ResourcesFaqs";
import ResourcesHelpCenter from "@/components/resources/ResourcesHelpCenter";
import type { Metadata } from "next";
import { faqSchema } from "./structured-data";

export const metadata: Metadata = {
  title: "Resources | ClickAds",
  description: "Everything you need to get the most out of ClickAds — documentation, FAQs, and help center all in one place.",
  openGraph: {
    title: "Resources | ClickAds",
    description: "Everything you need to get the most out of ClickAds — documentation, FAQs, and help center all in one place.",
    url: "https://www.useclickads.com/resources",
    type: "website",
  },
  alternates: {
    canonical: "https://www.useclickads.com/resources",
  },
};

export default function ResourcesPage() {
  return (
    <main id="main-content">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Navbar />
      <ResourcesHero />
      <ResourcesDocumentation />
      <ResourcesFaqs />
      <ResourcesHelpCenter />
      <Footer />
    </main>
  );
}
