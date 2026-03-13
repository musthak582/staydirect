// app/(site)/[hotelSlug]/rooms/page.tsx
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { SiteHeader } from '@/components/website/site-header'
import { SiteFooter } from '@/components/website/site-footer'
import { HotelRooms } from '@/components/website/hotel-rooms'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface RoomsPageProps {
  params: { hotelSlug: string }
  searchParams: { checkIn?: string; checkOut?: string; guests?: string }
}

export async function generateMetadata({ params }: RoomsPageProps) {
  const hotel = await prisma.hotel.findUnique({ where: { slug: params.hotelSlug } })
  if (!hotel) return { title: 'Rooms Not Found' }
  return { title: `Rooms — ${hotel.name}`, description: `Browse all available rooms at ${hotel.name}` }
}

export default async function HotelRoomsPage({ params, searchParams }: RoomsPageProps) {
  const hotel = await prisma.hotel.findUnique({
    where: { slug: params.hotelSlug },
    include: {
      rooms: {
        where: { isAvailable: true },
        orderBy: { price: 'asc' },
      },
    },
  })

  if (!hotel) notFound()

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader hotel={hotel} />

      {/* Page header */}
      <div className="bg-slate-900 py-12">
        <div className="mx-auto max-w-6xl px-6">
          <Link href={`/${hotel.slug}`}>
            <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10 gap-2 mb-4">
              <ArrowLeft className="h-4 w-4" />
              Back to {hotel.name}
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-white">All Rooms & Suites</h1>
          <p className="mt-2 text-slate-300">
            {hotel.rooms.length} room{hotel.rooms.length !== 1 ? 's' : ''} available · Best rates guaranteed when booking direct
          </p>
        </div>
      </div>

      <HotelRooms rooms={hotel.rooms} hotelSlug={hotel.slug} currency={hotel.currency} />

      <SiteFooter hotel={hotel} />
    </div>
  )
}
