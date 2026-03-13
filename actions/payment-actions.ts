// actions/payment-actions.ts
'use server'

import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { stripe, formatAmountForStripe } from '@/lib/stripe'
import { revalidatePath } from 'next/cache'

/**
 * Creates a Stripe Checkout Session for a booking.
 * Called from the hotel owner dashboard to generate a payment link for a guest.
 */
export async function createPaymentLinkAction(bookingId: string) {
  const user = await requireAuth()

  const hotel = await prisma.hotel.findUnique({ where: { ownerId: user.id } })
  if (!hotel) return { success: false, error: 'Hotel not found' }

  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, hotelId: hotel.id },
    include: { room: true, hotel: true },
  })
  if (!booking) return { success: false, error: 'Booking not found' }

  if (booking.paymentStatus === 'PAID') {
    return { success: false, error: 'This booking has already been paid' }
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: booking.hotel.currency.toLowerCase(),
          product_data: {
            name: `${booking.room.name} — ${booking.hotel.name}`,
            description: `${booking.nights} night${booking.nights !== 1 ? 's' : ''} · Check-in: ${booking.checkIn.toLocaleDateString()} · Check-out: ${booking.checkOut.toLocaleDateString()}`,
          },
          unit_amount: formatAmountForStripe(booking.totalAmount),
        },
        quantity: 1,
      },
    ],
    customer_email: booking.guestEmail,
    metadata: {
      bookingId: booking.id,
      hotelId: hotel.id,
      guestName: booking.guestName,
    },
    success_url: `${appUrl}/dashboard/bookings?payment=success&bookingId=${booking.id}`,
    cancel_url: `${appUrl}/dashboard/bookings?payment=cancelled&bookingId=${booking.id}`,
  })

  // Save the payment session reference
  await prisma.payment.create({
    data: {
      bookingId: booking.id,
      amount: booking.totalAmount,
      currency: booking.hotel.currency,
      status: 'PENDING',
      method: 'stripe',
      reference: session.id,
    },
  })

  // Update booking payment status to pending
  await prisma.booking.update({
    where: { id: booking.id },
    data: { paymentStatus: 'PENDING' },
  })

  revalidatePath('/dashboard/bookings')

  return { success: true, url: session.url, sessionId: session.id }
}

/**
 * Creates a direct guest-facing payment link (for public booking flow).
 * Called after a guest submits a booking on the public hotel site.
 */
export async function createGuestPaymentSessionAction(bookingId: string) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { room: true, hotel: true },
  })
  if (!booking) return { success: false, error: 'Booking not found' }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: booking.hotel.currency.toLowerCase(),
          product_data: {
            name: `${booking.room.name} — ${booking.hotel.name}`,
            description: `${booking.nights} night${booking.nights !== 1 ? 's' : ''} · ${booking.checkIn.toLocaleDateString()} → ${booking.checkOut.toLocaleDateString()}`,
          },
          unit_amount: formatAmountForStripe(booking.totalAmount),
        },
        quantity: 1,
      },
    ],
    customer_email: booking.guestEmail,
    metadata: {
      bookingId: booking.id,
      hotelId: booking.hotelId,
      guestName: booking.guestName,
    },
    success_url: `${appUrl}/${booking.hotel.slug}/booking/confirmation?bookingId=${booking.id}&guestName=${encodeURIComponent(booking.guestName)}`,
    cancel_url: `${appUrl}/${booking.hotel.slug}/booking?roomId=${booking.roomId}`,
  })

  // Track the payment
  await prisma.payment.create({
    data: {
      bookingId: booking.id,
      amount: booking.totalAmount,
      currency: booking.hotel.currency,
      status: 'PENDING',
      method: 'stripe',
      reference: session.id,
    },
  })

  await prisma.booking.update({
    where: { id: booking.id },
    data: { paymentStatus: 'PENDING' },
  })

  return { success: true, url: session.url }
}

/**
 * Get all payments for a booking
 */
export async function getBookingPayments(bookingId: string) {
  const user = await requireAuth()
  const hotel = await prisma.hotel.findUnique({ where: { ownerId: user.id } })
  if (!hotel) return []

  return prisma.payment.findMany({
    where: {
      bookingId,
      booking: { hotelId: hotel.id },
    },
    orderBy: { createdAt: 'desc' },
  })
}

/**
 * Manually mark a booking as paid (for cash/bank transfer payments)
 */
export async function markBookingPaidAction(bookingId: string, method = 'manual') {
  const user = await requireAuth()
  const hotel = await prisma.hotel.findUnique({ where: { ownerId: user.id } })
  if (!hotel) return { success: false, error: 'Hotel not found' }

  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, hotelId: hotel.id },
  })
  if (!booking) return { success: false, error: 'Booking not found' }

  await prisma.$transaction([
    prisma.booking.update({
      where: { id: bookingId },
      data: { paymentStatus: 'PAID', status: 'CONFIRMED' },
    }),
    prisma.payment.create({
      data: {
        bookingId,
        amount: booking.totalAmount,
        currency: 'USD',
        status: 'PAID',
        method,
        reference: `manual-${Date.now()}`,
      },
    }),
  ])

  revalidatePath('/dashboard/bookings')
  return { success: true }
}
