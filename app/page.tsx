import dynamic from "next/dynamic";
import Hero from "@/components/home/Hero";
import JsonLd from "@/components/common/JsonLd";
import type { Metadata } from "next";

const Navbar = dynamic(() => import("@/components/layout/Navbar"), {
  loading: () => null,
});

const IntroAnimation = dynamic(
  () => import("@/components/intro/IntroAnimation"),
  { loading: () => null, ssr: false }
);

const Services = dynamic(
  () => import("@/components/home/Services"),
  { loading: () => <SectionSkeleton height={500} />, ssr: false }
);

const OurProcess = dynamic(
  () => import("@/components/home/OurProcess"),
  { loading: () => <SectionSkeleton height={400} />, ssr: false }
);

const OurProducts = dynamic(
  () => import("@/components/home/OurProducts"),
  { loading: () => <SectionSkeleton height={500} />, ssr: false }
);

const CampaignDemo = dynamic(
  () => import("@/components/home/CampaignDemo"),
  { loading: () => <SectionSkeleton height={400} />, ssr: false }
);

const Pricing = dynamic(
  () => import("@/components/home/Pricing"),
  { loading: () => <SectionSkeleton height={500} />, ssr: false }
);

const TrustMarquee = dynamic(
  () => import("@/components/home/TrustMarquee"),
  { loading: () => <SectionSkeleton height={100} />, ssr: false }
);

const BlogPreview = dynamic(
  () => import("@/components/home/BlogPreview"),
  { loading: () => <SectionSkeleton height={400} />, ssr: false }
);

const CTABanner = dynamic(
  () => import("@/components/home/CTABanner"),
  { loading: () => <SectionSkeleton height={200} />, ssr: false }
);

const Footer = dynamic(
  () => import("@/components/layout/Footer"),
  { loading: () => <SectionSkeleton height={300} /> }
);

function SectionSkeleton({ height }: { height: number }) {
  return (
    <div
      aria-hidden="true"
      style={{ width: "100%", height: `${height}px`, background: "transparent" }}
    />
  );
}

// SEO Metadata for Homepage
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

export default function Home() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "ClickAds",
    "url": "https://www.useclickads.com",
    "logo": "https://www.useclickads.com/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-9334433557",
      "contactType": "customer service",
      "email": "contact@useclickads.com"
    },
    "sameAs": [
      "https://twitter.com/useclickads",
      "https://linkedin.com/company/useclickads",
      "https://instagram.com/useclickads"
    ]
  };

  return (
    <>
      <JsonLd data={organizationSchema} />
      <main id="main-content">
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
    </>
  );
}