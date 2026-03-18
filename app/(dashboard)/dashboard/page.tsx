import { redirect } from "next/navigation";
import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/utils";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BedDouble,
  CalendarCheck,
  DollarSign,
  Clock,
  Building2,
  ChevronRight,
  TrendingUp,
  Users,
  CalendarDays,
  Star,
  ExternalLink,
  Plus,
  CreditCard,
} from "lucide-react";
import {
  GridBackground,
  SectionHeader,
  MetricCard,
  GlassCard,
  StatusBadge,
  QuickActionButton
} from "@/components/ui/design-system";

// ─── data fetching ───────────────────────────────────────────────────────────

async function getDashboardData(userId: string) {
  const hotel = await prisma.hotel.findUnique({
    where: { ownerId: userId },
    include: {
      rooms: true,
      bookings: {
        include: { room: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!hotel) return { hotel: null };

  const bookings = hotel.bookings;
  const now = new Date();

  const totalRevenue = bookings
    .filter((b) => b.status === "CONFIRMED")
    .reduce((sum, b) => sum + b.totalPrice, 0);

  const pendingBookings = bookings.filter((b) => b.status === "PENDING");
  const confirmedBookings = bookings.filter((b) => b.status === "CONFIRMED");

  // Active stays: confirmed bookings where today is between checkIn and checkOut
  const activeStays = confirmedBookings.filter(
    (b) => new Date(b.checkIn) <= now && new Date(b.checkOut) >= now
  );

  // Upcoming: confirmed bookings with checkIn in the future
  const upcomingBookings = confirmedBookings
    .filter((b) => new Date(b.checkIn) > now)
    .sort((a, b) => new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime())
    .slice(0, 5);

  // Recent bookings for the activity feed
  const recentBookings = bookings.slice(0, 8);

  // Calculate occupancy rate (simplified)
  const totalRoomNights = hotel.rooms.length * 30; // 30 days lookback
  const occupiedNights = confirmedBookings.reduce((sum, b) => {
    const nights = Math.ceil((new Date(b.checkOut).getTime() - new Date(b.checkIn).getTime()) / (1000 * 60 * 60 * 24));
    return sum + nights;
  }, 0);
  const occupancyRate = totalRoomNights > 0 ? Math.round((occupiedNights / totalRoomNights) * 100) : 0;

  return {
    hotel,
    stats: {
      totalRooms: hotel.rooms.length,
      totalBookings: bookings.length,
      pendingCount: pendingBookings.length,
      confirmedCount: confirmedBookings.length,
      activeStays: activeStays.length,
      totalRevenue,
      occupancyRate,
    },
    upcomingBookings,
    recentBookings,
    pendingBookings: pendingBookings.slice(0, 4),
  };
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const data = await getDashboardData(session.user.id);

  // No hotel yet — show beautiful setup flow
  if (!data.hotel) {
    return (
      <div className="relative min-h-screen bg-white">
        <GridBackground />
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
          <PageHeader
            title={`Welcome, ${session.user.name.split(" ")[0]}.`}
            description="Let's get your direct booking website live in minutes."
          />
          <SetupPrompt />
        </div>
      </div>
    );
  }

  const { hotel, stats, upcomingBookings, recentBookings, pendingBookings } = data;

  return (
    <div className="relative min-h-screen bg-white">
      <GridBackground />

      <div className="relative z-10 px-6 py-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs tracking-widest uppercase text-zinc-400 mb-3">
              <span>Dashboard</span>
              <span className="text-zinc-300">/</span>
              <span className="text-zinc-900">Overview</span>
            </div>
            <h1 className="text-4xl font-semibold tracking-tighter text-zinc-900 mb-2">
              Welcome back, <span className="text-zinc-400">{session.user.name.split(" ")[0]}</span>
            </h1>
            <p className="text-zinc-500 text-sm">
              Managing <span className="text-zinc-900 font-medium">{hotel.name}</span>
            </p>
          </div>

          <Link href={`/${hotel.slug}`} target="_blank">
            <Button
              variant="outline"
              className="border-zinc-200 text-zinc-600 hover:border-zinc-400 hover:text-zinc-900 text-xs tracking-widest uppercase h-10 px-5 gap-2 group"
            >
              View live site
              <ExternalLink size={12} className="group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Quick stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard
            label="Revenue"
            value={formatPrice(stats.totalRevenue)}
            icon="dollar"  // Changed from {DollarSign}
            trend={{ value: 12, positive: true }}
          />
          <MetricCard
            label="Bookings"
            value={stats.totalBookings}
            icon="calendar"  // Changed from {CalendarCheck}
            trend={{ value: 8, positive: true }}
          />
          <MetricCard
            label="Occupancy"
            value={`${stats.occupancyRate}%`}
            icon="trending"  // Changed from {TrendingUp}
          />
          <MetricCard
            label="Active stays"
            value={stats.activeStays}
            icon="users"  // Changed from {Users}
          />
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pending actions */}
            {pendingBookings.length > 0 && (
              <GlassCard>
                <div className="p-5 border-b border-zinc-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                      <Clock size={14} className="text-amber-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-zinc-900">Action required</h3>
                      <p className="text-xs text-zinc-500">{stats.pendingCount} pending bookings need review</p>
                    </div>
                  </div>
                  <Link
                    href="/dashboard/bookings?status=pending"
                    className="text-xs tracking-widest uppercase text-zinc-400 hover:text-zinc-900 transition-colors flex items-center gap-1"
                  >
                    Review all <ChevronRight size={11} />
                  </Link>
                </div>

                <div className="divide-y divide-zinc-100">
                  {pendingBookings.map((booking) => (
                    <PendingBookingRow key={booking.id} booking={booking} />
                  ))}
                </div>
              </GlassCard>
            )}

            {/* Recent activity */}
            <GlassCard>
              <div className="p-5 border-b border-zinc-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-zinc-100 rounded-lg flex items-center justify-center">
                    <CalendarDays size={14} className="text-zinc-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-900">Recent activity</h3>
                    <p className="text-xs text-zinc-500">Latest bookings and updates</p>
                  </div>
                </div>
                <Link
                  href="/dashboard/bookings"
                  className="text-xs tracking-widest uppercase text-zinc-400 hover:text-zinc-900 transition-colors flex items-center gap-1"
                >
                  View all <ChevronRight size={11} />
                </Link>
              </div>

              {recentBookings.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CalendarDays size={20} className="text-zinc-400" />
                  </div>
                  <p className="text-sm text-zinc-900 mb-1">No bookings yet</p>
                  <p className="text-xs text-zinc-400">Share your booking link to get started</p>
                </div>
              ) : (
                <div className="divide-y divide-zinc-100">
                  {recentBookings.map((booking) => (
                    <ActivityRow key={booking.id} booking={booking} />
                  ))}
                </div>
              )}
            </GlassCard>
          </div>

          {/* Right column - Sidebar */}
          <div className="space-y-6">
            {/* Hotel status card */}
            <GlassCard>
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-zinc-100 rounded-lg overflow-hidden">
                      {hotel.logo ? (
                        <img src={hotel.logo} alt={hotel.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Building2 size={16} className="text-zinc-400" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-zinc-900">{hotel.name}</h3>
                      <p className="text-xs text-zinc-500">{hotel.location || "Location not set"}</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-50 border border-emerald-200">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-emerald-700 text-xs tracking-widest uppercase">Live</span>
                  </span>
                </div>

                {/* Quick stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-zinc-50 rounded-lg p-3">
                    <p className="text-xs text-zinc-400 mb-1">Rooms</p>
                    <p className="text-lg font-semibold text-zinc-900">{stats.totalRooms}</p>
                  </div>
                  <div className="bg-zinc-50 rounded-lg p-3">
                    <p className="text-xs text-zinc-400 mb-1">Reviews</p>
                    <p className="text-lg font-semibold text-zinc-900">0</p>
                  </div>
                </div>

                {/* Quick actions */}
                <div className="space-y-1">
                  <div className="space-y-1">
                    <QuickActionButton
                      href={`/${hotel.slug}`}
                      label="View public site"
                      icon="external"  // Changed from {ExternalLink}
                    />
                    <QuickActionButton
                      href="/dashboard/hotel"
                      label="Edit hotel profile"
                      icon="building"  // Changed from {Building2}
                    />
                    <QuickActionButton
                      href="/dashboard/rooms/new"
                      label="Add new room"
                      icon="plus"  // Changed from {Plus}
                    />
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Upcoming stays */}
            <GlassCard>
              <div className="p-5 border-b border-zinc-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-zinc-100 rounded-lg flex items-center justify-center">
                    <Star size={14} className="text-zinc-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-900">Upcoming stays</h3>
                    <p className="text-xs text-zinc-500">Confirmed reservations</p>
                  </div>
                </div>
              </div>

              {upcomingBookings.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-xs text-zinc-400">No upcoming stays</p>
                </div>
              ) : (
                <div className="divide-y divide-zinc-100">
                  {upcomingBookings.map((booking) => (
                    <UpcomingBookingRow key={booking.id} booking={booking} />
                  ))}
                </div>
              )}
            </GlassCard>

            {/* Payment summary */}
            <GlassCard>
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <CreditCard size={14} className="text-zinc-400" />
                    <p className="text-xs tracking-widest uppercase text-zinc-400">Payment summary</p>
                  </div>
                  <span className="text-xs text-emerald-600">+{stats.confirmedCount} confirmed</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-zinc-500">Total collected</p>
                  <p className="text-lg font-semibold text-zinc-900">{formatPrice(stats.totalRevenue)}</p>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── setup prompt (no hotel yet) ─────────────────────────────────────────────

function SetupPrompt() {
  const steps = [
    {
      number: "01",
      title: "Create hotel profile",
      description: "Add your hotel name, location, and beautiful cover photo.",
      href: "/dashboard/hotel",
      icon: Building2,
    },
    {
      number: "02",
      title: "Add your rooms",
      description: "List each room with pricing, photos, and amenities.",
      href: "/dashboard/rooms",
      icon: BedDouble,
    },
    {
      number: "03",
      title: "Share your booking link",
      description: "Send guests directly to your custom booking site.",
      href: "#",
      icon: ExternalLink,
    },
  ];

  return (
    <div className="max-w-2xl">
      <div className="space-y-3 mb-8">
        {steps.map((step, index) => (
          <Link key={step.number} href={step.href}>
            <div className="group relative">
              {/* Progress line */}
              {index < steps.length - 1 && (
                <div className="absolute left-8 top-14 bottom-0 w-px bg-zinc-200 group-hover:bg-zinc-300 transition-colors" />
              )}

              <div className="relative flex items-start gap-6 p-6 bg-white border border-zinc-200 rounded-xl hover:border-zinc-400 transition-all hover:shadow-lg">
                <div className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center group-hover:bg-zinc-900 transition-colors">
                  <step.icon size={20} className="text-zinc-500 group-hover:text-white transition-colors" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs font-medium text-zinc-400">{step.number}</span>
                    <h3 className="text-sm font-semibold text-zinc-900">{step.title}</h3>
                  </div>
                  <p className="text-xs text-zinc-500">{step.description}</p>
                </div>
                <ArrowRight
                  size={16}
                  className="text-zinc-300 group-hover:text-zinc-900 group-hover:translate-x-1 transition-all"
                />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <Link href="/dashboard/hotel">
        <Button className="bg-zinc-900 hover:bg-zinc-800 text-white text-xs tracking-widest uppercase h-12 px-8 gap-2 group">
          Start setup
          <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
        </Button>
      </Link>
    </div>
  );
}

// ─── row components ───────────────────────────────────────────────────────────

function PendingBookingRow({ booking }: { booking: any }) {
  return (
    <Link
      href={`/dashboard/bookings/${booking.id}`}
      className="flex items-center justify-between px-5 py-4 hover:bg-zinc-50 transition-colors group"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
          <Clock size={13} className="text-amber-600" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-zinc-900 truncate">{booking.guestName}</p>
          <p className="text-xs text-zinc-400">{booking.room.name} • {formatDate(booking.checkIn)}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-xs font-medium text-zinc-900">{formatPrice(booking.totalPrice)}</p>
        </div>
        <Button
          size="sm"
          className="bg-zinc-900 hover:bg-zinc-800 text-white text-xs tracking-widest uppercase h-8 px-3 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          Review
        </Button>
      </div>
    </Link>
  );
}

function ActivityRow({ booking }: { booking: any }) {
  return (
    <Link
      href={`/dashboard/bookings/${booking.id}`}
      className="flex items-center justify-between px-5 py-3 hover:bg-zinc-50 transition-colors"
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="w-8 h-8 bg-zinc-100 rounded-full flex items-center justify-center">
          <span className="text-xs font-medium text-zinc-600">
            {booking.guestName.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-zinc-900 truncate">{booking.guestName}</p>
          <p className="text-xs text-zinc-400 truncate">{booking.room.name}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 ml-4">
        <p className="text-xs font-medium text-zinc-900 hidden sm:block">
          {formatPrice(booking.totalPrice)}
        </p>
        <StatusBadge status={booking.status} />
        <ChevronRight size={12} className="text-zinc-300" />
      </div>
    </Link>
  );
}

function UpcomingBookingRow({ booking }: { booking: any }) {
  return (
    <Link
      href={`/dashboard/bookings/${booking.id}`}
      className="flex items-center justify-between px-5 py-3 hover:bg-zinc-50 transition-colors"
    >
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-zinc-900 truncate">{booking.guestName}</p>
        <p className="text-xs text-zinc-400">{booking.room.name}</p>
      </div>
      <div className="text-right ml-4">
        <p className="text-xs font-medium text-zinc-900">{formatDate(booking.checkIn)}</p>
        <p className="text-xs text-zinc-400">{formatPrice(booking.totalPrice)}</p>
      </div>
    </Link>
  );
}