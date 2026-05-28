import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductsHero from "@/components/products/ProductsHero";
import ProductsSection from "@/components/products/ProductsSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Purpose-built CRMs for industries that move fast. Lidflow for travel agencies. GrwFit for gyms and fitness studios.",
};

export default function ProductsPage() {
  return (
    <main id="main-content">
      <Navbar />
      <ProductsHero />
      <ProductsSection />
      <Footer />
    </main>
  );
}