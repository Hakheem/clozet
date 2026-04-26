import { getProducts } from "@/actions/products";
import DealsContent from "./DealsContent";
import Container from "@/components/layout/Container";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Deals — Lukuu",
    description: "Discover amazing deals with discounts of 10% or more.",
};

export default async function DealsPage() {
    const { products } = await getProducts({
        pageSize: 1000, 
    });

    return (
        <Container className='mx-auto w-full flex flex-col items-start'>
           
            <div className="w-full py-8 border-b border-border text-left">
                <p className="text-[0.6rem] uppercase tracking-[0.25em] font-semibold mb-1 text-accent">
                    — Limited Time
                </p>
                <h1 className="text-4xl md:text-5xl font-light title">
                    Hot Deals
                    <span className="text-accent">.</span>
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    Save 10% or more on curated items
                </p>
            </div>

            <main className="w-full py-8">
                <DealsContent products={products} />
            </main>
        </Container>
    );
}
