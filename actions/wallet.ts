"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { WalletTransactionType, WalletTransactionStatus, NotificationType } from "@prisma/client";
import { createNotification } from "./notifications";

export async function getSellerWalletStats() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user?.id || session.user.role !== "SELLER") {
            return { success: false, error: "Unauthorized" };
        }

        // Find or create wallet
        let wallet = await prisma.sellerWallet.findUnique({
            where: { sellerId: session.user.id },
            include: {
                transactions: {
                    orderBy: { createdAt: "desc" },
                }
            }
        });

        if (!wallet) {
            wallet = await prisma.sellerWallet.create({
                data: { sellerId: session.user.id },
                include: {
                    transactions: true
                }
            });
        }

        // Calculate dynamic balances
        // 48 hours ago
        const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000);

        // All order items that are delivered and older than 48 hours
        const clearedItems = await prisma.orderItem.findMany({
            where: {
                product: { sellerId: session.user.id },
                status: "DELIVERED",
                deliveredAt: { lte: cutoff },
                // Make sure this earning hasn't been "withdrawn" yet? 
                // Actually, balance should be updated when an order is cleared.
            }
        });

        // For simplicity in this demo, we'll calculate available balance as:
        // sum(DELIVERED items > 48h) - sum(PAYOUT transactions)
        
        const totalEarnings = clearedItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        
        const payouts = wallet.transactions
            .filter(t => t.type === "PAYOUT" && t.status !== "FAILED")
            .reduce((acc, t) => acc + t.amount, 0);

        const availableBalance = Math.max(0, totalEarnings - payouts);

        // Pending balance: items delivered within 48 hours OR shipped/confirmed items
        const pendingItems = await prisma.orderItem.findMany({
            where: {
                product: { sellerId: session.user.id },
                OR: [
                    { status: "DELIVERED", deliveredAt: { gt: cutoff } },
                    { status: { in: ["SHIPPED", "CONFIRMED", "PENDING"] } }
                ]
            }
        });

        const pendingBalance = pendingItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

        return { 
            success: true, 
            stats: {
                availableBalance,
                pendingBalance,
                lifetimeEarnings: wallet.lifetimeEarnings,
                transactions: wallet.transactions
            } 
        };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function requestPayout(amount: number) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user?.id || session.user.role !== "SELLER") {
            return { success: false, error: "Unauthorized" };
        }

        if (amount < 700) {
            return { success: false, error: "Minimum payout is 700 KES" };
        }

        const statsResult = await getSellerWalletStats();
        if (!statsResult.success || !statsResult.stats) {
            return { success: false, error: "Could not verify balance" };
        }

        if (amount > statsResult.stats.availableBalance) {
            return { success: false, error: "Insufficient available balance" };
        }

        const wallet = await prisma.sellerWallet.findUnique({
            where: { sellerId: session.user.id }
        });

        if (!wallet) return { success: false, error: "Wallet not found" };

        const transaction = await prisma.sellerWalletTransaction.create({
            data: {
                walletId: wallet.id,
                amount,
                type: "PAYOUT",
                status: "PENDING",
                description: `Payout request of ${amount} KES`
            }
        });

        // Notify Admin
        const admins = await prisma.user.findMany({ where: { role: "ADMIN" } });
        for (const admin of admins) {
            await createNotification({
                userId: admin.id,
                type: "PAYOUT_REQUEST",
                message: `Seller ${session.user.name} requested a payout of ${amount} KES`,
                link: `/admin/payouts`
            });
        }

        return { success: true, transaction };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

// Admin action to fulfill payout
export async function fulfillPayout(transactionId: string, success: boolean, message?: string) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user?.id || session.user.role !== "ADMIN") {
            return { success: false, error: "Unauthorized" };
        }

        const transaction = await prisma.sellerWalletTransaction.findUnique({
            where: { id: transactionId },
            include: { wallet: { include: { seller: true } } }
        });

        if (!transaction) return { success: false, error: "Transaction not found" };

        const updatedTransaction = await prisma.sellerWalletTransaction.update({
            where: { id: transactionId },
            data: {
                status: success ? "COMPLETED" : "FAILED",
                transactionMessage: message,
            }
        });

        // Notify Seller
        await createNotification({
            userId: transaction.wallet.sellerId,
            type: success ? "PAYOUT_SUCCESS" : "PAYOUT_FAILED",
            message: success 
                ? `Your payout of ${transaction.amount} KES was successful. ${message || ""}`
                : `Your payout of ${transaction.amount} KES failed. Reason: ${message || ""}`,
            link: `/seller/earnings`
        });

        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function getAllPayoutRequests() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user?.id || session.user.role !== "ADMIN") {
            return { success: false, error: "Unauthorized" };
        }

        const requests = await prisma.sellerWalletTransaction.findMany({
            where: { type: "PAYOUT" },
            include: {
                wallet: {
                    include: {
                        seller: {
                            select: { name: true, email: true, shopName: true, payoutMethod: true, payoutDetails: true }
                        }
                    }
                }
            },
            orderBy: { createdAt: "desc" }
        });

        return { success: true, requests };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
