import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ContactHero from "@/components/contact/ContactHero";
import ContactForm from "@/components/contact/ContactForm";
import ContactProcess from "@/components/contact/ContactProcess";
import JsonLd from "@/components/common/JsonLd";
import type { Metadata } from "next";
import { Suspense } from "react";
import CalendlyWidget from "@/components/CalendlyWidget";

export const metadata: Metadata = {
  title: "Contact | ClickAds",
  description: "Get in touch with ClickAds. Tell us what you're building and we'll map out exactly what needs to happen.",
  openGraph: {
    title: "Contact | ClickAds",
    description: "Get in touch with ClickAds. Tell us what you're building and we'll map out exactly what needs to happen.",
    url: "https://www.useclickads.com/contact",
    type: "website",
  },
  alternates: {
    canonical: "https://www.useclickads.com/contact",
  },
};

export default function ContactPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What services does ClickAds offer?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "ClickAds offers AI marketing, SaaS development, web development, AI automation, lead generation, performance advertising, analytics, and brand design services."
        }
      },
      {
        "@type": "Question",
        "name": "How long does a typical project take?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Project timelines vary based on scope and complexity. We'll provide a detailed timeline during the discovery phase after understanding your requirements."
        }
      },
      {
        "@type": "Question",
        "name": "What's your pricing model?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We offer flexible pricing based on project scope. Contact us to discuss your specific needs and we'll provide a custom quote."
        }
      },
      {
        "@type": "Question",
        "name": "Do you work with startups?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we work with businesses of all sizes, from startups to enterprises. We can tailor our services and pricing to match your stage and budget."
        }
      },
      {
        "@type": "Question",
        "name": "Can you help with our existing project?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely. We can audit existing projects, fix issues, optimize performance, or extend functionality. Let's discuss your specific needs."
        }
      },
      {
        "@type": "Question",
        "name": "How do we get started?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Fill out our contact form above with details about your project. We'll review it and reach out within 24 hours to schedule a discovery call."
        }
      }
    ]
  };

  return (
    <>
      <JsonLd data={faqSchema} />
      <main id="main-content">
        <Navbar />
        <ContactHero />
        <Suspense fallback={null}><ContactForm /></Suspense>
        <CalendlyWidget />
        <ContactProcess />
        <Footer />
      </main>
    </>
  );
}