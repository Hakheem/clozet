"use client";

import { useEffect, useState } from "react";
import { getMyOrders } from "@/actions/orders";
import { toast } from "sonner";
import { Loader2, Package, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            const res = await getMyOrders();
            if (res.success && res.orders) {
                setOrders(res.orders);
            } else {
                toast.error(res.error || "Failed to load orders");
            }
            setIsLoading(false);
        };
        fetchOrders();
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-accent" />
            </div>
        );
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return 'bg-amber-100 text-amber-700';
            case 'CONFIRMED': return 'bg-blue-100 text-blue-700';
            case 'SHIPPED': return 'bg-purple-100 text-purple-700';
            case 'DELIVERED': return 'bg-emerald-100 text-emerald-700';
            case 'CANCELLED': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="max-w-4xl">
            <h1 className="text-2xl font-medium title tracking-tight mb-2">Order History</h1>
            <p className="text-sm text-muted-foreground mb-8">Track your recent purchases and view order details.</p>

            {orders.length === 0 ? (
                <div className="text-center py-16 bg-accent/5 rounded-2xl border border-dashed border-border">
                    <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                    <h3 className="text-lg font-medium title mb-2">No orders yet</h3>
                    <p className="text-sm text-muted-foreground mb-6">When you buy something, it will appear here.</p>
                    <Link href="/shop" className="inline-block px-6 py-3 bg-primary text-white text-[11px] font-bold uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-colors">
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order.id} className="border border-border/50 rounded-2xl overflow-hidden bg-white">
                            {/* Order Header */}
                            <div className="bg-accent/5 px-6 py-4 border-b border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-6">
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Order Placed</p>
                                        <p className="text-sm font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Total</p>
                                        <p className="text-sm font-bold text-primary">KES {order.total.toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                                    <span className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest", getStatusColor(order.status))}>
                                        {order.status}
                                    </span>
                                    <span className="text-xs text-muted-foreground font-mono">#{order.id.slice(-8).toUpperCase()}</span>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="p-6">
                                <div className="space-y-4">
                                    {order.items.map((item: any) => (
                                        <div key={item.id} className="flex gap-4 items-center">
                                            <div className="w-16 h-20 bg-muted rounded-lg overflow-hidden shrink-0 border border-border/50 relative">
                                                {item.product.images?.[0] ? (
                                                    <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                                                ) : (
                                                    <div className="w-full h-full bg-accent/10" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-medium text-sm text-primary truncate">{item.product.name}</h4>
                                                <p className="text-xs text-muted-foreground mt-1">Sold by: {item.product.seller?.shopName || 'Lukuu'}</p>
                                                <div className="flex items-center gap-4 mt-2">
                                                    <span className="text-xs font-medium">Qty: {item.quantity}</span>
                                                    <span className="text-xs font-bold">KES {item.price.toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Delivery Info if Shipping */}
                                {order.deliveryAddress && (
                                    <div className="mt-6 pt-6 border-t border-border/50">
                                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Delivery Address</h4>
                                        <p className="text-sm text-primary font-medium">{order.deliveryAddress.title}</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">{order.deliveryAddress.street}, {order.deliveryAddress.city}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
