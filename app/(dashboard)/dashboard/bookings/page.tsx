import { getHotelBookings } from "@/actions/booking-actions";
import { getMyHotel } from "@/actions/hotel-actions";
import { EmptyState } from "@/components/ui/empty-state";
import { BookingsTable } from "@/components/dashboard/bookings-table";
import { 
  CalendarDays, 
  Hotel, 
  CalendarCheck, 
  Clock, 
  TrendingUp,
  ChevronRight,
  Download,
  Filter
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function BookingsPage() {
  const [hotel, bookings] = await Promise.all([getMyHotel(), getHotelBookings()]);

  // Calculate stats
  const totalBookings = bookings.length;
  const pendingCount = bookings.filter((b) => b.status === "PENDING").length;
  const confirmedCount = bookings.filter((b) => b.status === "CONFIRMED").length;
  const cancelledCount = bookings.filter((b) => b.status === "CANCELLED").length;
  
  const totalRevenue = bookings
    .filter((b) => b.status === "CONFIRMED")
    .reduce((sum, b) => sum + b.totalPrice, 0);
  
  const upcomingStays = bookings.filter(
    (b) => b.status === "CONFIRMED" && new Date(b.checkIn) > new Date()
  ).length;

  return (
    <div className="space-y-8">
      {/* Header with gradient background */}
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
            <span className="text-zinc-900 font-medium">Bookings</span>
          </div>

          {/* Title and actions */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-semibold tracking-tighter text-zinc-900 mb-2">
                Bookings
              </h1>
              <p className="text-zinc-500 text-sm">
                Manage reservations, confirm bookings, and track revenue
              </p>
            </div>

            {hotel && bookings.length > 0 && (
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  className="border-zinc-200 text-zinc-600 hover:border-zinc-400 text-xs tracking-widest uppercase h-11 px-5 gap-2"
                >
                  <Download size={14} />
                  Export
                </Button>
                <Button 
                  variant="outline" 
                  className="border-zinc-200 text-zinc-600 hover:border-zinc-400 text-xs tracking-widest uppercase h-11 px-5 gap-2"
                >
                  <Filter size={14} />
                  Filter
                </Button>
              </div>
            )}
          </div>

          {/* Quick stats */}
          {hotel && bookings.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-8">
              <StatCard
                label="Total bookings"
                value={totalBookings}
                icon={CalendarDays}
                change="+12%"
                changeUp={true}
              />
              <StatCard
                label="Pending"
                value={pendingCount}
                icon={Clock}
                subtext="awaiting confirmation"
                highlight={pendingCount > 0}
              />
              <StatCard
                label="Confirmed"
                value={confirmedCount}
                icon={CalendarCheck}
                subtext="active reservations"
              />
              <StatCard
                label="Revenue"
                value={`$${totalRevenue.toLocaleString()}`}
                icon={TrendingUp}
                subtext="from confirmed"
              />
              <StatCard
                label="Upcoming"
                value={upcomingStays}
                icon={CalendarDays}
                subtext="future stays"
              />
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      {!hotel ? (
        <div className="max-w-7xl mx-auto">
          <EmptyState
            icon={Hotel}
            title="No hotel profile yet"
            description="Create your hotel profile to start receiving bookings."
            action={{
              label: "Create hotel profile",
              href: "/dashboard/hotel",
              icon: Hotel
            }}
          />
        </div>
      ) : bookings.length === 0 ? (
        <div className="max-w-7xl mx-auto">
          <EmptyState
            icon={CalendarDays}
            title="No bookings yet"
            description="Bookings will appear here once guests reserve rooms on your site. Share your booking link to get started."
            action={{
              label: "View live site",
              href: `/${hotel.slug}`,
              icon: CalendarCheck
            }}
          />
          
          {/* Helpful tips */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto">
            <TipCard
              number="01"
              title="Share your link"
              description="Share your unique booking link on social media and Google Maps"
            />
            <TipCard
              number="02"
              title="Add more rooms"
              description="The more rooms you have, the more booking opportunities"
            />
            <TipCard
              number="03"
              title="Respond quickly"
              description="Confirm pending bookings promptly to secure reservations"
            />
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto">
          {/* Filters and search bar */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-zinc-500">
              Showing <span className="text-zinc-900 font-medium">{bookings.length}</span> bookings
            </p>
            
            <div className="flex items-center gap-3">
              <select className="text-xs border border-zinc-200 rounded-lg px-3 py-2 bg-white text-zinc-600 focus:outline-none focus:border-zinc-400">
                <option>All statuses</option>
                <option>Pending</option>
                <option>Confirmed</option>
                <option>Cancelled</option>
              </select>
              <select className="text-xs border border-zinc-200 rounded-lg px-3 py-2 bg-white text-zinc-600 focus:outline-none focus:border-zinc-400">
                <option>Last 30 days</option>
                <option>Last 90 days</option>
                <option>This year</option>
                <option>All time</option>
              </select>
            </div>
          </div>

          {/* Bookings table */}
          <BookingsTable bookings={bookings} />
        </div>
      )}
    </div>
  );
}

// Stat Card Component
function StatCard({ 
  label, 
  value, 
  icon: Icon, 
  change,
  changeUp,
  subtext,
  highlight 
}: { 
  label: string;
  value: string | number;
  icon: React.ElementType;
  change?: string;
  changeUp?: boolean;
  subtext?: string;
  highlight?: boolean;
}) {
  return (
    <div className={cn(
      "bg-white border rounded-xl p-5 transition-all hover:shadow-lg group",
      highlight 
        ? "border-amber-200 bg-amber-50/30" 
        : "border-zinc-200 hover:border-zinc-400"
    )}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs tracking-widest uppercase text-zinc-400">{label}</p>
        <div className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
          highlight 
            ? "bg-amber-100 group-hover:bg-amber-200" 
            : "bg-zinc-100 group-hover:bg-zinc-200"
        )}>
          <Icon size={14} className={highlight ? "text-amber-600" : "text-zinc-600"} />
        </div>
      </div>
      
      <p className="text-2xl font-semibold text-zinc-900 mb-1">{value}</p>
      
      {change && (
        <p className={cn(
          "text-xs",
          changeUp ? "text-emerald-600" : "text-zinc-400"
        )}>
          {change} from last month
        </p>
      )}
      
      {subtext && (
        <p className="text-xs text-zinc-400">{subtext}</p>
      )}
    </div>
  );
}

// Tip Card Component
function TipCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-5 hover:border-zinc-400 transition-all group">
      <span className="text-xs font-medium text-zinc-300 group-hover:text-zinc-400 mb-3 block">{number}</span>
      <h4 className="text-sm font-semibold text-zinc-900 mb-2">{title}</h4>
      <p className="text-xs text-zinc-500">{description}</p>
    </div>
  );
}