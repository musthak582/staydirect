import { notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { SiteNav } from "@/components/site/site-nav";
import { RoomCardPublic } from "@/components/site/room-card-public";
import { MapPin, Phone, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function HotelSitePage({
  params,
}: {
  params: Promise<{ hotelSlug: string }>;
}) {

  const { hotelSlug } = await params;

  const hotel = await prisma.hotel.findUnique({
    where: { slug: hotelSlug },
    include: { rooms: true },
  });

  if (!hotel) notFound();

  return (
    <div className="min-h-screen bg-white text-zinc-900" style={{ fontFamily: "'GeistMono', 'Courier New', monospace" }}>
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, #d4d4d8 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <SiteNav hotelName={hotel.name} hotelSlug={hotel.slug} />

      {/* Hero */}
      <section className="relative z-10 pt-24 pb-20 px-6 text-center">
        {hotel.coverImage && (
          <div className="w-full max-w-3xl mx-auto aspect-video rounded-2xl overflow-hidden mb-12 border border-zinc-200">
            <img
              src={hotel.coverImage}
              alt={hotel.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <p className="text-xs tracking-widest uppercase text-zinc-400 mb-4">
          Direct booking
        </p>

        <h1 className="text-5xl md:text-6xl font-semibold tracking-tighter text-zinc-900 mb-4">
          {hotel.name}
        </h1>

        {hotel.location && (
          <div className="flex items-center justify-center gap-1.5 text-zinc-500 mb-6">
            <MapPin size={13} />
            <span className="text-sm">{hotel.location}</span>
          </div>
        )}

        {hotel.description && (
          <p className="text-zinc-500 max-w-xl mx-auto text-sm leading-relaxed mb-10">
            {hotel.description}
          </p>
        )}

        <Link href={`/${hotel.slug}/rooms`}>
          <Button className="bg-zinc-900 hover:bg-zinc-800 text-white text-xs tracking-widest uppercase h-12 px-8 gap-2 group">
            View rooms & availability
            <ArrowRight
              size={13}
              className="group-hover:translate-x-0.5 transition-transform"
            />
          </Button>
        </Link>
      </section>

      {/* Rooms preview */}
      {hotel.rooms.length > 0 && (
        <section id="rooms" className="relative z-10 px-6 pb-24 max-w-5xl mx-auto">
          <p className="text-xs tracking-widest uppercase text-zinc-400 mb-8 text-center">
            Available rooms
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {hotel.rooms.slice(0, 3).map((room) => (
              <RoomCardPublic
                key={room.id}
                room={room}
                hotelSlug={hotel.slug}
              />
            ))}
          </div>
        </section>
      )}

      {/* Contact */}
      {(hotel.contactPhone || hotel.contactEmail) && (
        <section id="contact" className="relative z-10 px-6 pb-24 max-w-lg mx-auto text-center">
          <div className="bg-zinc-950 rounded-2xl p-10">
            <p className="text-xs tracking-widest uppercase text-white/30 mb-4">
              Contact us
            </p>

            <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">
              {hotel.name}
            </h2>

            <div className="space-y-3">
              {hotel.contactPhone && (
                <div className="flex items-center justify-center gap-2 text-white/60 text-sm">
                  <Phone size={13} /> {hotel.contactPhone}
                </div>
              )}

              {hotel.contactEmail && (
                <div className="flex items-center justify-center gap-2 text-white/60 text-sm">
                  <Mail size={13} /> {hotel.contactEmail}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      <footer className="relative z-10 border-t border-zinc-200 px-8 py-5 flex items-center justify-between">
        <p className="text-xs text-zinc-400 tracking-widest uppercase">
          {hotel.name}
        </p>

        <p className="text-xs text-zinc-400">
          Powered by <span className="text-zinc-900">StayDirect</span>
        </p>
      </footer>
    </div>
  );
}