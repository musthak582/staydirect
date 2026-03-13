// components/dashboard/edit-room-dialog.tsx
'use client'

import { useTransition } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { updateRoomAction } from '@/actions/room-actions'
import { RoomImageUploader } from './room-image-uploader'
import { toast } from 'sonner'

interface Room {
  id: string
  name: string
  description?: string | null
  price: number
  capacity: number
  beds: number
  bathrooms: number
  size?: number | null
  amenities: string[]
  isAvailable: boolean
  images: string[]
}

interface EditRoomDialogProps {
  room: Room
  open: boolean
  onClose: () => void
}

export function EditRoomDialog({ room, open, onClose }: EditRoomDialogProps) {
  const [isPending, startTransition] = useTransition()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const result = await updateRoomAction(room.id, formData)
      if (result.success) {
        toast.success('Room updated successfully!')
        onClose()
      } else {
        toast.error(result.error || 'Failed to update room')
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit room — {room.name}</DialogTitle>
          <DialogDescription>Update room details, pricing, and photos.</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details">
          <TabsList className="w-full">
            <TabsTrigger value="details" className="flex-1">Details</TabsTrigger>
            <TabsTrigger value="photos" className="flex-1">Photos</TabsTrigger>
          </TabsList>

          {/* Details tab */}
          <TabsContent value="details">
            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label>Room Name *</Label>
                <Input name="name" defaultValue={room.name} required />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  name="description"
                  defaultValue={room.description || ''}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Price per night ($) *</Label>
                  <Input name="price" type="number" step="0.01" defaultValue={room.price} required />
                </div>
                <div className="space-y-2">
                  <Label>Max guests</Label>
                  <Input name="capacity" type="number" defaultValue={room.capacity} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <Label>Beds</Label>
                  <Input name="beds" type="number" defaultValue={room.beds} />
                </div>
                <div className="space-y-2">
                  <Label>Bathrooms</Label>
                  <Input name="bathrooms" type="number" defaultValue={room.bathrooms} />
                </div>
                <div className="space-y-2">
                  <Label>Size (m²)</Label>
                  <Input name="size" type="number" defaultValue={room.size || ''} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Amenities (comma-separated)</Label>
                <Input
                  name="amenities"
                  defaultValue={room.amenities.join(', ')}
                  placeholder="WiFi, AC, TV"
                />
              </div>

              <div className="space-y-2">
                <Label>Availability</Label>
                <select
                  name="isAvailable"
                  defaultValue={room.isAvailable ? 'true' : 'false'}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  <option value="true">Available for booking</option>
                  <option value="false">Not available</option>
                </select>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                <Button type="submit" variant="brand" disabled={isPending}>
                  {isPending ? (
                    <><Loader2 className="h-4 w-4 animate-spin" />Saving...</>
                  ) : (
                    'Save changes'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>

          {/* Photos tab */}
          <TabsContent value="photos" className="pt-2">
            <div className="space-y-3">
              <p className="text-sm text-slate-500">
                Add photos to showcase this room on your booking website.
                The first photo will be used as the main room image.
              </p>
              <RoomImageUploader roomId={room.id} currentImages={room.images || []} />
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="outline" onClick={onClose}>Done</Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
