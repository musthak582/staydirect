// components/dashboard/sidebar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Hotel,
  LayoutDashboard,
  BedDouble,
  CalendarCheck,
  CalendarDays,
  Globe,
  BarChart3,
  Settings,
  LogOut,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { logoutAction } from '@/actions/auth-actions'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { getInitials } from '@/lib/utils'

const navItems = [
  { href: '/dashboard',            label: 'Overview',      icon: LayoutDashboard },
  { href: '/dashboard/hotel',      label: 'Hotel Profile', icon: Hotel           },
  { href: '/dashboard/rooms',      label: 'Rooms',         icon: BedDouble       },
  { href: '/dashboard/bookings',   label: 'Bookings',      icon: CalendarCheck   },
  { href: '/dashboard/calendar',   label: 'Calendar',      icon: CalendarDays    },
  { href: '/dashboard/website',    label: 'Website',       icon: Globe           },
  { href: '/dashboard/analytics',  label: 'Analytics',     icon: BarChart3       },
  { href: '/dashboard/settings',   label: 'Settings',      icon: Settings        },
]

interface SidebarProps {
  user: {
    name: string
    email: string
    hotel?: { name: string; slug: string } | null
  }
}

export function DashboardSidebar({ user }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex w-64 flex-col bg-white border-r border-slate-100 shrink-0">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 px-6 border-b border-slate-100">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600">
          <Hotel className="h-4 w-4 text-white" />
        </div>
        <span className="text-lg font-bold text-slate-900">StayDirect</span>
      </div>

      {/* Hotel badge */}
      {user.hotel && (
        <div className="mx-4 mt-4 rounded-xl bg-slate-50 px-3 py-2.5">
          <p className="text-xs text-slate-400 font-medium">Managing</p>
          <p className="text-sm font-semibold text-slate-900 truncate">{user.hotel.name}</p>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-gradient-to-r from-violet-50 to-indigo-50 text-violet-700 border border-violet-100'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              )}
            >
              <item.icon
                className={cn(
                  'h-4 w-4 shrink-0',
                  isActive ? 'text-violet-600' : 'text-slate-400'
                )}
              />
              {item.label}
              {isActive && <ChevronRight className="ml-auto h-3 w-3 text-violet-400" />}
            </Link>
          )
        })}
      </nav>

      {/* View live site */}
      {user.hotel && (
        <div className="px-3 pb-2">
          <Link
            href={`/${user.hotel.slug}`}
            target="_blank"
            className="flex items-center gap-2 rounded-xl border border-dashed border-violet-200 bg-violet-50 px-3 py-2.5 text-sm font-medium text-violet-700 hover:bg-violet-100 transition-colors"
          >
            <Globe className="h-4 w-4" />
            View your site
            <ChevronRight className="ml-auto h-3 w-3" />
          </Link>
        </div>
      )}

      {/* User footer */}
      <div className="border-t border-slate-100 p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs">{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">{user.name}</p>
            <p className="text-xs text-slate-400 truncate">{user.email}</p>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="rounded-lg p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </aside>
  )
}
