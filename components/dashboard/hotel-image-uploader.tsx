// components/dashboard/hotel-image-uploader.tsx
'use client'

import { useState, useTransition } from 'react'
import { X, ImageIcon, Star, Upload, Loader2 } from 'lucide-react'
import { addHotelImageAction, removeHotelImageAction } from '@/actions/image-actions'
import { toast } from 'sonner'

// NOTE: UploadThing's UploadButton is imported this way.
// Make sure `npm install uploadthing @uploadthing/react` is done.
// The UploadButton component handles the full upload lifecycle internally.
import { UploadButton } from '@uploadthing/react'
import type { OurFileRouter } from '@/lib/uploadthing'

interface HotelImageUploaderProps {
  hotelId: string
  currentImages: string[]
}

export function HotelImageUploader({ hotelId, currentImages }: HotelImageUploaderProps) {
  const [images, setImages] = useState<string[]>(currentImages)
  const [isPending, startTransition] = useTransition()
  const [isUploading, setIsUploading] = useState(false)

  function handleRemove(url: string) {
    startTransition(async () => {
      const result = await removeHotelImageAction(url)
      if (result.success) {
        setImages((prev) => prev.filter((img) => img !== url))
        toast.success('Image removed')
      } else {
        toast.error('Failed to remove image')
      }
    })
  }

  return (
    <div className="space-y-4">
      {/* Upload button */}
      <div className="flex items-center gap-4">
        {images.length < 8 && (
          <UploadButton<OurFileRouter, 'hotelImageUploader'>
            endpoint="hotelImageUploader"
            onUploadBegin={() => setIsUploading(true)}
            onClientUploadComplete={async (res) => {
              setIsUploading(false)
              if (!res || res.length === 0) return
              for (const file of res) {
                const result = await addHotelImageAction(file.url)
                if (result.success) {
                  setImages((prev) => [...prev, file.url])
                }
              }
              toast.success(`${res.length} photo${res.length !== 1 ? 's' : ''} uploaded!`)
            }}
            onUploadError={(error) => {
              setIsUploading(false)
              toast.error(`Upload failed: ${error.message}. Check your UPLOADTHING_SECRET in .env`)
            }}
            appearance={{
              button:
                'ut-ready:bg-violet-600 ut-ready:hover:bg-violet-700 ut-uploading:bg-violet-400 rounded-xl px-4 py-2 text-sm font-medium text-white flex items-center gap-2',
              container: 'flex items-center',
              allowedContent: 'text-xs text-slate-400 mt-1',
            }}
            content={{
              button({ ready, isUploading: uploading }) {
                if (uploading) return <><Loader2 className="h-4 w-4 animate-spin" /> Uploading...</>
                if (ready) return <><Upload className="h-4 w-4" /> Upload photos</>
                return 'Loading...'
              },
              allowedContent: `Up to ${8 - images.length} more images (max 4MB each)`,
            }}
          />
        )}
        {images.length >= 8 && (
          <p className="text-sm text-slate-400">Maximum 8 images reached</p>
        )}
      </div>

      {/* Image grid */}
      {images.length > 0 ? (
        <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
          {images.map((url, index) => (
            <div
              key={url}
              className="group relative rounded-xl overflow-hidden aspect-video bg-slate-100"
            >
              <img
                src={url}
                alt={`Hotel photo ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {index === 0 && (
                <div className="absolute top-1.5 left-1.5 flex items-center gap-1 bg-amber-400 text-amber-900 text-[10px] font-semibold rounded-md px-1.5 py-0.5">
                  <Star className="h-2.5 w-2.5" /> Main
                </div>
              )}
              <button
                onClick={() => handleRemove(url)}
                disabled={isPending || isUploading}
                className="absolute top-1.5 right-1.5 h-6 w-6 rounded-md bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center gap-2 rounded-xl bg-slate-50 border border-dashed border-slate-200 p-6 text-sm text-slate-400">
          <ImageIcon className="h-5 w-5" />
          No photos yet. Upload your hotel photos above. The first photo becomes the cover image.
        </div>
      )}
    </div>
  )
}
