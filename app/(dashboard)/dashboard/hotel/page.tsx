// app/(dashboard)/dashboard/hotel/page.tsx
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { getHotelByOwner } from '@/actions/hotel-actions'
import { HotelProfileForm } from '@/components/dashboard/hotel-profile-form'
import { HotelImageUploader } from '@/components/dashboard/hotel-image-uploader'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Globe, CheckCircle, ImageIcon } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function HotelPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const hotel = await getHotelByOwner()

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Hotel Profile</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your hotel information displayed on your booking website.
          </p>
        </div>
        {hotel && (
          <Link href={`/${hotel.slug}`} target="_blank">
            <Button variant="outline" size="sm" className="gap-2">
              <Globe className="h-4 w-4" />
              View live site
            </Button>
          </Link>
        )}
      </div>

      {/* Live indicator */}
      {hotel && (
        <div className="flex items-center gap-3 rounded-xl bg-emerald-50 border border-emerald-100 p-4">
          <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-emerald-900">Your booking site is live</p>
            <p className="text-xs text-emerald-700 mt-0.5">
              {process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/{hotel.slug}
            </p>
          </div>
          <Badge variant="success" className="ml-auto">Active</Badge>
        </div>
      )}

      {/* Hotel info form */}
      <Card>
        <CardHeader>
          <CardTitle>{hotel ? 'Update hotel information' : 'Create your hotel'}</CardTitle>
          <CardDescription>
            This information will be displayed on your public booking website.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <HotelProfileForm hotel={hotel} />
        </CardContent>
      </Card>

      {/* Photo gallery */}
      {hotel && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-slate-500" />
              <div>
                <CardTitle>Hotel Photos</CardTitle>
                <CardDescription>
                  Upload photos of your hotel. The first image is used as the main cover photo.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <HotelImageUploader
              hotelId={hotel.id}
              currentImages={hotel.images || []}
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
