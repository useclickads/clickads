import type { Metadata } from "next";
import HomeClient from "./HomeClient";

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
  return <HomeClient />;
}