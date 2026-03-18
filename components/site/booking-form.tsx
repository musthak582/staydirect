"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookingSchema, type BookingFormValues } from "@/lib/validations";
import { createBooking } from "@/actions/booking-actions";
import { formatPrice, calculateNights, calculateTotalPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Loader2, Users, DollarSign } from "lucide-react";
import type { Hotel, Room } from "@/app/generated/prisma/client";

type Props = { hotel: Hotel; rooms: Room[]; selectedRoom: Room };

export function BookingForm({ hotel, rooms, selectedRoom }: Props) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [activeRoom, setActiveRoom] = useState(selectedRoom);

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema) as any,
    defaultValues: {
      roomId: selectedRoom.id,
      hotelId: hotel.id,
      guests: 1,
    },
  });

  const checkIn = watch("checkIn");
  const checkOut = watch("checkOut");
  const nights = checkIn && checkOut ? calculateNights(checkIn, checkOut) : 0;
  const total = nights > 0 ? calculateTotalPrice(activeRoom.price, checkIn, checkOut) : 0;

  const onSubmit = async (data: BookingFormValues) => {
    setError("");
    const formData = new FormData();
    Object.entries({ ...data, roomId: activeRoom.id }).forEach(([k, v]) =>
      formData.append(k, String(v ?? ""))
    );
    const result = await createBooking(formData);
    if (!result.success) return setError(result.error);
    router.push(`/${hotel.slug}/book/confirmation?bookingId=${result.data.id}`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Room selector */}
      {rooms.length > 1 && (
        <div className="space-y-2">
          <Label className="text-xs tracking-widest uppercase text-zinc-500">Select room</Label>
          <div className="space-y-2">
            {rooms.map((room) => (
              <button
                key={room.id}
                type="button"
                onClick={() => setActiveRoom(room)}
                className={`w-full flex items-center justify-between p-4 rounded-xl border text-left transition-colors ${
                  activeRoom.id === room.id
                    ? "border-zinc-900 bg-zinc-950 text-white"
                    : "border-zinc-200 hover:border-zinc-400 text-zinc-700"
                }`}
              >
                <div>
                  <p className="text-sm font-medium">{room.name}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Users size={11} className="opacity-60" />
                    <span className="text-xs opacity-60">{room.capacity} guests max</span>
                  </div>
                </div>
                <span className="text-sm font-semibold">{formatPrice(room.price)}/night</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs tracking-widest uppercase text-zinc-500">Check-in *</Label>
          <Input
            {...register("checkIn")}
            type="date"
            min={new Date().toISOString().split("T")[0]}
            className="border-zinc-200 focus:border-zinc-900 focus:ring-0 text-sm h-11"
          />
          {errors.checkIn && <p className="text-xs text-red-500">{errors.checkIn.message}</p>}
        </div>
        <div className="space-y-2">
          <Label className="text-xs tracking-widest uppercase text-zinc-500">Check-out *</Label>
          <Input
            {...register("checkOut")}
            type="date"
            min={new Date().toISOString().split("T")[0]}
            className="border-zinc-200 focus:border-zinc-900 focus:ring-0 text-sm h-11"
          />
          {errors.checkOut && <p className="text-xs text-red-500">{errors.checkOut.message}</p>}
        </div>
      </div>

      {/* Guests */}
      <div className="space-y-2">
        <Label className="text-xs tracking-widest uppercase text-zinc-500">Number of guests *</Label>
        <Input
          {...register("guests")}
          type="number"
          min="1"
          max={activeRoom.capacity}
          className="border-zinc-200 focus:border-zinc-900 focus:ring-0 text-sm h-11"
        />
      </div>

      <Separator className="bg-zinc-100" />

      {/* Guest details */}
      <div className="space-y-2">
        <Label className="text-xs tracking-widest uppercase text-zinc-500">Full name *</Label>
        <Input {...register("guestName")} placeholder="John Silva" className="border-zinc-200 focus:border-zinc-900 focus:ring-0 text-sm h-11" />
        {errors.guestName && <p className="text-xs text-red-500">{errors.guestName.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs tracking-widest uppercase text-zinc-500">Email *</Label>
          <Input {...register("guestEmail")} type="email" placeholder="you@email.com" className="border-zinc-200 focus:border-zinc-900 focus:ring-0 text-sm h-11" />
          {errors.guestEmail && <p className="text-xs text-red-500">{errors.guestEmail.message}</p>}
        </div>
        <div className="space-y-2">
          <Label className="text-xs tracking-widest uppercase text-zinc-500">Phone</Label>
          <Input {...register("guestPhone")} placeholder="+94 77 000 0000" className="border-zinc-200 focus:border-zinc-900 focus:ring-0 text-sm h-11" />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs tracking-widest uppercase text-zinc-500">Special requests</Label>
        <Textarea {...register("specialNotes")} placeholder="Early check-in, dietary requirements, etc." className="border-zinc-200 focus:border-zinc-900 focus:ring-0 text-sm resize-none min-h-[80px]" />
      </div>

      {/* Price summary */}
      {nights > 0 && (
        <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-5 space-y-2">
          <div className="flex justify-between text-xs text-zinc-500">
            <span>{formatPrice(activeRoom.price)} × {nights} night{nights > 1 ? "s" : ""}</span>
            <span>{formatPrice(total)}</span>
          </div>
          <Separator className="bg-zinc-200" />
          <div className="flex justify-between text-sm font-semibold text-zinc-900">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
          <p className="text-xs text-zinc-400">Pay at property. Booking is pending until confirmed by hotel.</p>
        </div>
      )}

      {error && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-xs text-red-600">{error}</p>
        </div>
      )}

      <input type="hidden" {...register("hotelId")} value={hotel.id} />

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-zinc-900 hover:bg-zinc-800 text-white text-xs tracking-widest uppercase h-12 gap-2 group"
      >
        {isSubmitting ? (
          <Loader2 size={13} className="animate-spin" />
        ) : (
          <>
            Request booking <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
          </>
        )}
      </Button>
    </form>
  );
}