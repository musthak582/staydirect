"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { bookingSchema } from "@/lib/validations";
import { calculateTotalPrice } from "@/lib/utils";
import { sendBookingConfirmation, sendBookingNotification } from "@/lib/email";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import type { ActionResult, BookingWithDetails } from "@/types";
import type { Booking } from "@/app/generated/prisma/client";

export async function createBooking(formData: FormData): Promise<ActionResult<Booking>> {
  try {
    const raw = Object.fromEntries(formData);
    const parsed = bookingSchema.safeParse(raw);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    const { roomId, hotelId, checkIn, checkOut, ...guestData } = parsed.data;
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkOutDate <= checkInDate) {
      return { success: false, error: "Check-out must be after check-in." };
    }

    // Check availability
    const conflict = await prisma.booking.findFirst({
      where: {
        roomId,
        status: { not: "CANCELLED" },
        OR: [
          { checkIn: { lt: checkOutDate }, checkOut: { gt: checkInDate } },
        ],
      },
    });
    if (conflict) {
      return { success: false, error: "This room is not available for the selected dates." };
    }

    const room = await prisma.room.findUnique({ where: { id: roomId } });
    if (!room) return { success: false, error: "Room not found." };

    const totalPrice = calculateTotalPrice(room.price, checkInDate, checkOutDate);

    const booking = await prisma.booking.create({
      data: {
        roomId,
        hotelId,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        totalPrice,
        guestName: guestData.guestName,
        guestEmail: guestData.guestEmail,
        guestPhone: guestData.guestPhone || null,
        guests: guestData.guests,
        specialNotes: guestData.specialNotes || null,
        status: "PENDING",
      },
    });

    // Send emails (non-blocking)
    const hotel = await prisma.hotel.findUnique({ where: { id: hotelId } });
    if (hotel) {
      sendBookingConfirmation({ booking, room, hotel }).catch(console.error);
      if (hotel.contactEmail) {
        sendBookingNotification({ booking, room, hotel }).catch(console.error);
      }
    }

    revalidatePath("/dashboard/bookings");
    return { success: true, data: booking };
  } catch (error) {
    return { success: false, error: "Failed to create booking." };
  }
}

export async function updateBookingStatus(
  bookingId: string,
  status: "CONFIRMED" | "CANCELLED"
): Promise<ActionResult<Booking>> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return { success: false, error: "Unauthorized" };

    const hotel = await prisma.hotel.findUnique({
      where: { ownerId: session.user.id },
    });

    if (!hotel) return { success: false, error: "Hotel not found." };

    const booking = await prisma.booking.findFirst({
      where: { id: bookingId, hotelId: hotel.id },
      include: {
        room: true,
        hotel: true,
      },
    });

    if (!booking) return { success: false, error: "Booking not found." };

    const updated = await prisma.booking.update({
      where: { id: bookingId },
      data: { status },
      include: {
        room: true,
        hotel: true,
      },
    });

    // Send updated confirmation email to guest
    sendBookingConfirmation({
      booking: updated,
      room: updated.room,
      hotel: updated.hotel,
    }).catch(console.error);

    revalidatePath("/dashboard/bookings");

    return { success: true, data: updated };
  } catch (error) {
    return { success: false, error: "Failed to update booking." };
  }
}

export async function getHotelBookings(): Promise<BookingWithDetails[]> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return [];

  const hotel = await prisma.hotel.findUnique({
    where: { ownerId: session.user.id },
  });
  if (!hotel) return [];

  return prisma.booking.findMany({
    where: { hotelId: hotel.id },
    include: { room: true, hotel: true },
    orderBy: { createdAt: "desc" },
  });
}