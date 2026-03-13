// actions/room-actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { z } from 'zod'

const roomSchema = z.object({
  name: z.string().min(2, 'Room name must be at least 2 characters'),
  description: z.string().optional(),
  price: z.number().positive('Price must be positive'),
  capacity: z.number().int().positive(),
  beds: z.number().int().positive().optional(),
  bathrooms: z.number().int().positive().optional(),
  size: z.number().positive().optional(),
})

export async function createRoomAction(formData: FormData) {
  const user = await requireAuth()

  const hotel = await prisma.hotel.findUnique({ where: { ownerId: user.id } })
  if (!hotel) {
    return { success: false, error: 'Please set up your hotel first' }
  }

  const data = {
    name: formData.get('name') as string,
    description: formData.get('description') as string,
    price: parseFloat(formData.get('price') as string),
    capacity: parseInt(formData.get('capacity') as string) || 2,
    beds: parseInt(formData.get('beds') as string) || 1,
    bathrooms: parseInt(formData.get('bathrooms') as string) || 1,
    size: formData.get('size') ? parseFloat(formData.get('size') as string) : undefined,
  }

  const validated = roomSchema.safeParse(data)
  if (!validated.success) {
    return { success: false, error: validated.error.errors[0].message }
  }

  const amenitiesRaw = formData.get('amenities') as string
  const amenities = amenitiesRaw ? amenitiesRaw.split(',').map((a) => a.trim()).filter(Boolean) : []

  const room = await prisma.room.create({
    data: {
      hotelId: hotel.id,
      name: data.name,
      description: data.description || null,
      price: data.price,
      capacity: data.capacity,
      beds: data.beds,
      bathrooms: data.bathrooms,
      size: data.size || null,
      amenities,
    },
  })

  revalidatePath('/dashboard/rooms')
  revalidatePath(`/${hotel.slug}`)
  return { success: true, data: room }
}

export async function updateRoomAction(roomId: string, formData: FormData) {
  const user = await requireAuth()

  const hotel = await prisma.hotel.findUnique({ where: { ownerId: user.id } })
  if (!hotel) {
    return { success: false, error: 'Hotel not found' }
  }

  const room = await prisma.room.findFirst({
    where: { id: roomId, hotelId: hotel.id },
  })
  if (!room) {
    return { success: false, error: 'Room not found' }
  }

  const amenitiesRaw = formData.get('amenities') as string
  const amenities = amenitiesRaw ? amenitiesRaw.split(',').map((a) => a.trim()).filter(Boolean) : []

  const updatedRoom = await prisma.room.update({
    where: { id: roomId },
    data: {
      name: (formData.get('name') as string) || room.name,
      description: (formData.get('description') as string) || room.description,
      price: formData.get('price') ? parseFloat(formData.get('price') as string) : room.price,
      capacity: formData.get('capacity') ? parseInt(formData.get('capacity') as string) : room.capacity,
      beds: formData.get('beds') ? parseInt(formData.get('beds') as string) : room.beds,
      bathrooms: formData.get('bathrooms') ? parseInt(formData.get('bathrooms') as string) : room.bathrooms,
      amenities,
      isAvailable: formData.get('isAvailable') === 'true',
    },
  })

  revalidatePath('/dashboard/rooms')
  revalidatePath(`/${hotel.slug}`)
  return { success: true, data: updatedRoom }
}

export async function deleteRoomAction(roomId: string) {
  const user = await requireAuth()

  const hotel = await prisma.hotel.findUnique({ where: { ownerId: user.id } })
  if (!hotel) {
    return { success: false, error: 'Hotel not found' }
  }

  await prisma.room.delete({
    where: { id: roomId, hotelId: hotel.id },
  })

  revalidatePath('/dashboard/rooms')
  revalidatePath(`/${hotel.slug}`)
  return { success: true }
}

export async function getRooms() {
  const user = await requireAuth()
  const hotel = await prisma.hotel.findUnique({ where: { ownerId: user.id } })
  if (!hotel) return []

  return prisma.room.findMany({
    where: { hotelId: hotel.id },
    orderBy: { createdAt: 'asc' },
    include: {
      _count: {
        select: { bookings: true },
      },
    },
  })
}
