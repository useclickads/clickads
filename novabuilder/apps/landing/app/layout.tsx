import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'NovaBuilder',
  description: 'Enterprise AI-native no-code website builder.'
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
