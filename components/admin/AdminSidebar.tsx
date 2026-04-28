"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Store,
  Package, 
  ShoppingBag,
  Wallet,
  Palette,
  Settings,
  LogOut,
  ChevronRight,
  Bell,
} from "lucide-react";
import Logo from "@/components/layout/header/Logo";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";


const NAV_GROUPS = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { label: "Notifications", href: "/admin/notifications", icon: Bell },
    ],
  },
  {
    label: "People",
    items: [
      { label: "Users", href: "/admin/users", icon: Users },
      { label: "Sellers", href: "/admin/sellers", icon: Store },
    ],
  },
  {
    label: "Catalogue",
    items: [
      { label: "Products", href: "/admin/products", icon: Package },
      { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
      { label: "Payouts", href: "/admin/payouts", icon: Wallet },
    ],
  },
  {
    label: "Site",
    items: [
      { label: "Content", href: "/admin/content", icon: Palette },
      { label: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

export default function AdminSidebar({ adminName = "Administrator" }: { adminName?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      router.push("/login");
    } finally {
      setIsSigningOut(false);
      setShowSignOutDialog(false);
    }
  };

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <>
      <aside
        className="relative flex flex-col h-screen w-60 flex-shrink-0 overflow-hidden"
        style={{ background: "#111009" }}
      >
        {/* Grain texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.045]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "128px",
          }}
        />

        {/* Gold left-edge accent */}
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-px"
          style={{
            background:
              "linear-gradient(to bottom, transparent, rgba(191,164,122,0.25) 20%, rgba(191,164,122,0.25) 80%, transparent)",
          }}
        />

        {/* ── Logo ── */}
        <div className="relative z-10 flex items-center px-5 h-[64px] flex-shrink-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <Logo theme="dark" size="sm" />
          <span
            className="ml-2 text-[0.55rem] uppercase tracking-[0.2em] px-1.5 py-0.5 rounded"
            style={{
              background: "rgba(191,164,122,0.12)",
              color: "#BFA47A",
              fontFamily: "var(--font-dm-sans, sans-serif)",
              border: "1px solid rgba(191,164,122,0.2)",
            }}
          >
            Admin
          </span>
        </div>

        {/* ── Navigation ── */}
        <nav className="relative z-10 flex-1 px-3 overflow-y-auto py-4 space-y-4">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <p
                className="px-2 mb-1.5 text-[0.58rem] uppercase tracking-[0.22em] font-semibold"
                style={{ color: "rgba(191,164,122,0.45)" }}
              >
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const active = isActive(item.href);
                  const Icon = item.icon;
                  return (
                    <Link key={item.href} href={item.href}>
                      <span
                        className="group relative flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm font-medium transition-all duration-150 cursor-pointer"
                        style={{
                          background: active
                            ? "rgba(191,164,122,0.1)"
                            : "transparent",
                          color: active
                            ? "#EDE8DF"
                            : "rgba(237,232,223,0.45)",
                        }}
                        onMouseEnter={(e) => {
                          if (!active)
                            (e.currentTarget as HTMLSpanElement).style.background =
                              "rgba(255,255,255,0.04)";
                        }}
                        onMouseLeave={(e) => {
                          if (!active)
                            (e.currentTarget as HTMLSpanElement).style.background =
                              "transparent";
                        }}
                      >
                        {/* Active indicator */}
                        {active && (
                          <span
                            className="absolute left-0 inset-y-1 w-0.5 rounded-full"
                            style={{ background: "#BFA47A" }}
                          />
                        )}
                        <Icon
                          className="w-4 h-4 flex-shrink-0"
                          style={{ color: active ? "#BFA47A" : "rgba(237,232,223,0.35)" }}
                        />
                        <span style={{ fontFamily: "var(--font-dm-sans)" }}>
                          {item.label}
                        </span>
                        {active && (
                          <ChevronRight
                            className="w-3 h-3 ml-auto"
                            style={{ color: "rgba(191,164,122,0.5)" }}
                          />
                        )}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* ── Bottom: admin info + sign out ── */}
        <div
          className="relative z-10 px-3 py-4 flex-shrink-0"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center gap-2.5 px-2.5 py-2 mb-2 rounded-md"
            style={{ background: "rgba(255,255,255,0.03)" }}>
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{ background: "rgba(191,164,122,0.15)", color: "#BFA47A" }}
            >
              {(adminName || "A").charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p
                className="text-xs font-semibold truncate"
                style={{ color: "#EDE8DF" }}
              >
                {adminName || "Administrator"}
              </p>
              <p
                className="text-[0.6rem] uppercase tracking-wider"
                style={{ color: "rgba(191,164,122,0.6)" }}
              >
                Administrator
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowSignOutDialog(true)}
            className="flex w-full items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors duration-150 cursor-pointer"
            style={{ color: "rgba(237,232,223,0.35)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color =
                "rgba(239,68,68,0.8)";
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(239,68,68,0.06)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color =
                "rgba(237,232,223,0.35)";
              (e.currentTarget as HTMLButtonElement).style.background = "transparent";
            }}
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            <span style={{ fontFamily: "var(--font-dm-sans, sans-serif)" }}>
              Sign Out
            </span>
          </button>
        </div>
      </aside>

      {/* Sign-out dialog */}
      <AlertDialog open={showSignOutDialog} onOpenChange={setShowSignOutDialog}>
        <AlertDialogContent className="max-w-sm rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle style={{ color: "#1C1A17" }}>
              Sign out of Admin?
            </AlertDialogTitle>
            <AlertDialogDescription style={{ color: "#8A857D" }}>
              You'll be redirected to the login page.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="flex-1 rounded-lg">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="flex-1 rounded-lg"
              style={{ background: "#1C1A17", color: "#F7F5F2" }}
            >
              {isSigningOut ? "Signing out…" : "Sign Out"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

