import type { Metadata } from "next";
import "./globals.css";
import { Bebas_Neue, Inter } from 'next/font/google';

const bebasNeue = Bebas_Neue({ 
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-bebas'
});

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter'
});

export const metadata: Metadata = {
  title: "Web Order - Cafe Ordering System",
  description: "QR code based ordering system for cafe",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bebasNeue.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}

