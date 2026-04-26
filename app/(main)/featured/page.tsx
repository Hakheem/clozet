import { getProducts } from "@/actions/products";
import FeaturedContent from "./FeaturedContent";
import Container from "@/components/layout/Container";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Featured — Lukuu",
    description: "Discover our featured collection of premium items.",
};

export default async function FeaturedPage() {
    const { products } = await getProducts({
        pageSize: 1000,
    });

    return (
        <Container className='mx-auto w-full flex flex-col items-start'>
            <div className="w-full py-8 border-b border-border text-left">
                <p className="text-[0.6rem] uppercase tracking-[0.25em] font-semibold mb-1 text-accent">
                    — Curated Selection
                </p>
                <h1 className="text-4xl md:text-5xl font-light title">
                    Featured
                    <span className="text-accent">.</span>
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    Handpicked items from our premium collection
                </p>
            </div>

            <main className="w-full py-8">
                <FeaturedContent products={products} />
            </main>
        </Container>
    );
}
