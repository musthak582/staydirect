// app/(dashboard)/dashboard/bookings/page.tsx
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { getBookings } from '@/actions/booking-actions'
import { BookingsTable } from '@/components/dashboard/bookings-table'
import { Card, CardContent } from '@/components/ui/card'
import { CalendarCheck, Clock, CheckCircle, XCircle } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { getHotelByOwner } from '@/actions/hotel-actions'
import { formatCurrency } from '@/lib/utils'

export default async function BookingsPage({
  searchParams,
}: {
  searchParams: { page?: string; status?: string } | Promise<{ page?: string; status?: string }>
}) {
  // unwrap searchParams if it's a Promise
  const sp = searchParams instanceof Promise ? await searchParams : searchParams

  const page = parseInt(sp.page || '1')
  const status = sp.status || 'ALL'

  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const hotel = await getHotelByOwner()
  if (!hotel) redirect('/dashboard/hotel')

  const { bookings, total } = await getBookings(page, 10, status)

  // Summary stats
  const [pending, confirmed, cancelled] = await Promise.all([
    prisma.booking.count({ where: { hotelId: hotel.id, status: 'PENDING' } }),
    prisma.booking.count({ where: { hotelId: hotel.id, status: 'CONFIRMED' } }),
    prisma.booking.count({ where: { hotelId: hotel.id, status: 'CANCELLED' } }),
  ])

  const summaryCards = [
    { label: 'Pending', value: pending, icon: Clock, color: 'text-amber-600 bg-amber-50' },
    { label: 'Confirmed', value: confirmed, icon: CheckCircle, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Cancelled', value: cancelled, icon: XCircle, color: 'text-red-600 bg-red-50' },
    { label: 'Total', value: total, icon: CalendarCheck, color: 'text-violet-600 bg-violet-50' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Bookings</h1>
        <p className="mt-1 text-sm text-slate-500">Manage all reservations for your hotel</p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {summaryCards.map((card) => (
          <Card key={card.label}>
            <CardContent className="flex items-center gap-3 p-4">
              <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${card.color}`}>
                <card.icon className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{card.value}</p>
                <p className="text-xs text-slate-500">{card.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <BookingsTable bookings={bookings} total={total} page={page} status={status} />
    </div>
  )
}
