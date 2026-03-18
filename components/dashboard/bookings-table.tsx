"use client";

import { useState } from "react";
import { updateBookingStatus } from "@/actions/booking-actions";
import { formatDate, formatPrice, calculateNights } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Check, 
  X, 
  ChevronDown, 
  ChevronUp,
  Eye,
  Mail,
  Phone,
  MoreVertical,
  Calendar
} from "lucide-react";
import type { BookingWithDetails } from "@/types";
import { cn } from "@/lib/utils";
import Link from "next/link";

const statusStyles = {
  PENDING: {
    badge: "border-amber-200 bg-amber-50 text-amber-700",
    dot: "bg-amber-500",
    label: "Pending"
  },
  CONFIRMED: {
    badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
    dot: "bg-emerald-500",
    label: "Confirmed"
  },
  CANCELLED: {
    badge: "border-zinc-200 bg-zinc-50 text-zinc-500",
    dot: "bg-zinc-400",
    label: "Cancelled"
  },
};

export function BookingsTable({ bookings }: { bookings: BookingWithDetails[] }) {
  const [loading, setLoading] = useState<string | null>(null);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "CONFIRMED" | "CANCELLED">("ALL");

  const handleStatus = async (id: string, status: "CONFIRMED" | "CANCELLED") => {
    setLoading(id);
    await updateBookingStatus(id, status);
    setLoading(null);
  };

  const filteredBookings = filter === "ALL" 
    ? bookings 
    : bookings.filter(b => b.status === filter);

  if (bookings.length === 0) return null;

  return (
    <div className="space-y-4">
      {/* Table for desktop */}
      <div className="hidden lg:block border border-zinc-200 rounded-xl overflow-hidden bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-zinc-50 border-b border-zinc-200">
              {["Guest", "Room", "Check-in", "Check-out", "Nights", "Total", "Status", ""].map((h) => (
                <th key={h} className="px-5 py-4 text-left text-xs tracking-widest uppercase text-zinc-400 font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((booking, index) => {
              const styles = statusStyles[booking.status];
              return (
                <tr 
                  key={booking.id} 
                  className={cn(
                    "border-b border-zinc-100 transition-colors",
                    index % 2 === 0 ? "bg-white" : "bg-zinc-50/30",
                    "hover:bg-zinc-50"
                  )}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-zinc-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-zinc-600">
                          {booking.guestName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-zinc-900">{booking.guestName}</p>
                        <p className="text-xs text-zinc-400">{booking.guestEmail}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-zinc-900 font-medium">{booking.room.name}</p>
                    <p className="text-xs text-zinc-400">Room • {booking.room.capacity} guests</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-zinc-900">{formatDate(booking.checkIn)}</p>
                    <p className="text-xs text-zinc-400">3:00 PM</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-zinc-900">{formatDate(booking.checkOut)}</p>
                    <p className="text-xs text-zinc-400">11:00 AM</p>
                  </td>
                  <td className="px-5 py-4 text-zinc-900">
                    {calculateNights(booking.checkIn, booking.checkOut)}
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-semibold text-zinc-900">{formatPrice(booking.totalPrice)}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs tracking-widest uppercase",
                      styles.badge
                    )}>
                      <span className={cn("w-1.5 h-1.5 rounded-full", styles.dot)} />
                      {styles.label}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    {booking.status === "PENDING" ? (
                      <div className="flex items-center gap-1.5">
                        <Button
                          size="sm"
                          disabled={loading === booking.id}
                          onClick={() => handleStatus(booking.id, "CONFIRMED")}
                          className="bg-zinc-900 hover:bg-zinc-800 text-white h-8 px-3 text-xs gap-1.5"
                        >
                          <Check size={12} />
                          Confirm
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={loading === booking.id}
                          onClick={() => handleStatus(booking.id, "CANCELLED")}
                          className="border-zinc-200 text-zinc-400 hover:border-red-200 hover:text-red-500 h-8 w-8 p-0"
                        >
                          <X size={12} />
                        </Button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setExpandedRow(expandedRow === booking.id ? null : booking.id)}
                        className="p-1.5 hover:bg-zinc-100 rounded-lg transition-colors"
                      >
                        <Eye size={14} className="text-zinc-400" />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile card view */}
      <div className="lg:hidden space-y-4">
        {filteredBookings.map((booking) => {
          const styles = statusStyles[booking.status];
          const isExpanded = expandedRow === booking.id;
          
          return (
            <div key={booking.id} className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-zinc-600">
                        {booking.guestName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-zinc-900">{booking.guestName}</p>
                      <p className="text-xs text-zinc-400">{booking.guestEmail}</p>
                    </div>
                  </div>
                  <span className={cn(
                    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs tracking-widest uppercase",
                    styles.badge
                  )}>
                    <span className={cn("w-1.5 h-1.5 rounded-full", styles.dot)} />
                    {styles.label}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-zinc-400 mb-1">Room</p>
                    <p className="text-sm font-medium text-zinc-900">{booking.room.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-400 mb-1">Total</p>
                    <p className="text-sm font-semibold text-zinc-900">{formatPrice(booking.totalPrice)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-400 mb-1">Check-in</p>
                    <p className="text-sm text-zinc-900">{formatDate(booking.checkIn)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-400 mb-1">Check-out</p>
                    <p className="text-sm text-zinc-900">{formatDate(booking.checkOut)}</p>
                  </div>
                </div>

                {booking.status === "PENDING" ? (
                  <div className="flex items-center gap-2 pt-4 border-t border-zinc-100">
                    <Button
                      size="sm"
                      disabled={loading === booking.id}
                      onClick={() => handleStatus(booking.id, "CONFIRMED")}
                      className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-white h-10 text-xs gap-2"
                    >
                      <Check size={12} />
                      Confirm booking
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={loading === booking.id}
                      onClick={() => handleStatus(booking.id, "CANCELLED")}
                      className="border-zinc-200 text-zinc-400 hover:border-red-200 hover:text-red-500 h-10 px-4"
                    >
                      <X size={12} />
                    </Button>
                  </div>
                ) : (
                  <button
                    onClick={() => setExpandedRow(isExpanded ? null : booking.id)}
                    className="flex items-center justify-between w-full pt-4 border-t border-zinc-100 text-xs text-zinc-400 hover:text-zinc-900 transition-colors"
                  >
                    <span>View details</span>
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                )}

                {/* Expanded details */}
                {isExpanded && booking.status !== "PENDING" && (
                  <div className="mt-4 pt-4 border-t border-zinc-100 space-y-3">
                    <div className="flex items-center gap-3 text-xs">
                      <Mail size={12} className="text-zinc-400" />
                      <span className="text-zinc-600">{booking.guestEmail}</span>
                    </div>
                    {booking.guestPhone && (
                      <div className="flex items-center gap-3 text-xs">
                        <Phone size={12} className="text-zinc-400" />
                        <span className="text-zinc-600">{booking.guestPhone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-3 text-xs">
                      <Calendar size={12} className="text-zinc-400" />
                      <span className="text-zinc-600">
                        {calculateNights(booking.checkIn, booking.checkOut)} nights
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary footer */}
      <div className="flex items-center justify-between text-xs text-zinc-400 pt-4">
        <p>Showing {filteredBookings.length} of {bookings.length} bookings</p>
        <div className="flex items-center gap-4">
          <span>💰 Total revenue: <span className="text-zinc-900 font-medium">
            {formatPrice(bookings.filter(b => b.status === "CONFIRMED").reduce((sum, b) => sum + b.totalPrice, 0))}
          </span></span>
        </div>
      </div>
    </div>
  );
}