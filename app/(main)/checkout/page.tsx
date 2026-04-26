import Container from "@/components/layout/Container";
import CheckoutContent from "./CheckoutContent";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Checkout — Lukuu",
    description: "Complete your premium purchase securely.",
};

export default function CheckoutPage() {
    return (
        <Container className="mx-auto w-full">
            <header className="py-8 border-b border-border mb-8 flex flex-col items-start gap-4">
                <div className="flex items-center gap-3">
                    <h1 className="text-4xl md:text-5xl font-light title tracking-tight">
                        Secure Checkout
                        <span className="text-accent">.</span>
                    </h1>
                </div>
                <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">
                    Please provide your shipping and payment details below to complete your premium selection.
                </p>
            </header>
            <main>
                <CheckoutContent />
            </main>
        </Container>
    );
}
