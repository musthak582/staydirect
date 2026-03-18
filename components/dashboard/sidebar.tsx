"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Hotel, 
  BedDouble, 
  Calendar,
  BarChart3,
  Settings,
  LogOut,
  ChevronRight,
  Sparkles,
  ExternalLink
} from "lucide-react";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface DashboardSidebarProps {
  user: {
    name: string;
    email: string;
    image?: string | null;
  };
  hotelSlug?: string;
  hotelName?: string;
}

const navItems = [
  { 
    name: "Hotel Profile", 
    href: "/dashboard/hotel", 
    icon: Hotel,
    description: "Manage your hotel info"
  },
  { 
    name: "Rooms", 
    href: "/dashboard/rooms", 
    icon: BedDouble,
    description: "List and manage rooms"
  },
  { 
    name: "Bookings", 
    href: "/dashboard/bookings", 
    icon: Calendar,
    description: "View and manage reservations"
  },
  { 
    name: "Analytics", 
    href: "/dashboard/analytics", 
    icon: BarChart3,
    description: "Revenue and occupancy",
    badge: "Soon",
    disabled: true
  },
  { 
    name: "Settings", 
    href: "/dashboard/settings", 
    icon: Settings,
    description: "Account and preferences",
    badge: "Soon",
    disabled: true
  },
];

// Helper function to get initials from name
function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function DashboardSidebar({ user, hotelSlug, hotelName }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isHovered, setIsHovered] = useState<string | null>(null);

  const userInitials = getInitials(user.name);

  return (
    <div className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-zinc-200 flex flex-col">
      {/* Logo with hover effect */}
      <div className="relative group">
        <div className="h-16 flex items-center gap-2.5 px-6 border-b border-zinc-200">
          <div className="w-7 h-7 bg-zinc-950 rounded-md flex items-center justify-center transition-all group-hover:rounded-lg group-hover:scale-105">
            <div className="w-3.5 h-3.5 bg-white rounded-sm group-hover:rotate-12 transition-transform" />
          </div>
          <span className="text-zinc-900 text-sm font-medium tracking-widest uppercase">
            StayDirect
          </span>
        </div>
        
        {/* Subtle gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-900/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          const isHoveredItem = isHovered === item.href;
          
          return (
            <div key={item.href} className="relative">
              {item.disabled ? (
                // Disabled item with tooltip-like feel
                <div 
                  className="relative group cursor-not-allowed"
                  onMouseEnter={() => setIsHovered(item.href)}
                  onMouseLeave={() => setIsHovered(null)}
                >
                  <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg opacity-50">
                    <Icon size={16} className="text-zinc-400" />
                    <div className="flex-1">
                      <span className="text-xs tracking-widest uppercase text-zinc-400">
                        {item.name}
                      </span>
                      {item.badge && (
                        <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-500 text-[10px] tracking-widest uppercase">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Hover tooltip */}
                  {isHoveredItem && (
                    <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-zinc-900 text-white text-[10px] tracking-widest uppercase px-2 py-1 rounded whitespace-nowrap z-50">
                      Coming soon
                      <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 border-4 border-transparent border-r-zinc-900" />
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href}
                  onMouseEnter={() => setIsHovered(item.href)}
                  onMouseLeave={() => setIsHovered(null)}
                  className="relative block group"
                >
                  {/* Background with animation */}
                  <div 
                    className={`
                      absolute inset-0 rounded-lg transition-all duration-200
                      ${isActive 
                        ? 'bg-zinc-100' 
                        : 'bg-transparent group-hover:bg-zinc-50'
                      }
                    `} 
                  />
                  
                  {/* Content */}
                  <div className="relative flex items-center gap-3 px-3 py-2.5">
                    {/* Icon container with hover effect */}
                    <div className={`
                      transition-all duration-200
                      ${isActive 
                        ? 'text-zinc-900' 
                        : 'text-zinc-400 group-hover:text-zinc-900'
                      }
                    `}>
                      <Icon size={16} />
                    </div>
                    
                    {/* Text and description */}
                    <div className="flex-1">
                      <span className={`
                        text-xs tracking-widest uppercase transition-colors duration-200
                        ${isActive ? 'text-zinc-900 font-medium' : 'text-zinc-400 group-hover:text-zinc-900'}
                      `}>
                        {item.name}
                      </span>
                      
                      {/* Description appears on hover */}
                      <div className={`
                        overflow-hidden transition-all duration-200
                        ${isHoveredItem ? 'max-h-8 opacity-100 mt-0.5' : 'max-h-0 opacity-0'}
                      `}>
                        <span className="text-[10px] text-zinc-400">
                          {item.description}
                        </span>
                      </div>
                    </div>
                    
                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute right-2 w-1 h-1 bg-zinc-900 rounded-full" />
                    )}
                    
                    {/* Chevron on hover */}
                    <ChevronRight 
                      size={12} 
                      className={`
                        absolute right-3 text-zinc-300 transition-all duration-200
                        ${isHoveredItem ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}
                      `}
                    />
                  </div>
                </Link>
              )}
            </div>
          );
        })}
      </nav>

      {/* User section with actual data */}
      <div className="border-t border-zinc-200 p-4">
        {/* Live site link - only show if hotel exists */}
        {hotelSlug && (
          <Link
            href={`/${hotelSlug}`}
            target="_blank"
            className="flex items-center justify-between px-3 py-2 mb-2 rounded-lg hover:bg-zinc-50 transition-all group"
          >
            <span className="flex items-center gap-2">
              <Sparkles size={14} className="text-amber-500" />
              <span className="text-xs tracking-widest uppercase text-zinc-600 group-hover:text-zinc-900">
                {hotelName ? `${hotelName}` : 'Live site'}
              </span>
            </span>
            <ExternalLink 
              size={12} 
              className="text-zinc-300 group-hover:text-zinc-900 group-hover:translate-x-0.5 transition-all" 
            />
          </Link>
        )}

        {/* User info from session */}
        <div className="px-3 py-2 mb-2">
          <div className="flex items-center gap-2">
            {/* Avatar with image or fallback initials */}
            <div className="w-8 h-8 bg-zinc-100 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
              {user.image ? (
                <img 
                  src={user.image} 
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xs font-medium text-zinc-600">
                  {userInitials}
                </span>
              )}
            </div>
            
            {/* User details */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-zinc-900 truncate">
                {user.name}
              </p>
              <p className="text-[10px] text-zinc-400 truncate">
                {user.email}
              </p>
            </div>
          </div>
        </div>

        {/* Sign out button with animation */}
        <button
          onClick={async () => {
            await signOut();
            router.push("/");
          }}
          className="relative group w-full overflow-hidden rounded-lg"
        >
          <div className="absolute inset-0 bg-zinc-100 translate-y-full group-hover:translate-y-0 transition-transform duration-200" />
          <div className="relative flex items-center gap-3 px-3 py-2.5">
            <LogOut size={14} className="text-zinc-400 group-hover:text-zinc-900 transition-colors z-10" />
            <span className="text-xs tracking-widest uppercase text-zinc-400 group-hover:text-zinc-900 transition-colors z-10">
              Sign out
            </span>
          </div>
        </button>

        {/* Version */}
        <p className="text-[10px] text-zinc-300 text-center mt-4">
          v1.0.0 • Beta
        </p>
      </div>
    </div>
  );
}