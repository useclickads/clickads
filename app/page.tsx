import dynamic from "next/dynamic";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";

const IntroAnimation = dynamic(
  () => import("@/components/intro/IntroAnimation"),
  { loading: () => null }
);

const Services = dynamic(
  () => import("@/components/home/Services"),
  { loading: () => <SectionSkeleton height={500} /> }
);

const OurProcess = dynamic(
  () => import("@/components/home/OurProcess"),
  { loading: () => <SectionSkeleton height={400} /> }
);

const OurProducts = dynamic(
  () => import("@/components/home/OurProducts"),
  { loading: () => <SectionSkeleton height={500} /> }
);

const CampaignDemo = dynamic(
  () => import("@/components/home/CampaignDemo"),
  { loading: () => <SectionSkeleton height={400} /> }
);

const Pricing = dynamic(
  () => import("@/components/home/Pricing"),
  { loading: () => <SectionSkeleton height={500} /> }
);

const TrustMarquee = dynamic(
  () => import("@/components/home/TrustMarquee"),
  { loading: () => <SectionSkeleton height={100} /> }
);

const BlogPreview = dynamic(
  () => import("@/components/home/BlogPreview"),
  { loading: () => <SectionSkeleton height={400} /> }
);

const CTABanner = dynamic(
  () => import("@/components/home/CTABanner"),
  { loading: () => <SectionSkeleton height={200} /> }
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

export default function Home() {
  return (
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
  );
}