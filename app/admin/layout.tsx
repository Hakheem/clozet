"use client";

import AdminSidebar from "@/components/admin/AdminSidebar";
import { useSession } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import { Loader2 } from "lucide-react";

interface ExtendedUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  role?: string;
  username?: string;
  shopName?: string;
  payoutMethod?: string;
  phoneNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();

  // Optimized: Only show the "Verifying access" screen on initial load
  // if no session information is currently available in the client cache.
  if (isPending && !session) {
    return (
      <div
        className="flex items-center justify-center h-screen"
        style={{ background: "#F7F5F2" }}
      >
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin" style={{ color: "#BFA47A" }} />
          <p className="text-sm" style={{ color: "#8A857D" }}>
            Verifying access…
          </p>
        </div>
      </div>
    );
  }

  // Once loaded, or if session is already present, verify the session and role.
  if (!session || !session.user || (session.user as ExtendedUser).role !== "ADMIN") {
    // If not pending and not authorized, redirect.
    if (!isPending) {
        redirect("/login");
    }
    // Return null while redirecting to avoid flickering unauthorized content
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#F7F5F2" }}>
      {/* Sticky sidebar */}
      <AdminSidebar adminName={(session.user as ExtendedUser)?.name || "Administrator"} />

      {/* Scrollable main content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

