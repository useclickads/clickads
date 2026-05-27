import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "clickAds — AI Marketing Agency & SaaS Studio",
  description: "We build AI-powered growth engines for ambitious businesses.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}