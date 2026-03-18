import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { RoomForm } from "@/components/dashboard/room-form";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default async function NewRoomPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/sign-in");
  }

  // Check if user has a hotel
  const hotel = await prisma.hotel.findUnique({
    where: { ownerId: session.user.id },
  });

  if (!hotel) {
    redirect("/dashboard/hotel?error=Please create your hotel profile first");
  }

  return (
    <div className="space-y-8">
      {/* Header with gradient background - matching rooms page */}
      <div className="relative -mt-8 -mx-6 px-6 pt-8 pb-12 bg-gradient-to-b from-zinc-50 to-white border-b border-zinc-200">
        {/* Dot grid background */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage: "radial-gradient(circle, #d4d4d8 1px, transparent 1px)",
            backgroundSize: "24px 24px"
          }} 
        />
        
        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs tracking-widest uppercase mb-6">
            <Link href="/dashboard" className="text-zinc-400 hover:text-zinc-900 transition-colors">
              Dashboard
            </Link>
            <ChevronRight size={10} className="text-zinc-300" />
            <Link href="/dashboard/rooms" className="text-zinc-400 hover:text-zinc-900 transition-colors">
              Rooms
            </Link>
            <ChevronRight size={10} className="text-zinc-300" />
            <span className="text-zinc-900 font-medium">New Room</span>
          </div>

          {/* Title */}
          <div>
            <h1 className="text-4xl font-semibold tracking-tighter text-zinc-900 mb-2">
              Add New Room
            </h1>
            <p className="text-zinc-500 text-sm">
              Create a new room for {hotel.name}. Add photos, set pricing, and manage availability.
            </p>
          </div>

          {/* Quick tips */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-white/80 backdrop-blur-sm border border-zinc-200 rounded-lg p-4">
              <p className="text-xs font-medium text-zinc-900 mb-1">📸 High-quality photos</p>
              <p className="text-xs text-zinc-500">Rooms with professional photos get 40% more bookings</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm border border-zinc-200 rounded-lg p-4">
              <p className="text-xs font-medium text-zinc-900 mb-1">💰 Competitive pricing</p>
              <p className="text-xs text-zinc-500">Check similar rooms in your area for reference</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm border border-zinc-200 rounded-lg p-4">
              <p className="text-xs font-medium text-zinc-900 mb-1">✨ Detailed description</p>
              <p className="text-xs text-zinc-500">Highlight unique features and amenities</p>
            </div>
          </div>
        </div>
      </div>

      {/* Room Form - now with proper spacing */}
      <div className="max-w-4xl">
        <RoomForm />
      </div>
    </div>
  );
}