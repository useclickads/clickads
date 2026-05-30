"use client";

import dynamic from "next/dynamic";
import React from "react";

function SectionSkeleton({ height }: { height: number }) {
  return <div aria-hidden="true" style={{ width: "100%", height: `${height}px`, background: "transparent" }} />;
}

const Navbar = dynamic(() => import("@/components/layout/Navbar"), { loading: () => null, ssr: false });
const IntroAnimation = dynamic(() => import("@/components/intro/IntroAnimation"), { loading: () => null, ssr: false });
const Hero = dynamic(() => import("@/components/home/Hero"), { loading: () => <SectionSkeleton height={320} />, ssr: false });
const Services = dynamic(() => import("@/components/home/Services"), { loading: () => <SectionSkeleton height={500} />, ssr: false });
const OurProcess = dynamic(() => import("@/components/home/OurProcess"), { loading: () => <SectionSkeleton height={400} />, ssr: false });
const OurProducts = dynamic(() => import("@/components/home/OurProducts"), { loading: () => <SectionSkeleton height={500} />, ssr: false });
const CampaignDemo = dynamic(() => import("@/components/home/CampaignDemo"), { loading: () => <SectionSkeleton height={400} />, ssr: false });
const Pricing = dynamic(() => import("@/components/home/Pricing"), { loading: () => <SectionSkeleton height={500} />, ssr: false });
const TrustMarquee = dynamic(() => import("@/components/home/TrustMarquee"), { loading: () => <SectionSkeleton height={100} />, ssr: false });
const BlogPreview = dynamic(() => import("@/components/home/BlogPreview"), { loading: () => <SectionSkeleton height={400} />, ssr: false });
const CTABanner = dynamic(() => import("@/components/home/CTABanner"), { loading: () => <SectionSkeleton height={200} />, ssr: false });
const Footer = dynamic(() => import("@/components/layout/Footer"), { loading: () => <SectionSkeleton height={300} />, ssr: false });
const JsonLd = dynamic(() => import("@/components/common/JsonLd"), { loading: () => null, ssr: false });

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "ClickAds",
  "url": "https://www.useclickads.com",
  "logo": "https://www.useclickads.com/logo.png",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+91-9334433557",
    "email": "contact@useclickads.com",
    "contactType": "customer service",
  },
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "D-12, Akshardham",
    "addressLocality": "New Delhi",
    "addressRegion": "Delhi",
    "postalCode": "110092",
    "addressCountry": "IN",
  },
  "sameAs": [
    "https://twitter.com/useclickads",
    "https://www.linkedin.com/company/useclickads",
    "https://www.instagram.com/useclickads/",
    "https://www.facebook.com/useclickads",
    "https://www.youtube.com/@UseClickAds",
  ],
};

export default function HomeClient() {
  return (
    <main id="main-content">
      <JsonLd data={organizationSchema} />
      <IntroAnimation />
      <Navbar />
      <Hero />
      <Services />
      <OurProcess />
      <OurProducts />
      <CampaignDemo />
      <Pricing />
      <TrustMarquee />
      <BlogPreview />
      <CTABanner />
      <Footer />
    </main>
  );
}
