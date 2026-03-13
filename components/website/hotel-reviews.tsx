// components/website/hotel-reviews.tsx
'use client'

import { useState, useTransition } from 'react'
import { Star, MessageSquare, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createReviewAction } from '@/actions/booking-actions'
import { toast } from 'sonner'
import { formatDate } from '@/lib/utils'

interface Review {
  id: string
  guestName: string
  rating: number
  comment?: string | null
  createdAt: Date
}

interface HotelReviewsProps {
  reviews: Review[]
  hotelId: string
  avgRating: number | null
}

function StarRating({ rating, interactive = false, onRate }: {
  rating: number
  interactive?: boolean
  onRate?: (r: number) => void
}) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 transition-colors ${
            star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'
          } ${interactive ? 'cursor-pointer hover:text-amber-400 hover:fill-amber-400' : ''}`}
          onClick={() => interactive && onRate?.(star)}
        />
      ))}
    </div>
  )
}

export function HotelReviews({ reviews, hotelId, avgRating }: HotelReviewsProps) {
  const [showForm, setShowForm] = useState(false)
  const [selectedRating, setSelectedRating] = useState(5)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    formData.set('hotelId', hotelId)
    formData.set('rating', selectedRating.toString())

    startTransition(async () => {
      const result = await createReviewAction(formData)
      if (result.success) {
        toast.success('Thank you for your review! It will be published after approval.')
        setShowForm(false)
      } else {
        toast.error(result.error || 'Failed to submit review')
      }
    })
  }

  return (
    <section id="reviews" className="py-20 bg-slate-50">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Guest Reviews</h2>
            {avgRating && (
              <div className="flex items-center gap-2 mt-2">
                <StarRating rating={Math.round(avgRating)} />
                <span className="text-2xl font-bold text-slate-900">{avgRating.toFixed(1)}</span>
                <span className="text-slate-500 text-sm">({reviews.length} reviews)</span>
              </div>
            )}
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            variant="outline"
            className="gap-2 shrink-0"
          >
            <MessageSquare className="h-4 w-4" />
            Write a review
          </Button>
        </div>

        {/* Review form */}
        {showForm && (
          <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Share your experience</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Your rating</Label>
                <div className="mt-2 flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-7 w-7 cursor-pointer transition-colors ${
                        star <= selectedRating ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'
                      } hover:text-amber-400 hover:fill-amber-400`}
                      onClick={() => setSelectedRating(star)}
                    />
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="review-name">Your name</Label>
                <Input id="review-name" name="guestName" placeholder="John Doe" required className="mt-1" />
              </div>
              <div>
                <Label htmlFor="review-comment">Your review</Label>
                <Textarea
                  id="review-comment"
                  name="comment"
                  placeholder="Tell us about your stay..."
                  rows={3}
                  className="mt-1"
                />
              </div>
              <div className="flex gap-3">
                <Button type="submit" disabled={isPending} className="bg-slate-900 hover:bg-slate-800">
                  {isPending ? <><Loader2 className="h-4 w-4 animate-spin" />Submitting...</> : 'Submit review'}
                </Button>
                <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </form>
          </div>
        )}

        {/* Reviews grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <div key={review.id} className="rounded-2xl bg-white border border-slate-100 p-5 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">
                    {review.guestName[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{review.guestName}</p>
                    <p className="text-xs text-slate-400">{formatDate(review.createdAt)}</p>
                  </div>
                </div>
                <StarRating rating={review.rating} />
              </div>
              {review.comment && (
                <p className="text-sm text-slate-600 leading-relaxed">{review.comment}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
