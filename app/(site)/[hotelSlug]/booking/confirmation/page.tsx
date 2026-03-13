// app/(site)/[hotelSlug]/booking/confirmation/page.tsx
import Link from 'next/link'
import { CheckCircle, Calendar, Mail, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ConfirmationPageProps {
  params: { hotelSlug: string }
  searchParams: { bookingId?: string; guestName?: string }
}

export default function ConfirmationPage({ params, searchParams }: ConfirmationPageProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xl p-8">
          <div className="h-16 w-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-8 w-8 text-emerald-600" />
          </div>

          <h1 className="text-2xl font-bold text-slate-900">Booking Confirmed!</h1>
          <p className="mt-2 text-slate-500">
            {searchParams.guestName
              ? `Thank you, ${searchParams.guestName}!`
              : 'Thank you for your booking!'}
          </p>

          <div className="mt-6 space-y-3 text-left">
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
              <Mail className="h-4 w-4 text-slate-400 shrink-0" />
              <p className="text-sm text-slate-600">
                A confirmation has been sent to your email address.
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
              <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
              <p className="text-sm text-slate-600">
                The hotel will contact you to confirm your reservation.
              </p>
            </div>
          </div>

          <div className="mt-6">
            <Link href={`/${params.hotelSlug}`}>
              <Button variant="outline" className="w-full gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to hotel
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
