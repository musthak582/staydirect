// app/layout.tsx
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
// geist package must be installed: npm install geist
import './globals.css'
//import '@uploadthing/react/styles.css'
//import { Toaster } from '@/components/ui/sonner'

export const metadata: Metadata = {
  title: {
    default: 'StayDirect — Direct Booking Platform for Hotels',
    template: '%s | StayDirect',
  },
  description:
    'Build your hotel\'s direct booking website in minutes. Stop paying 15-30% commission to OTAs. Accept direct bookings and increase revenue.',
  keywords: ['hotel booking', 'direct booking', 'hotel website builder', 'no commission bookings'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://staydirect.io',
    title: 'StayDirect — Direct Booking Platform for Hotels',
    description: 'Build your hotel\'s direct booking website. Stop paying OTA commissions.',
    siteName: 'StayDirect',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="min-h-screen bg-slate-50 antialiased">
        {children}
        {/* <Toaster position="top-right" richColors /> */}
      </body>
    </html>
  )
}
