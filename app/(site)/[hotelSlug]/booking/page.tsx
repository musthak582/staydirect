// app/(site)/[hotelSlug]/booking/page.tsx
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { BookingForm } from '@/components/booking/booking-form'
import { SiteHeader } from '@/components/website/site-header'
import { SiteFooter } from '@/components/website/site-footer'
import { formatCurrency } from '@/lib/utils'
import { BedDouble, Users, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface BookingPageProps {
  params: { hotelSlug: string }
  searchParams: { roomId?: string }
}

export default async function BookingPage({ params, searchParams }: BookingPageProps) {
  const hotel = await prisma.hotel.findUnique({
    where: { slug: params.hotelSlug },
    include: {
      rooms: { where: { isAvailable: true }, orderBy: { price: 'asc' } },
    },
  })

  if (!hotel) notFound()

  const selectedRoom = searchParams.roomId
    ? hotel.rooms.find((r) => r.id === searchParams.roomId)
    : hotel.rooms[0]

  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader hotel={hotel} />

      <div className="mx-auto max-w-5xl px-6 py-12">
        {/* Back link */}
        <Link href={`/${hotel.slug}`}>
          <Button variant="ghost" size="sm" className="mb-6 gap-2 text-slate-600">
            <ArrowLeft className="h-4 w-4" />
            Back to {hotel.name}
          </Button>
        </Link>

        <div className="grid gap-8 lg:grid-cols-5">
          {/* Booking form */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-6">
              <h1 className="text-2xl font-bold text-slate-900 mb-1">Complete your booking</h1>
              <p className="text-sm text-slate-500 mb-6">Fill in your details to confirm your reservation</p>
              <BookingForm
                rooms={hotel.rooms}
                selectedRoomId={selectedRoom?.id}
                hotelSlug={hotel.slug}
                currency={hotel.currency}
              />
            </div>
          </div>

          {/* Booking summary */}
          <div className="lg:col-span-2 space-y-4">
            {selectedRoom && (
              <div className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden">
                <div className="h-40 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                  <BedDouble className="h-14 w-14 text-slate-300" />
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-slate-900 text-lg">{selectedRoom.name}</h3>
                  {selectedRoom.description && (
                    <p className="text-sm text-slate-500 mt-1 line-clamp-2">{selectedRoom.description}</p>
                  )}
                  <div className="mt-3 flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {selectedRoom.capacity} guests
                    </span>
                    <span className="flex items-center gap-1">
                      <BedDouble className="h-3.5 w-3.5" />
                      {selectedRoom.beds} bed{selectedRoom.beds !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm text-slate-500">Rate per night</span>
                      <span className="text-xl font-bold text-slate-900">
                        {formatCurrency(selectedRoom.price, hotel.currency)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Why book direct */}
            <div className="rounded-2xl bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-100 p-5">
              <h4 className="font-semibold text-violet-900 mb-3">Why book direct?</h4>
              <ul className="space-y-2">
                {[
                  'Best rate guaranteed',
                  'No booking fees',
                  'Direct communication with hotel',
                  'Flexible cancellation',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-violet-700">
                    <span className="text-violet-400">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <SiteFooter hotel={hotel} />
    </div>
  )
}
