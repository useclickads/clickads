import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// ─── Font optimisation ────────────────────────────────────────────────────────
// next/font automatically:
//   • Self-hosts the font (no render-blocking Google Fonts network request)
//   • Adds font-display: swap (text stays visible while font loads)
//   • Eliminates layout shift from font loading (fixes CLS)
//   • Preloads only the subsets you actually use
const inter = Inter({
  subsets: ["latin"],
  display: "swap",          // show fallback font immediately, swap when ready
  preload: true,            // preload the font file in <head>
  variable: "--font-inter", // exposes as CSS variable if needed
  // Only include weights you actually use — reduces font file size
  weight: ["400", "500", "600", "700"],
});

// ─── Metadata ─────────────────────────────────────────────────────────────────
// Moved to proper Metadata object — Next.js renders these in <head> correctly
export const metadata: Metadata = {
  title: {
    default: "clickAds — AI Marketing Agency & SaaS Studio",
    // Template for inner pages: "About | clickAds"
    template: "%s | clickAds",
  },
  description: "We build AI-powered growth engines for ambitious businesses.",

  // ── Open Graph (social sharing) ──────────────────────────────────────────
  openGraph: {
    title: "clickAds — AI Marketing Agency & SaaS Studio",
    description: "We build AI-powered growth engines for ambitious businesses.",
    url: "https://www.useclickads.com",
    siteName: "clickAds",
    locale: "en_US",
    type: "website",
    // Add your OG image:
    // images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },

  // ── Twitter card ─────────────────────────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    title: "clickAds — AI Marketing Agency & SaaS Studio",
    description: "We build AI-powered growth engines for ambitious businesses.",
    // images: ['/og-image.jpg'],
  },

  // ── Canonical URL (important for SEO) ────────────────────────────────────
  alternates: {
    canonical: "https://www.useclickads.com",
  },

  // ── Robots ───────────────────────────────────────────────────────────────
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

  // ── Icons ────────────────────────────────────────────────────────────────
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

// ─── Viewport (separate export — Next.js 14+ requirement) ────────────────────
// Fixes: missing viewport meta warning in Lighthouse
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,          // allow zoom for accessibility (don't set to 1)
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0d0d0d" },
  ],
};

// ─── Layout ───────────────────────────────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Preconnect to any external origins your site uses.
            Add/remove based on your actual third-party services. */}

        {/* Example: if you use Google Analytics */}
        {/* <link rel="preconnect" href="https://www.googletagmanager.com" /> */}

        {/* Example: if you use an external video/media CDN */}
        {/* <link rel="preconnect" href="https://cdn.useclickads.com" /> */}

        {/* DNS prefetch for less critical third parties */}
        {/* <link rel="dns-prefetch" href="https://widget.intercom.io" /> */}
      </head>
      <body
        className={inter.className}
        suppressHydrationWarning // keeps your existing setting
      >
        {children}
      </body>
    </html>
  );
}