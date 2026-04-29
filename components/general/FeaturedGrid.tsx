"use client";

import { useEffect, useState } from "react";
import { getProducts, type ProductWithCategory } from "@/actions/products";
import ProductCard from "@/components/shop/ProductCard";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import Title from "./Title";
import Container from "../layout/Container";

export default function FeaturedGrid() {
    const [products, setProducts] = useState<ProductWithCategory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const result = await getProducts({
                    isFeatured: true,
                    pageSize: 4,
                    sortBy: "newest",
                });
                setProducts(result.products);
            } catch (error) {
                console.error("Failed to fetch featured products:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFeatured();
    }, []);

    if (loading) {
        return (
            <Container>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-16">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="aspect-[3/4] rounded-2xl bg-muted animate-pulse" />
                    ))}
                </div>
            </Container>
        );
    }

    if (products.length === 0) return null;

    return (
        <Container>
            <section className="my-16">
                <div className="flex flex-col md:flex-row items-center gap-4 justify-start md:justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-accent" />
                        </div>
                        <div>
                            <Title className="text-3xl md:text-4xl title tracking-tight">
                                <span className="text-[#BFA47A]">Featured </span>Selection
                            </Title>
                        </div>
                    </div>

                    <Button
                        variant="outline"
                        className="flex items-center gap-2 h-10 border-[#E4E0D9] text-primary hover:bg-[#F9F8F6] rounded-xl text-[10px] uppercase tracking-widest font-bold px-6 w-fit"
                    >
                        <Link href="/featured">View Collection</Link>
                        <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </section>
        </Container>
    );
}

