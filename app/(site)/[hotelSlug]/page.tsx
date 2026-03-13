// app/(site)/[hotelSlug]/page.tsx
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { HotelHero } from '@/components/website/hotel-hero'
import { HotelRooms } from '@/components/website/hotel-rooms'
import { HotelAmenities } from '@/components/website/hotel-amenities'
import { HotelReviews } from '@/components/website/hotel-reviews'
import { HotelContact } from '@/components/website/hotel-contact'
import { SiteHeader } from '@/components/website/site-header'
import { SiteFooter } from '@/components/website/site-footer'

interface HotelPageProps {
  params: { hotelSlug: string } | Promise<{ hotelSlug: string }>
}

// ✅ Unwrap params if it's a Promise
async function getHotelSlug(params: { hotelSlug: string } | Promise<{ hotelSlug: string }>) {
  if (params instanceof Promise) return (await params).hotelSlug
  return params.hotelSlug
}

export async function generateMetadata({ params }: HotelPageProps) {
  const hotelSlug = await getHotelSlug(params)

  const hotel = await prisma.hotel.findUnique({
    where: { slug: hotelSlug },
  })
  if (!hotel) return { title: 'Hotel Not Found' }

  return {
    title: `${hotel.name} — Book Direct`,
    description: hotel.description || `Book directly at ${hotel.name}. Best rates guaranteed.`,
  }
}

export default async function HotelPublicPage({ params }: HotelPageProps) {
  const hotelSlug = await getHotelSlug(params)

  const hotel = await prisma.hotel.findUnique({
    where: { slug: hotelSlug },
    include: {
      rooms: {
        where: { isAvailable: true },
        orderBy: { price: 'asc' },
      },
      reviews: {
        where: { approved: true },
        orderBy: { createdAt: 'desc' },
        take: 6,
      },
    },
  })

  if (!hotel) notFound()

  const avgRating =
    hotel.reviews.length > 0
      ? hotel.reviews.reduce((sum, r) => sum + r.rating, 0) / hotel.reviews.length
      : null

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader hotel={hotel} />
      <HotelHero hotel={hotel} avgRating={avgRating} reviewCount={hotel.reviews.length} />
      <HotelRooms rooms={hotel.rooms} hotelSlug={hotel.slug} currency={hotel.currency} />
      {hotel.amenities?.length > 0 && <HotelAmenities amenities={hotel.amenities} />}
      {hotel.reviews.length > 0 && (
        <HotelReviews reviews={hotel.reviews} hotelId={hotel.id} avgRating={avgRating} />
      )}
      <HotelContact hotel={hotel} />
      <SiteFooter hotel={hotel} />
    </div>
  )
}