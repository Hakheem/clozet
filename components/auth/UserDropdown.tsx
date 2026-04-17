"use client";

import { useSession, signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Loader2, User, LogOut, LayoutDashboard, Store } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Skeleton } from "../ui/skeleton";

export default function UserDropdown() {
  const { data: session, isPending } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close dropdown on outside click
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
    await signOut();
    router.refresh(); 
  };

  if (isPending) {
    return <Skeleton className="py-3 w-24 rounded-lg" />;
  }

  if (!session) {
    return (
      <Link href="/login">
        <Button className="px-6 py-3 text-sm font-medium rounded-lg shadow-sm transition-all duration-300 transform  active:scale-95 rounded-md">
         Login
        </Button>
      </Link>
    );
  }

  const { user } = session;
  const userWithRole = user as typeof user & { role?: string };
  const isAdmin = userWithRole.role === "ADMIN";
  const isSeller = userWithRole.role === "SELLER";

  return (
    <div className="relative z-40" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-8 h-8 rounded-full border border-border transition-colors focus:outline-none focus:ring-1 focus:ring-primary focus:ring-offset-0 cursor-pointer"
      >
        {user.image ? (
          <img src={user.image} alt="User Avatar" className="w-7 h-7 rounded-full object-cover" />
        ) : (
          <span className="font-semibold text-sm uppercase">{user.name?.charAt(0) || user.email.charAt(0)}</span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 py-2 overflow-hidden origin-top-right"
          >
            <div className="px-4 py-3 border-b border-gray-50 flex flex-col items-start truncate">
              <span className="text-sm font-semibold text-zinc-900 truncate w-full">{user.name || "User"}</span>
              <span className="text-xs text-zinc-500 truncate w-full">{user.email}</span>
            </div>

            <div className="py-1">
              {isAdmin && (
                <Link href="/admin" onClick={() => setIsOpen(false)}>
                  <span className="flex w-full items-center px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors cursor-pointer">
                    <LayoutDashboard className="h-4 w-4 mr-3 text-zinc-400" />
                    Admin Dashboard
                  </span>
                </Link>
              )}
              
              {(isSeller || isAdmin) && (
                <Link href="/seller" onClick={() => setIsOpen(false)}>
                  <span className="flex w-full items-center px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors cursor-pointer">
                    <Store className="h-4 w-4 mr-3 text-zinc-400" />
                    Seller Hub
                  </span>
                </Link>
              )}

              <Link href="/profile" onClick={() => setIsOpen(false)}>
                <span className="flex w-full items-center px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors cursor-pointer">
                  <User className="h-4 w-4 mr-3 text-zinc-400" />
                  My Profile
                </span>
              </Link>

              <button
                onClick={handleSignOut}
                className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
              >
                <LogOut className="h-4 w-4 mr-3 text-red-500" />
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


