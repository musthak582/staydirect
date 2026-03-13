// app/(dashboard)/dashboard/website/page.tsx
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { getHotelByOwner } from '@/actions/hotel-actions'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Globe, ExternalLink, Copy, CheckCircle, Palette, Layout, Star } from 'lucide-react'
import Link from 'next/link'

export default async function WebsitePage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const hotel = await getHotelByOwner()
  if (!hotel) redirect('/dashboard/hotel')

  const siteUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/${hotel.slug}`

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Your Booking Website</h1>
          <p className="mt-1 text-sm text-slate-500">
            This is your hotel&apos;s public booking page where guests make reservations.
          </p>
        </div>
        <Link href={`/${hotel.slug}`} target="_blank">
          <Button variant="brand" size="sm" className="gap-2">
            <ExternalLink className="h-4 w-4" />
            Open website
          </Button>
        </Link>
      </div>

      {/* Site URL card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-violet-50 flex items-center justify-center">
              <Globe className="h-5 w-5 text-violet-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-slate-500 mb-1">Your booking website URL</p>
              <code className="text-sm font-mono text-slate-900 bg-slate-50 px-2 py-1 rounded-lg">
                {siteUrl}
              </code>
            </div>
            <Badge variant="success">Live</Badge>
          </div>
          <div className="mt-4 flex gap-3">
            <Link href={`/${hotel.slug}`} target="_blank">
              <Button variant="outline" size="sm" className="gap-2">
                <ExternalLink className="h-4 w-4" />
                Preview site
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Website features */}
      <div className="grid gap-4 md:grid-cols-3">
        {[
          {
            icon: Layout,
            title: 'Professional design',
            description: 'Your site has a modern, mobile-friendly design that works on all devices.',
            status: 'Active',
          },
          {
            icon: Star,
            title: 'Guest reviews',
            description: 'Guests can leave reviews that build trust and increase your bookings.',
            status: 'Active',
          },
          {
            icon: CheckCircle,
            title: 'Booking engine',
            description: 'Real-time availability checking and instant booking confirmation.',
            status: 'Active',
          },
        ].map((feature) => (
          <Card key={feature.title}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="h-9 w-9 rounded-lg bg-violet-50 flex items-center justify-center">
                  <feature.icon className="h-4.5 w-4.5 text-violet-600" />
                </div>
                <Badge variant="success" className="text-xs">{feature.status}</Badge>
              </div>
              <h3 className="text-sm font-semibold text-slate-900">{feature.title}</h3>
              <p className="mt-1 text-xs text-slate-500">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Optimize your bookings</CardTitle>
          <CardDescription>Tips to get more direct bookings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { tip: 'Add high-quality photos to your rooms', done: false },
            { tip: 'Write a compelling hotel description', done: !!hotel.description },
            { tip: 'List all room amenities', done: hotel._count.rooms > 0 },
            { tip: 'Set up your contact information', done: !!(hotel.phone || hotel.email) },
            { tip: 'Share your booking URL on social media', done: false },
          ].map((item) => (
            <div key={item.tip} className="flex items-center gap-3 rounded-xl p-3 hover:bg-slate-50">
              <div className={`h-5 w-5 rounded-full flex items-center justify-center shrink-0 ${item.done ? 'bg-emerald-100' : 'bg-slate-100'}`}>
                {item.done ? (
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                ) : (
                  <div className="h-2 w-2 rounded-full bg-slate-400" />
                )}
              </div>
              <span className={`text-sm ${item.done ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                {item.tip}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
