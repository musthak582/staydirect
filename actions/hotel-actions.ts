// actions/hotel-actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { generateSlug } from '@/lib/utils'
import { z } from 'zod'

const hotelSchema = z.object({
  name: z.string().min(2, 'Hotel name must be at least 2 characters'),
  description: z.string().optional(),
  location: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  website: z.string().optional(),
  amenities: z.array(z.string()).optional(),
  checkIn: z.string().optional(),
  checkOut: z.string().optional(),
  currency: z.string().optional(),
})

export async function createHotelAction(formData: FormData) {
  const user = await requireAuth()

  const existingHotel = await prisma.hotel.findUnique({
    where: { ownerId: user.id },
  })
  if (existingHotel) {
    return { success: false, error: 'Hotel already exists for this account' }
  }

  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const location = formData.get('location') as string
  const address = formData.get('address') as string
  const phone = formData.get('phone') as string
  const email = formData.get('email') as string

  const validated = hotelSchema.safeParse({ name, description, location, address, phone, email })
  if (!validated.success) {
    return { success: false, error: validated.error.errors[0].message }
  }

  let slug = generateSlug(name)
  const existing = await prisma.hotel.findUnique({ where: { slug } })
  if (existing) {
    slug = `${slug}-${Date.now()}`
  }

  const hotel = await prisma.hotel.create({
    data: {
      name,
      slug,
      description: description || null,
      location: location || null,
      address: address || null,
      phone: phone || null,
      email: email || null,
      ownerId: user.id,
    },
  })

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/hotel')
  return { success: true, data: hotel }
}

export async function updateHotelAction(formData: FormData) {
  const user = await requireAuth()

  const hotel = await prisma.hotel.findUnique({ where: { ownerId: user.id } })
  if (!hotel) {
    return { success: false, error: 'Hotel not found' }
  }

  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const location = formData.get('location') as string
  const address = formData.get('address') as string
  const phone = formData.get('phone') as string
  const email = formData.get('email') as string
  const checkIn = formData.get('checkIn') as string
  const checkOut = formData.get('checkOut') as string
  const currency = formData.get('currency') as string

  const updatedHotel = await prisma.hotel.update({
    where: { id: hotel.id },
    data: {
      name: name || hotel.name,
      description: description || hotel.description,
      location: location || hotel.location,
      address: address || hotel.address,
      phone: phone || hotel.phone,
      email: email || hotel.email,
      checkIn: checkIn || hotel.checkIn,
      checkOut: checkOut || hotel.checkOut,
      currency: currency || hotel.currency,
    },
  })

  revalidatePath('/dashboard/hotel')
  revalidatePath(`/${hotel.slug}`)
  return { success: true, data: updatedHotel }
}

export async function getHotelByOwner() {
  const user = await requireAuth()
  const hotel = await prisma.hotel.findUnique({
    where: { ownerId: user.id },
    include: {
      rooms: true,
      _count: {
        select: {
          bookings: true,
          rooms: true,
          reviews: true,
        },
      },
    },
  })
  return hotel
}

export async function getHotelStats() {
  const user = await requireAuth()
  const hotel = await prisma.hotel.findUnique({ where: { ownerId: user.id } })
  if (!hotel) return null

  const [totalBookings, confirmedBookings, totalRevenue, rooms, recentBookings] =
    await Promise.all([
      prisma.booking.count({ where: { hotelId: hotel.id } }),
      prisma.booking.count({
        where: { hotelId: hotel.id, status: 'CONFIRMED' },
      }),
      prisma.booking.aggregate({
        where: { hotelId: hotel.id, paymentStatus: 'PAID' },
        _sum: { totalAmount: true },
      }),
      prisma.room.count({ where: { hotelId: hotel.id } }),
      prisma.booking.findMany({
        where: { hotelId: hotel.id },
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: { room: true },
      }),
    ])

  return {
    totalBookings,
    confirmedBookings,
    totalRevenue: totalRevenue._sum.totalAmount || 0,
    totalRooms: rooms,
    recentBookings,
    occupancyRate:
      rooms > 0 ? Math.round((confirmedBookings / (rooms * 30)) * 100) : 0,
  }
}
