"use client";

import { useMemo } from "react";
import ProductCard from "@/components/shop/ProductCard";
import type { ProductWithCategory } from "@/actions/products";
import { Zap } from "lucide-react";
import Link from "next/link";

export default function DealsContent({ products }: { products: ProductWithCategory[] }) {
    // Filter products with 10% or more discount
    const deals = useMemo(() => {
        return products.filter(product => {
            if (!product.discountPrice || product.discountPrice >= product.price) {
                return false;
            }
            const discountPercent = Math.round(((product.price - product.discountPrice) / product.price) * 100);
            return discountPercent >= 10;
        });
    }, [products]);

    if (deals.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 bg-accent/8 border border-accent/15">
                    <Zap className="w-6 h-6 text-accent" />
                </div>
                <p className="text-base font-medium mb-1 text-foreground">
                    No deals available right now
                </p>
                <p className="text-sm text-muted-foreground">
                    Check back soon for amazing discounts.
                </p>
                <Link href="/shop" className="mt-4 text-sm underline text-accent">
                    Browse all products
                </Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
            {deals.map(product => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
}
