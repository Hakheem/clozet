"use client";

import { useState, useEffect } from "react";
import { useFavoritesStore } from "@/lib/stores";
import { getProductById } from "@/actions/products";
import ProductCard from "@/components/shop/ProductCard";
import type { ProductWithCategory } from "@/actions/products";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Heart, Trash } from "lucide-react";
import Link from "next/link";

export default function WishlistContent() {
    const { favorites, toggleFavorite } = useFavoritesStore();
    const [products, setProducts] = useState<ProductWithCategory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            if (favorites.length === 0) {
                setProducts([]);
                setLoading(false);
                return;
            }

            try {
                const fetchedProducts = await Promise.all(
                    favorites.map(id => getProductById(id))
                );
                setProducts(fetchedProducts.filter(Boolean) as ProductWithCategory[]);
            } catch (error) {
                console.error("Failed to fetch products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [favorites]);

    const handleClearWishlist = () => {
        favorites.forEach(id => toggleFavorite(id));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-24">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent mx-auto mb-4"></div>
                    <p className="text-muted-foreground font-medium uppercase tracking-widest text-[0.6rem]">Curating your favorites...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
          
            <div className="py-8 border-b border-border mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <h1 className="text-4xl md:text-5xl font-light title tracking-tight">
                          My Wishlist.
                      </h1>
                    </div>
                    <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">
                        Keep track of the products you love. Your personal collection of premium finds, ready for when you&apos;re prepared to shop.
                    </p>
                </div>

                {products.length > 0 && (
                    <AlertDialog>
                        <AlertDialogTrigger
                            render={
                                <Button
                                    className="flex gap-2 items-center text-red-400  transition-all duration-200 uppercase tracking-widest text-[0.65rem] font-bold py-5 px-6 border rounded-lg bg-red-50 border-red-100 hover:text-white hover:bg-red-300 hover:border-red-300     "
                                >
                                    <Trash className="w-3.5 h-3.5" />
                                    Clear Wishlist
                                </Button>
                            }
                        />
                        <AlertDialogContent className="rounded-2xl border-border/50">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="title text-2xl font-light">Clear Wishlist</AlertDialogTitle>
                                <AlertDialogDescription className="text-sm text-muted-foreground">
                                    Are you sure you want to remove all items from your wishlist? This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <div className="flex gap-3 justify-end mt-4">
                                <AlertDialogCancel className="rounded-xl border-border/50 text-[0.7rem] uppercase tracking-widest font-bold">Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                    onClick={handleClearWishlist} 
                                    className="bg-red-400 text-white hover:bg-red-500 rounded-xl text-[0.7rem] uppercase tracking-widest font-bold px-6 "
                                >
                                    Yes, Clear Wishlist
                                </AlertDialogAction>
                            </div>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
            </div>

            {products.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6 bg-accent/5 border border-accent/10 group animate-pulse">
                        <Heart className="w-8 h-8 text-accent/40 group-hover:text-accent transition-colors" />
                    </div>
                    <p className="text-xl font-light mb-2 text-foreground title">
                        Your wishlist is empty
                    </p>
                    <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                        Start adding your favorite items to build your personal collection of premium style.
                    </p>
                    <Link href="/shop" className="mt-8 text-[0.65rem] font-bold uppercase tracking-[0.2em] py-4 px-10 bg-primary text-background rounded-full hover:bg-primary/90 transition-all">
                        Explore Shop
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
}
