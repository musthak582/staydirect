// app/(dashboard)/dashboard/rooms/page.tsx
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { getHotelByOwner } from '@/actions/hotel-actions'
import { prisma } from '@/lib/prisma'
import { RoomsList } from '@/components/dashboard/rooms-list'
import { AddRoomDialog } from '@/components/dashboard/add-room-dialog'
import { Card } from '@/components/ui/card'
import { BedDouble } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function RoomsPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const hotel = await getHotelByOwner()
  if (!hotel) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <BedDouble className="h-12 w-12 text-slate-300 mb-4" />
        <h2 className="text-xl font-bold text-slate-900">Set up your hotel first</h2>
        <p className="mt-2 text-slate-500">Create a hotel profile before adding rooms.</p>
        <Link href="/dashboard/hotel" className="mt-4">
          <Button variant="brand">Create hotel profile</Button>
        </Link>
      </div>
    )
  }

  const rooms = await prisma.room.findMany({
    where: { hotelId: hotel.id },
    orderBy: { createdAt: 'asc' },
    include: {
      _count: { select: { bookings: true } },
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Rooms</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your {rooms.length} room{rooms.length !== 1 ? 's' : ''}
          </p>
        </div>
        <AddRoomDialog />
      </div>
      <RoomsList rooms={rooms} />
    </div>
  )
}
