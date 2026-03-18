//actions/room-actions.ts
"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { roomSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import type { ActionResult } from "@/types";
import type { Room } from "@/app/generated/prisma/client";

async function getSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");
  return session;
}

async function getOwnerHotel(userId: string) {
  const hotel = await prisma.hotel.findUnique({ where: { ownerId: userId } });
  if (!hotel) throw new Error("No hotel found. Create your hotel profile first.");
  return hotel;
}

export async function createRoom(formData: FormData): Promise<ActionResult<Room>> {
  try {
    const session = await getSession();
    const hotel = await getOwnerHotel(session.user.id);

    const raw = Object.fromEntries(formData);
    const parsed = roomSchema.safeParse(raw);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || "Invalid input",
      };
    }

    const room = await prisma.room.create({
      data: {
        ...parsed.data,
        hotelId: hotel.id,
        imageUrl: parsed.data.imageUrl || null,
      },
    });

    revalidatePath("/dashboard/rooms");
    revalidatePath(`/${hotel.slug}`);
    return { success: true, data: room };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create room." };
  }
}

export async function updateRoom(roomId: string, formData: FormData): Promise<ActionResult<Room>> {
  try {
    const session = await getSession();
    const hotel = await getOwnerHotel(session.user.id);

    const existing = await prisma.room.findFirst({
      where: { id: roomId, hotelId: hotel.id },
    });
    if (!existing) return { success: false, error: "Room not found." };

    const raw = Object.fromEntries(formData);
    const parsed = roomSchema.safeParse(raw);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || "Invalid input",
      };
    }
    const room = await prisma.room.update({
      where: { id: roomId },
      data: { ...parsed.data, imageUrl: parsed.data.imageUrl || null },
    });

    revalidatePath("/dashboard/rooms");
    revalidatePath(`/${hotel.slug}`);
    return { success: true, data: room };
  } catch (error) {
    return { success: false, error: "Failed to update room." };
  }
}

export async function deleteRoom(roomId: string): Promise<ActionResult<void>>{
  try {
    const session = await getSession();
    const hotel = await getOwnerHotel(session.user.id);

    const existing = await prisma.room.findFirst({
      where: { id: roomId, hotelId: hotel.id },
    });
    if (!existing) return { success: false, error: "Room not found." };

    await prisma.room.delete({ where: { id: roomId } });

    revalidatePath("/dashboard/rooms");
    revalidatePath(`/${hotel.slug}`);
    return { success: true, data: undefined };
  } catch (error) {
    return { success: false, error: "Failed to delete room." };
  }
}