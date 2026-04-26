"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ShoppingBag, Trash2, Minus, Plus } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/stores";
import Link from "next/link";

export default function CartSheet() {
    const { items, removeItem, updateQuantity, getTotal, getItemCount } = useCartStore();
    const [open, setOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const total = getTotal();
    const itemCount = getItemCount();

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
                render={
                    <div role="button" className="relative p-2 hover:bg-[#BFA47A]/10 rounded-full transition-colors cursor-pointer outline-none">
                        <ShoppingBag className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
                        {mounted && itemCount > 0 && (
                            <span className="absolute p-2 -top-1 -right-0 bg-[#BFA47A] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center border border-white">
                                {itemCount}
                            </span>
                        )} 
                    </div>
                }
            />
            <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-0">
                <SheetHeader className="p-4 border-b border-[#E4E0D9]">
                    <SheetTitle className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-primary">
                        <ShoppingBag className="w-5 h-5 text-[#BFA47A] " />
                        Cart Items: ({itemCount})
                    </SheetTitle>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto no-scrollbar">
                    {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                            <div className="w-20 h-20 bg-[#F9F8F6] rounded-full flex items-center justify-center mb-4">
                                <ShoppingBag className="w-8 h-8 text-[#BFA47A]/30" />
                            </div>
                            <h3 className="text-sm font-bold text-primary mb-1">Your cart is empty</h3>
                            <p className="text-xs text-[#8A857D] mb-6">Add a product to see it here</p>
                            <Button 
                                onClick={() => setOpen(false)}
                                className="bg-[#BFA47A] hover:bg-[#A68B5C] text-white text-[10px] h-9 px-6 rounded-full font-bold uppercase tracking-wider cursor-pointer"
                            >
                                Shop Now
                            </Button>
                        </div>
                    ) : (
                        <div className="divide-y divide-[#E4E0D9]/50">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-3 px-4 py-4 bg-white hover:bg-[#F9F8F6]/50 transition-colors group">
                                    {/* Image Section */}
                                    <div className="w-20 h-24 rounded-lg overflow-hidden bg-[#F9F8F6] flex-shrink-0 border border-[#F0EDE8]">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            width={80}
                                            height={96}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    </div>
                                    
                                    {/* Item Details */}
                                    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-1">
                                                <h3 className="font-bold text-[13px] text-primary line-clamp-1 pr-2">{item.name}</h3>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-[9px] uppercase tracking-widest text-[#8A857D] font-bold">{item.category}</p>
                                                    {item.size && (
                                                        <span className="text-[9px] font-bold text-primary px-1.5 py-0.5 bg-[#EEE9E3] rounded">
                                                            {item.size}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="p-1.5 text-[#8A857D] hover:text-red-500 hover:bg-red-50 rounded-md transition-all cursor-pointer"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between mt-4">
                                            {/* Interactive Counter UI */}
                                            <div className="flex items-center gap-3 bg-[#F9F8F6] border border-[#E4E0D9] rounded-full p-1 shadow-sm">
                                                <button
                                                    onClick={() => {
                                                        if (item.quantity > 1) {
                                                            updateQuantity(item.id, item.quantity - 1);
                                                        } else {
                                                            removeItem(item.id);
                                                        }
                                                    }}
                                                    className="w-6 h-6 flex items-center justify-center rounded-full bg-white border border-[#E4E0D9] text-primary hover:border-[#BFA47A] transition-colors cursor-pointer"
                                                >
                                                    <Minus className="w-2.5 h-2.5" />
                                                </button>
                                                
                                                <span className="text-[11px] font-bold text-primary min-w-[12px] text-center">
                                                    {item.quantity}
                                                </span>
                                                
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    disabled={item.quantity >= item.stock}
                                                    className="w-6 h-6 flex items-center justify-center rounded-full bg-white border border-[#E4E0D9] text-primary hover:border-[#BFA47A] disabled:opacity-30 transition-colors cursor-pointer"
                                                >
                                                    <Plus className="w-2.5 h-2.5" />
                                                </button>
                                            </div>

                                            <div className="text-right">
                                                <span className="font-bold text-sm text-primary">
                                                    KES {((item.discountPrice || item.price) * item.quantity).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {items.length > 0 && (
                    <SheetFooter className="p-4 bg-[#F9F8F6] border-t border-[#E4E0D9] sm:flex-col gap-3">
                        <div className="w-full space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-semibold uppercase tracking-widest text-[#8A857D]">Subtotal</span>
                                <span className="text-lg font-semibold text-primary">KES {total.toLocaleString()}</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Link href="/checkout" className="w-full" onClick={() => setOpen(false)}>
                                    <Button className="w-full bg-primary hover:bg-primary/90 text-white h-10 rounded-md font-semibold text-[10px] uppercase tracking-[0.2em] shadow-sm cursor-pointer">
                                        Checkout
                                    </Button> 
                                </Link>
                                <button 
                                    onClick={() => setOpen(false)}
                                    className="w-full py-1 text-[10px] font-medium uppercase tracking-widest text-[#8A857D] hover:text-primary transition-colors cursor-pointer"
                                >
                                    Add more items
                                </button>
                            </div>
                        </div>
                    </SheetFooter>
                )}
            </SheetContent>
            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </Sheet>
    );
}

