"use client";

import { useCompareStore } from "@/lib/stores";
import { getProductById, ProductWithCategory } from "@/actions/products";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Trash, Plus, ChartNoAxesColumn, ArrowRight } from "lucide-react";
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

    const totalCols = 4; 
    const filledCols = products.length;
    const emptyCols = totalCols - filledCols;

    return (
        <div className="pb-20">
            <div className="flex justify-between items-center mb-8 pb-6 border-b border-border/50">
                <div className="flex items-center gap-4">
                    <div className="px-3 py-1 rounded-md bg-accent text-white text-[10px] font-bold uppercase tracking-widest">
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

            <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
                <div 
                    className="grid gap-0 border border-border/40 rounded-xl overflow-hidden bg-white min-w-[700px]"
                    style={{ gridTemplateColumns: `140px repeat(${totalCols}, 1fr)` }}
                >
                    {/* Header Row */}
                    <div className="bg-[#F9F8F6] border-b border-border/40 p-4 flex items-end">
                        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">Feature</span>
                    </div>

                    {products.map((product) => (
                        <div key={product.id} className="border-b border-border/40 relative group">
                            <button 
                                onClick={() => removeFromCompare(product.id)}
                                className="absolute top-3 right-3 z-10 p-1.5 bg-white/90 backdrop-blur-sm rounded-md border border-border/50 text-muted-foreground hover:text-red-500 hover:border-red-200 transition-all shadow-sm cursor-pointer"
                            >
                                <Trash className="w-3 h-3" />
                            </button>

                            <div className="relative w-full aspect-[4/3] rounded-sm overflow-hidden mb-3 border border-border/50">
                                <Image 
                                    src={product.images[0]} 
                                    alt={product.name} 
                                    fill 
                                    className="object-cover"
                                />
                            </div>

                            <p className="text-[8px] px-4 uppercase tracking-[0.2em] font-bold text-accent mb-1">{product.category.name}</p>
                            <h3 className="text-sm px-4 font-bold title leading-tight line-clamp-2">{product.name}</h3>
                        </div>
                    ))}

                    {/* Empty slot headers */}
                    {Array.from({ length: emptyCols }).map((_, i) => (
                        <div key={`empty-header-${i}`} className="border-b border-border/40 p-4">
                            <Link href="/shop" className="flex flex-col items-center justify-center h-full min-h-[120px] rounded-lg border-2 border-dashed border-border/30 bg-[#F9F8F6]/50 hover:bg-[#F0EDE8]/50 transition-all group">
                                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mb-2 group-hover:scale-110 transition-transform shadow-sm">
                                    <Plus className="w-4 h-4 text-muted-foreground" />
                                </div>
                                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Add Item</p>
                            </Link>
                        </div>
                    ))}

                    {/* Trait Rows */}
                    {traits.map((trait) => (
                        <>
                            {/* Trait Label */}
                            <div key={`label-${trait.key}`} className="bg-[#F9F8F6] border-b border-border/40 p-4 flex items-center">
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">{trait.label}</span>
                            </div>

                            {/* Product Values */}
                            {products.map((product) => (
                                <div key={`${product.id}-${trait.key}`} className="border-b border-border/40 p-4 flex items-center">
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

                            {/* Empty slot values */}
                            {Array.from({ length: emptyCols }).map((_, i) => (
                                <div key={`empty-${trait.key}-${i}`} className="border-b border-border/40 p-4 bg-[#F9F8F6]/30" />
                            ))}
                        </>
                    ))}

                    {/* CTA Row */}
                    <div className="bg-[#F9F8F6] p-4 flex items-center">
                        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">Action</span>
                    </div>

                    {products.map((product) => (
                        <div key={`cta-${product.id}`} className="p-4">
                            <Link href={`/shop/${product.category.slug}/${product.slug}`}>
                                <Button className="w-full h-9 rounded-lg bg-primary/5 text-primary hover:bg-primary hover:text-white border border-primary/10 transition-all font-bold text-[10px] uppercase tracking-widest gap-1.5">
                                    View
                                    <ArrowRight className="w-3 h-3" />
                                </Button>
                            </Link>
                        </div>
                    ))}

                    {Array.from({ length: emptyCols }).map((_, i) => (
                        <div key={`empty-cta-${i}`} className="p-4 bg-[#F9F8F6]/30" />
                    ))}
                </div>
            </div>
        </div>
    );
}

