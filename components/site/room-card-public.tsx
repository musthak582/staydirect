import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Users, ArrowRight } from "lucide-react";
import type { Room } from "@/app/generated/prisma/client";

type Props = { room: Room; hotelSlug: string };

export function RoomCardPublic({ room, hotelSlug }: Props) {
  return (
    <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden hover:border-zinc-400 transition-colors group">
      {room.imageUrl ? (
        <div className="aspect-video overflow-hidden bg-zinc-100">
          <img src={room.imageUrl} alt={room.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
      ) : (
        <div className="aspect-video bg-zinc-100 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-zinc-300 rounded-lg" />
        </div>
      )}
      <div className="p-5">
        <h3 className="text-sm font-semibold text-zinc-900 mb-1">{room.name}</h3>
        {room.description && (
          <p className="text-xs text-zinc-500 leading-relaxed mb-4 line-clamp-2">{room.description}</p>
        )}
        <div className="flex items-center justify-between mb-4">
          <span className="text-base font-semibold text-zinc-900">{formatPrice(room.price)}<span className="text-xs text-zinc-400 font-normal">/night</span></span>
          <div className="flex items-center gap-1.5 text-zinc-400">
            <Users size={12} />
            <span className="text-xs">{room.capacity} guests</span>
          </div>
        </div>
        <Link
          href={`/${hotelSlug}/book?roomId=${room.id}`}
          className="flex items-center justify-between w-full bg-zinc-900 hover:bg-zinc-800 text-white text-xs tracking-widest uppercase h-10 px-4 rounded-lg transition-colors group/btn"
        >
          Book this room
          <ArrowRight size={12} className="group-hover/btn:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}