import type { Booking, Hotel, Room } from "@/app/generated/prisma/client";

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export type BookingWithDetails = Booking & {
  room: Room;
  hotel: Hotel;
};

