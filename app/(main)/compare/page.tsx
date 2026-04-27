import Container from "@/components/layout/Container";
import CompareContent from "./CompareContent";
import { Metadata } from "next";
import BreadCrumbs from "@/components/shop/BreadCrumbs";

export const metadata: Metadata = {
    title: "Compare — Lukuu",
    description: "Compare premium items side-by-side to find your perfect match.",
};

export default function ComparePage() {
    return (
        <Container className="mx-auto w-full py-8">
            <header className="py-8 border-b border-border mb-8 flex flex-col items-start gap-4">
                <div className="flex items-center gap-3">
                    <h1 className="text-4xl md:text-5xl font-light title tracking-tight">
                        Compare Items
                        <span className="text-accent">.</span>
                    </h1>
                </div>
                <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">
                    Review and compare the features of your selected premium products to make an informed decision.
                </p>
            </header>
            <main>
                <CompareContent />
            </main>
        </Container>
    );
}
