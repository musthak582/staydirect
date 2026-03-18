"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Save, 
  Users, 
  DollarSign,
  Image as ImageIcon,
  X,
  Check,
  Loader2,
  Sparkles,
  BedDouble,
  Eye,
  Plus
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { UploadButton } from "@/lib/uploadthing";
import Image from "next/image";
import { roomSchema, type RoomFormValues } from "@/lib/validations";
import { createRoom, updateRoom } from "@/actions/room-actions";
import type { Room } from "@/app/generated/prisma/client";
import { cn } from "@/lib/utils";
import { useState } from "react";

type RoomFormProps = {
  initialData?: Room;
  onSuccess?: () => void;
};

const AMENITIES = [
  "WiFi",
  "TV",
  "Mini bar",
  "Safe",
  "Air conditioning",
  "Coffee maker",
  "Hair dryer",
  "Iron",
  "Work desk",
  "Ocean view",
  "Balcony",
  "Jacuzzi",
];

export function RoomForm({ initialData, onSuccess }: RoomFormProps) {
  const router = useRouter();
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm<RoomFormValues>({
    resolver: zodResolver(roomSchema) as any,
    defaultValues: initialData
      ? {
          name: initialData.name,
          description: initialData.description ?? "",
          price: initialData.price,
          capacity: initialData.capacity,
          imageUrl: initialData.imageUrl ?? "",
        }
      : {
          name: "",
          description: "",
          price: 0,
          capacity: 1,
          imageUrl: "",
        },
    mode: "onChange",
  });

  const imageUrl = watch("imageUrl");
  const name = watch("name");
  const description = watch("description");
  const price = watch("price");
  const capacity = watch("capacity");

  async function onSubmit(values: RoomFormValues) {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    // Add amenities to form data
    selectedAmenities.forEach(amenity => {
      formData.append("amenities", amenity);
    });

    const result = initialData
      ? await updateRoom(initialData.id, formData)
      : await createRoom(formData);

    if (result.success) {
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/dashboard/rooms");
        router.refresh();
      }
    } else {
      console.error(result.error);
    }
  }

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Image Upload Section */}
      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-zinc-100">
          <h2 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
            <ImageIcon size={16} className="text-zinc-400" />
            Room Photos
          </h2>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Main image */}
            <div className="col-span-2 lg:col-span-1">
              <div className="space-y-3">
                <label className="text-xs uppercase tracking-widest text-zinc-500">
                  Main Photo <span className="text-red-400">*</span>
                </label>
                <div className={cn(
                  "relative aspect-video border-2 border-dashed rounded-xl transition-all overflow-hidden",
                  imageUrl ? "border-zinc-200" : "border-zinc-200 hover:border-zinc-400"
                )}>
                  {imageUrl ? (
                    <>
                      <Image
                        src={imageUrl}
                        alt="Room"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      <button
                        type="button"
                        onClick={() => setValue("imageUrl", "", { shouldValidate: true })}
                        className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
                      >
                        <X size={14} className="text-zinc-600" />
                      </button>
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                      <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center">
                        <ImageIcon size={20} className="text-zinc-400" />
                      </div>
                      <p className="text-xs text-zinc-400">Click to upload</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Upload button */}
            <div className="col-span-2 lg:col-span-1">
              <div className="space-y-3">
                <label className="text-xs uppercase tracking-widest text-zinc-500">
                  &nbsp;
                </label>
                <UploadButton
                  endpoint="roomImages"
                  onClientUploadComplete={(res) => {
                    const file = res?.[0] as any;
                    const url = file?.ufsUrl ?? file?.url;
                    if (url) setValue("imageUrl", url, { shouldValidate: true });
                  }}
                  onUploadError={(error: Error) => console.error(error)}
                  appearance={{
                    button: "w-full bg-zinc-900 text-white text-xs tracking-widest uppercase h-12 px-4 rounded-xl hover:bg-zinc-800 transition-colors",
                    allowedContent: "hidden",
                  }}
                />
                <p className="text-xs text-zinc-400">
                  Recommended: 1200x800px, max 5MB
                </p>
              </div>
            </div>
          </div>

          {errors.imageUrl && (
            <p className="text-xs text-red-500 mt-2">{errors.imageUrl.message}</p>
          )}
        </div>
      </div>

      {/* Basic Information */}
      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-zinc-100">
          <h2 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
            <BedDouble size={16} className="text-zinc-400" />
            Basic Information
          </h2>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-zinc-500">
                Room Name <span className="text-red-400">*</span>
              </label>
              <Input
                placeholder="e.g., Deluxe Ocean View Suite"
                {...register("name")}
                className="border-zinc-200 focus:border-zinc-400 h-11"
              />
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-zinc-500">
                Guest Capacity <span className="text-red-400">*</span>
              </label>
              <Input
                type="number"
                min="1"
                max="20"
                placeholder="2"
                {...register("capacity", { valueAsNumber: true })}
                className="border-zinc-200 focus:border-zinc-400 h-11"
              />
              {errors.capacity && (
                <p className="text-xs text-red-500">{errors.capacity.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-zinc-500">
              Price per night <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">$</span>
              <Input
                type="number"
                min="0"
                step="0.01"
                placeholder="199.00"
                {...register("price", { valueAsNumber: true })}
                className="pl-8 border-zinc-200 focus:border-zinc-400 h-11"
              />
            </div>
            {errors.price && (
              <p className="text-xs text-red-500">{errors.price.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-zinc-500">
              Description
            </label>
            <Textarea
              placeholder="Describe the room's features, view, amenities, and what makes it special..."
              {...register("description")}
              className="min-h-[120px] border-zinc-200 focus:border-zinc-400 resize-none"
            />
            {errors.description && (
              <p className="text-xs text-red-500">{errors.description.message}</p>
            )}
            <p className="text-xs text-zinc-400 text-right">
              {description?.length || 0}/500
            </p>
          </div>
        </div>
      </div>

      {/* Amenities */}
      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-zinc-100">
          <h2 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
            <Sparkles size={16} className="text-zinc-400" />
            Amenities
          </h2>
        </div>
        
        <div className="p-6">
          <p className="text-xs text-zinc-500 mb-4">
            Select all amenities available in this room
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {AMENITIES.map((amenity) => {
              const isSelected = selectedAmenities.includes(amenity);
              return (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => toggleAmenity(amenity)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2.5 rounded-lg border text-xs transition-all",
                    isSelected 
                      ? "bg-zinc-900 border-zinc-900 text-white" 
                      : "border-zinc-200 text-zinc-600 hover:border-zinc-400 hover:bg-zinc-50"
                  )}
                >
                  {isSelected ? (
                    <Check size={12} className="flex-shrink-0" />
                  ) : (
                    <Plus size={12} className="flex-shrink-0 text-zinc-400" />
                  )}
                  <span className="truncate">{amenity}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Preview */}
      {name && (
        <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-zinc-100">
            <h2 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
              <Eye size={16} className="text-zinc-400" />
              Live Preview
            </h2>
          </div>
          
          <div className="p-6">
            <div className="bg-zinc-50 rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-zinc-900">{name}</h3>
                  <p className="text-sm text-zinc-500 mt-1 line-clamp-2">
                    {description || "Room description will appear here"}
                  </p>
                </div>
                <Badge className="bg-zinc-900 text-white border-0">
                  ${price || "0"}/night
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-zinc-500">
                <span className="flex items-center gap-1">
                  <Users size={14} /> {capacity || "1"} guests
                </span>
                {selectedAmenities.length > 0 && (
                  <span className="flex items-center gap-1">
                    <Sparkles size={14} /> {selectedAmenities.length} amenities
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-3 pt-4">
        <Link href="/dashboard/rooms">
          <Button
            type="button"
            variant="outline"
            className="border-zinc-200 text-zinc-600 hover:border-zinc-400 text-xs tracking-widest uppercase h-12 px-8"
          >
            Cancel
          </Button>
        </Link>
        <Button
          type="submit"
          disabled={isSubmitting || !isValid}
          className="bg-zinc-900 hover:bg-zinc-800 text-white text-xs tracking-widest uppercase h-12 px-8 min-w-[140px] gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Save size={14} />
              Create Room
            </>
          )}
        </Button>
      </div>
    </form>
  );
}