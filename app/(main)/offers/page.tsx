import { getProducts } from "@/actions/products";
import OffersContent from "./OffersContent";
import Container from "@/components/layout/Container";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Offers — Lukuu",
    description: "Discover exclusive special offers on selected items.",
};

export default async function OffersPage() {
    // Fetch all products to filter offers on the client
    const { products } = await getProducts({
        pageSize: 1000, // Fetch all products to filter client-side
    });

    return (
        <Container className='mx-auto w-full flex flex-col items-start'>
            {/* ── Page header ──────────────────────────────────────── */}
            <div className="w-full py-8 border-b border-border text-left">
                <p className="text-[0.6rem] uppercase tracking-[0.25em] font-semibold mb-1 text-accent">
                    — Special Selection
                </p>
                <h1 className="text-4xl md:text-5xl font-light title">
                    Special Offers
                    <span className="text-accent">.</span>
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    Handpicked offers on premium items
                </p>
            </div>

            {/* ── Offers Grid ───────────────────────────────────────── */}
            <main className="w-full py-8">
                <OffersContent products={products} />
            </main>
        </Container>
    );
}
