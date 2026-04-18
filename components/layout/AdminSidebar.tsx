"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import { toast } from "sonner";
import {
    LayoutDashboard,
    Users,
    Settings,
    LogOut,
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

interface AdminSidebarProps {
    adminName?: string;
}

export default function AdminSidebar({ adminName = "Administrator" }: AdminSidebarProps) {
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const router = useRouter();

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
            href: "/admin",
        },
        {
            label: "Users",
            icon: Users,
            href: "/admin/users",
        },
        {
            label: "Settings",
            icon: Settings,
            href: "/admin/settings",
        },
    ];

    return (
        <>
            <aside className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-sm font-semibold text-zinc-900">Lukuu Admin</h3>
                    <p className="text-xs text-gray-500 mt-1">{adminName}</p>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 px-4 py-6 space-y-2">
                    {links.map((link) => {
                        const Icon = link.icon;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
                            >
                                <Icon className="w-5 h-5" />
                                <span className="text-sm font-medium">{link.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout Button */}
                <div className="p-4 border-t border-gray-200">
                    <Button
                        variant="outline"
                        className="w-full justify-start gap-2 text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => setShowLogoutDialog(true)}
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </Button>
                </div>
            </aside>

            {/* Logout Confirmation Dialog */}
            <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Logout?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to logout? You'll need to sign in again to access the admin dashboard.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isLoggingOut ? "Logging out..." : "Logout"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
