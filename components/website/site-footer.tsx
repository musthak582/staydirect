// components/website/site-footer.tsx
import Link from 'next/link'
import { Hotel } from 'lucide-react'

interface SiteFooterProps {
  hotel: {
    name: string
    slug: string
    email?: string | null
  }
}

export function SiteFooter({ hotel }: SiteFooterProps) {
  return (
    <footer className="bg-slate-900 py-10">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-bold text-white text-lg">{hotel.name}</p>
            {hotel.email && (
              <p className="text-slate-400 text-sm mt-0.5">{hotel.email}</p>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-slate-500 text-xs">
            <span>Powered by</span>
            <div className="flex items-center gap-1">
              <div className="h-4 w-4 rounded-md bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                <Hotel className="h-2.5 w-2.5 text-white" />
              </div>
              <Link href="/" className="text-slate-400 hover:text-slate-300 font-medium">
                StayDirect
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
