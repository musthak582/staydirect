import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { SiteNav } from "@/components/site/site-nav";
import { formatDate, formatPrice, calculateNights } from "@/lib/utils";
import { Check, ArrowRight } from "lucide-react";

export default async function ConfirmationPage({
  params,
  searchParams,
}: {
  params: Promise<{ hotelSlug: string }>;
  searchParams: Promise<{ bookingId?: string }>;
}) {
  const { hotelSlug } = await params;
  const { bookingId } = await searchParams;

  if (!bookingId) notFound();

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { room: true, hotel: true },
  });

  if (!booking) notFound();

  const nights = calculateNights(booking.checkIn, booking.checkOut);

  return (
    <div className="min-h-screen bg-white text-zinc-900" style={{ fontFamily: "'GeistMono', 'Courier New', monospace" }}>
      <div className="fixed inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, #d4d4d8 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
      <SiteNav hotelName={booking.hotel.name} hotelSlug={hotelSlug} />

      <main className="relative z-10 max-w-md mx-auto px-6 py-20 text-center">
        <div className="w-14 h-14 bg-zinc-950 rounded-2xl flex items-center justify-center mx-auto mb-8">
          <Check size={22} className="text-white" />
        </div>

        <p className="text-xs tracking-widest uppercase text-zinc-400 mb-2">Booking received</p>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 mb-3">You're all set, {booking.guestName.split(" ")[0]}.</h1>
        <p className="text-sm text-zinc-500 mb-10">
          Your booking request has been sent to {booking.hotel.name}. You'll receive a confirmation email at <span className="text-zinc-900">{booking.guestEmail}</span>.
        </p>

        <div className="border border-zinc-200 rounded-xl overflow-hidden text-left mb-8">
          <div className="bg-zinc-950 px-5 py-4">
            <p className="text-xs tracking-widest uppercase text-white/40 mb-1">Booking summary</p>
            <p className="text-white font-medium">{booking.room.name}</p>
          </div>
          <div className="divide-y divide-zinc-100">
            {[
              ["Check-in", formatDate(booking.checkIn)],
              ["Check-out", formatDate(booking.checkOut)],
              ["Nights", String(nights)],
              ["Guests", String(booking.guests)],
              ["Total", formatPrice(booking.totalPrice)],
              ["Status", booking.status],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between px-5 py-3">
                <span className="text-xs text-zinc-400 tracking-widest uppercase">{label}</span>
                <span className="text-xs font-medium text-zinc-900">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <Link
          href={`/${hotelSlug}`}
          className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          Back to {booking.hotel.name} <ArrowRight size={12} />
        </Link>
      </main>
    </div>
  );
}