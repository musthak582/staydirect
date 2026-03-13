// lib/uploadthing.ts
import { createUploadthing, type FileRouter } from 'uploadthing/next'
import { requireAuth } from '@/lib/auth'

const f = createUploadthing()

export const ourFileRouter = {
  hotelImageUploader: f({ image: { maxFileSize: '4MB', maxFileCount: 8 } })
    .middleware(async () => {
      const user = await requireAuth()
      return { userId: user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.userId, url: file.url }
    }),

  roomImageUploader: f({ image: { maxFileSize: '4MB', maxFileCount: 6 } })
    .middleware(async () => {
      const user = await requireAuth()
      return { userId: user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.userId, url: file.url }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
