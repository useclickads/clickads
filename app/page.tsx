import type { Metadata } from "next";
import HomeClient from "./HomeClient";
import StructuredData from "@/components/StructuredData";

export const metadata: Metadata = {
  title: "ClickAds — AI Marketing Agency & SaaS Studio",
  description: "We build AI-powered growth engines for ambitious businesses. Marketing automation, SaaS development, lead generation and more.",
  openGraph: {
    title: "ClickAds — AI Marketing Agency & SaaS Studio",
    description: "We build AI-powered growth engines for ambitious businesses. Marketing automation, SaaS development, lead generation and more.",
    url: "https://www.useclickads.com",
    type: "website",
  },
  alternates: {
    canonical: "https://www.useclickads.com",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ClickAds",
  url: "https://www.useclickads.com",
  logo: "https://www.useclickads.com/icon1.png",
  description: "AI-powered marketing agency and SaaS studio helping ambitious businesses grow.",
  address: {
    "@type": "PostalAddress",
    addressCountry: "IN",
  },
  sameAs: [
    "https://twitter.com/useclickads",
    "https://linkedin.com/company/useclickads",
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What services does ClickAds offer?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "ClickAds offers AI-powered digital marketing services including paid advertising, SEO, marketing automation, SaaS development, and lead generation for ambitious businesses.",
      },
    },
    {
      "@type": "Question",
      name: "How is ClickAds different from other marketing agencies?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "ClickAds combines AI automation with hands-on campaign management. We build growth systems — not just run ads — so results compound over time.",
      },
    },
    {
      "@type": "Question",
      name: "What industries does ClickAds work with?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We work with B2B services, SaaS companies, travel agencies, fitness businesses, and growth-stage startups across India and globally.",
      },
    },
    {
      "@type": "Question",
      name: "How do I get started with ClickAds?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can get started by visiting our contact page at useclickads.com/contact or booking a free strategy call with our team.",
      },
    },
  ],
};

export default function Home() {
  return (
    <>
      <StructuredData data={organizationSchema} />
      <StructuredData data={faqSchema} />
      <HomeClient />
    </>
  );
}