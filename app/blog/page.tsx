// app/blog/page.tsx

import type { Metadata } from "next";
import Navbar   from "@/components/layout/Navbar";
import Footer   from "@/components/layout/Footer";
import BlogHero from "@/components/blog/BlogHero";
import BlogGrid from "@/components/blog/BlogGrid";

export const metadata: Metadata = {
  title: "Blog — clickAds",
  description:
    "Every post is a lesson from a live campaign. Read it, apply it, measure it.",
  openGraph: {
    title: "Blog — clickAds",
    description:
      "Every post is a lesson from a live campaign. Read it, apply it, measure it.",
    url: "https://www.useclickads.com/blog",
    siteName: "clickAds",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog — clickAds",
    description:
      "Every post is a lesson from a live campaign. Read it, apply it, measure it.",
  },
  alternates: {
    canonical: "https://www.useclickads.com/blog",
  },
};

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main>
        <BlogHero />
        <BlogGrid />
      </main>
      <Footer />
    </>
  );
}