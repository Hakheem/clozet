// components/general/CTABanners.tsx
//
// Usage: drop this into any page that needs the promotional banner row.
//
//   import CTABanners from "@/components/general/CTABanners";
//   <CTABanners />
//
// The component fetches active banners from the DB (server component).
// Banner 1 (position 1) renders on the LEFT, Banner 2 on the RIGHT.
// Each banner picks its visual treatment from the `type` field:
//   OVERLAY → full-bleed image, 50% linear gradient from right, text on right
//   GRID    → left half image, right half text + button (no overlay)

// components/general/CTABanners.tsx

import Link from "next/link";
import { ArrowRight } from "lucide-react";
// 1. Import your existing singleton instance
// Update the path below to match where your prisma file is located (e.g., @/lib/db or @/lib/prisma)
import { prisma } from "@/lib/prisma"; 

type Banner = {
    id: string; 
    title: string; 
    subtitle: string | null; 
    buttonText: string | null;
    buttonHref: string | null; 
    image: string | null; 
    type: "GRID" | "OVERLAY";
    position: number;
};

async function getActiveBanners(): Promise<Banner[]> {
    // 2. Simply use the shared 'prisma' instance directly.
    // No 'new PrismaClient()' needed here!
    return prisma.banner.findMany({
        where: { isActive: true },
        orderBy: { position: "asc" },
        take: 2,
    }) as Promise<Banner[]>;
}
// ─── Overlay banner ───────────────────────────────────────────────────────────
// Full-bleed background image with a 50% linear gradient from the right side.
// Text and CTA sit on the dark gradient half.
function OverlayBanner({ banner }: { banner: Banner }) {
    return (
        <div
            className="relative flex h-72 md:h-80 overflow-hidden rounded-xl"
            style={{ background: "#1C1A17" }}
        >
            {/* Background image */}
            {banner.image && (
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `url("${banner.image}")`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                />
            )}

            {/* Gradient overlay — transparent left → dark right (50%) */}
            <div
                className="absolute inset-0"
                style={{
                    background:
                        "linear-gradient(to left, rgba(28,26,23,0.92) 0%, rgba(28,26,23,0.75) 40%, rgba(28,26,23,0.15) 65%, transparent 100%)",
                }}
            />

            {/* Grain */}
            <div
                className="absolute inset-0 opacity-[0.04] pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "repeat",
                    backgroundSize: "128px",
                }}
            />

            {/* Text — anchored to the right half */}
            <div className="relative z-10 flex flex-col justify-end p-7 ml-auto w-full md:w-1/2">
                <p
                    className="text-[0.6rem] uppercase tracking-[0.25em] font-semibold mb-2"
                    style={{ color: "#BFA47A" }}
                >
                    — Featured
                </p>
                <h3
                    className="text-2xl md:text-3xl font-light leading-tight mb-2"
                    style={{ fontFamily: "var(--font-cormorant, serif)", color: "#EDE8DF" }}
                >
                    {banner.title}
                </h3>
                {banner.subtitle && (
                    <p
                        className="text-sm leading-relaxed mb-4"
                        style={{ color: "rgba(237,232,223,0.6)", fontFamily: "var(--font-dm-sans, sans-serif)" }}
                    >
                        {banner.subtitle}
                    </p>
                )}
                {banner.buttonText && banner.buttonHref && (
                    <Link href={banner.buttonHref}>
                        <span
                            className="group inline-flex items-center gap-2 text-sm font-semibold transition-colors"
                            style={{ color: "#BFA47A", fontFamily: "var(--font-dm-sans, sans-serif)" }}
                        >
                            {banner.buttonText}
                            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                        </span>
                    </Link>
                )}
            </div>
        </div>
    );
}

// ─── Grid banner ─────────────────────────────────────────────────────────────
// Left half: image. Right half: warm dark panel with text + CTA button.
function GridBanner({ banner }: { banner: Banner }) {
    return (
        <div
            className="relative flex h-72 md:h-80 overflow-hidden rounded-xl"
            style={{ border: "1px solid #E4E0D9" }}
        >
            {/* Left: image */}
            <div
                className="w-1/2 flex-shrink-0 relative"
                style={{ background: "#1C1A17" }}
            >
                {banner.image && (
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundImage: `url("${banner.image}")`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}
                    />
                )}
                {/* Subtle right edge fade into the text panel */}
                <div
                    className="absolute inset-y-0 right-0 w-12"
                    style={{
                        background: "linear-gradient(to right, transparent, rgba(28,26,23,0.15))",
                    }}
                />
            </div>

            {/* Right: text panel */}
            <div
                className="flex-1 flex flex-col justify-center px-7 py-6"
                style={{ background: "#1C1A17" }}
            >
                {/* Grain on the text panel */}
                <div
                    className="absolute inset-0 opacity-[0.04] pointer-events-none"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                        backgroundRepeat: "repeat",
                        backgroundSize: "128px",
                    }}
                />
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="block w-6 h-px" style={{ background: "#BFA47A" }} />
                        <p
                            className="text-[0.58rem] uppercase tracking-[0.22em] font-semibold"
                            style={{ color: "#BFA47A" }}
                        >
                            New In
                        </p>
                    </div>
                    <h3
                        className="text-2xl md:text-3xl font-light leading-tight mb-2"
                        style={{ fontFamily: "var(--font-cormorant, serif)", color: "#EDE8DF" }}
                    >
                        {banner.title}
                    </h3>
                    {banner.subtitle && (
                        <p
                            className="text-sm leading-relaxed mb-5"
                            style={{ color: "rgba(237,232,223,0.55)", fontFamily: "var(--font-dm-sans, sans-serif)" }}
                        >
                            {banner.subtitle}
                        </p>
                    )}
                    {banner.buttonText && banner.buttonHref && (
                        <Link href={banner.buttonHref}>
                            <span
                                className="group inline-flex items-center gap-2 px-5 h-9 rounded-lg text-sm font-semibold transition-all duration-200"
                                style={{
                                    background: "linear-gradient(135deg, #EDE8DF 0%, #D4C9B5 100%)",
                                    color: "#1C1A17",
                                    fontFamily: "var(--font-dm-sans, sans-serif)",
                                }}
                            >
                                {banner.buttonText}
                                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                            </span>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Root export — server component
// ─────────────────────────────────────────────────────────────────────────────
export default async function CTABanners() {
    const banners = await getActiveBanners();

    if (banners.length === 0) return null;

    return (
        <section className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {banners.map(banner =>
                    banner.type === "GRID"
                        ? <GridBanner key={banner.id} banner={banner} />
                        : <OverlayBanner key={banner.id} banner={banner} />
                )}
            </div>
        </section>
    );
}
