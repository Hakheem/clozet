"use client";

import Container from "@/components/layout/Container";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, MapPin, ShoppingBag, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { authClient, useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useEffect } from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const navItems = [
    { name: "My Profile", href: "/profile", icon: User },
    { name: "Delivery Addresses", href: "/profile/addresses", icon: MapPin },
    { name: "Order History", href: "/profile/orders", icon: ShoppingBag },
];

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { data: session, isPending } = useSession();

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!isPending && !session) {
            router.push("/login");
        }
    }, [isPending, session, router]);

    const handleSignOut = async () => {
        await authClient.signOut();
        toast.success("Signed out successfully");
        router.push("/login");
    };

    return (
        <Container className="py-12">
            <div className="flex flex-col md:flex-row gap-8 lg:gap-12 w-full max-w-6xl mx-auto">
                
                {/* Sidebar */}
                <aside className="w-full md:w-64 shrink-0">
                    <div className="sticky top-32 space-y-6">
                        <div>
                            <h2 className="text-2xl font-light title tracking-tight mb-6">Account</h2>
                            <nav className="flex flex-col space-y-1">
                                {navItems.map((item) => {
                                    const isActive = pathname === item.href;
                                    const Icon = item.icon;
                                    return (
                                        <Link 
                                            key={item.href} 
                                            href={item.href}
                                            className={cn(
                                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-sm font-medium",
                                                isActive 
                                                    ? "bg-primary text-white shadow-md shadow-primary/10" 
                                                    : "text-muted-foreground hover:bg-accent/5 hover:text-primary"
                                            )}
                                        >
                                            <Icon className={cn("w-4 h-4", isActive ? "text-white" : "text-muted-foreground")} />
                                            {item.name}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>

                        <div className="pt-6 border-t border-border/50">
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <button 
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-sm font-medium text-red-500 hover:bg-red-50 w-full text-left cursor-pointer"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Sign Out
                                    </button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="rounded-2xl border-border/40">
                                    <AlertDialogHeader>
                                        <AlertDialogTitle className="title text-xl">Sign Out</AlertDialogTitle>
                                        <AlertDialogDescription className="text-sm text-muted-foreground">
                                            Are you sure you want to sign out of your account? You will need to log in again to access your orders and profile.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter className="gap-3">
                                        <AlertDialogCancel className="rounded-xl border-border/50 text-xs font-bold uppercase tracking-widest h-11 px-6">Cancel</AlertDialogCancel>
                                        <AlertDialogAction 
                                            onClick={handleSignOut}
                                            className="rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-bold uppercase tracking-widest h-11 px-6 border-none shadow-lg shadow-red-500/20"
                                        >
                                            Sign Out
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 min-w-0">
                    <div className="bg-white border border-border/40 rounded-3xl p-6 md:p-8 shadow-sm">
                        {children}
                    </div>
                </main>

            </div>
        </Container>
    );
}
