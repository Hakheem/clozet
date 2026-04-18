"use client";

import SellerSidebar from "@/components/layout/SellerSidebar";
import { useSession } from "@/lib/auth-client";
import { redirect } from "next/navigation";

export default function SellerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: session, isPending } = useSession();

    if (isPending) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-900 mx-auto mb-4"></div>
                    <p className="text-zinc-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!session || session.user.role !== "SELLER") {
        redirect("/login");
    }

    return (
        <div className="flex">
            <SellerSidebar
                shopName={session.user.shopName || "My Shop"}
                ownerName={session.user.name || "Owner"}
            />
            <div className="flex-1 bg-zinc-50">{children}</div>
        </div>
    );
}
