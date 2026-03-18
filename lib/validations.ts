import { z } from "zod";

export const hotelSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  description: z.string().max(1000).optional(),
  location: z.string().max(200).optional(),
  phone: z.string().max(20).optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  imageUrl: z.string().url().optional().or(z.literal("")),
});

export const roomSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  description: z.string().max(1000).optional(),
  price: z.coerce.number().min(1, "Price must be at least $1"),
  capacity: z.coerce.number().min(1).max(20),
  imageUrl: z.string().url().optional().or(z.literal("")),
});

export const bookingSchema = z.object({
  roomId: z.string().cuid(),
  hotelId: z.string().cuid(),
  guestName: z.string().min(2, "Name must be at least 2 characters"),
  guestEmail: z.string().email("Invalid email address"),
  guestPhone: z.string().min(7, "Invalid phone number").optional(),
  checkIn: z.string().refine((d) => !isNaN(Date.parse(d)), "Invalid check-in date"),
  checkOut: z.string().refine((d) => !isNaN(Date.parse(d)), "Invalid check-out date"),
  guests: z.coerce.number().min(1).max(20),
  specialNotes: z.string().max(500).optional(),
});

export type HotelFormValues = z.infer<typeof hotelSchema>;
export type RoomFormValues = z.infer<typeof roomSchema>;
export type BookingFormValues = z.infer<typeof bookingSchema>;