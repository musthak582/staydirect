// app/(dashboard)/dashboard/page.tsx
import Link from 'next/link'
import {
  TrendingUp,
  CalendarCheck,
  BedDouble,
  DollarSign,
  ArrowRight,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getCurrentUser } from '@/lib/auth'
import { getHotelStats } from '@/actions/hotel-actions'
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  if (!user.hotel) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-16 h-16 rounded-2xl bg-violet-50 flex items-center justify-center mb-4">
          <BedDouble className="h-8 w-8 text-violet-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Set up your hotel</h2>
        <p className="mt-2 text-slate-500 max-w-md">
          You haven&apos;t set up your hotel profile yet. Create it now to start accepting direct bookings.
        </p>
        <Link href="/dashboard/hotel" className="mt-6">
          <Button variant="brand" size="lg">
            Set up hotel profile <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    )
  }

  const stats = await getHotelStats()

  const statsCards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(stats?.totalRevenue || 0),
      change: '+18.2%',
      icon: DollarSign,
      color: 'bg-emerald-50 text-emerald-600',
      positive: true,
    },
    {
      title: 'Total Bookings',
      value: stats?.totalBookings?.toString() || '0',
      change: '+12 this month',
      icon: CalendarCheck,
      color: 'bg-violet-50 text-violet-600',
      positive: true,
    },
    {
      title: 'Total Rooms',
      value: stats?.totalRooms?.toString() || '0',
      change: 'Active rooms',
      icon: BedDouble,
      color: 'bg-blue-50 text-blue-600',
      positive: null,
    },
    {
      title: 'Occupancy Rate',
      value: `${stats?.occupancyRate || 0}%`,
      change: '+5% vs last month',
      icon: TrendingUp,
      color: 'bg-amber-50 text-amber-600',
      positive: true,
    },
  ]

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Good morning, {user.name.split(' ')[0]} 👋
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Here&apos;s what&apos;s happening with {user.hotel.name} today.
          </p>
        </div>
        <Link href="/dashboard/bookings">
          <Button variant="brand" size="sm">
            View all bookings
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                <p className="mt-1 text-3xl font-bold text-slate-900">{stat.value}</p>
                <p className={`mt-1 text-xs font-medium ${stat.positive === true ? 'text-emerald-600' : stat.positive === false ? 'text-red-600' : 'text-slate-400'}`}>
                  {stat.change}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent bookings */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Bookings</CardTitle>
              <CardDescription>Latest reservation activity</CardDescription>
            </div>
            <Link href="/dashboard/bookings">
              <Button variant="ghost" size="sm" className="text-violet-600 hover:text-violet-700">
                View all <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {stats?.recentBookings && stats.recentBookings.length > 0 ? (
              <div className="space-y-3">
                {stats.recentBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 hover:bg-slate-100 transition-colors"
                  >
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                      {booking.guestName[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900">{booking.guestName}</p>
                      <p className="text-xs text-slate-400 truncate">
                        {booking.room.name} · {formatDate(booking.checkIn)} – {formatDate(booking.checkOut)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className={`text-xs px-2 py-0.5 rounded-lg border font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                      <p className="text-xs font-semibold text-slate-700">
                        {formatCurrency(booking.totalAmount)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400">
                <CalendarCheck className="h-8 w-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm">No bookings yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              { href: '/dashboard/rooms', label: 'Add new room', icon: BedDouble, color: 'text-blue-600 bg-blue-50' },
              { href: '/dashboard/bookings', label: 'Manage bookings', icon: CalendarCheck, color: 'text-violet-600 bg-violet-50' },
              { href: '/dashboard/website', label: 'Customize website', icon: TrendingUp, color: 'text-emerald-600 bg-emerald-50' },
              { href: '/dashboard/analytics', label: 'View analytics', icon: TrendingUp, color: 'text-amber-600 bg-amber-50' },
            ].map((action) => (
              <Link key={action.href} href={action.href}>
                <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-slate-50 transition-colors cursor-pointer group">
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${action.color}`}>
                    <action.icon className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
                    {action.label}
                  </span>
                  <ArrowRight className="ml-auto h-3.5 w-3.5 text-slate-300 group-hover:text-slate-500" />
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
