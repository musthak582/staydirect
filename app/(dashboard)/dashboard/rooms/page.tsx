import Link from "next/link";
import { getMyHotel } from "@/actions/hotel-actions";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Hotel, 
  BedDouble, 
  Sparkles,
  DollarSign,
  Calendar,
  Users,
  Grid3x3,
  List,
  SlidersHorizontal,
  ChevronRight
} from "lucide-react";
import { RoomCard } from "@/components/dashboard/room-card";
import { EmptyState } from "@/components/ui/empty-state";

// Mock stats for demo - replace with real data
async function getRoomStats(hotel: any) {
  if (!hotel) return null;
  
  return {
    totalRooms: hotel.rooms.length,
    totalCapacity: hotel.rooms.reduce((sum: number, room: any) => sum + room.capacity, 0),
    avgPrice: hotel.rooms.length 
      ? Math.round(hotel.rooms.reduce((sum: number, room: any) => sum + room.price, 0) / hotel.rooms.length)
      : 0,
    bookedTonight: Math.floor(hotel.rooms.length * 0.6), // Mock data - 60% booked
  };
}

export default async function RoomsPage() {
  const hotel = await getMyHotel();
  const stats = hotel ? await getRoomStats(hotel) : null;

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
            <span className="text-zinc-400">Dashboard</span>
            <ChevronRight size={10} className="text-zinc-300" />
            <span className="text-zinc-900 font-medium">Rooms</span>
          </div>

          {/* Title and action */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-semibold tracking-tighter text-zinc-900 mb-2">
                Rooms
              </h1>
              <p className="text-zinc-500 text-sm">
                Manage your rooms, pricing, and availability
              </p>
            </div>

            {hotel && (
              <Link href="/dashboard/rooms/new">
                <Button className="bg-zinc-900 hover:bg-zinc-800 text-white text-xs tracking-widest uppercase h-11 px-6 gap-2 group">
                  <Plus size={14} className="group-hover:rotate-90 transition-transform duration-300" />
                  Add new room
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {hotel && stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 -mt-6">
          <StatCard
            label="Total rooms"
            value={stats.totalRooms}
            icon={BedDouble}
            trend="+2 this month"
            trendUp={true}
          />
          <StatCard
            label="Total capacity"
            value={stats.totalCapacity}
            icon={Users}
            description="guests max"
          />
          <StatCard
            label="Average price"
            value={`$${stats.avgPrice}`}
            icon={DollarSign}
            description="per night"
          />
          <StatCard
            label="Booked tonight"
            value={stats.bookedTonight}
            icon={Calendar}
            progress={(stats.bookedTonight / stats.totalRooms) * 100}
          />
        </div>
      )}

      {/* View controls (only if rooms exist) */}
      {hotel && hotel.rooms.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-zinc-500">
            Showing <span className="text-zinc-900 font-medium">{hotel.rooms.length}</span> rooms
          </p>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 p-1 bg-zinc-100 rounded-lg">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-zinc-600 hover:text-zinc-900 hover:bg-white">
                <Grid3x3 size={14} />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-zinc-400 hover:text-zinc-900 hover:bg-white">
                <List size={14} />
              </Button>
            </div>
            <Button variant="outline" size="sm" className="border-zinc-200 text-zinc-600 hover:border-zinc-400 hover:text-zinc-900 text-xs gap-2 h-9">
              <SlidersHorizontal size={12} />
              Filter
            </Button>
          </div>
        </div>
      )}

      {/* Main content */}
      {!hotel ? (
        <EmptyState
          icon={Hotel}
          title="No hotel profile yet"
          description="Create your hotel profile before adding rooms. This will set up your public booking page."
          action={{
            label: "Create hotel profile",
            href: "/dashboard/hotel",
            icon: Sparkles
          }}
        />
      ) : hotel.rooms.length === 0 ? (
        <EmptyState
          icon={BedDouble}
          title="No rooms added yet"
          description="Start by adding your first room. You can add photos, set prices, and manage availability."
          action={{
            label: "Add your first room",
            href: "/dashboard/rooms/new",
            icon: Plus
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {hotel.rooms.map((room, index) => (
            <div
              key={room.id}
              className="animate-in fade-in slide-in-from-bottom-4 duration-500"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <RoomCard room={room} />
            </div>
          ))}
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
  trend,
  trendUp,
  description,
  progress 
}: { 
  label: string;
  value: string | number;
  icon: React.ElementType;
  trend?: string;
  trendUp?: boolean;
  description?: string;
  progress?: number;
}) {
  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-5 hover:border-zinc-400 transition-all hover:shadow-lg group">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs tracking-widest uppercase text-zinc-400">{label}</p>
        <div className="w-8 h-8 bg-zinc-100 rounded-lg flex items-center justify-center group-hover:bg-zinc-900 group-hover:text-white transition-colors">
          <Icon size={14} className="text-zinc-600 group-hover:text-white transition-colors" />
        </div>
      </div>
      
      <p className="text-2xl font-semibold text-zinc-900 mb-1">{value}</p>
      
      {trend && (
        <p className={`text-xs ${trendUp ? 'text-emerald-600' : 'text-zinc-400'}`}>
          {trend}
        </p>
      )}
      
      {description && (
        <p className="text-xs text-zinc-400">{description}</p>
      )}
      
      {progress !== undefined && (
        <div className="mt-3">
          <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-zinc-900 rounded-full transition-all duration-500 group-hover:bg-zinc-700"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-[10px] text-zinc-400 mt-1">
            {Math.round(progress)}% occupied
          </p>
        </div>
      )}
    </div>
  );
}