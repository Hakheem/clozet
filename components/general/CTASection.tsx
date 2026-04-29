import { prisma } from "@/lib/prisma";
import MobileSlider from "./CTASlider"; 
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Container from "../layout/Container";

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
    return prisma.banner.findMany({
        where: { isActive: true },
        orderBy: { position: "asc" },
        take: 2,
    }) as Promise<Banner[]>;
}

function OverlayBanner({ banner }: { banner: Banner }) {
    return (
        <div className="group relative flex h-58 md:h-72 overflow-hidden rounded-2xl bg-[#1C1A17] shadow-md transition-transform duration-300">
            {banner.image && (
                <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-102" 
                    style={{ backgroundImage: `url("${banner.image}")` }} 
                />
            )}
            
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-[#1C1A17] via-[#1C1A17]/80 to-transparent md:from-[#1C1A17]/90 md:via-[#1C1A17]/70 md:to-transparent/10" />
            
            <div className="relative z-10 flex flex-col justify-end p-5 md:p-8 ml-auto w-full md:w-3/5 lg:w-1/2">
                {/* Top Badge Style */}
                <div className="mb-1.5 md:mb-2">
                    <span className="inline-block px-2 py-0.5 rounded bg-[#BFA47A]/10 border border-[#BFA47A]/20 text-[0.6rem] uppercase tracking-[0.15em] font-bold text-[#BFA47A]">
                        Featured
                    </span>
                </div>
                {/* Bolder Title with Reduced Gap */}
                <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mb-1 text-[#EDE8DF] drop-shadow-sm">
                    {banner.title}
                </h3>
                {banner.subtitle && (
                    <p className="text-xs sm:text-sm leading-relaxed mb-3 text-[#EDE8DF]/70 line-clamp-2 md:line-clamp-none">
                        {banner.subtitle}
                    </p>
                )}
                {/* Reduced Button Height Link */}
                <Link href={banner.buttonHref || "#"} className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#BFA47A] hover:text-[#D4C9B5] transition-colors w-max">
                    {banner.buttonText || "Explore"} <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
            </div>
        </div>
    );
}

function GridBanner({ banner }: { banner: Banner }) {
    return (
        <div className="group relative flex h-58 md:h-72 overflow-hidden rounded-2xl border border-[#BFA47A]/20 bg-[#1C1A17] shadow-md transition-transform duration-300">
            <div className="w-2/5 md:w-1/2 flex-shrink-0 relative overflow-hidden bg-[#151411]">
                {banner.image && (
                    <div 
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-102" 
                        style={{ backgroundImage: `url("${banner.image}")` }} 
                    />
                )}
                <div className="absolute inset-0 bg-[#1C1A17]/10 group-hover:bg-transparent transition-colors duration-500" />
            </div>
            
            <div className="flex-1 flex flex-col justify-center p-4 sm:p-6 md:p-8 relative z-10">
                {/* Top Badge Style */}
                <div className="mb-1.5 md:mb-2">
                    <span className="inline-block px-2 py-0.5 rounded bg-[#BFA47A]/10 border border-[#BFA47A]/20 text-[0.6rem] uppercase tracking-[0.15em] font-bold text-[#BFA47A]">
                        New In
                    </span>
                </div>
                {/* Bolder Title with Reduced Gap */}
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight mb-2 text-[#EDE8DF]">
                    {banner.title}
                </h3>
                {banner.subtitle && (
                    <p className="hidden md:block text-sm leading-relaxed mb-4 text-[#EDE8DF]/70">
                        {banner.subtitle}
                    </p>
                )}
                {/* Slightly Reduced Button Height (h-8 on mobile, h-9 on desktop) */}
                <Link href={banner.buttonHref || "#"} className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 h-8 md:h-9 rounded-lg text-xs sm:text-sm font-semibold bg-gradient-to-br from-[#EDE8DF] to-[#D4C9B5] text-[#1C1A17] hover:opacity-90 transition-opacity w-max shadow-md">
                    {banner.buttonText || "Discover"} <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
            </div>
        </div>
    );
}

export default async function CTASection() {
    const banners = await getActiveBanners();
    if (banners.length === 0) return null;

    const renderedBanners = banners.map(banner => 
        banner.type === "GRID" ? <GridBanner key={banner.id} banner={banner} /> : <OverlayBanner key={banner.id} banner={banner} />
    );

    return (
        <Container className="my-12 md:my-16">
            <div className="hidden md:grid md:grid-cols-2 gap-6">
                {renderedBanners}
            </div>

            <MobileSlider>
                {renderedBanners}
            </MobileSlider>
        </Container>
    );
}

