// app/api/availability/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const roomId = searchParams.get('roomId')
  const checkIn = searchParams.get('checkIn')
  const checkOut = searchParams.get('checkOut')

  if (!roomId || !checkIn || !checkOut) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
  }

  try {
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
          {
            AND: [
              { checkIn: { gte: checkInDate } },
              { checkOut: { lte: checkOutDate } },
            ],
          },
        ],
      },
    })

    return NextResponse.json({ available: !conflict })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to check availability' }, { status: 500 })
  }
}
