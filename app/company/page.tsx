import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CompanyHero from "@/components/company/CompanyHero";
import CompanyAbout from "@/components/company/CompanyAbout";
import CompanyCareers from "@/components/company/CompanyCareers";
import CompanyPartners from "@/components/company/CompanyPartners";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Company | ClickAds",
  description: "Learn about ClickAds — who we are, what we stand for, and how you can work with us or join our team.",
  openGraph: {
    title: "Company | ClickAds",
    description: "Learn about ClickAds — who we are, what we stand for, and how you can work with us or join our team.",
    url: "https://www.useclickads.com/company",
    type: "website",
  },
  alternates: {
    canonical: "https://www.useclickads.com/company",
  },
};

export default function CompanyPage() {
  return (
    <main id="main-content">
      <Navbar />
      <CompanyHero />
      <CompanyAbout />
      <CompanyCareers />
      <CompanyPartners />
      <Footer />
    </main>
  );
}