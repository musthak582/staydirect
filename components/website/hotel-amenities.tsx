// components/website/hotel-amenities.tsx
import { Wifi, Car, Coffee, Dumbbell, Spool, Utensils, Wind, Tv } from 'lucide-react'

const amenityIcons: Record<string, React.ReactNode> = {
  wifi: <Wifi className="h-5 w-5" />,
  parking: <Car className="h-5 w-5" />,
  breakfast: <Coffee className="h-5 w-5" />,
  gym: <Dumbbell className="h-5 w-5" />,
  pool: <Spool className="h-5 w-5" />,
  restaurant: <Utensils className="h-5 w-5" />,
  ac: <Wind className="h-5 w-5" />,
  tv: <Tv className="h-5 w-5" />,
}

export function HotelAmenities({ amenities }: { amenities: string[] }) {
  return (
    <section className="py-16 bg-white border-t border-slate-100">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-8">Hotel Amenities</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {amenities.map((amenity) => {
            const key = amenity.toLowerCase()
            const icon = amenityIcons[key]
            return (
              <div
                key={amenity}
                className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3"
              >
                <div className="text-slate-500">
                  {icon || <span className="h-5 w-5 text-slate-400">✓</span>}
                </div>
                <span className="text-sm font-medium text-slate-700">{amenity}</span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
