"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createOrUpdateHotel } from "@/actions/hotel-actions";
import { UploadButton } from "@/lib/uploadthing";
import Image from "next/image";
import { 
  Check, 
  X, 
  Upload, 
  Plus,
  Image as ImageIcon,
  Building2,
  MapPin,
  Mail,
  Phone,
  Globe,
  Sparkles,
  Loader2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface HotelProfileFormProps {
  initialData?: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    location: string | null;
    contactEmail: string | null;
    contactPhone: string | null;
    logo: string | null;
    coverImage: string | null;
    amenities: string[] | null;
  } | null;
}

const COMMON_AMENITIES = [
  "Free WiFi",
  "Parking",
  "Breakfast included",
  "Air conditioning",
  "Swimming pool",
  "Fitness center",
  "Restaurant",
  "Room service",
  "Pet friendly",
  "Non-smoking",
  "Family rooms",
  "Airport shuttle",
  "Spa",
  "Bar/Lounge",
  "Business center",
  "EV charging",
];

export function HotelProfileForm({ initialData }: HotelProfileFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [logo, setLogo] = useState<string | null>(initialData?.logo || null);
  const [coverImage, setCoverImage] = useState<string | null>(initialData?.coverImage || null);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    initialData?.amenities || []
  );
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);
  const [isSlugAvailable, setIsSlugAvailable] = useState<boolean | null>(null);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    // Persist media + amenities
    if (logo) {
      formData.set("logo", logo);
    }
    if (coverImage) {
      formData.set("coverImage", coverImage);
    }
    // Add amenities to formData
    selectedAmenities.forEach(amenity => {
      formData.append("amenities", amenity);
    });

    const result = await createOrUpdateHotel(formData);
    
    if (result.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      setSuccess(true);
      setIsLoading(false);
      router.refresh();
      
      // Reset success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    }
  }

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  // Simple slug validation
  const validateSlug = (value: string) => {
    const isValid = /^[a-z0-9-]+$/.test(value) && value.length >= 3;
    setIsSlugAvailable(isValid ? null : false);
    setSlug(value);
  };

  return (
    <form action={handleSubmit} className="divide-y divide-zinc-200">
      {/* Header with completion status */}
      <div className="p-6 bg-gradient-to-r from-zinc-50 to-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
            <Sparkles size={18} className="text-emerald-600" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-zinc-900">Hotel information</h2>
            <p className="text-xs text-zinc-500">Complete these details to activate your booking page</p>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mt-4 h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-zinc-900 rounded-full transition-all duration-500"
            style={{ 
              width: `${[
                initialData?.name ? 20 : 0,
                initialData?.slug ? 20 : 0,
                logo ? 20 : 0,
                coverImage ? 20 : 0,
                selectedAmenities.length > 0 ? 20 : 0
              ].reduce((a, b) => a + b, 0)}%` 
            }}
          />
        </div>
      </div>

      {/* Image Upload Section - Redesigned */}
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Logo Upload */}
          <div>
            <Label className="text-xs uppercase tracking-widest text-zinc-500 mb-3 block">
              Hotel Logo
            </Label>
            <div className="space-y-3">
              <div className={cn(
                "relative group cursor-pointer border-2 border-dashed rounded-xl transition-all",
                logo ? "border-zinc-200" : "border-zinc-200 hover:border-zinc-400"
              )}>
                {logo ? (
                  <div className="relative aspect-square rounded-xl overflow-hidden">
                    <Image 
                      src={logo} 
                      alt="Hotel logo" 
                      fill 
                      className="object-cover"
                      unoptimized
                    />
                    <button
                      type="button"
                      onClick={() => setLogo(null)}
                      className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} className="text-zinc-600" />
                    </button>
                  </div>
                ) : (
                  <div className="aspect-square flex flex-col items-center justify-center gap-2 p-6">
                    <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center">
                      <Building2 size={20} className="text-zinc-400" />
                    </div>
                    <p className="text-xs text-zinc-400 text-center">Click to upload logo</p>
                  </div>
                )}
              </div>
              <UploadButton
                endpoint="hotelLogo"
                onClientUploadComplete={(res) => {
                  const file = res?.[0] as any;
                  const url = file?.ufsUrl ?? file?.url;
                  if (url) setLogo(url);
                }}
                onUploadError={(error: Error) => {
                  setError(error.message);
                }}
                appearance={{
                  button: "w-full bg-zinc-900 text-white text-xs tracking-widest uppercase h-10 px-4 rounded-lg hover:bg-zinc-800 transition-colors",
                  allowedContent: "hidden",
                }}
              />
            </div>
          </div>

          {/* Cover Upload */}
          <div>
            <Label className="text-xs uppercase tracking-widest text-zinc-500 mb-3 block">
              Cover Image
            </Label>
            <div className="space-y-3">
              <div className={cn(
                "relative group cursor-pointer border-2 border-dashed rounded-xl transition-all",
                coverImage ? "border-zinc-200" : "border-zinc-200 hover:border-zinc-400"
              )}>
                {coverImage ? (
                  <div className="relative aspect-video rounded-xl overflow-hidden">
                    <Image 
                      src={coverImage} 
                      alt="Cover" 
                      fill 
                      className="object-cover"
                      unoptimized
                    />
                    <button
                      type="button"
                      onClick={() => setCoverImage(null)}
                      className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} className="text-zinc-600" />
                    </button>
                  </div>
                ) : (
                  <div className="aspect-video flex flex-col items-center justify-center gap-2">
                    <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center">
                      <ImageIcon size={20} className="text-zinc-400" />
                    </div>
                    <p className="text-xs text-zinc-400">Click to upload cover</p>
                  </div>
                )}
              </div>
              <UploadButton
                endpoint="hotelCover"
                onClientUploadComplete={(res) => {
                  const file = res?.[0] as any;
                  const url = file?.ufsUrl ?? file?.url;
                  if (url) setCoverImage(url);
                }}
                onUploadError={(error: Error) => {
                  setError(error.message);
                }}
                appearance={{
                  button: "w-full bg-zinc-900 text-white text-xs tracking-widest uppercase h-10 px-4 rounded-lg hover:bg-zinc-800 transition-colors",
                  allowedContent: "hidden",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Basic Info with Icons */}
      <div className="p-8 space-y-6">
        <h3 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
          <Building2 size={16} className="text-zinc-400" />
          Basic Information
        </h3>
        
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-xs uppercase tracking-widest text-zinc-500">
              Hotel name <span className="text-red-400">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              defaultValue={initialData?.name || ""}
              required
              className="border-zinc-200 focus:border-zinc-400 rounded-lg h-11"
              placeholder="e.g., Grand Hotel"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug" className="text-xs uppercase tracking-widest text-zinc-500">
              URL slug <span className="text-red-400">*</span>
            </Label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <Globe size={14} className="text-zinc-400" />
                <span className="text-xs text-zinc-400">/</span>
              </div>
              <Input
                id="slug"
                name="slug"
                value={slug}
                onChange={(e) => validateSlug(e.target.value)}
                required
                className="border-zinc-200 focus:border-zinc-400 rounded-lg h-11 pl-16"
                placeholder="grand-hotel"
              />
              {slug && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {isSlugAvailable === false && (
                    <X size={14} className="text-red-400" />
                  )}
                  {isSlugAvailable === true && (
                    <Check size={14} className="text-emerald-500" />
                  )}
                </div>
              )}
            </div>
            <p className="text-xs text-zinc-400">
              staydirect.com/<span className="text-zinc-600 font-mono">{slug || "your-hotel"}</span>
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location" className="text-xs uppercase tracking-widest text-zinc-500 flex items-center gap-1">
            <MapPin size={12} /> Location
          </Label>
          <Input
            id="location"
            name="location"
            defaultValue={initialData?.location || ""}
            className="border-zinc-200 focus:border-zinc-400 rounded-lg h-11"
            placeholder="New York, NY"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-xs uppercase tracking-widest text-zinc-500">
            Description
          </Label>
          <Textarea
            id="description"
            name="description"
            defaultValue={initialData?.description || ""}
            className="border-zinc-200 focus:border-zinc-400 rounded-lg min-h-[120px] resize-none"
            placeholder="Describe your hotel, its history, location, and what makes it special..."
          />
          <p className="text-xs text-zinc-400 text-right">
            {initialData?.description?.length || 0}/500
          </p>
        </div>
      </div>

      {/* Contact Info with Icons */}
      <div className="p-8 space-y-6">
        <h3 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
          <Mail size={16} className="text-zinc-400" />
          Contact Information
        </h3>
        
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="contactEmail" className="text-xs uppercase tracking-widest text-zinc-500 flex items-center gap-1">
              <Mail size={12} /> Email
            </Label>
            <Input
              id="contactEmail"
              name="contactEmail"
              type="email"
              defaultValue={initialData?.contactEmail || ""}
              className="border-zinc-200 focus:border-zinc-400 rounded-lg h-11"
              placeholder="hello@grandhotel.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactPhone" className="text-xs uppercase tracking-widest text-zinc-500 flex items-center gap-1">
              <Phone size={12} /> Phone
            </Label>
            <Input
              id="contactPhone"
              name="contactPhone"
              defaultValue={initialData?.contactPhone || ""}
              className="border-zinc-200 focus:border-zinc-400 rounded-lg h-11"
              placeholder="+1 (555) 123-4567"
            />
          </div>
        </div>
      </div>

      {/* Amenities - Redesigned */}
      <div className="p-8 space-y-6">
        <h3 className="text-sm font-semibold text-zinc-900 mb-4">Amenities</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {COMMON_AMENITIES.map((amenity) => {
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
                  <Check size={14} className="flex-shrink-0" />
                ) : (
                  <Plus size={14} className="flex-shrink-0 text-zinc-400" />
                )}
                <span className="truncate">{amenity}</span>
              </button>
            );
          })}
        </div>
        
        <p className="text-xs text-zinc-400">
          {selectedAmenities.length} amenities selected
        </p>
      </div>

      {/* Form Actions - Enhanced */}
      <div className="p-6 bg-zinc-50 flex items-center justify-between rounded-b-xl">
        <div>
          {error && (
            <div className="flex items-center gap-2 text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">
              <X size={14} />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 text-xs text-emerald-500 bg-emerald-50 px-3 py-2 rounded-lg">
              <Check size={14} />
              <span>Changes saved successfully</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="border-zinc-200 text-zinc-600 hover:border-zinc-400 hover:text-zinc-900 text-xs tracking-widest uppercase h-11 px-6"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-zinc-900 hover:bg-zinc-800 text-white text-xs tracking-widest uppercase h-11 px-8 min-w-[120px] gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check size={14} />
                Save changes
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}