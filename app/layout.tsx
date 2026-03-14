import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Axiom — Authentication Infrastructure for Modern SaaS',
    template: '%s | Axiom',
  },
  description:
    'Ship authentication in minutes. Email, password, Google OAuth, email verification, and session management — all pre-configured and production-ready.',
  keywords: ['authentication', 'auth', 'saas', 'login', 'oauth', 'session management', 'better-auth'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://axiom.dev',
    title: 'Axiom — Authentication Infrastructure for Modern SaaS',
    description: 'Ship authentication in minutes. Stop building auth from scratch.',
    siteName: 'Axiom',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="min-h-screen bg-white antialiased">
        {children}
      </body>
    </html>
  )
}