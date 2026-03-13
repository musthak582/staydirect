// app/(dashboard)/dashboard/analytics/page.tsx
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { getHotelByOwner } from '@/actions/hotel-actions'
import { prisma } from '@/lib/prisma'
import { AnalyticsCharts } from '@/components/dashboard/analytics-charts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import { TrendingUp, DollarSign, CalendarCheck, BedDouble, Users, Star } from 'lucide-react'
import { subMonths, startOfMonth, endOfMonth, format } from 'date-fns'

export default async function AnalyticsPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const hotel = await getHotelByOwner()
  if (!hotel) redirect('/dashboard/hotel')

  // Get last 6 months data
  const months = Array.from({ length: 6 }, (_, i) => {
    const date = subMonths(new Date(), 5 - i)
    return {
      start: startOfMonth(date),
      end: endOfMonth(date),
      label: format(date, 'MMM'),
    }
  })

  const monthlyData = await Promise.all(
    months.map(async (month) => {
      const [bookings, revenue] = await Promise.all([
        prisma.booking.count({
          where: {
            hotelId: hotel.id,
            createdAt: { gte: month.start, lte: month.end },
          },
        }),
        prisma.booking.aggregate({
          where: {
            hotelId: hotel.id,
            paymentStatus: 'PAID',
            createdAt: { gte: month.start, lte: month.end },
          },
          _sum: { totalAmount: true },
        }),
      ])
      return {
        month: month.label,
        bookings,
        revenue: revenue._sum.totalAmount || 0,
      }
    })
  )

  // Room performance
  const roomStats = await prisma.room.findMany({
    where: { hotelId: hotel.id },
    include: {
      _count: { select: { bookings: true } },
      bookings: {
        where: { paymentStatus: 'PAID' },
        select: { totalAmount: true },
      },
    },
  })

  const roomPerformance = roomStats.map((room) => ({
    name: room.name,
    bookings: room._count.bookings,
    revenue: room.bookings.reduce((sum, b) => sum + b.totalAmount, 0),
    price: room.price,
  }))

  // Overall stats
  const [totalBookings, totalRevenue, avgRating, totalGuests] = await Promise.all([
    prisma.booking.count({ where: { hotelId: hotel.id } }),
    prisma.booking.aggregate({
      where: { hotelId: hotel.id, paymentStatus: 'PAID' },
      _sum: { totalAmount: true },
    }),
    prisma.review.aggregate({
      where: { hotelId: hotel.id, approved: true },
      _avg: { rating: true },
    }),
    prisma.booking.aggregate({
      where: { hotelId: hotel.id },
      _sum: { guests: true },
    }),
  ])

  const overviewStats = [
    {
      title: 'Total Revenue',
      value: formatCurrency(totalRevenue._sum.totalAmount || 0),
      icon: DollarSign,
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      title: 'Total Bookings',
      value: totalBookings.toString(),
      icon: CalendarCheck,
      color: 'bg-violet-50 text-violet-600',
    },
    {
      title: 'Total Guests',
      value: (totalGuests._sum.guests || 0).toString(),
      icon: Users,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Avg. Rating',
      value: avgRating._avg.rating ? avgRating._avg.rating.toFixed(1) : '—',
      icon: Star,
      color: 'bg-amber-50 text-amber-600',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
        <p className="mt-1 text-sm text-slate-500">
          Performance overview for {hotel.name}
        </p>
      </div>

      {/* Overview stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {overviewStats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">{stat.title}</p>
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AnalyticsCharts monthlyData={monthlyData} roomPerformance={roomPerformance} />
    </div>
  )
}
