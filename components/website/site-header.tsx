// components/website/site-header.tsx
'use client'

import Link from 'next/link'
import { MapPin, Phone, Mail, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Hotel {
  name: string
  slug: string
  location?: string | null
  phone?: string | null
  email?: string | null
}

export function SiteHeader({ hotel }: { hotel: Hotel }) {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex h-16 items-center justify-between">
          <Link href={`/${hotel.slug}`} className="text-lg font-bold text-slate-900">
            {hotel.name}
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => scrollToSection('rooms')}
              className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
            >
              Rooms
            </button>
            <button
              onClick={() => scrollToSection('reviews')}
              className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
            >
              Reviews
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
            >
              Contact
            </button>
          </nav>

          <Button
            onClick={() => scrollToSection('rooms')}
            className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl"
            size="sm"
          >
            Book now
          </Button>
        </div>
      </div>
    </header>
  )
}
