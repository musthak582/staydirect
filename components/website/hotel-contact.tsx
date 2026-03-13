// components/website/hotel-contact.tsx
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

interface Hotel {
  name: string
  address?: string | null
  location?: string | null
  phone?: string | null
  email?: string | null
  checkIn?: string | null
  checkOut?: string | null
}

export function HotelContact({ hotel }: { hotel: Hotel }) {
  const contacts = [
    hotel.address && { icon: MapPin, label: 'Address', value: hotel.address },
    hotel.phone && { icon: Phone, label: 'Phone', value: hotel.phone },
    hotel.email && { icon: Mail, label: 'Email', value: hotel.email },
    (hotel.checkIn || hotel.checkOut) && {
      icon: Clock,
      label: 'Check-in / Check-out',
      value: `${hotel.checkIn || '--:--'} / ${hotel.checkOut || '--:--'}`,
    },
  ].filter(Boolean) as { icon: React.ElementType; label: string; value: string }[]

  if (contacts.length === 0) return null

  return (
    <section id="contact" className="py-20 bg-white border-t border-slate-100">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900">Contact & Location</h2>
          <p className="mt-2 text-slate-500">Get in touch with us directly</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {contacts.map((contact) => (
            <div key={contact.label} className="flex items-start gap-4 rounded-2xl bg-slate-50 p-5">
              <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center shrink-0">
                <contact.icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{contact.label}</p>
                <p className="mt-0.5 text-sm font-medium text-slate-900">{contact.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
