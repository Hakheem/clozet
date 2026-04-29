"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { PackageOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "@/components/shop/ProductCard";
import { getProducts, getCategoriesWithCounts, type ProductWithCategory } from "@/actions/products";
import Container from "../layout/Container";

interface Category {
    id: string;
    name: string;
    slug: string;
    image: string | null;
    _count: { products: number };
}

export default function ProductTabs() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<ProductWithCategory[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [cats, prods] = await Promise.all([
                    getCategoriesWithCounts(),
                    getProducts({ pageSize: 100 }),
                ]);
                setCategories(cats);
                setProducts(prods.products);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const sortedProducts = useMemo(() => {
        const filtered = selectedCategory
            ? products.filter((p) => p.category.slug === selectedCategory)
            : products;

        return [...filtered].sort((a, b) => {
            const getPriority = (p: ProductWithCategory) => {
                if (p.isFeatured) return 0;
                if (p.status === "SALE") return 1;
                return 2;
            };
            return (
                getPriority(a) - getPriority(b) ||
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
        });
    }, [products, selectedCategory]);

    const displayedCategories = categories.slice(0, 5);

    if (loading) {
        return (
            <Container>
                <section className="w-full py-8">
                    <div className="relative w-full overflow-hidden mb-8">
                        <div
                            className="flex flex-wrap gap-2 pb-2 px-2 md:px-4 md:justify-center"
                            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                        >
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="flex-shrink-0 w-24 h-9 bg-primary/20 rounded-full animate-pulse" />
                            ))}
                        </div>
                    </div>
                    <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="h-[250px] w-full bg-primary/20 rounded-xl animate-pulse md:w-[250px] lg:w-[270px] " />
                        ))}
                    </div>
                </section>
            </Container>
        );
    }

    return (
        <Container>
            <section className="w-full py-8">
                <div className="relative w-full overflow-hidden mb-8">
                    <div
                        className="flex flex-wrap gap-2 overflow-x-auto md:gap-3 pb-2 px-2 md:px-4 items-center justify-start md:justify-center"
                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                    >
                        {/* All tab */}
                        <motion.button
                            whileTap={{ scale: 0.93 }}
                            onClick={() => setSelectedCategory(null)}
                            className={`flex-shrink-0 px-4 py-1.5 md:py-2 rounded-full text-[11px] md:text-xs font-semibold transition-colors border cursor-pointer ${
                                selectedCategory === null
                                    ? "bg-[#BFA47A] text-white border-[#BFA47A]"
                                    : "bg-white border-[#E4E0D9] text-primary hover:border-[#BFA47A]"
                            }`}
                        >
                            All
                        </motion.button>

                        {/* Category tabs */}
                        {displayedCategories.map((category) => (
                            <motion.button
                                key={category.id}
                                whileTap={{ scale: 0.93 }}
                                onClick={() => setSelectedCategory(category.slug)}
                                className={`flex-shrink-0 flex items-center gap-1.5 md:gap-2 pl-1 pr-3 md:pr-4 py-1 rounded-full border transition-colors cursor-pointer ${
                                    selectedCategory === category.slug
                                        ? "bg-[#BFA47A] text-white border-[#BFA47A]"
                                        : "bg-white border-[#E4E0D9] text-primary hover:border-[#BFA47A]"
                                }`}
                            >
                                <div
                                    className={`flex-shrink-0 w-6 h-6 md:w-7 md:h-7 rounded-full overflow-hidden border ${
                                        selectedCategory === category.slug
                                            ? "border-white/20"
                                            : "border-[#F0EDE8]"
                                    }`}
                                >
                                    {category.image ? (
                                        <img
                                            src={category.image}
                                            alt={category.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-[0.35rem] md:text-[0.4rem] font-semibold bg-gray-100 text-gray-400">
                                            N/A
                                        </div>
                                    )}
                                </div>
                                <span className="text-[11px] md:text-xs font-semibold tracking-tight leading-none whitespace-nowrap">
                                    {category.name}
                                </span>
                            </motion.button>
                        ))}

                        {/* View All */}
                        <Link
                            href="/shop"
                            className="flex-shrink-0 whitespace-nowrap flex items-center px-4 py-1.5 md:py-2 rounded-full text-[11px] md:text-xs font-semibold bg-white border border-[#E4E0D9] text-primary hover:border-[#BFA47A] transition-colors cursor-pointer"
                        >
                            View All
                        </Link>
                    </div>
                </div>

                {/* Products grid / empty state */}
                <AnimatePresence mode="wait">
                    {sortedProducts.length > 0 ? (
                        <motion.div
                            key={selectedCategory ?? "all"}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.2 }}
                            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-start"
                        >
                            {sortedProducts.slice(0, 8).map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="w-full max-h-[400px] min-h-[320px] flex flex-col items-center justify-center border-2 border-dashed border-[#E4E0D9] rounded-3xl bg-[#F9F8F6] p-10 text-center"
                        >
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-md">
                                <PackageOpen className="w-10 h-10 text-[#BFA47A]/40" />
                            </div>
                            <h3 className="text-base font-bold text-primary mb-2">
                                Restocking in progress...
                            </h3>
                            <p className="text-xs text-[#8A857D] max-w-[280px] leading-relaxed">
                                We are currently updating our collection with fresh arrivals. Please check back
                                shortly or explore our other categories!
                            </p>
                            <button
                                onClick={() => setSelectedCategory(null)}
                                className="mt-6 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#BFA47A] hover:text-primary transition-colors cursor-pointer flex items-center gap-2 group"
                            >
                                <span className="border-b border-[#BFA47A] group-hover:border-primary">
                                    See what else is new
                                </span>
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>
        </Container>
    );
}

