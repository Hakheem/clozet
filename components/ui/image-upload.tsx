"use client";

import { useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ImageUploadProps {
  value?: string | null;
  onChange: (url: string) => void;
  onClear: () => void;
  label?: string;
  className?: string;
  aspectRatio?: "square" | "video" | "auto";
  folder?: string;
}

export default function ImageUpload({
  value,
  onChange,
  onClear,
  label = "Upload Image",
  className = "",
  aspectRatio = "video",
  folder = "clozet",
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File is too large. Max 5MB.");
      return;
    }

    setIsUploading(true);
    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          image: await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(file);
          }), 
          folder 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const result = await response.json();
      onChange(result.url);
      toast.success("Image uploaded successfully");
    } catch (error: any) {
      console.error("Upload Error:", error?.message || "Unknown error");
      toast.error(error?.message || "Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const aspectClass = 
    aspectRatio === "square" ? "aspect-square" : 
    aspectRatio === "video" ? "aspect-video" : 
    "aspect-auto";

  return (
    <div className={`space-y-3 ${className}`}>
      {value ? (
        <div className={`relative w-full ${aspectClass} rounded-lg overflow-hidden border border-[#E4E0D9] bg-[#F7F5F2]`}>
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={onClear}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 shadow-sm hover:bg-white transition-colors"
          >
            <X className="w-4 h-4 text-[#DC2626]" />
          </button>
        </div>
      ) : (
        <label className={`relative flex flex-col items-center justify-center w-full ${aspectClass} rounded-lg border-2 border-dashed border-[#E4E0D9] bg-[#F7F5F2] cursor-pointer hover:bg-[#F0EDE8] transition-colors group ${isUploading ? "pointer-events-none opacity-60" : ""}`}>
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 text-[#BFA47A] animate-spin" />
              <span className="text-[10px] font-bold text-[#8A857D] uppercase tracking-widest text-center px-4">Processing Asset...</span>
            </div>
          ) : (
            <>
              <Upload className="w-6 h-6 mb-2 text-[#8A857D] group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold text-[#8A857D]">{label}</span>
              <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} disabled={isUploading} />
            </>
          )}
        </label>
      )}
    </div>
  );
}
