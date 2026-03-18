//components/shared/image-uploader.tsx
"use client";

import { useState } from "react";
import { UploadButton } from "@/lib/uploadthing";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

type Endpoint = keyof OurFileRouter;

type Props = {
  endpoint: Endpoint;
  value?: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
};

export function ImageUploader({ endpoint, value, onChange, onRemove }: Props) {
  const [uploading, setUploading] = useState(false);

  if (value) {
    return (
      <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-zinc-200 group">
        <img src={value} alt="Upload" className="w-full h-full object-cover" />
        <button
          type="button"
          onClick={onRemove}
          className="absolute top-2 right-2 w-7 h-7 bg-white border border-zinc-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-zinc-100"
        >
          <X size={12} className="text-zinc-700" />
        </button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "w-full aspect-video border-2 border-dashed border-zinc-200 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-zinc-400 transition-colors",
        uploading && "opacity-60 pointer-events-none"
      )}
    >
      <UploadButton
        endpoint={endpoint}
        onUploadBegin={() => setUploading(true)}
        onClientUploadComplete={(res) => {
          setUploading(false);
          const file = res?.[0];
          const url = (file as any)?.ufsUrl ?? (file as any)?.url;
          if (url) onChange(url as string);
        }}
        onUploadError={() => setUploading(false)}
        appearance={{
          button: "bg-zinc-900 hover:bg-zinc-800 text-white text-xs tracking-widest uppercase h-9 px-5 rounded-lg",
          allowedContent: "text-xs text-zinc-400 mt-1",
        }}
      />
      {uploading && (
        <p className="text-xs text-zinc-400 tracking-widest uppercase animate-pulse">Uploading...</p>
      )}
    </div>
  );
}