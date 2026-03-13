// actions/booking-actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { differenceInDays } from 'date-fns'
import { z } from 'zod'

const bookingSchema = z.object({
  roomId: z.string().min(1, 'Room is required'),
  guestName: z.string().min(2, 'Name must be at least 2 characters'),
  guestEmail: z.string().email('Invalid email address'),
  guestPhone: z.string().optional(),
  guestMessage: z.string().optional(),
  checkIn: z.string().min(1, 'Check-in date is required'),
  checkOut: z.string().min(1, 'Check-out date is required'),
  guests: z.number().int().positive(),
})

export async function createBookingAction(formData: FormData) {
  const data = {
    roomId: formData.get('roomId') as string,
    guestName: formData.get('guestName') as string,
    guestEmail: formData.get('guestEmail') as string,
    guestPhone: formData.get('guestPhone') as string,
    guestMessage: formData.get('guestMessage') as string,
    checkIn: formData.get('checkIn') as string,
    checkOut: formData.get('checkOut') as string,
    guests: parseInt(formData.get('guests') as string) || 1,
  }

  const validated = bookingSchema.safeParse(data)
  if (!validated.success) {
    return { success: false, error: validated.error.errors[0].message }
  }

  const room = await prisma.room.findUnique({
    where: { id: data.roomId },
    include: { hotel: true },
  })
  if (!room) {
    return { success: false, error: 'Room not found' }
  }

  const checkInDate = new Date(data.checkIn)
  const checkOutDate = new Date(data.checkOut)

  if (checkInDate >= checkOutDate) {
    return { success: false, error: 'Check-out must be after check-in' }
  }

  // Check availability
  const conflictingBooking = await prisma.booking.findFirst({
    where: {
      roomId: data.roomId,
      status: { not: 'CANCELLED' },
      OR: [
        {
          AND: [
            { checkIn: { lte: checkInDate } },
            { checkOut: { gt: checkInDate } },
          ],
        },
        {
          AND: [
            { checkIn: { lt: checkOutDate } },
            { checkOut: { gte: checkOutDate } },
          ],
        },
        {
          AND: [
            { checkIn: { gte: checkInDate } },
            { checkOut: { lte: checkOutDate } },
          ],
        },
      ],
    },
  })

  if (conflictingBooking) {
    return { success: false, error: 'Room is not available for selected dates' }
  }

  const nights = differenceInDays(checkOutDate, checkInDate)
  const totalAmount = nights * room.price

  const booking = await prisma.booking.create({
    data: {
      hotelId: room.hotelId,
      roomId: data.roomId,
      guestName: data.guestName,
      guestEmail: data.guestEmail,
      guestPhone: data.guestPhone || null,
      guestMessage: data.guestMessage || null,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests: data.guests,
      nights,
      totalAmount,
      status: 'PENDING',
      paymentStatus: 'UNPAID',
    },
    include: { room: true, hotel: true },
  })

  revalidatePath('/dashboard/bookings')
  return { success: true, data: booking }
}

export async function updateBookingStatusAction(bookingId: string, status: string) {
  const user = await requireAuth()

  const hotel = await prisma.hotel.findUnique({ where: { ownerId: user.id } })
  if (!hotel) return { success: false, error: 'Hotel not found' }

  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, hotelId: hotel.id },
  })
  if (!booking) return { success: false, error: 'Booking not found' }

  const updated = await prisma.booking.update({
    where: { id: bookingId },
    data: { status: status as 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' },
  })

  revalidatePath('/dashboard/bookings')
  return { success: true, data: updated }
}

export async function updatePaymentStatusAction(bookingId: string, paymentStatus: string) {
  const user = await requireAuth()

  const hotel = await prisma.hotel.findUnique({ where: { ownerId: user.id } })
  if (!hotel) return { success: false, error: 'Hotel not found' }

  const updated = await prisma.booking.update({
    where: { id: bookingId, hotelId: hotel.id },
    data: { paymentStatus: paymentStatus as 'UNPAID' | 'PENDING' | 'PAID' | 'REFUNDED' },
  })

  revalidatePath('/dashboard/bookings')
  return { success: true, data: updated }
}

export async function getBookings(page = 1, limit = 10, status?: string) {
  const user = await requireAuth()
  const hotel = await prisma.hotel.findUnique({ where: { ownerId: user.id } })
  if (!hotel) return { bookings: [], total: 0 }

  const where = {
    hotelId: hotel.id,
    ...(status && status !== 'ALL' ? { status: status as 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' } : {}),
  }

  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      where,
      include: { room: true },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.booking.count({ where }),
  ])

  return { bookings, total }
}

export async function checkAvailabilityAction(roomId: string, checkIn: string, checkOut: string) {
  const checkInDate = new Date(checkIn)
  const checkOutDate = new Date(checkOut)

  const conflict = await prisma.booking.findFirst({
    where: {
      roomId,
      status: { not: 'CANCELLED' },
      OR: [
        {
          AND: [
            { checkIn: { lte: checkInDate } },
            { checkOut: { gt: checkInDate } },
          ],
        },
        {
          AND: [
            { checkIn: { lt: checkOutDate } },
            { checkOut: { gte: checkOutDate } },
          ],
        },
      ],
    },
  })

  return { available: !conflict }
}

export async function createReviewAction(formData: FormData) {
  const hotelId = formData.get('hotelId') as string
  const guestName = formData.get('guestName') as string
  const rating = parseInt(formData.get('rating') as string)
  const comment = formData.get('comment') as string

  if (!hotelId || !guestName || !rating) {
    return { success: false, error: 'Missing required fields' }
  }

  const review = await prisma.review.create({
    data: {
      hotelId,
      guestName,
      rating,
      comment: comment || null,
      approved: false,
    },
  })

  revalidatePath(`/`)
  return { success: true, data: review }
}
