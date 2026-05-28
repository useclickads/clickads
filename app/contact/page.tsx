import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ContactHero from "@/components/contact/ContactHero";
import ContactForm from "@/components/contact/ContactForm";
import ContactProcess from "@/components/contact/ContactProcess";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with ClickAds. Tell us what you're building and we'll map out exactly what needs to happen.",
};

export default function ContactPage() {
  return (
    <main id="main-content">
      <Navbar />
      <ContactHero />
      <Suspense fallback={null}><ContactForm /></Suspense>
      <ContactProcess />
      <Footer />
    </main>
  );
}