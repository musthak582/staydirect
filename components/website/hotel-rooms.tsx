// components/website/hotel-rooms.tsx
import Link from 'next/link'
import { BedDouble, Users, Maximize2, Bath, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'

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
  images: string[]
}

interface HotelRoomsProps {
  rooms: Room[]
  hotelSlug: string
  currency: string
}

export function HotelRooms({ rooms, hotelSlug, currency }: HotelRoomsProps) {
  return (
    <section id="rooms" className="py-20 bg-white">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900">Available Rooms</h2>
          <p className="mt-3 text-slate-500">Select your perfect accommodation</p>
        </div>

        {rooms.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <BedDouble className="h-12 w-12 mx-auto mb-4 opacity-40" />
            <p>No rooms available at the moment. Please contact us directly.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rooms.map((room) => {
              const mainImage = room.images?.[0] || null
              return (
                <div
                  key={room.id}
                  className="group rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                >
                  {/* Room image */}
                  <div className="relative h-52 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
                    {mainImage ? (
                      <img
                        src={mainImage}
                        alt={room.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <BedDouble className="h-14 w-14 text-slate-300" />
                      </div>
                    )}

                    {/* Multiple images badge */}
                    {room.images && room.images.length > 1 && (
                      <div className="absolute top-3 right-3 bg-black/50 text-white text-xs font-medium rounded-lg px-2 py-1">
                        1/{room.images.length}
                      </div>
                    )}

                    {/* Price badge */}
                    <div className="absolute bottom-3 left-3">
                      <span className="bg-white/90 backdrop-blur-sm text-slate-900 text-sm font-bold rounded-xl px-3 py-1.5 shadow-sm">
                        {formatCurrency(room.price, currency)}
                        <span className="text-xs font-normal text-slate-500">/night</span>
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-lg font-bold text-slate-900">{room.name}</h3>
                    {room.description && (
                      <p className="mt-1.5 text-sm text-slate-500 line-clamp-2">{room.description}</p>
                    )}

                    <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 text-slate-400" />
                        {room.capacity} guests
                      </span>
                      <span className="flex items-center gap-1.5">
                        <BedDouble className="h-3.5 w-3.5 text-slate-400" />
                        {room.beds} bed{room.beds !== 1 ? 's' : ''}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Bath className="h-3.5 w-3.5 text-slate-400" />
                        {room.bathrooms} bath
                      </span>
                      {room.size && (
                        <span className="flex items-center gap-1.5">
                          <Maximize2 className="h-3.5 w-3.5 text-slate-400" />
                          {room.size} m²
                        </span>
                      )}
                    </div>

                    {room.amenities.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {room.amenities.slice(0, 4).map((a) => (
                          <Badge key={a} variant="secondary" className="text-xs">
                            {a}
                          </Badge>
                        ))}
                        {room.amenities.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{room.amenities.length - 4}
                          </Badge>
                        )}
                      </div>
                    )}

                    <div className="mt-5">
                      <Link href={`/${hotelSlug}/booking?roomId=${room.id}`}>
                        <Button className="w-full rounded-xl bg-slate-900 hover:bg-slate-800 text-white gap-2 group-hover:bg-violet-600 transition-colors">
                          Book this room
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
