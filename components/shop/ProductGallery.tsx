"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProductGallery({ images, name }: { images: string[], name: string }) {
  const [selectedImage, setSelectedImage] = useState(0);
 
  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnails */}
      <div className="flex md:flex-col gap-3">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedImage(idx)}
            className={`relative w-20 h-24 rounded-lg overflow-hidden border-2 transition-all ${
              selectedImage === idx ? "border-[#BFA47A]" : "border-transparent opacity-70 hover:opacity-100"
            }`}
          >
            <Image src={img} alt={`${name} ${idx}`} fill className="object-cover" />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className="relative flex-1 self-start aspect-[3/4] bg-[#EEE9E3] rounded-2xl overflow-hidden group">
        <Image
          src={images[selectedImage]}
          alt={name}
          fill
          priority
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
    </div>
  );
}

