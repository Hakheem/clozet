"use client";

import { useCompareStore } from "@/lib/stores";
import { getProductById, ProductWithCategory } from "@/actions/products";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Trash, Plus, ChartNoAxesColumn, ShoppingCart, ArrowRight } from "lucide-react";
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
                    <p className="text-muted-foreground font-bold uppercase tracking-[0.2em] text-[0.6rem]">Analyzing products...</p>
                </div>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-24 h-24 rounded-[2rem] flex items-center justify-center mb-6 bg-[#F9F8F6] border border-[#E4E0D9]">
                    <ChartNoAxesColumn className="w-10 h-10 text-accent/30" />
                </div>
                <h2 className="text-2xl font-bold mb-2 text-primary title tracking-tight">Your comparison list is empty</h2>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto mb-8 font-medium">
                    Add up to 4 premium items to compare their unique features and find your perfect match.
                </p>
                <Link href="/shop">
                    <Button className="rounded-xl px-10 bg-primary text-white hover:bg-primary/90 transition-all uppercase tracking-[0.2em] text-[0.65rem] font-bold h-12">
                        Start Comparing
                    </Button>
                </Link>
            </div>
        );
    }

    const traits = [
        { label: "Price", key: "price" },
        { label: "Type", key: "variantType" },
        { label: "Material", key: "material" },
        { label: "Brand", key: "brand" },
        { label: "Category", key: "category" },
        { label: "Status", key: "status" },
    ];

    return (
        <div className="pb-24">
            <div className="flex justify-between items-center mb-10 pb-6 border-b border-border/50">
                <div className="flex items-center gap-4">
                    <div className="px-3 py-1 rounded-full bg-accent text-white text-[10px] font-bold uppercase tracking-widest">
                        {products.length} / 4 Items
                    </div>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest hidden md:block">
                        Side-by-Side Review
                    </p>
                </div>
                <Button 
                    variant="ghost" 
                    onClick={clearCompare}
                    className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-all px-4"
                >
                    <Trash className="w-3.5 h-3.5 mr-2" />
                    Clear Comparison
                </Button>
            </div>

            <div className="flex overflow-x-auto no-scrollbar pb-4 -mx-4 px-4 md:mx-0 md:px-0">
                {/* Fixed Traits Labels (Desktop only) */}
                <div className="hidden lg:flex flex-col w-48 shrink-0 mt-[400px]">
                    {traits.map((trait) => (
                        <div key={trait.label} className="h-20 flex items-center border-b border-border/40">
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">{trait.label}</span>
                        </div>
                    ))}
                </div>

                {/* Product Columns */}
                <div className="flex gap-4 lg:gap-6 flex-1">
                    {products.map((product) => (
                        <div key={product.id} className="w-[280px] lg:flex-1 min-w-[280px] flex flex-col group">
                            {/* Product Header Card */}
                            <div className="relative mb-8 group">
                                <button 
                                    onClick={() => removeFromCompare(product.id)}
                                    className="absolute top-3 right-3 z-20 p-2 bg-white/90 backdrop-blur-md rounded-lg border border-border/50 text-muted-foreground hover:text-red-500 hover:border-red-200 transition-all shadow-sm"
                                >
                                    <Trash className="w-3.5 h-3.5" />
                                </button>
                                
                                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-4 border border-border shadow-sm">
                                    <Image 
                                        src={product.images[0]} 
                                        alt={product.name} 
                                        fill 
                                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="absolute bottom-4 left-4 right-4 translate-y-4 group-hover:translate-y-0 transition-transform opacity-0 group-hover:opacity-100">
                                        <Link href={`/shop/${product.category.slug}/${product.slug}`}>
                                            <Button className="w-full bg-white text-primary hover:bg-white/90 rounded-lg h-10 text-[10px] font-bold uppercase tracking-widest">
                                                Quick View
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                                
                                <div className="px-1">
                                    <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-accent mb-1">{product.category.name}</p>
                                    <h3 className="text-base font-bold title leading-tight line-clamp-1">{product.name}</h3>
                                </div>
                            </div>

                            {/* Traits Values */}
                            <div className="space-y-0">
                                {traits.map((trait) => (
                                    <div key={`${product.id}-${trait.label}`} className="h-20 flex flex-col justify-center border-b border-border/40 lg:px-2">
                                        {/* Mobile label */}
                                        <span className="lg:hidden text-[8px] font-bold uppercase tracking-widest text-muted-foreground mb-1">{trait.label}</span>
                                        
                                        {trait.key === "price" ? (
                                            <span className="text-sm font-bold text-primary">KES {(product.discountPrice || product.price).toLocaleString()}</span>
                                        ) : trait.key === "status" ? (
                                            <span className={`text-[10px] font-bold uppercase tracking-widest w-fit px-2 py-0.5 rounded ${
                                                product.status === 'SALE' ? 'bg-red-50 text-red-500' : 
                                                product.status === 'HOT' ? 'bg-orange-50 text-orange-500' : 
                                                'bg-primary/5 text-primary'
                                            }`}>
                                                {product.status}
                                            </span>
                                        ) : trait.key === "category" ? (
                                            <span className="text-xs font-medium text-muted-foreground">{product.category.name}</span>
                                        ) : (
                                            <span className="text-xs font-medium text-muted-foreground">{product[trait.key as keyof ProductWithCategory] as string || "N/A"}</span>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* CTA Action */}
                            <div className="mt-8">
                                <Link href={`/shop/${product.category.slug}/${product.slug}`}>
                                    <Button className="w-full h-12 rounded-xl bg-primary/5 text-primary hover:bg-primary hover:text-white border border-primary/10 transition-all font-bold text-[10px] uppercase tracking-widest gap-2">
                                        View Details
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    ))}
                    
                    {/* Placeholder for empty slot */}
                    {products.length < 4 && (
                        <Link href="/shop" className="w-[280px] lg:flex-1 min-w-[280px] flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-border/40 bg-[#F9F8F6] group hover:bg-[#F0EDE8] transition-all min-h-[600px]">
                            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
                                <Plus className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Add Item</p>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
