"use client";

import { useState } from "react";
import {
  Truck,
  ShieldCheck,
  Minus,
  Plus,
  ShoppingCart,
  Heart,
  ChartNoAxesColumn,
  MessageCircle,
  RotateCcw,
  Share2,
  PackageCheck,
} from "lucide-react";
import { useCartStore, useFavoritesStore } from "@/lib/stores";
import { Button } from "../ui/button";
import { toast } from "sonner";

export default function ProductInfo({ product }: { product: any }) {
  const { addItem, items, updateQuantity, removeItem } = useCartStore();
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const cartItemId = `${product.id}-cart`;
  const cartItem = items?.find((item) => item.id === cartItemId);
  const quantityInCart = cartItem?.quantity || 0;

  const isDiscounted = !!product.discountPrice;
  const currentPrice = isDiscounted ? product.discountPrice : product.price;

  // Stock status helpers
  const stockCount = product.totalStock ?? 0;
  const isOutOfStock = stockCount === 0;
  const isLowStock = stockCount > 0 && stockCount <= 5;

  const handleAddToCart = () => {
    if (isOutOfStock) {
      toast.error("This product is out of stock");
      return;
    }
    addItem({
      id: cartItemId,
      productId: product.id,
      name: product.name,
      price: product.price,
      discountPrice: product.discountPrice || undefined,
      image: product.images[0],
      category: product.category.name,
      stock: product.totalStock,
      size: selectedSize,
    });
    toast.success("Added to cart");
  };

  const handleShare = () => {
    const url = window.location.origin + `/shop/${product.category.slug}/${product.slug}`;
    if (navigator.share) {
      navigator.share({ title: product.name, text: product.intro || product.name, url });
    } else {
      navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard");
    }
  };

  // Build miscellaneous attributes from schema fields
  const metaFields: { label: string; value: string }[] = [];
  if (product.brand)       metaFields.push({ label: "Brand",    value: product.brand });
  if (product.material)    metaFields.push({ label: "Material", value: product.material });
  if (product.gender && product.gender !== "UNISEX")
                           metaFields.push({ label: "Gender",   value: product.gender.charAt(0) + product.gender.slice(1).toLowerCase() });
  if (product.variantType) metaFields.push({ label: "Type",     value: product.variantType.charAt(0) + product.variantType.slice(1).toLowerCase() });

  return (
    <div className="flex flex-col">
      {/* ── Header ── */}
      <div className="mb-5">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#BFA47A] mb-2 block">
          {product.category.name}{product.brand ? ` • ${product.brand}` : ""}
        </span>
        <h1 className="text-3xl font-bold text-foreground mb-4">{product.name}</h1>

        {/* Price row */}
        <div className="flex items-center gap-4">
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-bold text-primary">KES {currentPrice.toLocaleString()}</span>
            {isDiscounted && (
              <span className="text-lg text-muted-foreground line-through decoration-[#db3939]/50">
                KES {product.price.toLocaleString()}
              </span>
            )}
          </div>
          {isDiscounted && (
            <span className="bg-[#db3939] text-white text-[10px] font-bold px-2 py-1 rounded">
              SAVE {Math.round(((product.price - product.discountPrice!) / product.price) * 100)}%
            </span>
          )}
        </div>
      </div>

      {/* ── Stock badge ── */}
      <div className="mb-5">
        {isOutOfStock ? (
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full bg-red-50 text-red-500 border border-red-100">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" />
            Out of Stock
          </span>
        ) : isLowStock ? (
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full bg-amber-50 text-amber-600 border border-amber-100">
            <span className="w-1.5 h-1.5 rounded-md bg-amber-400 inline-block" />
            Only {stockCount} left in stock
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
            <span className="w-1.5 h-1.5 rounded-md bg-emerald-400 inline-block" />
             {stockCount} in stock
          </span>
        )}
      </div>

      {/* ── Description ── */}
      {product.description && (
        <p className="text-muted-foreground text-sm leading-relaxed mb-8 border-l-2 border-[#E4E0D9] pl-4">
          {product.description}
        </p>
      )}

      {/* ── Variant / Size Selection ── */}
      {product.variants?.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xs font-bold uppercase tracking-widest mb-4">
            Select Size
            <span className="ml-2 text-[#8A857D] normal-case font-normal tracking-normal">(optional)</span>
          </h3>
          <div className="flex flex-wrap gap-3">
            {product.variants.map((v: any) => (
              <button
                key={v.id}
                disabled={v.stock === 0}
                onClick={() => setSelectedSize(selectedSize === v.size ? null : v.size)}
                className={`min-w-[50px] h-10 flex items-center justify-center rounded-lg border text-xs font-bold transition-all ${
                  selectedSize === v.size
                    ? "border-primary bg-primary text-white"
                    : "border-[#E4E0D9] hover:border-primary"
                } ${v.stock === 0 ? "opacity-30 cursor-not-allowed bg-[#EEE9E3]" : "cursor-pointer"}`}
              >
                {v.size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Cart Actions ── */}
      <div className="flex items-center gap-3 mb-6">
        {quantityInCart > 0 ? (
          <div className="flex items-center justify-between w-40 md:w-32 h-12  rounded-md px-2">
            <button
              onClick={() => quantityInCart > 1 ? updateQuantity(cartItemId, quantityInCart - 1) : removeItem(cartItemId)}
              className="w-8 h-8 flex items-center justify-center rounded-md bg-white border border-[#E4E0D9] bg-[#F9F8F6]  cursor-pointer"
            >
              <Minus size={14} />
            </button>
            <span className="font-bold">{quantityInCart}</span>
            <button
              onClick={() => updateQuantity(cartItemId, quantityInCart + 1)}
              disabled={quantityInCart >= product.totalStock}
              className="w-8 h-8 flex items-center justify-center rounded-md bg-white border border-[#E4E0D9] bg-[#F9F8F6]  cursor-pointer disabled:opacity-30"
            >
              <Plus size={14} />
            </button>
          </div>
        ) : (
          <Button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="flex-1 h-12 rounded-lg bg-primary text-white font-bold uppercase tracking-widest text-[11px] flex gap-2"
          >
            <ShoppingCart size={16} />
            Add to Cart
          </Button>
        )}

        {/* Wishlist button */}
        <button
          onClick={() => toggleFavorite(product.id)}
          className={`w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-lg border-2 transition-all cursor-pointer ${
            isFavorite(product.id)
              ? "border-[#BFA47A] bg-[#BFA47A]/10"
              : "border-[#E4E0D9] hover:border-[#BFA47A] bg-white"
          }`}
        >
          <Heart
            size={18}
            className={isFavorite(product.id) ? "fill-[#BFA47A] text-[#BFA47A]" : "text-[#1C1A17]"}
          />
        </button>
      </div>

      {/* ── 4-grid action tiles ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-8">
        {/* Compare */}
        <button className="flex flex-col items-center gap-2 py-4 px-2 rounded-md border border-[#E4E0D9] bg-[#F9F8F6] hover:border-[#BFA47A] transition-all group cursor-pointer">
          <ChartNoAxesColumn className="w-4 h-4 text-primary group-hover:scale-105 transition-transform" />
          <span className="text-[9px] font-bold uppercase tracking-widest  group-hover:text-primary transition-colors">Compare</span>
        </button>

        {/* Ask a Question */}
        <button className="flex flex-col items-center gap-2 py-4 px-2 rounded-md border border-[#E4E0D9] bg-[#F9F8F6] hover:border-[#BFA47A] transition-all group cursor-pointer">
          <MessageCircle className="w-4 h-4 text-primary group-hover:scale-105 transition-transform" />
          <span className="text-[9px] font-bold uppercase tracking-widest  group-hover:text-primary transition-colors">Ask a Question</span>
        </button>

        {/* Delivery & Return */}
        <button className="flex flex-col items-center gap-2 py-4 px-2 rounded-md border border-[#E4E0D9] bg-[#F9F8F6] hover:border-[#BFA47A] transition-all group cursor-pointer">
          <RotateCcw className="w-4 h-4 text-primary group-hover:scale-105 transition-transform" />
          <span className="text-[9px] font-bold uppercase tracking-widest  group-hover:text-primary transition-colors">Delivery & Return</span>
        </button>

        {/* Share */}
        <button
          onClick={handleShare}
          className="flex flex-col items-center gap-2 py-4 px-2 rounded-md border border-[#E4E0D9] bg-[#F9F8F6] hover:border-[#BFA47A] transition-all group cursor-pointer"
        >
          <Share2 className="w-4 h-4 text-primary group-hover:scale-105 transition-transform" />
          <span className="text-[9px] font-bold uppercase tracking-widest  group-hover:text-primary transition-colors">Share</span>
        </button>
      </div>

      {/* ── Product Meta / Miscellaneous ── */}
      {metaFields.length > 0 && (
        <div className="mb-8 rounded-lg border border-[#E4E0D9] overflow-hidden">
          {metaFields.map((field, i) => (
            <div
              key={field.label}
              className={`flex items-center justify-between px-4 py-3 ${
                i % 2 === 0 ? "bg-[#F9F8F6]" : "bg-white"
              } ${i < metaFields.length - 1 ? "border-b border-[#E4E0D9]" : ""}`}
            >
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#8A857D]">{field.label}</span>
              <span className="text-[11px] font-semibold text-primary">{field.value}</span>
            </div>
          ))}
        </div>
      )}

      {/* ── Trust Badges ── */}
      <div className="flex flex-col sm:flex-row gap-4 border-t border-[#E4E0D9] pt-8">
        <div className="flex items-center gap-3 flex-1 bg-[#F9F8F6] border border-[#E4E0D9] rounded-xl px-5 py-4">
          <Truck className="text-[#BFA47A] flex-shrink-0" size={22} />
          <div>
            <p className="text-xs font-bold uppercase">Free Shipping</p>
            <p className="text-[10px] text-muted-foreground">On orders above KES 10,000</p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-1 bg-[#F9F8F6] border border-[#E4E0D9] rounded-xl px-5 py-4">
          <ShieldCheck className="text-[#BFA47A] flex-shrink-0" size={22} />
          <div>
            <p className="text-xs font-bold uppercase">Genuine Product</p>
            <p className="text-[10px] text-muted-foreground">100% Authentic Guarantee</p>
          </div>
        </div>
      </div>
    </div>
  );
}

