// components/dashboard/room-image-uploader.tsx
'use client'

import { useState, useTransition } from 'react'
import { X, ImageIcon, Star, Upload, Loader2 } from 'lucide-react'
import { addRoomImageAction, removeRoomImageAction } from '@/actions/image-actions'
import { toast } from 'sonner'
import { UploadButton } from '@uploadthing/react'
import type { OurFileRouter } from '@/lib/uploadthing'

interface RoomImageUploaderProps {
  roomId: string
  currentImages: string[]
}

export function RoomImageUploader({ roomId, currentImages }: RoomImageUploaderProps) {
  const [images, setImages] = useState<string[]>(currentImages)
  const [isPending, startTransition] = useTransition()
  const [isUploading, setIsUploading] = useState(false)

  function handleRemove(url: string) {
    startTransition(async () => {
      const result = await removeRoomImageAction(roomId, url)
      if (result.success) {
        setImages((prev) => prev.filter((img) => img !== url))
        toast.success('Photo removed')
      } else {
        toast.error('Failed to remove photo')
      }
    })
  }

  return (
    <div className="space-y-3">
      {/* Upload button */}
      {images.length < 6 && (
        <UploadButton<OurFileRouter, 'roomImageUploader'>
          endpoint="roomImageUploader"
          onUploadBegin={() => setIsUploading(true)}
          onClientUploadComplete={async (res) => {
            setIsUploading(false)
            if (!res || res.length === 0) return
            for (const file of res) {
              const result = await addRoomImageAction(roomId, file.url)
              if (result.success) {
                setImages((prev) => [...prev, file.url])
              }
            }
            toast.success(`${res.length} photo${res.length !== 1 ? 's' : ''} uploaded!`)
          }}
          onUploadError={(error) => {
            setIsUploading(false)
            toast.error(`Upload failed: ${error.message}. Check UPLOADTHING_SECRET in .env`)
          }}
          appearance={{
            button:
              'ut-ready:bg-violet-600 ut-ready:hover:bg-violet-700 ut-uploading:bg-violet-400 rounded-lg px-3 py-1.5 text-xs font-medium text-white flex items-center gap-1.5',
            container: 'flex items-center',
            allowedContent: 'text-xs text-slate-400 mt-1',
          }}
          content={{
            button({ ready, isUploading: uploading }) {
              if (uploading) return <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Uploading...</>
              if (ready) return <><Upload className="h-3.5 w-3.5" /> Upload room photos</>
              return 'Loading...'
            },
            allowedContent: `Up to ${6 - images.length} more (max 4MB each)`,
          }}
        />
      )}

      {/* Image grid */}
      {images.length > 0 ? (
        <div className="grid grid-cols-3 gap-2">
          {images.map((url, index) => (
            <div key={url} className="group relative rounded-lg overflow-hidden aspect-video bg-slate-100">
              <img src={url} alt={`Room photo ${index + 1}`} className="w-full h-full object-cover" />
              {index === 0 && (
                <div className="absolute top-1 left-1 bg-amber-400 text-amber-900 text-[9px] font-bold rounded px-1 flex items-center gap-0.5">
                  <Star className="h-2 w-2" /> Main
                </div>
              )}
              <button
                onClick={() => handleRemove(url)}
                disabled={isPending || isUploading}
                className="absolute top-1 right-1 h-5 w-5 rounded bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-50 rounded-lg p-3 border border-dashed border-slate-200">
          <ImageIcon className="h-4 w-4" />
          No photos yet. The first photo becomes the main room image.
        </div>
      )}
    </div>
  )
}
