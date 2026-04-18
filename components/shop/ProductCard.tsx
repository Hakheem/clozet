// ─────────────────────────────────────────────────────────────────────────────
// FILE: components/shop/ProductCard.tsx
//
// Reusable product card used on the shop page, category page and homepage.
// ─────────────────────────────────────────────────────────────────────────────

import Link from "next/link";
import { Heart } from "lucide-react";
import type { ProductWithCategory } from "@/actions/products";

export default function ProductCard({ product }: { product: ProductWithCategory }) {
  const discount =
    product.comparePrice && product.comparePrice > product.price
      ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
      : null;

  return (
    <Link href={`/shop/${product.category.slug}/${product.slug}`} className="group block">
      <div
        className="relative overflow-hidden rounded-xl"
        style={{ background: "#F7F5F2", border: "1px solid #E4E0D9" }}
      >
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden">
          {product.images[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center"
              style={{ background: "#EEE9E3" }}>
              <span className="text-xs" style={{ color: "#8A857D" }}>No image</span>
            </div>
          )}

          {/* Discount badge */}
          {discount && (
            <span
              className="absolute top-2.5 left-2.5 text-[0.6rem] font-bold px-1.5 py-0.5 rounded"
              style={{ background: "#1C1A17", color: "#F7F5F2", letterSpacing: "0.05em" }}
            >
              -{discount}%
            </span>
          )}

          {/* Featured badge */}
          {product.isFeatured && (
            <span
              className="absolute top-2.5 right-2.5 text-[0.58rem] font-semibold px-1.5 py-0.5 rounded uppercase tracking-wider"
              style={{ background: "#BFA47A", color: "#1C1A17" }}
            >
              Featured
            </span>
          )}

          {/* Wishlist — placeholder, wire up later */}
          <button
            className="absolute bottom-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200"
            style={{ background: "rgba(255,255,255,0.9)" }}
            aria-label="Save to wishlist"
          >
            <Heart className="w-3.5 h-3.5" style={{ color: "#1C1A17" }} />
          </button>
        </div>

        {/* Info */}
        <div className="p-3">
          <p className="text-[0.6rem] uppercase tracking-[0.15em] mb-0.5"
            style={{ color: "#BFA47A" }}>
            {product.category.name}
          </p>
          <p className="text-sm font-medium leading-tight mb-2 line-clamp-1"
            style={{ color: "#1C1A17" }}>
            {product.name}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold" style={{ color: "#1C1A17" }}>
              KES {product.price.toLocaleString()}
            </span>
            {product.comparePrice && (
              <span className="text-xs line-through" style={{ color: "#8A857D" }}>
                KES {product.comparePrice.toLocaleString()}
              </span>
            )}
          </div>
          {product.stock === 0 && (
            <p className="text-xs mt-1" style={{ color: "#DC2626" }}>Out of stock</p>
          )}
        </div>
      </div>
    </Link>
  );
}

