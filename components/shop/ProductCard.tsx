"use client";

import Link from "next/link";
import { Heart, ChartNoAxesColumn, Share2, ShoppingCart, Plus, Minus } from "lucide-react";
import type { ProductWithCategory } from "@/actions/products";
import { useCartStore, useFavoritesStore, useCompareStore } from "@/lib/stores";
import { Button } from "../ui/button";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function ProductCard({ product }: { product: ProductWithCategory }) {
  const { addItem, items, updateQuantity, removeItem } = useCartStore();
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const { addToCompare, isInCompare, removeFromCompare } = useCompareStore();

  const isDiscounted = !!product.discountPrice;
  const currentPrice = isDiscounted ? product.discountPrice! : product.price;
  const originalPrice = isDiscounted ? product.price : null;

  const discountAmount = originalPrice
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : null;

  // Identify the item in the cart
  const cartItemId = `${product.id}-cart`;
  const cartItem = items?.find((item) => item.id === cartItemId);
  const quantityInCart = cartItem?.quantity || 0;

  const handleAddToCart = () => {
    if (product.totalStock === 0) {
      toast.error("This product is out of stock");
      return;
    }

    addItem({
      id: cartItemId,
      productId: product.id,
      name: product.name,
      price: product.price,
      discountPrice: product.discountPrice || undefined,
      image: product.images[0] || "",
      category: product.category.name,
      stock: product.totalStock,
    });

    toast.success(`${product.name} added to cart`);
  };

  const handleIncrement = () => {
    if (quantityInCart < product.totalStock) {
      updateQuantity(cartItemId, quantityInCart + 1);
    } else {
      toast.error(`Only ${product.totalStock} units available`);
    }
  };

  const handleDecrement = () => {
    if (quantityInCart > 1) {
      updateQuantity(cartItemId, quantityInCart - 1);
    } else {
      removeItem(cartItemId);
      toast.info(`${product.name} removed from cart`);
    }
  };

  const handleShare = () => {
    const url = window.location.origin + `/shop/${product.category.slug}/${product.slug}`;
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.intro || product.name,
        url: url,
      });
    } else {
      navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard");
    }
  };

  const handleCompare = () => {
    if (isInCompare(product.id)) {
      removeFromCompare(product.id);
      toast.info("Removed from comparison");
    } else {
      addToCompare(product.id);
      toast.success("Added to comparison");
    }
  };

  return (
    <TooltipProvider delay={200}>
      <div className="group block min-w-0">
        <div
          className="relative overflow-hidden rounded-xl h-full flex flex-col bg-white border border-border transition-all duration-300 hover:shadow-xl hover:shadow-black/5"
        >
          {/* Image Section */}
          <div className="relative h-[230px] lg:h-[260px] w-full md:w-[280px] lg:w-[300px] overflow-hidden bg-[#EEE9E3]">
            <Link href={`/shop/${product.category.slug}/${product.slug}`}>
              {product.images.length > 0 ? (
                <>
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className={`w-full h-full object-cover object-center transition-all duration-700 ${product.images.length > 1 ? "group-hover:opacity-0 group-hover:scale-105" : "group-hover:scale-105"
                      }`}
                  />
                  {product.images.length > 1 && (
                    <img
                      src={product.images[1]}
                      alt={`${product.name} alternate`}
                      className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-all duration-700 scale-105 group-hover:scale-100"
                    />
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-[0.6rem] font-bold uppercase tracking-widest text-muted-foreground">Image Loading...</span>
                </div>
              )}
            </Link>

            {/* Badges */}
            {product.status !== "NORMAL" && (
              <span
                className="absolute top-2.5 left-2.5 text-[0.55rem] font-bold px-2 py-0.5 rounded uppercase tracking-widest z-10 text-white"
                style={{
                  background: product.status === "SALE" ? "#db3939" : product.status === "HOT" ? "#EA580C" : "#1C1A17",
                }}
              >
                {product.status}
              </span>
            )}

            {discountAmount && product.status !== "SALE" && (
              <span className="absolute top-2.5 right-2.5 text-[0.6rem] font-semibold tracking-tight px-2 py-1 rounded border border-border z-10 bg-white text-foreground">
                -{discountAmount}% OFF
              </span>
            )}

            {/* Hover Icons */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-center items-center gap-4 py-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10 bg-white backdrop-blur-md">
              <Tooltip>
                <TooltipTrigger>
                  <button onClick={() => toggleFavorite(product.id)} className="cursor-pointer p-2.5 rounded-full bg-white border border-border hover:border-accent hover:bg-accent/5 transition-all shadow-sm">
                    <Heart className={`w-4 h-4 ${isFavorite(product.id) ? "fill-accent text-accent" : "text-foreground"
                      }`} />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-[10px] font-bold uppercase tracking-widest">Add to Wishlist</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger>
                  <button onClick={handleCompare} className="cursor-pointer p-2.5 rounded-full bg-white border border-border hover:border-accent hover:bg-accent/5 transition-all shadow-sm">
                    <ChartNoAxesColumn className={`w-4 h-4 ${isInCompare(product.id) ? "text-accent" : "text-foreground"}`} />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-[10px] font-bold uppercase tracking-widest">Compare Product</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger>
                  <button onClick={handleShare} className="cursor-pointer p-2.5 rounded-full bg-white border border-border hover:border-accent hover:bg-accent/5 transition-all shadow-sm">
                    <Share2 className="w-4 h-4 text-foreground" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-[10px] font-bold uppercase tracking-widest">Share Product</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Product Info Section */}
          <div className="p-3.5 flex-1 flex flex-col">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-[0.6rem] uppercase tracking-[0.12em] text-accent font-bold truncate">
                {product.category.name}
              </span>
              {product.brand && (
                <span className="text-[0.55rem] uppercase font-bold text-muted-foreground truncate">{product.brand}</span>
              )}
            </div>

            <Link href={`/shop/${product.category.slug}/${product.slug}`}>
              <p className="text-sm font-semibold leading-tight mb-1 line-clamp-1 text-foreground hover:text-accent transition-colors">
                {product.name}
              </p>
            </Link>

            {product.intro && (
              <p className="text-[0.7rem] leading-snug line-clamp-2 mb-3 h-8 text-muted-foreground font-medium">
                {product.intro}
              </p>
            )}

            {/* Price & Action Button Area */}
            <div className="mt-auto flex flex-col md:flex-row md:items-center justify-between gap-2 pt-2">
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <span className="text-[0.75rem] md:text-base font-bold text-primary">
                  KES {currentPrice.toLocaleString()}
                </span>
                {originalPrice && (
                  <span className="text-[0.65rem] md:text-[0.6rem] line-through text-muted-foreground decoration-[#121212]/70 font-medium">
                    KES {originalPrice.toLocaleString()}
                  </span>
                )}
              </div>

              {quantityInCart > 0 ? (
                <div className="flex items-center justify-between w-full md:w-24 ">
                  <button
                    onClick={handleDecrement}
                    className="flex items-center justify-center w-7 h-7 rounded-md bg-white border border-border text-foreground hover:border-accent transition-colors cursor-pointer"
                  >
                    <Minus className="w-2.5 h-2.5" />
                  </button>
                  <span className="text-xs font-bold text-primary">{quantityInCart}</span>
                  <button
                    onClick={handleIncrement}
                    disabled={quantityInCart >= product.totalStock}
                    className="flex items-center justify-center w-7 h-7 rounded-md bg-white border border-border text-foreground hover:border-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    <Plus className="w-2.5 h-2.5" />
                  </button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  onClick={handleAddToCart}
                  disabled={product.totalStock === 0}
                  className="w-full md:w-auto h-9 flex items-center justify-center gap-1.5 px-4 text-[10px] uppercase tracking-widest font-bold rounded-lg border-[#E4E0D9] hover:bg-primary hover:text-white transition-all shadow-sm"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  {product.totalStock === 0 ? "Out of Stock" : "Add to cart"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
