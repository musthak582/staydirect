// components/dashboard/hotel-profile-form.tsx
'use client'

import { useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createHotelAction, updateHotelAction } from '@/actions/hotel-actions'
import { toast } from 'sonner'
import { Loader2, Hotel, MapPin, Phone, Mail, Clock } from 'lucide-react'

interface HotelProfileFormProps {
  hotel?: {
    id: string
    name: string
    slug: string
    description?: string | null
    location?: string | null
    address?: string | null
    phone?: string | null
    email?: string | null
    checkIn?: string | null
    checkOut?: string | null
    currency?: string
    amenities?: string[]
  } | null
}

export function HotelProfileForm({ hotel }: HotelProfileFormProps) {
  const [isPending, startTransition] = useTransition()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const action = hotel ? updateHotelAction : createHotelAction
      const result = await action(formData)
      
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success(hotel ? 'Hotel updated successfully!' : 'Hotel created successfully!')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="name">Hotel Name *</Label>
          <div className="relative">
            <Hotel className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              id="name"
              name="name"
              defaultValue={hotel?.name}
              placeholder="Grand Ocean Hotel"
              className="pl-10"
              required
            />
          </div>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            defaultValue={hotel?.description || ''}
            placeholder="Describe your hotel — highlight unique features, atmosphere, and what makes it special..."
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">City / Location</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              id="location"
              name="location"
              defaultValue={hotel?.location || ''}
              placeholder="Bali, Indonesia"
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Full Address</Label>
          <Input
            id="address"
            name="address"
            defaultValue={hotel?.address || ''}
            placeholder="123 Beach Road, Seminyak"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              id="phone"
              name="phone"
              defaultValue={hotel?.phone || ''}
              placeholder="+1 (555) 000-0000"
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Contact Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={hotel?.email || ''}
              placeholder="reservations@yourhotel.com"
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="checkIn">Check-in Time</Label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              id="checkIn"
              name="checkIn"
              defaultValue={hotel?.checkIn || '14:00'}
              placeholder="14:00"
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="checkOut">Check-out Time</Label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              id="checkOut"
              name="checkOut"
              defaultValue={hotel?.checkOut || '11:00'}
              placeholder="11:00"
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="currency">Currency</Label>
          <Input
            id="currency"
            name="currency"
            defaultValue={hotel?.currency || 'USD'}
            placeholder="USD"
          />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" variant="brand" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            hotel ? 'Update hotel' : 'Create hotel'
          )}
        </Button>
      </div>
    </form>
  )
}
