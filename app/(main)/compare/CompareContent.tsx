"use client";

import { useCompareStore } from "@/lib/stores";
import { getProductById, ProductWithCategory } from "@/actions/products";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Trash, Plus, ChartNoAxesColumn, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CompareContent() {
    const { compareIds, removeFromCompare, clearCompare } = useCompareStore();
    const [products, setProducts] = useState<ProductWithCategory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            if (compareIds.length === 0) {
                setProducts([]);
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                const results = await Promise.all(
                    compareIds.map(id => getProductById(id))
                );
                setProducts(results.filter(Boolean) as ProductWithCategory[]);
            } catch (error) {
                console.error("Failed to fetch products for comparison:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [compareIds]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-24">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent mx-auto mb-4"></div>
                    <p className="text-muted-foreground font-medium uppercase tracking-widest text-[0.6rem]">Analyzing products...</p>
                </div>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6 bg-accent/5 border border-accent/10">
                    <ChartNoAxesColumn className="w-8 h-8 text-accent/40" />
                </div>
                <h2 className="text-2xl font-light mb-2 text-foreground title">Comparison list is empty</h2>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto mb-8">
                    Add products to your comparison list to see their features side-by-side.
                </p>
                <Link href="/shop">
                    <Button className="rounded-full px-10 bg-primary text-background hover:bg-primary/90 transition-all uppercase tracking-[0.2em] text-[0.65rem] font-bold py-6">
                        Explore Shop
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="py-10">
            <div className="flex justify-between items-center mb-10">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-[0.15em]">
                    Comparing <span className="text-accent font-bold">{products.length}</span> Premium Items
                </p>
                <Button 
                    variant="ghost" 
                    onClick={clearCompare}
                    className="text-[0.65rem] uppercase tracking-widest font-bold text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all"
                >
                    <Trash className="w-3.5 h-3.5 mr-2" />
                    Clear List
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-border/30 border border-border/30 rounded-2xl overflow-hidden shadow-sm">
                {products.map((product) => (
                    <div key={product.id} className="bg-white flex flex-col group relative">
                        {/* Remove Button */}
                        <button 
                            onClick={() => removeFromCompare(product.id)}
                            className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full border border-border/50 text-muted-foreground hover:text-destructive hover:border-destructive/30 transition-all shadow-sm opacity-0 group-hover:opacity-100"
                        >
                            <Trash className="w-3 h-3" />
                        </button>

                        {/* Product Image */}
                        <div className="relative aspect-[3/4] bg-muted overflow-hidden">
                            {product.images && product.images[0] && (
                                <Image 
                                    src={product.images[0]} 
                                    alt={product.name} 
                                    fill 
                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                            )}
                        </div>

                        {/* Product Details */}
                        <div className="p-6 flex-1 space-y-6">
                            <div className="space-y-1">
                                <p className="text-[0.6rem] uppercase tracking-[0.2em] font-bold text-accent">{product.category.name}</p>
                                <h3 className="text-base font-medium title tracking-tight line-clamp-2">{product.name}</h3>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-baseline py-3 border-t border-b border-border/20">
                                    <span className="text-[0.65rem] uppercase tracking-widest font-bold text-muted-foreground">Price</span>
                                    <span className="text-base font-bold text-primary">KES {(product.discountPrice || product.price).toLocaleString()}</span>
                                </div>
                                <div className="space-y-2">
                                    <span className="text-[0.65rem] uppercase tracking-widest font-bold text-muted-foreground block">Status</span>
                                    <span className="text-[0.7rem] px-2 py-0.5 rounded bg-accent/10 text-accent font-bold uppercase tracking-widest">
                                        {product.status}
                                    </span>
                                </div>
                                <div className="space-y-2">
                                    <span className="text-[0.65rem] uppercase tracking-widest font-bold text-muted-foreground block">Collection</span>
                                    <span className="text-[0.7rem] text-primary font-medium">{product.brand || 'Premium Selection'}</span>
                                </div>
                            </div>

                            <Link href={`/product/${product.id}`} className="block">
                                <Button className="w-full rounded-xl py-6 bg-primary/5 text-primary hover:bg-primary hover:text-background border border-primary/10 transition-all uppercase tracking-widest text-[0.65rem] font-bold">
                                    View Details
                                </Button>
                            </Link>
                        </div>
                    </div>
                ))}
                
                {products.length < 4 && (
                    <Link href="/shop" className="bg-muted/30 border-2 border-dashed border-border/50 flex flex-col items-center justify-center p-8 text-center min-h-[500px] group hover:bg-muted/50 transition-all">
                        <div className="w-12 h-12 rounded-full bg-white border border-border/50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Plus className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-muted-foreground">Add to Compare</p>
                    </Link>
                )}
            </div>
        </div>
    );
}
