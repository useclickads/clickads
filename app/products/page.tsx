import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductsHero from "@/components/products/ProductsHero";
import ProductsSection from "@/components/products/ProductsSection";
import JsonLd from "@/components/common/JsonLd";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products | ClickAds — Lidflow & GrwFit",
  description: "Purpose-built CRMs for travel agencies and gyms. Lidflow manages leads and bookings. GrwFit tracks members, payments and churn.",
  openGraph: {
    title: "Products | ClickAds — Lidflow & GrwFit",
    description: "Purpose-built CRMs for travel agencies and gyms. Lidflow manages leads and bookings. GrwFit tracks members, payments and churn.",
    url: "https://www.useclickads.com/products",
    type: "website",
  },
  alternates: {
    canonical: "https://www.useclickads.com/products",
  },
};

export default function ProductsPage() {
  const productsSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.useclickads.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Products",
        "item": "https://www.useclickads.com/products"
      }
    ]
  };

  return (
    <>
      <JsonLd data={productsSchema} />
      <main id="main-content">
        <Navbar />
        <ProductsHero />
        <ProductsSection />
        <Footer />
      </main>
    </>
  );
}