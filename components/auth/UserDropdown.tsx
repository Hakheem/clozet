"use client";

import { useSession, signOut } from "@/lib/auth-client";
import { Loader2, User, LogOut, LayoutDashboard, Store, AlertTriangle, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Skeleton } from "../ui/skeleton";
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

export default function UserDropdown() {
  const { data: session, isPending } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      router.refresh();
    } finally {
      setIsSigningOut(false);
      setShowSignOutDialog(false);
    }
  };

  if (isPending) {
    return <Skeleton className="h-8 w-8 rounded-full" />;
  }

  if (!session) {
    return (
      <Link
        href="/login"
        className="inline-flex font-medium items-center px-1 text-sm transition-all duration-200 capitalize tracking-wide"
      >
        Login
      </Link>
    );
  }

  const { user } = session;
  const userWithRole = user as typeof user & { role?: string };
  const isAdmin = userWithRole.role === "ADMIN";
  const isSeller = userWithRole.role === "SELLER";

  const initials = (user.name?.charAt(0) || user.email.charAt(0)).toUpperCase();

  return (
    <>
      <div className="relative z-40" ref={dropdownRef}>
        {/* Avatar button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 focus:outline-none"
          style={{
            background: isOpen ? '#1C1A17' : 'transparent',
            border: `1.5px solid ${isOpen ? '#1C1A17' : '#E4E0D9'}`,
          }}
          aria-label="Account menu"
        >
          {user.image ? (
            <img
              src={user.image}
              alt="Avatar"
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span
              className="text-xs font-bold"
              style={{ color: isOpen ? '#F7F5F2' : '#1C1A17' }}
            >
              {initials}
            </span>
          )}
          {/* Online dot */}
          <span
            className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-background"
            style={{ background: '#4ECCA3' }}
          />
        </button>

        {/* Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-0 mt-3 w-60 rounded-xl overflow-hidden origin-top-right"
              style={{
                background: '#FFFFFF',
                border: '1px solid #E4E0D9',
                boxShadow: '0 8px 32px rgba(28,26,23,0.12), 0 2px 8px rgba(28,26,23,0.06)',
              }}
            >
              {/* User info */}
              <div
                className="px-4 py-3.5"
                style={{ borderBottom: '1px solid #F0EDE8' }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: '#1C1A17', color: '#F7F5F2' }}
                  >
                    {user.image ? (
                      <img src={user.image} alt="" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      initials
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: '#1C1A17' }}>
                      {user.name || "User"}
                    </p>
                    <p className="text-xs truncate" style={{ color: '#8A857D' }}>
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Menu items */}
              <div className="py-1.5">
                {isAdmin && (
                  <MenuItem
                    href="/admin"
                    icon={<LayoutDashboard className="h-3.5 w-3.5" />}
                    label="Admin Dashboard"
                    onClick={() => setIsOpen(false)}
                  />
                )}
                {(isSeller || isAdmin) && (
                  <MenuItem
                    href="/seller"
                    icon={<Store className="h-3.5 w-3.5" />}
                    label="Seller Hub"
                    onClick={() => setIsOpen(false)}
                  />
                )}
                <MenuItem
                  href="/profile"
                  icon={<User className="h-3.5 w-3.5" />}
                  label="My Profile"
                  onClick={() => setIsOpen(false)}
                />
                <MenuItem
                  href="/profile/orders"
                  icon={<ShoppingBag className="h-3.5 w-3.5" />}
                  label="My Orders"
                  onClick={() => setIsOpen(false)}
                />
              </div>

              {/* Sign out */}
              <div
                className="py-1.5"
                style={{ borderTop: '1px solid #F0EDE8' }}
              >
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setShowSignOutDialog(true);
                  }}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors duration-150"
                  style={{ color: '#DC2626' }}
                  onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = '#FEF2F2')}
                  onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = 'transparent')}
                >
                  <LogOut className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Sign-out confirmation dialog ──────────────────────── */}
      <AlertDialog open={showSignOutDialog} onOpenChange={setShowSignOutDialog}>
        <AlertDialogContent
          className="max-w-sm rounded-2xl"
          style={{ border: '1px solid #E4E0D9' }}
        >
          <AlertDialogHeader>
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
              style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}
            >
              <LogOut className="w-4 h-4" style={{ color: '#DC2626' }} />
            </div>
            <AlertDialogTitle
              className="text-lg font-semibold"
              style={{ color: '#1C1A17' }}
            >
              Sign out of Lukuu?
            </AlertDialogTitle>
            <AlertDialogDescription
              className="text-sm leading-relaxed"
              style={{ color: '#8A857D' }}
            >
              You'll be logged out of your account. Your cart and saved items will still
              be here when you come back.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-2">
            <AlertDialogCancel
              className="flex-1 h-10 rounded-lg border text-sm font-medium transition-colors"
              style={{ borderColor: '#E4E0D9', color: '#1C1A17' }}
            >
              Stay signed in
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="flex-1 h-10 rounded-lg text-sm font-semibold transition-all"
              style={{
                background: '#1C1A17',
                color: '#F7F5F2',
              }}
            >
              {isSigningOut ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Sign Out"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

/* ── Shared menu item component ─────────────────────────── */
function MenuItem({
  href,
  icon,
  label,
  onClick,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <Link href={href} onClick={onClick}>
      <span
        className="flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors duration-150 cursor-pointer"
        style={{ color: '#4A4740' }}
        onMouseEnter={e => ((e.currentTarget as HTMLSpanElement).style.background = '#F7F5F2')}
        onMouseLeave={e => ((e.currentTarget as HTMLSpanElement).style.background = 'transparent')}
      >
        <span style={{ color: '#8A857D' }}>{icon}</span>
        <span className="font-medium">{label}</span>
      </span>
    </Link>
  );
}

