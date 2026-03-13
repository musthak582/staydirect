// components/dashboard/add-room-dialog.tsx
'use client'

import { useState, useTransition } from 'react'
import { Plus, Loader2, BedDouble } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { createRoomAction } from '@/actions/room-actions'
import { toast } from 'sonner'

export function AddRoomDialog() {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const result = await createRoomAction(formData)
      if (result.success) {
        toast.success('Room created successfully!')
        setOpen(false)
      } else {
        toast.error(result.error || 'Failed to create room')
      }
    })
  }

  return (
    <>
      <Button variant="brand" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" />
        Add room
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add new room</DialogTitle>
            <DialogDescription>
              Add a room to your hotel. Guests will see this on your booking website.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Room Name *</Label>
              <Input
                id="name"
                name="name"
                placeholder="Deluxe Ocean View"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Spacious room with panoramic ocean views, king-size bed..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="price">Price per night ($) *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="150"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity">Max guests *</Label>
                <Input
                  id="capacity"
                  name="capacity"
                  type="number"
                  min="1"
                  defaultValue="2"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label htmlFor="beds">Beds</Label>
                <Input
                  id="beds"
                  name="beds"
                  type="number"
                  min="1"
                  defaultValue="1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bathrooms">Bathrooms</Label>
                <Input
                  id="bathrooms"
                  name="bathrooms"
                  type="number"
                  min="1"
                  defaultValue="1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="size">Size (m²)</Label>
                <Input
                  id="size"
                  name="size"
                  type="number"
                  min="0"
                  placeholder="30"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amenities">Amenities (comma-separated)</Label>
              <Input
                id="amenities"
                name="amenities"
                placeholder="WiFi, AC, TV, Mini-bar, Sea view"
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="brand" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <BedDouble className="h-4 w-4" />
                    Add room
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
