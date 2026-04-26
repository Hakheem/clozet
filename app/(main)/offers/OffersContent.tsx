"use client";

import { useMemo } from "react";
import ProductCard from "@/components/shop/ProductCard";
import type { ProductWithCategory } from "@/actions/products";
import { Tag } from "lucide-react";
import Link from "next/link";

export default function OffersContent({ products }: { products: ProductWithCategory[] }) {
    // Filter products with discount less than 10%
    const offers = useMemo(() => {
        return products.filter(product => {
            if (!product.discountPrice || product.discountPrice >= product.price) {
                return false;
            }
            const discountPercent = Math.round(((product.price - product.discountPrice) / product.price) * 100);
            return discountPercent > 0 && discountPercent < 10;
        });
    }, [products]);

    if (offers.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 bg-accent/8 border border-accent/15">
                    <Tag className="w-6 h-6 text-accent" />
                </div>
                <p className="text-base font-medium mb-1 text-foreground">
                    No offers available right now
                </p>
                <p className="text-sm text-muted-foreground">
                    Check back soon for special offers.
                </p>
                <Link href="/shop" className="mt-4 text-sm underline text-accent">
                    See what we currently have...
                </Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
            {offers.map(product => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
}
