import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";

export const metadata: Metadata = {
  title: {
    default: 'StayDirect — Zero‑commission booking websites for hotels',
    template: '%s | StayDirect',
  },
  description:
    'Stop paying 15-30% to OTAs. Get your own professional booking website in minutes. Accept direct bookings, manage rooms, and keep every dollar.',
  keywords: [
    'hotel booking system', 
    'direct bookings', 
    'hotel website builder', 
    'commission-free bookings',
    'hotel management software',
    'booking engine'
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://staydirect.com',
    title: 'StayDirect — Zero‑commission booking websites for hotels',
    description: 'Stop paying 15-30% to OTAs. Get your own booking site in minutes.',
    siteName: 'StayDirect',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'StayDirect - Direct bookings for hotels',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StayDirect — Zero‑commission booking websites',
    description: 'Stop paying 15-30% to OTAs. Get your own booking site in minutes.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://staydirect.com',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="min-h-screen bg-white antialiased font-mono">
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
        {children}
      </body>
    </html>
  )
}