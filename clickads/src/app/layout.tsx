import type { Metadata } from 'next';
import { Barlow_Condensed, Barlow } from 'next/font/google';
import './globals.css';
import CursorGlow from './components/CursorGlow';

const barlowCondensed = Barlow_Condensed({
  variable: '--font-heading',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
});

const barlow = Barlow({
  variable: '--font-body',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'ClickAds — AI Marketing Agency',
  description: 'AI-powered marketing agency helping brands scale with data-driven campaigns, automation & in-house SaaS products.',
  keywords: 'digital marketing, google ads, meta ads, SEO, AI marketing, travel CRM, gym management',
  openGraph: {
    title: 'ClickAds — AI Marketing Agency',
    description: 'AI-powered marketing agency helping brands scale.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${barlowCondensed.variable} ${barlow.variable}`}
        style={{
          margin: 0, padding: 0,
          background: '#0a0a0a',
          cursor: 'none',
          fontFamily: 'var(--font-body), sans-serif',
        }}
      >
        <CursorGlow />
        {children}
      </body>
    </html>
  );
}