import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { SiteNav } from "@/components/site/site-nav";
import { RoomCardPublic } from "@/components/site/room-card-public";
import { ArrowLeft } from "lucide-react";

export default async function RoomsPage({
  params,
}: {
  params: Promise<{ hotelSlug: string }>;
}) {
  const { hotelSlug } = await params;

  const hotel = await prisma.hotel.findUnique({
    where: { slug: hotelSlug },
    include: { rooms: { orderBy: { createdAt: "desc" } } },
  });

  if (!hotel) notFound();

  return (
    <div
      className="min-h-screen bg-white text-zinc-900"
      style={{ fontFamily: "'GeistMono', 'Courier New', monospace" }}
    >
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #d4d4d8 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <SiteNav hotelName={hotel.name} hotelSlug={hotel.slug} />

      <main className="relative z-10 max-w-5xl mx-auto px-6 py-16">
        <div className="mb-10">
          <Link
            href={`/${hotel.slug}`}
            className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            <ArrowLeft size={12} />
            Back to hotel
          </Link>

          <p className="text-xs tracking-widest uppercase text-zinc-400 mt-6 mb-2">
            Rooms & availability
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-zinc-900">
            {hotel.name}
          </h1>
          {hotel.amenities.length > 0 && (
            <p className="text-sm text-zinc-500 mt-3">
              Amenities: {hotel.amenities.join(" · ")}
            </p>
          )}
        </div>

        {hotel.rooms.length === 0 ? (
          <div className="border border-zinc-200 rounded-xl p-8 text-center">
            <p className="text-xs tracking-widest uppercase text-zinc-400 mb-2">
              No rooms yet
            </p>
            <p className="text-sm text-zinc-500">
              This hotel hasn’t published any rooms.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {hotel.rooms.map((room) => (
              <RoomCardPublic key={room.id} room={room} hotelSlug={hotel.slug} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

