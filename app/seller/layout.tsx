"use client";

import SellerSidebar from "@/components/layout/SellerSidebar";
import { useSession } from "@/lib/auth-client";
import { redirect, usePathname } from "next/navigation";

export default function SellerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session, isPending } = useSession();
  
  const isOnboarding = pathname === "/seller/onboarding";

  if (isPending && !session) {
    return (
      <div
        className="flex items-center justify-center h-screen"
        style={{ background: "#F7F5F2" }}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#BFA47A]"></div>
          <p className="text-sm font-medium" style={{ color: "#8A857D" }}>
            Preparing your dashboard…
          </p>
        </div>
      </div>
    );
  }

  if (!session || (session.user as any).role !== "SELLER") {
    if (!isPending) {
        redirect("/login");
    }
    return null;
  }

  // Enforce onboarding if not complete
  if (!(session.user as any).onboarded && !isOnboarding) {
    redirect("/seller/onboarding");
    return null;
  }

  // If already onboarded, don't allow visiting the onboarding page again
  if ((session.user as any).onboarded && isOnboarding) {
    redirect("/seller");
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#F7F5F2" }}>
      {!isOnboarding && (
        <SellerSidebar
          shopName={(session.user as any).shopName || "My Shop"}
          ownerName={session.user.name || "Owner"}
        />
      )}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
