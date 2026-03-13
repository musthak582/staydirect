// components/dashboard/bookings-table.tsx
'use client'

import { useState, useTransition } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { updateBookingStatusAction, updatePaymentStatusAction } from '@/actions/booking-actions'
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils'
import { toast } from 'sonner'
import { ChevronLeft, ChevronRight, Calendar, CreditCard } from 'lucide-react'
import { PaymentPanel } from './payment-panel'

interface Booking {
  id: string
  guestName: string
  guestEmail: string
  guestPhone?: string | null
  checkIn: Date
  checkOut: Date
  guests: number
  nights: number
  totalAmount: number
  status: string
  paymentStatus: string
  createdAt: Date
  room: { id: string; name: string; price: number }
}

interface BookingsTableProps {
  bookings: Booking[]
  total: number
  page: number
  status: string
}

export function BookingsTable({ bookings, total, page, status }: BookingsTableProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  const [paymentBooking, setPaymentBooking] = useState<Booking | null>(null)

  const totalPages = Math.ceil(total / 10)

  function handleStatusFilter(value: string) {
    const params = new URLSearchParams()
    params.set('status', value)
    params.set('page', '1')
    router.push(`${pathname}?${params.toString()}`)
  }

  function handlePage(newPage: number) {
    const params = new URLSearchParams()
    params.set('status', status)
    params.set('page', newPage.toString())
    router.push(`${pathname}?${params.toString()}`)
  }

  function handleStatusChange(bookingId: string, newStatus: string) {
    startTransition(async () => {
      const result = await updateBookingStatusAction(bookingId, newStatus)
      if (result.success) toast.success('Booking status updated')
      else toast.error(result.error || 'Failed to update status')
    })
  }

  function handlePaymentChange(bookingId: string, newStatus: string) {
    startTransition(async () => {
      const result = await updatePaymentStatusAction(bookingId, newStatus)
      if (result.success) toast.success('Payment status updated')
      else toast.error(result.error || 'Failed to update payment')
    })
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-base">All Bookings ({total})</CardTitle>
          <Select value={status} onValueChange={handleStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All bookings</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="CONFIRMED">Confirmed</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>

        <CardContent className="p-0">
          {bookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Calendar className="h-8 w-8 text-slate-300 mb-3" />
              <p className="text-sm font-medium text-slate-600">No bookings found</p>
              <p className="text-xs text-slate-400 mt-1">
                Bookings will appear here once guests make reservations
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    {['Guest', 'Room', 'Dates', 'Amount', 'Status', 'Payment', 'Actions'].map(
                      (h) => (
                        <th
                          key={h}
                          className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3 first:px-6"
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors">
                      {/* Guest */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {booking.guestName[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900">
                              {booking.guestName}
                            </p>
                            <p className="text-xs text-slate-400">{booking.guestEmail}</p>
                          </div>
                        </div>
                      </td>

                      {/* Room */}
                      <td className="px-4 py-4">
                        <p className="text-sm text-slate-700">{booking.room.name}</p>
                        <p className="text-xs text-slate-400">
                          {booking.guests} guest{booking.guests !== 1 ? 's' : ''}
                        </p>
                      </td>

                      {/* Dates */}
                      <td className="px-4 py-4">
                        <p className="text-sm text-slate-700">{formatDate(booking.checkIn)}</p>
                        <p className="text-xs text-slate-400">
                          → {formatDate(booking.checkOut)} · {booking.nights}n
                        </p>
                      </td>

                      {/* Amount */}
                      <td className="px-4 py-4">
                        <p className="text-sm font-semibold text-slate-900">
                          {formatCurrency(booking.totalAmount)}
                        </p>
                      </td>

                      {/* Booking Status */}
                      <td className="px-4 py-4">
                        <Select
                          value={booking.status}
                          onValueChange={(val) => handleStatusChange(booking.id, val)}
                          disabled={isPending}
                        >
                          <SelectTrigger
                            className={`h-7 w-32 text-xs border ${getStatusColor(booking.status)}`}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PENDING">Pending</SelectItem>
                            <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                            <SelectItem value="CANCELLED">Cancelled</SelectItem>
                            <SelectItem value="COMPLETED">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>

                      {/* Payment Status */}
                      <td className="px-4 py-4">
                        <Select
                          value={booking.paymentStatus}
                          onValueChange={(val) => handlePaymentChange(booking.id, val)}
                          disabled={isPending}
                        >
                          <SelectTrigger
                            className={`h-7 w-24 text-xs border ${getStatusColor(booking.paymentStatus)}`}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="UNPAID">Unpaid</SelectItem>
                            <SelectItem value="PENDING">Pending</SelectItem>
                            <SelectItem value="PAID">Paid</SelectItem>
                            <SelectItem value="REFUNDED">Refunded</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-4">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs gap-1.5 text-violet-700 border-violet-200 hover:bg-violet-50"
                          onClick={() => setPaymentBooking(booking)}
                        >
                          <CreditCard className="h-3 w-3" />
                          Pay
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
              <p className="text-sm text-slate-500">
                Page {page} of {totalPages} · {total} total
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePage(page - 1)}
                  disabled={page <= 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePage(page + 1)}
                  disabled={page >= totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {paymentBooking && (
        <PaymentPanel
          booking={paymentBooking}
          open={!!paymentBooking}
          onClose={() => setPaymentBooking(null)}
        />
      )}
    </>
  )
}
