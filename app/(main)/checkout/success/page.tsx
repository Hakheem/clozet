import Container from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Order Successful — Lukuu",
    description: "Your payment was successful and your order is confirmed.",
};

export default function CheckoutSuccessPage() {
    return (
        <Container className="mx-auto w-full py-20 flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="w-24 h-24 rounded-[2rem] bg-emerald-50 flex items-center justify-center mb-8 border border-emerald-100 shadow-xl shadow-emerald-500/10">
                <CheckCircle2 className="w-12 h-12 text-emerald-500" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-light title tracking-tight mb-4">
                Order Confirmed<span className="text-emerald-500">.</span>
            </h1>
            
            <p className="text-sm text-muted-foreground max-w-md leading-relaxed mb-10">
                Thank you for your purchase. Your payment was successful, and we are now processing your premium selection. You will receive an update shortly.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/profile">
                    <Button className="rounded-full px-8 bg-primary text-background hover:bg-primary/90 transition-all uppercase tracking-widest text-[0.7rem] font-bold py-6 w-full sm:w-auto shadow-xl shadow-primary/10 flex items-center gap-2">
                        View Order Details
                    </Button>
                </Link>
                <Link href="/shop">
                    <Button variant="outline" className="rounded-full px-8 border-border hover:bg-muted transition-all uppercase tracking-widest text-[0.7rem] font-bold py-6 w-full sm:w-auto flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4" />
                        Continue Shopping
                    </Button>
                </Link>
            </div>
        </Container>
    );
}
