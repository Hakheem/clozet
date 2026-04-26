"use client";

import { useMemo } from "react";
import ProductCard from "@/components/shop/ProductCard";
import type { ProductWithCategory } from "@/actions/products";
import { Star } from "lucide-react";
import Link from "next/link";

export default function FeaturedContent({ products }: { products: ProductWithCategory[] }) {
    // Filter featured products
    const featured = useMemo(() => {
        return products.filter(product => product.isFeatured);
    }, [products]);

    if (featured.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 bg-accent/8 border border-accent/15">
                    <Star className="w-6 h-6 text-accent" />
                </div>
                <p className="text-base font-medium mb-1 text-foreground">
                    No featured products yet
                </p>
                <p className="text-sm text-muted-foreground">
                    Check back soon for our curated selection.
                </p>
                <Link href="/shop" className="mt-4 text-sm underline text-accent">
                    Browse all products
                </Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
            {featured.map(product => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
}
