import type { Metadata } from "next";
import { Orbitron, Rajdhani, Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from 'next/script';

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import SessionProviderWrapper from "@/components/providers/SessionProviderWrapper";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Artisan.gg - Top Up. Play Better.",
  description: "Artisan.gg is a dark-themed mobile-first e-commerce platform for gaming top-ups.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${orbitron.variable} ${rajdhani.variable} ${inter.variable} ${geistMono.variable} antialiased dark`} suppressHydrationWarning={true}>
      <head>
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      </head>
      <body className="min-h-screen bg-[#09090b] text-white" suppressHydrationWarning={true}>
        <SessionProviderWrapper>
          {children}
          <Toaster position="top-right" theme="dark" richColors />
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
