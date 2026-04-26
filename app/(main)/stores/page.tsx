import { getSellers } from "@/actions/sellers";
import StoresContent from "./StoresContent";
import Container from "@/components/layout/Container";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Stores — Lukuu",
    description: "Discover premium sellers on Lukuu.",
};

export default async function StoresPage() {
    const sellers = await getSellers();

    return (
        <Container className='mx-auto w-full flex flex-col items-start'>
            <div className="w-full py-8 border-b border-border text-left">
                <p className="text-[0.6rem] uppercase tracking-[0.25em] font-semibold mb-1 text-accent">
                    — Our Community
                </p>
                <h1 className="text-4xl md:text-5xl font-light title">
                    Stores & Sellers
                    <span className="text-accent">.</span>
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    Discover premium sellers curated just for you
                </p>
            </div>

            {/* ── Stores Grid ───────────────────────────────────────── */}
            <main className="w-full py-8">
                <StoresContent sellers={sellers} />
            </main>
        </Container>
    );
}
