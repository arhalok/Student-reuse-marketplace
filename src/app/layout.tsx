import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { MarketplaceProvider } from '@/lib/store';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'CampuShare | Campus Student Reuse Marketplace',
  description:
    'Campus-first marketplace for buying, selling, exchanging, renting, and giving away reusable student academic essentials. Buy less. Reuse more. Spend less.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-50 font-sans text-zinc-900">
        <MarketplaceProvider>{children}</MarketplaceProvider>
      </body>
    </html>
  );
}
