"use client";

import { useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getCloudinarySignature } from "@/actions/products";

interface ProductImageUploadProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export default function ProductImageUpload({
  value,
  onChange,
}: ProductImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newImages = [...value];

    try {
      // 1. Get signed signature from server
      const { timestamp, signature, cloudName, apiKey, folder } = await getCloudinarySignature();

      for (const file of Array.from(files)) {
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} is too large. Max 5MB.`);
          continue;
        }

        // 2. Upload directly to Cloudinary
        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", apiKey!);
        formData.append("timestamp", timestamp.toString());
        formData.append("signature", signature);
        formData.append("folder", folder);

        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (data.secure_url) {
          newImages.push(data.secure_url);
        } else {
          toast.error(`Failed to upload ${file.name}`);
        }
      }

      onChange(newImages);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("An error occurred during upload.");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {value.map((url, i) => (
        <div 
          key={i} 
          className="relative aspect-square rounded-xl overflow-hidden border border-[#E4E0D9] bg-white group"
        >
          <img src={url} alt="Preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => removeImage(i)}
            className="absolute top-2 right-2 p-1 rounded-full bg-white/90 shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-white"
          >
            <X className="w-3.5 h-3.5 text-[#DC2626]" />
          </button>
          {i === 0 && (
            <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded text-[0.6rem] font-bold uppercase tracking-wider bg-[#1C1A17] text-[#F7F5F2]">
              Main
            </div>
          )}
        </div>
      ))}
      
      {uploading && (
        <div className="flex flex-col items-center justify-center aspect-square rounded-xl border-2 border-dashed border-[#E4E0D9] bg-[#F7F5F2]/50 animate-pulse">
           <Loader2 className="w-5 h-5 text-[#BFA47A] animate-spin" />
           <p className="text-[0.6rem] mt-2 font-bold uppercase tracking-wider text-[#8A857D]">Uploading...</p>
        </div>
      )}

      {!uploading && value.length < 8 && (
        <label className="flex flex-col items-center justify-center aspect-square rounded-xl border-2 border-dashed border-[#E4E0D9] bg-[#F7F5F2] cursor-pointer hover:bg-[#F0EDE8] transition-colors group">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-[#E4E0D9] mb-2 group-hover:scale-110 transition-transform">
            <Upload className="w-4 h-4 text-[#8A857D]" />
          </div>
          <p className="text-[0.65rem] font-bold uppercase tracking-wider text-[#8A857D]">Upload</p>
          <input 
            type="file" 
            multiple 
            accept="image/*" 
            className="hidden" 
            onChange={handleFileChange} 
          />
        </label>
      )}
    </div>
  );
}
