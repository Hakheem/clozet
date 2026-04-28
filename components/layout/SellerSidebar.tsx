"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { signOut, useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import {
    LayoutDashboard,
    ShoppingBag,
    Package,
    LogOut,
    Settings,
    Wallet,
    Store,
    ChevronRight,
    Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
import Link from "next/link";
import { motion } from "framer-motion";

export default function SellerSidebar() {
    const { data: session } = useSession();
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    const shopName = (session?.user as any)?.shopName || "My Shop";
    const userImage = session?.user?.image;
    const ownerName = session?.user?.name || "Merchant";

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await signOut({
                fetchOptions: {
                    onSuccess: () => {
                        toast.success("Logged out successfully");
                        router.push("/login");
                    },
                },
            });
        } catch (error) {
            toast.error("Failed to logout");
            setIsLoggingOut(false);
        }
    };

    const links = [
        {
            label: "Dashboard",
            icon: LayoutDashboard,
            href: "/seller",
            exact: true,
        },
        {
            label: "Products",
            icon: Package,
            href: "/seller/products",
        },
        {
            label: "Orders",
            icon: ShoppingBag,
            href: "/seller/orders",
        },
        {
            label: "Earnings",
            icon: Wallet,
            href: "/seller/earnings",
        },
        {
            label: "Notifications",
            icon: Bell,
            href: "/seller/notifications",
        },
        {
            label: "Store Settings",
            icon: Settings,
            href: "/seller/settings",
        },
    ];

    return (
        <>
            <aside className="w-72 bg-[#111009] border-r border-white/5 h-screen flex flex-col relative overflow-hidden">
                {/* Brand Hairline Overlay */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#BFA47A]/30 to-transparent" />

                {/* Seller Identity Header */}
                <div className="p-8 pb-10">
                    <div className="flex items-center gap-4 group">
                        <div className="relative">
                            <div className="w-12 h-12 rounded-full border-2 border-[#BFA47A]/30 overflow-hidden bg-[#1C1A17] transition-transform group-hover:scale-105 duration-500">
                                {userImage ? (
                                    <img src={userImage} alt={shopName} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[#BFA47A]">
                                        <Store className="w-6 h-6" />
                                    </div>
                                )}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#BFA47A] rounded-full border-2 border-[#111009] flex items-center justify-center">
                                <div className="w-1.5 h-1.5 bg-[#111009] rounded-full animate-pulse" />
                            </div>
                        </div>
                        <div className="space-y-0.5 min-w-0">
                            <h3 className="text-sm font-bold text-[#EDE8DF] truncate tracking-tight">{shopName}</h3>
                            <div className="flex items-center gap-1.5 opacity-60">
                                <span className="w-1 h-1 rounded-full bg-[#BFA47A]" />
                                <p className="text-[10px] text-[#EDE8DF] font-medium uppercase tracking-widest truncate">{ownerName}</p>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Navigation Links */}
                <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = link.exact 
                            ? pathname === link.href 
                            : pathname.startsWith(link.href);
                        
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-300 group ${
                                    isActive 
                                    ? "bg-[#BFA47A] text-[#111009] shadow-lg shadow-[#BFA47A]/10" 
                                    : "text-[#8A857D] hover:text-[#EDE8DF] hover:bg-white/5"
                                }`}
                            >
                                <div className="flex items-center gap-4">
                                    <Icon className={`w-5 h-5 transition-transform duration-500 ${isActive ? "scale-110" : "group-hover:scale-110"}`} />
                                    <span className="text-[11px] font-bold uppercase tracking-[0.15em]">{link.label}</span>
                                </div>
                                {isActive && (
                                    <motion.div 
                                        layoutId="activeIndicator"
                                        className="w-1 h-4 bg-[#111009] rounded-full"
                                    />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer / Support Link */}
                <div className="px-8 pb-4">
                    <p className="text-[9px] text-[#8A857D] uppercase font-bold tracking-widest">Merchant Support</p>
                    <Link href="/support" className="text-[10px] text-[#BFA47A] font-bold hover:underline">Help & Guides</Link>
                </div>

                {/* Logout Button */}
                <div className="p-6 pt-4 border-t border-white/5 bg-[#0D0C08]">
                    <button
                        onClick={() => setShowLogoutDialog(true)}
                        className="w-full flex items-center justify-center gap-2 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-[#DC2626] border border-[#DC2626]/20 hover:bg-[#DC2626]/5 transition-all"
                    >
                        <LogOut className="w-4 h-4" />
                        End Session
                    </button>
                  
                </div>
            </aside>

            {/* Logout Confirmation Dialog */}
            <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
                <AlertDialogContent className="bg-[#1C1A17] border-white/10 text-[#EDE8DF]">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="title text-2xl font-light">Confirm Logout</AlertDialogTitle>
                        <AlertDialogDescription className="text-[#8A857D]">
                            Your merchant session will be terminated. Unsaved drafting changes may be lost. Proceed?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-6 gap-3">
                        <AlertDialogCancel className="bg-transparent border-white/10 text-[#EDE8DF] hover:bg-white/5 rounded-full px-6 uppercase text-[10px] font-bold tracking-widest h-11">
                            Stay Logged In
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            className="bg-[#DC2626] hover:bg-[#B91C1C] text-white rounded-full px-8 uppercase text-[10px] font-bold tracking-widest h-11"
                        >
                            {isLoggingOut ? "Ending..." : "Confirm Logout"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
