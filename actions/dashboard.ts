"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { startOfMonth, endOfMonth, eachDayOfInterval, format, subDays, startOfDay, endOfDay } from "date-fns";

export async function getAdminDashboardStats() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user?.id || session.user.role !== "ADMIN") {
            return { success: false, error: "Unauthorized" };
        }

        const totalUsers = await prisma.user.count();
        const totalSellers = await prisma.user.count({ where: { role: "SELLER" } });
        const totalProducts = await prisma.product.count();
        const totalOrders = await prisma.order.count();
        const totalRevenue = await prisma.order.aggregate({
            where: { paymentStatus: "COMPLETED" },
            _sum: { total: true }
        });

        // Chart data: Revenue over the last 7 days
        const last7Days = eachDayOfInterval({
            start: subDays(new Date(), 6),
            end: new Date(),
        });

        const revenueData = await Promise.all(last7Days.map(async (day) => {
            const dayRevenue = await prisma.order.aggregate({
                where: {
                    paymentStatus: "COMPLETED",
                    createdAt: {
                        gte: startOfDay(day),
                        lte: endOfDay(day),
                    }
                },
                _sum: { total: true }
            });

            return {
                date: format(day, "MMM dd"),
                revenue: dayRevenue._sum.total || 0,
            };
        }));

        // Chart data: Order status distribution
        const statuses = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED", "DISPUTED"];
        const orderDistribution = await Promise.all(statuses.map(async (status) => {
            const count = await prisma.order.count({
                where: { status: status as any }
            });
            return { name: status, value: count };
        }));

        return {
            success: true,
            stats: {
                totalUsers,
                totalSellers,
                totalProducts,
                totalOrders,
                totalRevenue: totalRevenue._sum.total || 0,
                revenueData,
                orderDistribution
            }
        };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function getSellerDashboardStats() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user?.id || session.user.role !== "SELLER") {
            return { success: false, error: "Unauthorized" };
        }

        const myProductsCount = await prisma.product.count({
            where: { sellerId: session.user.id }
        });

        const myOrderItems = await prisma.orderItem.findMany({
            where: { product: { sellerId: session.user.id } },
            include: { order: true }
        });

        const totalSales = myOrderItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        const ordersCount = new Set(myOrderItems.map(item => item.orderId)).size;

        // Chart data: Sales over last 7 days
        const last7Days = eachDayOfInterval({
            start: subDays(new Date(), 6),
            end: new Date(),
        });

        const salesData = await Promise.all(last7Days.map(async (day) => {
            const items = await prisma.orderItem.findMany({
                where: {
                    product: { sellerId: session.user.id },
                    order: {
                        createdAt: {
                            gte: startOfDay(day),
                            lte: endOfDay(day),
                        }
                    }
                }
            });

            const daySales = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

            return {
                date: format(day, "MMM dd"),
                sales: daySales,
            };
        }));

        return {
            success: true,
            stats: {
                myProductsCount,
                totalSales,
                ordersCount,
                salesData
            }
        };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
