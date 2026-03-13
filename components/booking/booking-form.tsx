// components/booking/booking-form.tsx
'use client'

import { useState, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Loader2, CalendarDays, Users, User, Mail, Phone,
  MessageSquare, CheckCircle, CreditCard, Banknote, ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createBookingAction, checkAvailabilityAction } from '@/actions/booking-actions'
import { createGuestPaymentSessionAction } from '@/actions/payment-actions'
import { formatCurrency, calculateNights } from '@/lib/utils'
import { toast } from 'sonner'
import { differenceInDays, format, addDays } from 'date-fns'

interface Room {
  id: string
  name: string
  price: number
  capacity: number
}

interface BookingFormProps {
  rooms: Room[]
  selectedRoomId?: string
  hotelSlug: string
  currency: string
}

type Step = 'form' | 'payment'

export function BookingForm({ rooms, selectedRoomId, hotelSlug, currency }: BookingFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [step, setStep] = useState<Step>('form')
  const [createdBookingId, setCreatedBookingId] = useState<string | null>(null)
  const [guestName, setGuestName] = useState('')

  const today = format(new Date(), 'yyyy-MM-dd')
  const tomorrow = format(addDays(new Date(), 1), 'yyyy-MM-dd')

  const [roomId, setRoomId] = useState(selectedRoomId || rooms[0]?.id || '')
  const [checkIn, setCheckIn] = useState(today)
  const [checkOut, setCheckOut] = useState(tomorrow)
  const [guests, setGuests] = useState('2')
  const [availability, setAvailability] = useState<'available' | 'unavailable' | null>(null)
  const [isChecking, setIsChecking] = useState(false)

  const selectedRoom = rooms.find((r) => r.id === roomId)
  const nights = checkIn && checkOut ? differenceInDays(new Date(checkOut), new Date(checkIn)) : 0
  const totalAmount = selectedRoom && nights > 0 ? selectedRoom.price * nights : 0

  useEffect(() => {
    if (!roomId || !checkIn || !checkOut) return
    if (differenceInDays(new Date(checkOut), new Date(checkIn)) <= 0) return

    setIsChecking(true)
    setAvailability(null)

    const timer = setTimeout(async () => {
      try {
        const result = await checkAvailabilityAction(roomId, checkIn, checkOut)
        setAvailability(result.available ? 'available' : 'unavailable')
      } catch {
        setAvailability(null)
      } finally {
        setIsChecking(false)
      }
    }, 600)

    return () => clearTimeout(timer)
  }, [roomId, checkIn, checkOut])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (availability === 'unavailable') {
      toast.error('Room is not available for selected dates')
      return
    }

    const formData = new FormData(e.currentTarget)
    formData.set('roomId', roomId)
    const name = formData.get('guestName') as string
    setGuestName(name)

    startTransition(async () => {
      const result = await createBookingAction(formData)
      if (result.success && result.data) {
        setCreatedBookingId((result.data as any).id)
        setStep('payment')
      } else {
        toast.error(result.error || 'Failed to create booking')
      }
    })
  }

  // --- Payment Step ---
  if (step === 'payment' && createdBookingId) {
    return (
      <PaymentStep
        bookingId={createdBookingId}
        guestName={guestName}
        totalAmount={totalAmount}
        currency={currency}
        hotelSlug={hotelSlug}
      />
    )
  }

  // --- Booking Form Step ---
  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Room selection */}
      <div className="space-y-2">
        <Label>Select Room *</Label>
        <Select value={roomId} onValueChange={setRoomId}>
          <SelectTrigger>
            <SelectValue placeholder="Choose a room" />
          </SelectTrigger>
          <SelectContent>
            {rooms.map((room) => (
              <SelectItem key={room.id} value={room.id}>
                {room.name} — {formatCurrency(room.price, currency)}/night
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="checkIn">
            <CalendarDays className="inline h-3.5 w-3.5 mr-1" />
            Check-in *
          </Label>
          <Input
            id="checkIn"
            name="checkIn"
            type="date"
            min={today}
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="checkOut">
            <CalendarDays className="inline h-3.5 w-3.5 mr-1" />
            Check-out *
          </Label>
          <Input
            id="checkOut"
            name="checkOut"
            type="date"
            min={checkIn || today}
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            required
          />
        </div>
      </div>

      {/* Guests */}
      <div className="space-y-2">
        <Label>
          <Users className="inline h-3.5 w-3.5 mr-1" />
          Number of Guests *
        </Label>
        <Select name="guests" value={guests} onValueChange={setGuests}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: selectedRoom?.capacity || 4 }, (_, i) => i + 1).map((n) => (
              <SelectItem key={n} value={n.toString()}>
                {n} {n === 1 ? 'guest' : 'guests'}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Availability indicator */}
      {nights > 0 && (
        <div
          className={`rounded-xl p-3 text-sm font-medium flex items-center gap-2 ${
            isChecking
              ? 'bg-slate-50 text-slate-500'
              : availability === 'available'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : availability === 'unavailable'
              ? 'bg-red-50 text-red-700 border border-red-200'
              : 'bg-slate-50 text-slate-500'
          }`}
        >
          {isChecking ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Checking availability...
            </>
          ) : availability === 'available' ? (
            <>
              <CheckCircle className="h-4 w-4" />
              Room is available for your dates!
            </>
          ) : availability === 'unavailable' ? (
            <>Room is not available for the selected dates. Please choose different dates.</>
          ) : null}
        </div>
      )}

      <hr className="border-slate-100" />

      {/* Guest details */}
      <p className="text-sm font-semibold text-slate-700">Your Details</p>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="guestName">
            <User className="inline h-3.5 w-3.5 mr-1" />
            Full Name *
          </Label>
          <Input id="guestName" name="guestName" placeholder="John Doe" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="guestEmail">
            <Mail className="inline h-3.5 w-3.5 mr-1" />
            Email Address *
          </Label>
          <Input
            id="guestEmail"
            name="guestEmail"
            type="email"
            placeholder="john@example.com"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="guestPhone">
            <Phone className="inline h-3.5 w-3.5 mr-1" />
            Phone Number
          </Label>
          <Input id="guestPhone" name="guestPhone" type="tel" placeholder="+1 (555) 000-0000" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="guestMessage">
            <MessageSquare className="inline h-3.5 w-3.5 mr-1" />
            Special Requests
          </Label>
          <Textarea
            id="guestMessage"
            name="guestMessage"
            placeholder="Any special requests or notes for the hotel..."
            rows={2}
          />
        </div>
      </div>

      {/* Price summary */}
      {nights > 0 && selectedRoom && (
        <div className="rounded-xl bg-slate-50 border border-slate-100 p-4 space-y-2">
          <div className="flex justify-between text-sm text-slate-600">
            <span>
              {formatCurrency(selectedRoom.price, currency)} × {nights} night
              {nights !== 1 ? 's' : ''}
            </span>
            <span>{formatCurrency(totalAmount, currency)}</span>
          </div>
          <div className="flex justify-between font-bold text-slate-900 pt-2 border-t border-slate-200">
            <span>Total</span>
            <span>{formatCurrency(totalAmount, currency)}</span>
          </div>
        </div>
      )}

      <Button
        type="submit"
        size="lg"
        className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl"
        disabled={isPending || availability === 'unavailable' || nights <= 0}
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          `Continue to Payment${totalAmount > 0 ? ` — ${formatCurrency(totalAmount, currency)}` : ''}`
        )}
      </Button>

      <p className="text-xs text-center text-slate-400">
        By booking, you agree to the hotel&apos;s terms and cancellation policy.
      </p>
    </form>
  )
}

// ---- Payment Step Sub-component ----
function PaymentStep({
  bookingId,
  guestName,
  totalAmount,
  currency,
  hotelSlug,
}: {
  bookingId: string
  guestName: string
  totalAmount: number
  currency: string
  hotelSlug: string
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handlePayNow() {
    startTransition(async () => {
      try {
        const result = await createGuestPaymentSessionAction(bookingId)
        if (result.success && result.url) {
          window.location.href = result.url
        } else {
          toast.error(result.error || 'Failed to initialize payment')
        }
      } catch {
        toast.error('Payment service unavailable. Please contact the hotel directly.')
      }
    })
  }

  function handlePayLater() {
    router.push(
      `/${hotelSlug}/booking/confirmation?bookingId=${bookingId}&guestName=${encodeURIComponent(guestName)}`
    )
  }

  return (
    <div className="space-y-6">
      {/* Success indicator */}
      <div className="flex items-center gap-3 rounded-xl bg-emerald-50 border border-emerald-200 p-4">
        <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-emerald-900">Booking request received!</p>
          <p className="text-xs text-emerald-700 mt-0.5">
            Choose how you&apos;d like to pay to confirm your reservation.
          </p>
        </div>
      </div>

      {/* Amount */}
      <div className="rounded-xl bg-slate-50 border border-slate-100 p-4 text-center">
        <p className="text-sm text-slate-500">Total amount due</p>
        <p className="text-3xl font-black text-slate-900 mt-1">
          {formatCurrency(totalAmount, currency)}
        </p>
      </div>

      {/* Pay options */}
      <div className="space-y-3">
        <Button
          onClick={handlePayNow}
          disabled={isPending}
          size="lg"
          className="w-full bg-violet-600 hover:bg-violet-700 text-white rounded-xl gap-2"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Redirecting to payment...
            </>
          ) : (
            <>
              <CreditCard className="h-4 w-4" />
              Pay now securely with card
              <ArrowRight className="h-4 w-4 ml-auto" />
            </>
          )}
        </Button>

        <Button
          onClick={handlePayLater}
          variant="outline"
          size="lg"
          className="w-full rounded-xl gap-2"
          disabled={isPending}
        >
          <Banknote className="h-4 w-4" />
          Pay at hotel / bank transfer
        </Button>
      </div>

      <p className="text-xs text-center text-slate-400">
        🔒 Card payments processed securely by Stripe. Your details are never stored.
      </p>
    </div>
  )
}
