// components/dashboard/analytics-charts.tsx
'use client'

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'

interface MonthlyData {
  month: string
  bookings: number
  revenue: number
}

interface RoomPerformance {
  name: string
  bookings: number
  revenue: number
  price: number
}

interface AnalyticsChartsProps {
  monthlyData: MonthlyData[]
  roomPerformance: RoomPerformance[]
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-slate-100 bg-white p-3 shadow-lg">
        <p className="text-xs font-semibold text-slate-700 mb-1">{label}</p>
        {payload.map((entry: any) => (
          <p key={entry.name} className="text-xs text-slate-500">
            <span className="font-medium" style={{ color: entry.color }}>
              {entry.name === 'revenue' ? formatCurrency(entry.value) : entry.value}
            </span>{' '}
            {entry.name === 'revenue' ? 'revenue' : 'bookings'}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export function AnalyticsCharts({ monthlyData, roomPerformance }: AnalyticsChartsProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Revenue chart */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Revenue</CardTitle>
          <CardDescription>Revenue from paid bookings over the last 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#7c3aed"
                strokeWidth={2}
                fill="url(#revenueGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Bookings chart */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Bookings</CardTitle>
          <CardDescription>Number of bookings per month</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="bookings" fill="#7c3aed" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Room performance */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Room Performance</CardTitle>
          <CardDescription>Bookings and revenue breakdown by room</CardDescription>
        </CardHeader>
        <CardContent>
          {roomPerformance.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">No room data available yet</p>
          ) : (
            <div className="space-y-3">
              {roomPerformance.map((room) => (
                <div key={room.name} className="flex items-center gap-4 rounded-xl bg-slate-50 px-4 py-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-semibold text-slate-900 truncate">{room.name}</p>
                      <p className="text-sm font-bold text-slate-900">{formatCurrency(room.revenue)}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full"
                          style={{
                            width: `${Math.min(100, (room.bookings / Math.max(...roomPerformance.map(r => r.bookings), 1)) * 100)}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs text-slate-500 shrink-0">{room.bookings} bookings</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
