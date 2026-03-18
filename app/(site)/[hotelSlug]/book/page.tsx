import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { SiteNav } from "@/components/site/site-nav";
import { BookingForm } from "@/components/site/booking-form";

export default async function BookPage({
  params,
  searchParams,
}: {
  params: Promise<{ hotelSlug: string }>;
  searchParams: Promise<{ roomId?: string }>;
}) {

  const { hotelSlug } = await params;
  const { roomId } = await searchParams;

  const hotel = await prisma.hotel.findUnique({
    where: { slug: hotelSlug },
    include: { rooms: true },
  });

  if (!hotel) notFound();

  const selectedRoom = roomId
    ? hotel.rooms.find((r) => r.id === roomId) ?? hotel.rooms[0]
    : hotel.rooms[0];

  if (!selectedRoom) notFound();

  return (
    <div
      className="min-h-screen bg-white text-zinc-900"
      style={{ fontFamily: "'GeistMono', 'Courier New', monospace" }}
    >
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, #d4d4d8 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <SiteNav hotelName={hotel.name} hotelSlug={hotel.slug} />

      <main className="relative z-10 max-w-xl mx-auto px-6 py-16">
        <p className="text-xs tracking-widest uppercase text-zinc-400 mb-2">
          Reservation
        </p>

        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 mb-8">
          {hotel.name}
        </h1>

        <BookingForm
          hotel={hotel}
          rooms={hotel.rooms}
          selectedRoom={selectedRoom}
        />
      </main>
    </div>
  );
}