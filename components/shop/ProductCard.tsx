
import Link from "next/link";
import { Heart } from "lucide-react";
import type { ProductWithCategory } from "@/actions/products";

export default function ProductCard({ product }: { product: ProductWithCategory }) {
  const isDiscounted = !!product.discountPrice;
  const currentPrice = isDiscounted ? product.discountPrice! : product.price;
  const originalPrice = isDiscounted ? product.price : null;

  const discountAmount = originalPrice
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : null;

  return (
    <Link href={`/shop/${product.category.slug}/${product.slug}`} className="group block">
      <div
        className="relative overflow-hidden rounded-xl h-full flex flex-col"
        style={{ background: "#FFFFFF", border: "1px solid #E4E0D9" }}
      >
        {/* Image container */}
        <div className="relative aspect-[4/5] overflow-hidden bg-[#EEE9E3]">
          {product.images.length > 0 ? (
            <>
              <img
                src={product.images[0]}
                alt={product.name}
                className={`w-full h-full object-cover transition-all duration-700 ${
                  product.images.length > 1 ? "group-hover:opacity-0 group-hover:scale-105" : "group-hover:scale-105"
                }`}
              />
              {product.images.length > 1 && (
                <img
                  src={product.images[1]}
                  alt={`${product.name} alternate`}
                  className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-all duration-700 scale-110 group-hover:scale-100"
                />
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-[0.6rem] font-bold uppercase tracking-widest text-[#8A857D]">No image</span>
            </div>
          )}

          {/* Status badge */}
          {product.status !== "NORMAL" && (
            <span
              className="absolute top-2.5 left-2.5 text-[0.55rem] font-bold px-2 py-0.5 rounded uppercase tracking-widest z-10"
              style={{ 
                background: product.status === "SALE" ? "#DC2626" : product.status === "HOT" ? "#EA580C" : "#1C1A17", 
                color: "#FFFFFF" 
              }}
            >
              {product.status}
            </span>
          )}

          {/* Discount amount badge */}
          {discountAmount && product.status !== "SALE" && (
            <span
              className="absolute top-2.5 right-2.5 text-[0.6rem] font-bold px-1.5 py-0.5 rounded border border-[#E4E0D9] z-10"
              style={{ background: "#FFFFFF", color: "#1C1A17" }}
            >
              -{discountAmount}%
            </span>
          )}

          {/* Wishlist — placeholder */}
          <button
            className="absolute bottom-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 z-10"
            style={{ background: "#FFFFFF", border: "1px solid #E4E0D9" }}
            aria-label="Save to wishlist"
          >
            <Heart className="w-3.5 h-3.5" style={{ color: "#1C1A17" }} />
          </button>
        </div>

        {/* Info */}
        <div className="p-3.5 flex-1 flex flex-col">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[0.6rem] uppercase tracking-[0.12em] font-medium" style={{ color: "#BFA47A" }}>
              {product.category.name}
            </span>
            {product.brand && (
              <span className="text-[0.55rem] uppercase font-bold text-[#8A857D]">{product.brand}</span>
            )}
          </div>
          
          <p className="text-sm font-semibold leading-tight mb-1 line-clamp-1" style={{ color: "#1C1A17" }}>
            {product.name}
          </p>

          {product.intro && (
            <p className="text-[0.7rem] leading-snug line-clamp-2 mb-3 h-8" style={{ color: "#8A857D" }}>
              {product.intro}
            </p>
          )}

          <div className="mt-auto flex items-center gap-2">
            <span className="text-sm font-bold" style={{ color: "#1C1A17" }}>
              KES {currentPrice.toLocaleString()}
            </span>
            {originalPrice && (
              <span className="text-[0.7rem] line-through decoration-[#DC2626]/40" style={{ color: "#8A857D" }}>
                KES {originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

