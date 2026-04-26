import Container from "@/components/layout/Container";
import CompareContent from "./CompareContent";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Compare — Lukuu",
    description: "Compare premium items side-by-side to find your perfect match.",
};

export default function ComparePage() {
    return (
        <Container className="mx-auto w-full">
            <header className="py-12 border-b border-border mb-10 flex flex-col items-start gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-10 bg-accent rounded-full" />
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
