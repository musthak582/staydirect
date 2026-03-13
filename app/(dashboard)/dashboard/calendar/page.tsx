// app/(dashboard)/dashboard/calendar/page.tsx
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { getHotelByOwner } from '@/actions/hotel-actions'
import { prisma } from '@/lib/prisma'
import { AvailabilityCalendar } from '@/components/dashboard/availability-calendar'
import { startOfMonth, endOfMonth, addMonths } from 'date-fns'

export default async function CalendarPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const hotel = await getHotelByOwner()
  if (!hotel) redirect('/dashboard/hotel')

  // Fetch bookings for next 3 months
  const start = startOfMonth(new Date())
  const end = endOfMonth(addMonths(new Date(), 2))

  const bookings = await prisma.booking.findMany({
    where: {
      hotelId: hotel.id,
      status: { not: 'CANCELLED' },
      OR: [
        { checkIn: { gte: start, lte: end } },
        { checkOut: { gte: start, lte: end } },
        { AND: [{ checkIn: { lte: start } }, { checkOut: { gte: end } }] },
      ],
    },
    include: { room: { select: { id: true, name: true } } },
    orderBy: { checkIn: 'asc' },
  })

  const rooms = await prisma.room.findMany({
    where: { hotelId: hotel.id },
    orderBy: { createdAt: 'asc' },
    select: { id: true, name: true, price: true },
  })

  // Serialize dates for client
  const serializedBookings = bookings.map((b) => ({
    id: b.id,
    guestName: b.guestName,
    guestEmail: b.guestEmail,
    checkIn: b.checkIn.toISOString(),
    checkOut: b.checkOut.toISOString(),
    nights: b.nights,
    guests: b.guests,
    totalAmount: b.totalAmount,
    status: b.status,
    paymentStatus: b.paymentStatus,
    room: b.room,
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Availability Calendar</h1>
        <p className="mt-1 text-sm text-slate-500">
          Visual overview of all bookings and room availability
        </p>
      </div>
      <AvailabilityCalendar bookings={serializedBookings} rooms={rooms} />
    </div>
  )
}
