"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";
import type { SellerWithStats } from "@/actions/sellers";
import { LuFacebook, LuInstagram } from 'react-icons/lu'
import { PiTiktokLogo } from 'react-icons/pi'



export default function StoresContent({ sellers }: { sellers: SellerWithStats[] }) { 
    if (sellers.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 bg-accent/8 border border-accent/15">
                    <MapPin className="w-6 h-6 text-accent" />
                </div>
                <p className="text-base font-medium mb-1 text-foreground">
                    No stores available yet
                </p>
                <p className="text-sm text-muted-foreground">
                    Check back soon for featured sellers.
                </p>
                <Link href="/shop" className="mt-4 text-sm underline text-accent">
                    Browse all products
                </Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sellers.map(seller => (
                <Link
                    href={`/store/${seller.id}`}
                    key={seller.id}
                    className="group border border-border/50 rounded-2xl overflow-hidden bg-white hover:border-accent/30 hover:shadow-xl hover:shadow-accent/5 transition-all duration-500"
                >
                    <div className="grid grid-cols-3 h-full">
                        {/* Store Image — Span 1 */}
                        <div className="col-span-1 relative h-full min-h-[140px] bg-accent/5 overflow-hidden border-r border-border/30">
                            {seller.image ? (
                                <Image
                                    src={seller.image}
                                    alt={seller.shopName || seller.name}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-3xl font-light text-accent/40 title">
                                        {(seller.shopName || seller.name).charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Store Info — Span 2 */}
                        <div className="col-span-2 p-5 flex flex-col justify-between">
                            <div>
                                <h3 className="text-lg font-medium text-foreground line-clamp-1 title tracking-tight group-hover:text-accent transition-colors">
                                    {seller.shopName || seller.name}
                                </h3>
                                {seller.bio && (
                                    <p className="text-[0.7rem] text-muted-foreground line-clamp-2 mt-1.5 leading-relaxed">
                                        {seller.bio}
                                    </p>
                                )}

                                {/* Location */}
                                {seller.location && (
                                    <div className="flex items-center gap-1.5 mt-3 text-[0.65rem] text-muted-foreground font-medium uppercase tracking-wider">
                                        <MapPin className="w-3 h-3 text-accent" />
                                        {seller.location}
                                    </div>
                                )}
                            </div>

                            <div className="mt-4 flex items-center justify-between">
                                {/* Product Count */}
                                <div className="text-[0.6rem] font-bold text-accent bg-accent/10 py-1 px-2.5 rounded-full uppercase tracking-widest">
                                    {seller.productCount} Items
                                </div>

                                {/* Social Indicators (subtle) */}
                                <div className="flex gap-2">
                                    {seller.instagram && <LuInstagram className="w-3 h-3 text-muted-foreground/50" />}
                                    {seller.tiktok && <PiTiktokLogo className="w-3 h-3 text-muted-foreground/50" />}
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}
