import Container from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { XCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Payment Failed — Lukuu",
    description: "Your payment was not successful.",
};

export default function CheckoutFailedPage() {
    return (
        <Container className="mx-auto w-full py-20 flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="w-24 h-24 rounded-[2rem] bg-red-50 flex items-center justify-center mb-8 border border-red-100 shadow-xl shadow-red-500/10">
                <XCircle className="w-12 h-12 text-red-500" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-light title tracking-tight mb-4">
                Payment Failed<span className="text-red-500">.</span>
            </h1>
            
            <p className="text-sm text-muted-foreground max-w-md leading-relaxed mb-10">
                Unfortunately, your payment could not be processed. This could be due to a cancelled STK push, insufficient funds, or a network issue. Your items are still in your vault.
            </p>
            
            <Link href="/checkout">
                <Button className="rounded-full px-8 bg-primary text-background hover:bg-primary/90 transition-all uppercase tracking-widest text-[0.7rem] font-bold py-6 shadow-xl shadow-primary/10 flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Return to Checkout
                </Button>
            </Link>
        </Container>
    );
}
