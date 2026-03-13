// components/website/hotel-hero.tsx
import { MapPin, Star, Calendar } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface Hotel {
  name: string
  description?: string | null
  location?: string | null
  images?: string[]
  checkIn?: string | null
  checkOut?: string | null
}

interface HotelHeroProps {
  hotel: Hotel
  avgRating: number | null
  reviewCount: number
}

export function HotelHero({ hotel, avgRating, reviewCount }: HotelHeroProps) {
  const hasImage = hotel.images && hotel.images.length > 0
  const mainImage = hasImage ? hotel.images![0] : null

  return (
    <section className="relative overflow-hidden">
      <div className="relative h-[520px] overflow-hidden">
        {/* Background: real image or gradient fallback */}
        {mainImage ? (
          <img
            src={mainImage}
            alt={hotel.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900">
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Thumbnail strip (if multiple images) */}
        {hotel.images && hotel.images.length > 1 && (
          <div className="absolute bottom-20 right-6 flex gap-2">
            {hotel.images.slice(1, 5).map((img, i) => (
              <div
                key={i}
                className="h-14 w-20 rounded-lg overflow-hidden border-2 border-white/30 shadow-lg"
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
            {hotel.images.length > 5 && (
              <div className="h-14 w-20 rounded-lg bg-black/50 border-2 border-white/30 flex items-center justify-center">
                <span className="text-white text-xs font-bold">+{hotel.images.length - 5}</span>
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto max-w-6xl w-full px-6 pb-16">
            {hotel.location && (
              <div className="flex items-center gap-1.5 text-white/80 text-sm mb-3">
                <MapPin className="h-4 w-4" />
                {hotel.location}
              </div>
            )}
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              {hotel.name}
            </h1>
            {hotel.description && (
              <p className="mt-3 text-lg text-white/80 max-w-2xl leading-relaxed line-clamp-2">
                {hotel.description}
              </p>
            )}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {avgRating && (
                <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm rounded-xl px-3 py-1.5">
                  <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                  <span className="text-white font-semibold text-sm">{avgRating.toFixed(1)}</span>
                  <span className="text-white/60 text-sm">({reviewCount} reviews)</span>
                </div>
              )}
              {hotel.checkIn && (
                <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm rounded-xl px-3 py-1.5">
                  <Calendar className="h-4 w-4 text-white/80" />
                  <span className="text-white/90 text-sm">Check-in: {hotel.checkIn}</span>
                </div>
              )}
              {hotel.checkOut && (
                <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm rounded-xl px-3 py-1.5">
                  <Calendar className="h-4 w-4 text-white/80" />
                  <span className="text-white/90 text-sm">Check-out: {hotel.checkOut}</span>
                </div>
              )}
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-400/30 backdrop-blur-sm">
                ✓ Best rate guaranteed — Book direct
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
