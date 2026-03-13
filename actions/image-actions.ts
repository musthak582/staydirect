// actions/image-actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export async function saveHotelImagesAction(imageUrls: string[]) {
  const user = await requireAuth()
  const hotel = await prisma.hotel.findUnique({ where: { ownerId: user.id } })
  if (!hotel) return { success: false, error: 'Hotel not found' }

  const updated = await prisma.hotel.update({
    where: { id: hotel.id },
    data: { images: imageUrls },
  })

  revalidatePath('/dashboard/hotel')
  revalidatePath(`/${hotel.slug}`)
  return { success: true, data: updated }
}

export async function addHotelImageAction(imageUrl: string) {
  const user = await requireAuth()
  const hotel = await prisma.hotel.findUnique({ where: { ownerId: user.id } })
  if (!hotel) return { success: false, error: 'Hotel not found' }

  const images = [...hotel.images, imageUrl]
  const updated = await prisma.hotel.update({
    where: { id: hotel.id },
    data: { images },
  })

  revalidatePath('/dashboard/hotel')
  revalidatePath(`/${hotel.slug}`)
  return { success: true, data: updated }
}

export async function removeHotelImageAction(imageUrl: string) {
  const user = await requireAuth()
  const hotel = await prisma.hotel.findUnique({ where: { ownerId: user.id } })
  if (!hotel) return { success: false, error: 'Hotel not found' }

  const images = hotel.images.filter((img) => img !== imageUrl)
  await prisma.hotel.update({
    where: { id: hotel.id },
    data: { images },
  })

  revalidatePath('/dashboard/hotel')
  revalidatePath(`/${hotel.slug}`)
  return { success: true }
}

export async function addRoomImageAction(roomId: string, imageUrl: string) {
  const user = await requireAuth()
  const hotel = await prisma.hotel.findUnique({ where: { ownerId: user.id } })
  if (!hotel) return { success: false, error: 'Hotel not found' }

  const room = await prisma.room.findFirst({
    where: { id: roomId, hotelId: hotel.id },
  })
  if (!room) return { success: false, error: 'Room not found' }

  const images = [...room.images, imageUrl]
  await prisma.room.update({ where: { id: roomId }, data: { images } })

  revalidatePath('/dashboard/rooms')
  revalidatePath(`/${hotel.slug}`)
  return { success: true }
}

export async function removeRoomImageAction(roomId: string, imageUrl: string) {
  const user = await requireAuth()
  const hotel = await prisma.hotel.findUnique({ where: { ownerId: user.id } })
  if (!hotel) return { success: false, error: 'Hotel not found' }

  const room = await prisma.room.findFirst({
    where: { id: roomId, hotelId: hotel.id },
  })
  if (!room) return { success: false, error: 'Room not found' }

  const images = room.images.filter((img) => img !== imageUrl)
  await prisma.room.update({ where: { id: roomId }, data: { images } })

  revalidatePath('/dashboard/rooms')
  revalidatePath(`/${hotel.slug}`)
  return { success: true }
}

export async function saveRoomImagesAction(roomId: string, imageUrls: string[]) {
  const user = await requireAuth()
  const hotel = await prisma.hotel.findUnique({ where: { ownerId: user.id } })
  if (!hotel) return { success: false, error: 'Hotel not found' }

  await prisma.room.update({
    where: { id: roomId, hotelId: hotel.id },
    data: { images: imageUrls },
  })

  revalidatePath('/dashboard/rooms')
  revalidatePath(`/${hotel.slug}`)
  return { success: true }
}
