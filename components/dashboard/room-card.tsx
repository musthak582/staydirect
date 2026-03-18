"use client";

import Link from "next/link";
import { useState } from "react";
import { deleteRoom } from "@/actions/room-actions";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Pencil, 
  Trash2, 
  Users, 
  DollarSign,
  Calendar,
  MoreVertical,
  Eye,
  Copy,
  Check,
  Clock
} from "lucide-react";
import type { Room } from "@/app/generated/prisma/client";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function RoomCard({ room }: { room: Room }) {
  const [deleting, setDeleting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Delete "${room.name}"? This cannot be undone.`)) return;
    setDeleting(true);
    await deleteRoom(room.id);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/rooms/${room.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Mock availability - replace with real data
  const isAvailable = Math.random() > 0.3;

  return (
    <div className="group relative bg-white border border-zinc-200 rounded-xl overflow-hidden hover:border-zinc-400 hover:shadow-lg transition-all duration-300">
      {/* Image Section */}
      <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100">
        {room.imageUrl ? (
          <Image
            src={room.imageUrl}
            alt={room.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-12 h-12 border-2 border-zinc-300 rounded-xl" />
          </div>
        )}

        {/* Status badge */}
        <div className="absolute top-3 left-3">
          <span className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs tracking-widest uppercase border backdrop-blur-sm",
            isAvailable 
              ? "bg-emerald-500/90 text-white border-emerald-400" 
              : "bg-zinc-500/90 text-white border-zinc-400"
          )}>
            <span className={cn(
              "w-1.5 h-1.5 rounded-full",
              isAvailable ? "bg-white animate-pulse" : "bg-white/50"
            )} />
            {isAvailable ? "Available" : "Booked"}
          </span>
        </div>

        {/* Actions overlay */}
        <div className="absolute top-3 right-3">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white transition-colors"
          >
            <MoreVertical size={14} className="text-zinc-600" />
          </button>
          
          {/* Dropdown menu */}
          {showMenu && (
            <>
              <div 
                className="fixed inset-0 z-40"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 top-10 w-48 bg-white border border-zinc-200 rounded-lg shadow-lg z-50 py-1">
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-2 w-full px-3 py-2 text-xs text-zinc-600 hover:bg-zinc-50 transition-colors"
                >
                  {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                  {copied ? "Copied!" : "Copy room link"}
                </button>
                <Link
                  href={`/rooms/${room.id}`}
                  className="flex items-center gap-2 w-full px-3 py-2 text-xs text-zinc-600 hover:bg-zinc-50 transition-colors"
                >
                  <Eye size={12} />
                  View public page
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-base font-semibold text-zinc-900 group-hover:text-zinc-700 transition-colors">
            {room.name}
          </h3>
          <span className="text-lg font-semibold text-zinc-900">
            {formatPrice(room.price)}
          </span>
        </div>

        {room.description && (
          <p className="text-xs text-zinc-500 leading-relaxed mb-4 line-clamp-2">
            {room.description}
          </p>
        )}

        {/* Features */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1.5 text-zinc-500">
            <Users size={13} />
            <span className="text-xs">{room.capacity} {room.capacity === 1 ? 'guest' : 'guests'}</span>
          </div>
          <div className="flex items-center gap-1.5 text-zinc-500">
            <Clock size={13} />
            <span className="text-xs">Min 1 night</span>
          </div>
        </div>

        {/* Bookings preview (mock) */}
        <div className="flex items-center gap-2 mb-4 p-2 bg-zinc-50 rounded-lg">
          <Calendar size={12} className="text-zinc-400" />
          <div className="flex-1">
            <div className="h-1.5 bg-zinc-200 rounded-full overflow-hidden">
              <div className="h-full w-2/3 bg-zinc-900/20 rounded-full" />
            </div>
          </div>
          <span className="text-[10px] text-zinc-500">67% booked</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-4 border-t border-zinc-100">
          <Link href={`/dashboard/rooms/${room.id}/edit`} className="flex-1">
            <Button
              variant="outline"
              className="w-full border-zinc-200 text-zinc-600 hover:border-zinc-400 hover:text-zinc-900 text-xs tracking-widest uppercase h-9 gap-2 group"
            >
              <Pencil size={11} className="group-hover:scale-110 transition-transform" />
              Edit
            </Button>
          </Link>
          <Button
            variant="outline"
            disabled={deleting}
            onClick={handleDelete}
            className="border-zinc-200 text-zinc-400 hover:border-red-200 hover:text-red-500 hover:bg-red-50 text-xs h-9 w-9 p-0 transition-colors"
          >
            {deleting ? (
              <div className="w-3 h-3 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Trash2 size={11} />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}