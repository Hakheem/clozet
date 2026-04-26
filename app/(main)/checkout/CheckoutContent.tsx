"use client";

import { useCartStore, useFavoritesStore } from "@/lib/stores";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { 
    ChevronRight, 
    Trash2, 
    Plus, 
    Minus, 
    Heart, 
    Truck, 
    Store, 
    ShieldCheck, 
    ArrowRight,
    Tag,
    Loader2,
    Phone
} from "lucide-react";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";
import { getAddresses } from "@/actions/addresses";
import { useEffect } from "react";

export default function CheckoutContent() {
    const { data: session } = useSession();
    const router = useRouter();
    const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();
    const { toggleFavorite, isFavorite } = useFavoritesStore();
    const [deliveryMethod, setDeliveryMethod] = useState<"shipping" | "pickup">("shipping");
    const [phone, setPhone] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [checkoutRequestID, setCheckoutRequestID] = useState<string | null>(null);
    const [addresses, setAddresses] = useState<any[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<string>("");

    useEffect(() => {
        if (session?.user?.id) {
            getAddresses().then((res) => {
                if (res.success && res.addresses) {
                    setAddresses(res.addresses);
                    const defaultAddr = res.addresses.find((a: any) => a.isDefault);
                    if (defaultAddr) {
                        setSelectedAddressId(defaultAddr.id);
                    } else if (res.addresses.length > 0) {
                        setSelectedAddressId(res.addresses[0].id);
                    }
                }
            });
        }
    }, [session?.user?.id]);

    const subtotal = getTotal();
    const deliveryFee = deliveryMethod === "shipping" ? 200 : 0;
    
    const savings = useMemo(() => {
        return items.reduce((acc, item) => {
            if (item.discountPrice && item.discountPrice < item.price) {
                return acc + (item.price - item.discountPrice) * item.quantity;
            }
            return acc;
        }, 0);
    }, [items]);

    const finalTotal = subtotal + deliveryFee;

    const pollPaymentStatus = (reqId: string) => {
        const interval = setInterval(async () => {
            try {
                const res = await axios.get(`/api/mpesa/status/${reqId}`);
                if (res.data.status === "CONFIRMED" || res.data.paymentStatus === "COMPLETED") {
                    clearInterval(interval);
                    clearCart(); // Clear the cart ONLY after confirmation
                    toast.success("Payment successful!");
                    router.push("/checkout/success");
                } else if (res.data.status === "CANCELLED" || res.data.paymentStatus === "FAILED") {
                    clearInterval(interval);
                    toast.error("Payment failed or was cancelled.");
                    setIsProcessing(false);
                    router.push("/checkout/failed");
                }
            } catch (error) {
                // Keep polling silently
            }
        }, 3000);
    };

    const handleMpesaPayment = async () => {
        if (!session) {
            toast.error("Please log in to complete your purchase.");
            router.push("/login?callbackUrl=/checkout");
            return;
        }

        if (!phone) {
            toast.error("Please enter your M-Pesa phone number.");
            return;
        }

        if (deliveryMethod === "shipping" && !selectedAddressId) {
            toast.error("Please select a delivery address.");
            return;
        }

        setIsProcessing(true);
        try {
            const res = await axios.post("/api/mpesa/stkpush", {
                phone,
                amount: finalTotal,
                cartItems: items,
                deliveryAddressId: deliveryMethod === "shipping" ? selectedAddressId : undefined,
            });

            if (res.data.success) {
                toast.success(res.data.message);
                setCheckoutRequestID(res.data.checkoutRequestID);
                pollPaymentStatus(res.data.checkoutRequestID);
            } else {
                toast.error(res.data.error || "Failed to initiate payment");
                setIsProcessing(false);
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.error || "An error occurred");
            setIsProcessing(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-32 text-center">
                <div className="w-24 h-24 rounded-[2rem] bg-accent/5 flex items-center justify-center mb-8 border border-accent/10">
                    <ShieldCheck className="w-12 h-12 text-accent/30" />
                </div>
                <h1 className="text-4xl font-light title mb-4 tracking-tight">Your vault is empty</h1>
                <p className="text-sm text-muted-foreground max-w-sm mb-10 leading-relaxed">
                    You haven't selected any premium pieces yet. Return to the shop to curate your collection.
                </p>
                <Link href="/shop">
                    <Button className="rounded-full px-12 bg-primary text-background hover:bg-primary/90 transition-all uppercase tracking-[0.2em] text-[0.7rem] font-bold py-7 shadow-xl shadow-primary/10">
                        Explore Collection
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 py-10 items-start">
            {/* ── Left Column: Cart Items (Span 3) ────────────────────── */}
            <div className="lg:col-span-3 space-y-8">
                <div className="flex items-center justify-between border-b border-border/30 pb-6">
                    <h2 className="text-2xl font-light title tracking-tight">
                        Your Selection
                        <span className="text-accent ml-1">({items.length})</span>
                    </h2>
                    <Link href="/shop" className="text-[0.65rem] uppercase tracking-widest font-bold text-accent hover:underline">
                        Add more items
                    </Link>
                </div>

                <div className="space-y-6">
                    {items.map((item) => (
                        <div key={item.id} className="group relative bg-white border border-border/40 rounded-xl p-5 flex gap-6 hover:border-accent/30 transition-all duration-300 shadow-sm hover:shadow-md">
                            {/* Product Image */}
                            <div className="relative w-32 h-40 bg-muted rounded-xl overflow-hidden shrink-0">
                                <Image 
                                    src={item.image} 
                                    alt={item.name} 
                                    fill 
                                    className="object-cover group-hover:scale-110 transition-transform duration-700" 
                                />
                                {item.discountPrice && (
                                    <div className="absolute top-2 left-2 bg-accent text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-widest shadow-sm">
                                        Sale
                                    </div>
                                )}
                            </div>

                            {/* Product Info */}
                            <div className="flex-1 flex flex-col justify-between py-1">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <p className="text-[0.65rem] uppercase tracking-[0.2em] font-bold text-accent">
                                                {item.category} — Premium Selection
                                            </p>
                                            <h3 className="text-xl font-medium title tracking-tight pr-10">{item.name}</h3>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-primary">
                                                KES {(item.discountPrice || item.price).toLocaleString()}
                                            </p>
                                            {item.discountPrice && (
                                                <p className="text-[0.7rem] text-muted-foreground line-through opacity-60">
                                                    KES {item.price.toLocaleString()}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-[0.7rem] text-muted-foreground leading-relaxed max-w-md line-clamp-2 italic opacity-80">
                                        Handcrafted luxury piece featuring signature styling and premium materials.
                                    </p>
                                </div>

                                <div className="flex items-center justify-between mt-6">
                                    {/* Quantity Controls */}
                                    <div className="flex items-center gap-4 bg-muted/30 rounded-xl p-1.5 border border-border/20">
                                        <button 
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-border/50 text-primary hover:border-accent transition-colors shadow-sm"
                                        >
                                            <Minus className="w-3.5 h-3.5" />
                                        </button>
                                        <span className="text-xs font-bold text-primary min-w-[20px] text-center">
                                            {item.quantity}
                                        </span>
                                        <button 
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            disabled={item.quantity >= item.stock}
                                            className={cn(
                                                "w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-border/50 text-primary transition-colors shadow-sm",
                                                item.quantity >= item.stock ? "opacity-30 cursor-not-allowed" : "hover:border-accent"
                                            )}
                                        >
                                            <Plus className="w-3.5 h-3.5" />
                                        </button>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-3">
                                        <button 
                                            onClick={() => toggleFavorite(item.productId)}
                                            className={cn(
                                                "p-2.5 rounded-xl border transition-all duration-300",
                                                isFavorite(item.productId) 
                                                    ? "bg-accent/10 border-accent/30 text-accent shadow-inner" 
                                                    : "bg-white border-border/50 text-muted-foreground hover:text-accent hover:border-accent/30 shadow-sm"
                                            )}
                                            title="Add to Wishlist"
                                        >
                                            <Heart className={cn("w-4 h-4", isFavorite(item.productId) && "fill-accent")} />
                                        </button>
                                        <button 
                                            onClick={() => removeItem(item.id)}
                                            className="p-2.5 rounded-xl bg-white border border-border/50 text-muted-foreground hover:text-destructive hover:border-destructive/30 transition-all duration-300 shadow-sm"
                                            title="Remove from Cart"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Right Column: Checkout Summary (Span 2) ──────────────── */}
            <div className="lg:col-span-2">
                <div className="sticky top-24 space-y-6">
                    <div className="bg-white border border-border/50 rounded-xl p-8 shadow-xl shadow-accent/5 space-y-8">
                        <div>
                            <h3 className="text-xl font-medium title tracking-tight mb-6">Order Summary</h3>
                            
                            {/* Delivery Method Selection */}
                            <div className="grid grid-cols-2 gap-3 p-1.5 bg-muted/30 rounded-xl border border-border/20 mb-8">
                                <button 
                                    onClick={() => setDeliveryMethod("shipping")}
                                    className={cn(
                                        "flex items-center justify-center gap-2 py-3 rounded-xl text-[0.65rem] font-bold uppercase tracking-widest transition-all duration-300",
                                        deliveryMethod === "shipping" 
                                            ? "bg-white text-primary shadow-sm ring-1 ring-border/10" 
                                            : "text-muted-foreground hover:text-primary"
                                    )}
                                >
                                    <Truck className="w-3.5 h-3.5" />
                                    Delivery
                                </button>
                                <button 
                                    onClick={() => setDeliveryMethod("pickup")}
                                    className={cn(
                                        "flex items-center justify-center gap-2 py-3 rounded-xl text-[0.65rem] font-bold uppercase tracking-widest transition-all duration-300",
                                        deliveryMethod === "pickup" 
                                            ? "bg-white text-primary shadow-sm ring-1 ring-border/10" 
                                            : "text-muted-foreground hover:text-primary"
                                    )}
                                >
                                    <Store className="w-3.5 h-3.5" />
                                    Pickup
                                </button>
                            </div>

                            {/* Summary Details */}
                            <div className="space-y-4">
                                <div className="flex justify-between text-[0.7rem] uppercase tracking-widest font-medium text-muted-foreground">
                                    <span>Subtotal</span>
                                    <span className="text-primary font-bold">KES {subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-[0.7rem] uppercase tracking-widest font-medium text-muted-foreground">
                                    <span>Delivery Fee</span>
                                    <span className={cn(deliveryFee === 0 ? "text-emerald-600 font-bold" : "text-primary font-bold")}>
                                        {deliveryFee === 0 ? "FREE" : `KES ${deliveryFee}`}
                                    </span>
                                </div>
                                
                                {savings > 0 && (
                                    <div className="flex justify-between text-[0.7rem] uppercase tracking-widest font-bold text-accent bg-accent/5 p-3 rounded-xl border border-accent/10">
                                        <div className="flex items-center gap-2">
                                            <Tag className="w-3 h-3" />
                                            <span>Your Savings</span>
                                        </div>
                                        <span>KES {savings.toLocaleString()}</span>
                                    </div>
                                )}

                                <div className="pt-6 mt-2 border-t border-border/30 flex justify-between items-baseline">
                                    <span className="text-base font-medium title tracking-tight">Estimated Total</span>
                                    <span className="text-2xl font-bold text-primary">KES {finalTotal.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {deliveryMethod === "pickup" && (
                            <div className="p-4 rounded-xl bg-accent/5 border border-accent/10 space-y-2">
                                <p className="text-[0.65rem] font-bold uppercase tracking-widest text-accent">Store Pickup</p>
                                <p className="text-[0.6rem] text-muted-foreground leading-relaxed">
                                    Our seller will call or text you shortly with the exact pickup point details and availability.
                                </p>
                            </div>
                        )}

                        {deliveryMethod === "shipping" && (
                            <div className="p-4 rounded-xl border border-border/50 bg-white space-y-3">
                                <div className="flex justify-between items-center">
                                    <p className="text-[0.65rem] font-bold uppercase tracking-widest text-primary">Delivery Address</p>
                                    <Link href="/profile/addresses" className="text-[0.65rem] font-bold uppercase tracking-widest text-accent hover:underline">
                                        Manage
                                    </Link>
                                </div>
                                
                                {addresses.length === 0 ? (
                                    <div className="text-center py-4 bg-muted/30 rounded-lg">
                                        <p className="text-xs text-muted-foreground mb-2">No addresses found.</p>
                                        <Link href="/profile/addresses" className="text-xs font-medium text-primary hover:underline">
                                            Add an address
                                        </Link>
                                    </div>
                                ) : (
                                    <select 
                                        value={selectedAddressId}
                                        onChange={(e) => setSelectedAddressId(e.target.value)}
                                        className="w-full rounded-lg border border-border/50 px-3 py-2 text-sm bg-white outline-none focus:border-accent"
                                    >
                                        <option value="" disabled>Select an address</option>
                                        {addresses.map((addr) => (
                                            <option key={addr.id} value={addr.id}>
                                                {addr.title} - {addr.street}, {addr.city}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input 
                                    type="tel"
                                    placeholder="M-Pesa Phone Number (e.g. 07...)"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    disabled={isProcessing}
                                    className="pl-9 rounded-lg h-12 bg-white"
                                />
                            </div>

                            <Button 
                                onClick={handleMpesaPayment}
                                disabled={isProcessing}
                                className="w-full rounded-lg h-12 bg-[#25D366] text-white hover:bg-[#128C7E] transition-all shadow-md shadow-emerald-500/10 uppercase tracking-[0.25em] text-[0.75rem] font-bold group flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        Pay with M-Pesa
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </Button>
                            
                            <p className="text-[0.6rem] text-muted-foreground text-center px-4 leading-relaxed italic">
                                {isProcessing 
                                    ? "Please enter your M-Pesa PIN on your phone to complete the transaction."
                                    : "* STK Push will be sent to your registered phone number for secure authorization."}
                            </p>
                        </div>
                    </div>

                    <div className="p-6 border border-dashed border-border/50 rounded-xl flex items-center gap-4 bg-white/50 backdrop-blur-sm">
                        <ShieldCheck className="w-8 h-8 text-accent/40" />
                        <div>
                            <p className="text-[0.65rem] font-bold uppercase tracking-widest text-primary">Secure Payment</p>
                            <p className="text-[0.6rem] text-muted-foreground mt-0.5">Transactions are processed securely via Safaricom Daraja API.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

