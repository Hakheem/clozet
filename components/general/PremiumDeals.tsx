"use client";

import { useEffect, useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import Title from './Title';
import { Button } from '../ui/button';
import Link from 'next/link';
import Container from '../layout/Container';
import { getProducts, type ProductWithCategory } from "@/actions/products";
import ProductCard from "@/components/shop/ProductCard";

const PremiumDeals = () => {
    const [products, setProducts] = useState<ProductWithCategory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDeals = async () => {
            try {
                // Fetch products that have a discountPrice
                const result = await getProducts({ 
                    pageSize: 100, // Fetch more to filter client-side if needed, but getProducts doesn't have a direct "isDiscounted" filter
                });
                
                // Filter for discounted products and sort by highest percentage first
                const deals = result.products
                    .filter(p => p.discountPrice && p.discountPrice < p.price)
                    .sort((a, b) => {
                        const discA = ((a.price - a.discountPrice!) / a.price);
                        const discB = ((b.price - b.discountPrice!) / b.price);
                        
                        if (discB !== discA) return discB - discA;
                        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                    })
                    .slice(0, 12);

                setProducts(deals);
            } catch (error) {
                console.error("Failed to fetch premium deals:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDeals();
    }, []);

    return (
        <Container className='my-24 mx-auto'>
            <section className='flex flex-col space-y-8'>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className='flex items-center gap-3'>
                            <div className="w-8 h-8 rounded-full bg-[#BFA47A]/10 flex items-center justify-center">
                                <Sparkles className='w-4 h-4 text-[#BFA47A]' />
                            </div>
                            <h2 className="uppercase font-bold tracking-[0.25em] text-[10px] text-[#BFA47A]">Limited Time Offers</h2>
                        </div>

                        <Button variant="outline" className='flex items-center gap-2 h-10 border-[#E4E0D9] text-primary hover:bg-[#F9F8F6] rounded-xl text-[10px] uppercase tracking-widest font-bold px-6'>
                            <Link href={`/deals`}>View All Deals</Link>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                    </div>

                    <div className="max-w-2xl">
                        <Title className='text-3xl md:text-4xl mb-3'>Premium Deals, <span className="text-[#BFA47A]">Unbeatable</span> Prices</Title>
                        <p className="text-muted-foreground text-sm leading-relaxed font-medium">
                            Experience luxury for less. Explore our exclusive collection of high-demand items with seasonal discounts designed for the discerning shopper.
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="aspect-[3/4] rounded-2xl bg-muted animate-pulse" />
                        ))}
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center border border-dashed border-[#E4E0D9] rounded-3xl bg-[#F9F8F6]">
                        <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">No active deals at the moment</p>
                    </div>
                )}
            </section>
        </Container>
    );
}

export default PremiumDeals;
