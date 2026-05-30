import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "clickAds — AI Marketing Agency & SaaS Studio",
    template: "%s | clickAds",
  },
  description: "We build AI-powered growth engines for ambitious businesses.",
  openGraph: {
    title: "clickAds — AI Marketing Agency & SaaS Studio",
    description: "We build AI-powered growth engines for ambitious businesses.",
    url: "https://www.useclickads.com",
    siteName: "clickAds",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "clickAds — AI Marketing Agency & SaaS Studio",
    description: "We build AI-powered growth engines for ambitious businesses.",
  },
  alternates: {
    canonical: "https://www.useclickads.com",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0d0d0d" },
  ],
};

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        {/* Preload CSS with async loading to prevent render-blocking */}
        <link
          rel="preload"
          as="style"
          href="/_next/static/css/app.css"
          onLoad={(e: any) => {
            e.rel = 'stylesheet';
          }}
          onError={(e: any) => {
            e.rel = 'stylesheet';
          }}
        />
        <noscript>
          <link rel="stylesheet" href="/_next/static/css/app.css" />
        </noscript>
      </head>
      <body
        className={inter.className}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}