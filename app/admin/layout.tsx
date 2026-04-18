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

  if (isPending) {
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

  if (!session || !session.user || (session.user as ExtendedUser).role !== "ADMIN") {
    redirect("/login");
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

