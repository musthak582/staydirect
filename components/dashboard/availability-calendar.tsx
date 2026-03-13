// components/dashboard/availability-calendar.tsx
'use client'

import { useState, useMemo } from 'react'
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isWithinInterval,
  addMonths,
  subMonths,
  parseISO,
  isToday,
  differenceInDays,
} from 'date-fns'
import { ChevronLeft, ChevronRight, Circle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, getStatusColor } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

interface BookingData {
  id: string
  guestName: string
  guestEmail: string
  checkIn: string
  checkOut: string
  nights: number
  guests: number
  totalAmount: number
  status: string
  paymentStatus: string
  room: { id: string; name: string }
}

interface Room {
  id: string
  name: string
  price: number
}

interface AvailabilityCalendarProps {
  bookings: BookingData[]
  rooms: Room[]
}

const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  CONFIRMED: { bg: 'bg-emerald-100', text: 'text-emerald-800', dot: 'bg-emerald-500' },
  PENDING:   { bg: 'bg-amber-100',   text: 'text-amber-800',   dot: 'bg-amber-500'   },
  CANCELLED: { bg: 'bg-red-100',     text: 'text-red-800',     dot: 'bg-red-400'     },
  COMPLETED: { bg: 'bg-blue-100',    text: 'text-blue-800',    dot: 'bg-blue-500'    },
}

export function AvailabilityCalendar({ bookings, rooms }: AvailabilityCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedBooking, setSelectedBooking] = useState<BookingData | null>(null)
  const [selectedRoomFilter, setSelectedRoomFilter] = useState<string>('ALL')

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const filteredRooms = selectedRoomFilter === 'ALL'
    ? rooms
    : rooms.filter((r) => r.id === selectedRoomFilter)

  // For each room, find which days have bookings
  const roomBookingMap = useMemo(() => {
    const map: Record<string, BookingData[]> = {}
    for (const room of rooms) {
      map[room.id] = bookings.filter((b) => b.room.id === room.id)
    }
    return map
  }, [bookings, rooms])

  function getBookingForDay(roomId: string, day: Date): BookingData | null {
    const roomBookings = roomBookingMap[roomId] || []
    return (
      roomBookings.find((b) => {
        const checkIn = parseISO(b.checkIn)
        const checkOut = parseISO(b.checkOut)
        return isWithinInterval(day, { start: checkIn, end: checkOut }) &&
          !isSameDay(day, checkOut) // checkout day is available
      }) || null
    )
  }

  function isCheckInDay(booking: BookingData, day: Date): boolean {
    return isSameDay(parseISO(booking.checkIn), day)
  }

  function isCheckOutDay(booking: BookingData, day: Date): boolean {
    return isSameDay(parseISO(booking.checkOut), day)
  }

  const totalBooked = bookings.filter((b) => b.status !== 'CANCELLED').length
  const totalConfirmed = bookings.filter((b) => b.status === 'CONFIRMED').length
  const totalPending = bookings.filter((b) => b.status === 'PENDING').length

  return (
    <>
      <div className="space-y-4">
        {/* Summary row */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'This Month', value: totalBooked, color: 'text-slate-900' },
            { label: 'Confirmed', value: totalConfirmed, color: 'text-emerald-700' },
            { label: 'Pending', value: totalPending, color: 'text-amber-700' },
            { label: 'Rooms', value: rooms.length, color: 'text-violet-700' },
          ].map((s) => (
            <Card key={s.label}>
              <CardContent className="p-4">
                <p className="text-xs text-slate-500">{s.label}</p>
                <p className={`text-2xl font-bold mt-0.5 ${s.color}`}>{s.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 flex-wrap">
          {Object.entries(STATUS_COLORS).map(([status, colors]) => (
            <div key={status} className="flex items-center gap-1.5">
              <div className={`h-2.5 w-2.5 rounded-full ${colors.dot}`} />
              <span className="text-xs text-slate-500 capitalize">{status.toLowerCase()}</span>
            </div>
          ))}
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-slate-200" />
            <span className="text-xs text-slate-500">Available</span>
          </div>
        </div>

        {/* Calendar card */}
        <Card>
          {/* Calendar header */}
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-lg font-bold text-slate-900">
                  {format(currentDate, 'MMMM yyyy')}
                </h2>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-violet-600"
                  onClick={() => setCurrentDate(new Date())}
                >
                  Today
                </Button>
              </div>

              {/* Room filter */}
              <select
                value={selectedRoomFilter}
                onChange={(e) => setSelectedRoomFilter(e.target.value)}
                className="h-8 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="ALL">All rooms</option>
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>{room.name}</option>
                ))}
              </select>
            </div>
          </CardHeader>

          <CardContent className="pt-4">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse" style={{ minWidth: `${Math.max(700, days.length * 36)}px` }}>
                {/* Day headers */}
                <thead>
                  <tr>
                    {/* Room name column */}
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider py-2 pr-4 w-36 sticky left-0 bg-white z-10">
                      Room
                    </th>
                    {days.map((day) => (
                      <th
                        key={day.toISOString()}
                        className={`text-center py-2 px-0.5 min-w-[32px] ${
                          isToday(day) ? 'text-violet-600' : 'text-slate-400'
                        }`}
                      >
                        <div className="flex flex-col items-center gap-0.5">
                          <span className="text-[10px] font-medium uppercase">
                            {format(day, 'EEE')[0]}
                          </span>
                          <span
                            className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${
                              isToday(day) ? 'bg-violet-600 text-white' : ''
                            }`}
                          >
                            {format(day, 'd')}
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                {/* Room rows */}
                <tbody>
                  {filteredRooms.map((room, roomIdx) => (
                    <tr
                      key={room.id}
                      className={roomIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}
                    >
                      {/* Room name */}
                      <td className="pr-4 py-1.5 sticky left-0 z-10 bg-inherit">
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold text-slate-800 truncate max-w-[130px]">
                            {room.name}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {formatCurrency(room.price)}/night
                          </span>
                        </div>
                      </td>

                      {/* Day cells */}
                      {days.map((day) => {
                        const booking = getBookingForDay(room.id, day)
                        const isStart = booking ? isCheckInDay(booking, day) : false
                        const isEnd = booking
                          ? isSameDay(parseISO(booking.checkOut), addDays(day, 1))
                          : false
                        const colors = booking ? STATUS_COLORS[booking.status] : null

                        return (
                          <td key={day.toISOString()} className="py-1 px-0.5 text-center">
                            {booking ? (
                              <button
                                onClick={() => setSelectedBooking(booking)}
                                title={`${booking.guestName} · ${booking.status}`}
                                className={`w-full h-7 text-[10px] font-medium transition-opacity hover:opacity-80 cursor-pointer ${
                                  colors?.bg
                                } ${colors?.text} ${
                                  isStart
                                    ? 'rounded-l-full pl-1'
                                    : isEnd
                                    ? 'rounded-r-full pr-1'
                                    : ''
                                }`}
                              >
                                {isStart ? (
                                  <span className="truncate px-1 block">
                                    {booking.guestName.split(' ')[0]}
                                  </span>
                                ) : (
                                  <span>&nbsp;</span>
                                )}
                              </button>
                            ) : (
                              <div className="w-full h-7 flex items-center justify-center">
                                <div className="h-1 w-1 rounded-full bg-slate-200" />
                              </div>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredRooms.length === 0 && (
                <div className="text-center py-12 text-slate-400">
                  <p className="text-sm">No rooms found. Add rooms to see availability.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming bookings list */}
        <Card>
          <CardHeader>
            <h3 className="text-base font-semibold text-slate-900">
              Upcoming Bookings — {format(currentDate, 'MMMM yyyy')}
            </h3>
          </CardHeader>
          <CardContent>
            {bookings.filter((b) => b.status !== 'CANCELLED').length === 0 ? (
              <p className="text-sm text-slate-400 py-4 text-center">No bookings this month</p>
            ) : (
              <div className="space-y-2">
                {bookings
                  .filter((b) => b.status !== 'CANCELLED')
                  .sort((a, b) => parseISO(a.checkIn).getTime() - parseISO(b.checkIn).getTime())
                  .map((booking) => {
                    const colors = STATUS_COLORS[booking.status]
                    return (
                      <button
                        key={booking.id}
                        onClick={() => setSelectedBooking(booking)}
                        className="w-full flex items-center gap-3 rounded-xl hover:bg-slate-50 p-3 transition-colors text-left"
                      >
                        <div className={`h-2.5 w-2.5 rounded-full shrink-0 ${colors?.dot}`} />
                        <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {booking.guestName[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-900">{booking.guestName}</p>
                          <p className="text-xs text-slate-400 truncate">
                            {booking.room.name} · {format(parseISO(booking.checkIn), 'MMM d')} →{' '}
                            {format(parseISO(booking.checkOut), 'MMM d')} · {booking.nights}n
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-bold text-slate-900">
                            {formatCurrency(booking.totalAmount)}
                          </p>
                          <Badge className={`text-[10px] border ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </Badge>
                        </div>
                      </button>
                    )
                  })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Booking detail dialog */}
      {selectedBooking && (
        <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Booking Details</DialogTitle>
              <DialogDescription>Reservation information</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-lg font-bold">
                  {selectedBooking.guestName[0]}
                </div>
                <div>
                  <p className="font-bold text-slate-900">{selectedBooking.guestName}</p>
                  <p className="text-sm text-slate-500">{selectedBooking.guestEmail}</p>
                </div>
              </div>

              {[
                { label: 'Room', value: selectedBooking.room.name },
                { label: 'Check-in', value: format(parseISO(selectedBooking.checkIn), 'EEE, MMM d yyyy') },
                { label: 'Check-out', value: format(parseISO(selectedBooking.checkOut), 'EEE, MMM d yyyy') },
                { label: 'Nights', value: `${selectedBooking.nights} night${selectedBooking.nights !== 1 ? 's' : ''}` },
                { label: 'Guests', value: `${selectedBooking.guests} guest${selectedBooking.guests !== 1 ? 's' : ''}` },
                { label: 'Total', value: formatCurrency(selectedBooking.totalAmount) },
              ].map((row) => (
                <div key={row.label} className="flex justify-between text-sm border-b border-slate-100 pb-2">
                  <span className="text-slate-500">{row.label}</span>
                  <span className="font-medium text-slate-900">{row.value}</span>
                </div>
              ))}

              <div className="flex gap-2 pt-1">
                <Badge className={`text-xs border ${getStatusColor(selectedBooking.status)}`}>
                  {selectedBooking.status}
                </Badge>
                <Badge className={`text-xs border ${getStatusColor(selectedBooking.paymentStatus)}`}>
                  {selectedBooking.paymentStatus}
                </Badge>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}
