// components/dashboard/rooms-list.tsx
'use client'

import { useState, useTransition } from 'react'
import { BedDouble, Users, Maximize2, Edit, Trash2, MoreVertical, ImageIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { deleteRoomAction } from '@/actions/room-actions'
import { formatCurrency } from '@/lib/utils'
import { toast } from 'sonner'
import { EditRoomDialog } from './edit-room-dialog'

interface Room {
  id: string
  name: string
  description?: string | null
  price: number
  capacity: number
  beds: number
  bathrooms: number
  size?: number | null
  amenities: string[]
  isAvailable: boolean
  images: string[]
  _count?: { bookings: number }
}

interface RoomsListProps {
  rooms: Room[]
}

export function RoomsList({ rooms }: RoomsListProps) {
  const [isPending, startTransition] = useTransition()
  const [editingRoom, setEditingRoom] = useState<Room | null>(null)

  if (rooms.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="h-16 w-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-4">
            <BedDouble className="h-8 w-8 text-slate-300" />
          </div>
          <h3 className="text-lg font-semibold text-slate-700">No rooms yet</h3>
          <p className="mt-1 text-sm text-slate-400 max-w-sm">
            Add your first room to start accepting bookings.
          </p>
        </CardContent>
      </Card>
    )
  }

  function handleDelete(roomId: string) {
    if (!confirm('Are you sure you want to delete this room?')) return
    startTransition(async () => {
      const result = await deleteRoomAction(roomId)
      if (result.success) toast.success('Room deleted')
      else toast.error(result.error || 'Failed to delete room')
    })
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {rooms.map((room) => {
          const mainImage = room.images?.[0] || null
          return (
            <Card key={room.id} className="overflow-hidden hover:shadow-md transition-shadow group">
              {/* Room image */}
              <div className="relative h-44 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
                {mainImage ? (
                  <img
                    src={mainImage}
                    alt={room.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                    <BedDouble className="h-10 w-10 text-slate-300" />
                    <span className="text-xs text-slate-400">No photo</span>
                  </div>
                )}

                {/* Image count */}
                {room.images && room.images.length > 0 && (
                  <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/50 text-white text-xs rounded-lg px-2 py-0.5">
                    <ImageIcon className="h-3 w-3" />
                    {room.images.length}
                  </div>
                )}

                {/* Availability badge */}
                <div className="absolute top-3 right-3">
                  <Badge variant={room.isAvailable ? 'success' : 'destructive'} className="text-xs">
                    {room.isAvailable ? 'Available' : 'Unavailable'}
                  </Badge>
                </div>

                {/* Actions menu */}
                <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon" className="h-7 w-7 bg-white shadow-sm">
                        <MoreVertical className="h-3.5 w-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem onClick={() => setEditingRoom(room)}>
                        <Edit className="h-4 w-4" /> Edit room
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDelete(room.id)}
                        className="text-red-600 focus:text-red-600 focus:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" /> Delete room
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-1.5">
                  <h3 className="font-semibold text-slate-900">{room.name}</h3>
                  <span className="text-base font-bold text-violet-600">
                    {formatCurrency(room.price)}
                    <span className="text-xs font-normal text-slate-400">/n</span>
                  </span>
                </div>

                {room.description && (
                  <p className="text-xs text-slate-500 line-clamp-2 mb-3">{room.description}</p>
                )}

                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />{room.capacity}
                  </span>
                  <span className="flex items-center gap-1">
                    <BedDouble className="h-3.5 w-3.5" />{room.beds} bed
                  </span>
                  {room.size && (
                    <span className="flex items-center gap-1">
                      <Maximize2 className="h-3.5 w-3.5" />{room.size}m²
                    </span>
                  )}
                </div>

                {room.amenities.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1">
                    {room.amenities.slice(0, 3).map((a) => (
                      <Badge key={a} variant="secondary" className="text-xs">{a}</Badge>
                    ))}
                    {room.amenities.length > 3 && (
                      <Badge variant="outline" className="text-xs">+{room.amenities.length - 3}</Badge>
                    )}
                  </div>
                )}

                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    {room._count?.bookings || 0} booking{(room._count?.bookings || 0) !== 1 ? 's' : ''}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs gap-1"
                    onClick={() => setEditingRoom(room)}
                  >
                    <Edit className="h-3 w-3" /> Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {editingRoom && (
        <EditRoomDialog
          room={editingRoom}
          open={!!editingRoom}
          onClose={() => setEditingRoom(null)}
        />
      )}
    </>
  )
}
