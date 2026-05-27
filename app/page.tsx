import Navbar from "@/components/layout/Navbar";
import IntroAnimation from "@/components/intro/IntroAnimation";
import Hero from "@/components/home/Hero";
import Services from "@/components/home/Services";
import OurProcess from "@/components/home/OurProcess";
import OurProducts from "@/components/home/OurProducts";
import CampaignDemo from "@/components/home/CampaignDemo";
import Pricing from "@/components/home/Pricing";
import TrustMarquee from "@/components/home/TrustMarquee";
import BlogPreview from "@/components/home/BlogPreview";
import CTABanner from "@/components/home/CTABanner";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main>
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