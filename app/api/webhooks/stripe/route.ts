// app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('STRIPE_WEBHOOK_SECRET is not set')
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const bookingId = session.metadata?.bookingId

        if (!bookingId) break

        // Mark booking as paid and confirmed
        await prisma.booking.update({
          where: { id: bookingId },
          data: {
            paymentStatus: 'PAID',
            status: 'CONFIRMED',
          },
        })

        // Update the payment record
        await prisma.payment.updateMany({
          where: {
            bookingId,
            reference: session.id,
          },
          data: {
            status: 'PAID',
          },
        })

        console.log(`✅ Payment confirmed for booking ${bookingId}`)
        break
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session
        const bookingId = session.metadata?.bookingId

        if (!bookingId) break

        // Reset payment status back to UNPAID
        await prisma.booking.update({
          where: { id: bookingId },
          data: { paymentStatus: 'UNPAID' },
        })

        await prisma.payment.updateMany({
          where: { bookingId, reference: session.id },
          data: { status: 'PENDING' },
        })

        console.log(`⚠️ Payment session expired for booking ${bookingId}`)
        break
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge
        // Find booking by payment intent reference
        const payment = await prisma.payment.findFirst({
          where: { reference: charge.payment_intent as string },
        })

        if (payment) {
          await prisma.booking.update({
            where: { id: payment.bookingId },
            data: { paymentStatus: 'REFUNDED' },
          })
          await prisma.payment.update({
            where: { id: payment.id },
            data: { status: 'REFUNDED' },
          })
          console.log(`💸 Refund processed for booking ${payment.bookingId}`)
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

// Stripe requires raw body for webhook verification
export const config = {
  api: {
    bodyParser: false,
  },
}
