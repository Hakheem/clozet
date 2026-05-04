"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  subDays,
  startOfDay,
  endOfDay,
} from "date-fns";

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
      _sum: { total: true },
    });

    // Chart data: Revenue over the last 7 days
    const last7Days = eachDayOfInterval({
      start: subDays(new Date(), 6),
      end: new Date(),
    });

    const revenueData = await Promise.all(
      last7Days.map(async (day) => {
        const dayRevenue = await prisma.order.aggregate({
          where: {
            paymentStatus: "COMPLETED",
            createdAt: {
              gte: startOfDay(day),
              lte: endOfDay(day),
            },
          },
          _sum: { total: true },
        });

        return {
          date: format(day, "MMM dd"),
          revenue: dayRevenue._sum.total || 0,
        };
      }),
    );

    // Chart data: Order status distribution
    const statuses = [
      "PENDING",
      "CONFIRMED",
      "SHIPPED",
      "DELIVERED",
      "CANCELLED",
      "DISPUTED",
    ];
    const orderDistribution = await Promise.all(
      statuses.map(async (status) => {
        const count = await prisma.order.count({
          where: { status: status as any },
        });
        return { name: status, value: count };
      }),
    );

    // Recent orders
    const recentOrders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      include: {
        buyer: { select: { name: true, email: true } },
        items: {
          include: {
            product: {
              select: { name: true, seller: { select: { shopName: true } } },
            },
          },
        },
        deliveryAddress: { select: { city: true } },
      },
    });

    // Best-selling products globally
    const bestSellingProducts = await prisma.orderItem.groupBy({
      by: ["productId"],
      _sum: { quantity: true, price: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 10,
    });

    const bestSellingProductDetails = await Promise.all(
      bestSellingProducts.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: {
            id: true,
            name: true,
            price: true,
            images: true,
            seller: { select: { shopName: true } },
          },
        });
        return {
          ...product,
          quantitySold: item._sum.quantity || 0,
          totalRevenue: (item._sum.price || 0) * (item._sum.quantity || 0),
        };
      }),
    );

    return {
      success: true,
      stats: {
        totalUsers,
        totalSellers,
        totalProducts,
        totalOrders,
        totalRevenue: totalRevenue._sum.total || 0,
        revenueData,
        orderDistribution,
        recentOrders,
        bestSellingProducts: bestSellingProductDetails,
      },
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
      where: { sellerId: session.user.id },
    });

    // Only count completed/delivered order items for totalSales
    const deliveredItems = await prisma.orderItem.findMany({
      where: {
        product: { sellerId: session.user.id },
        status: "DELIVERED",
      },
    });

    const totalSales = deliveredItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );

    // All order items for order count
    const allOrderItems = await prisma.orderItem.findMany({
      where: { product: { sellerId: session.user.id } },
      select: { orderId: true },
    });
    const ordersCount = new Set(allOrderItems.map((item) => item.orderId)).size;

    // Wallet stats
    const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000);

    let wallet = await prisma.sellerWallet.findUnique({
      where: { sellerId: session.user.id },
      include: { transactions: true },
    });

    let lifetimeEarnings = 0;
    let availableBalance = 0;
    let pendingEarnings = 0;

    if (wallet) {
      lifetimeEarnings = wallet.lifetimeEarnings;

      // Cleared items (delivered > 48h)
      const clearedItems = await prisma.orderItem.findMany({
        where: {
          product: { sellerId: session.user.id },
          status: "DELIVERED",
          deliveredAt: { lte: cutoff },
        },
      });
      const totalCleared = clearedItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0,
      );
      const payouts = wallet.transactions
        .filter((t) => t.type === "PAYOUT" && t.status !== "FAILED")
        .reduce((acc, t) => acc + t.amount, 0);
      availableBalance = Math.max(0, totalCleared - payouts);

      // Pending items
      const pendingItems = await prisma.orderItem.findMany({
        where: {
          product: { sellerId: session.user.id },
          OR: [
            { status: "DELIVERED", deliveredAt: { gt: cutoff } },
            { status: { in: ["SHIPPED", "CONFIRMED", "PENDING"] } },
          ],
        },
      });
      pendingEarnings = pendingItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0,
      );
    }

    // Chart data: Earnings from DELIVERED orders over last 7 days
    const last7Days = eachDayOfInterval({
      start: subDays(new Date(), 6),
      end: new Date(),
    });

    const salesData = await Promise.all(
      last7Days.map(async (day) => {
        const items = await prisma.orderItem.findMany({
          where: {
            product: { sellerId: session.user.id },
            status: "DELIVERED",
            deliveredAt: {
              gte: startOfDay(day),
              lte: endOfDay(day),
            },
          },
        });

        const daySales = items.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0,
        );

        return {
          date: format(day, "MMM dd"),
          sales: daySales,
        };
      }),
    );

    // Recent seller orders
    const recentSellerOrders = await prisma.order.findMany({
      where: {
        items: {
          some: {
            product: { sellerId: session.user.id },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: {
        buyer: { select: { name: true, email: true, phoneNumber: true } },
        items: {
          where: {
            product: { sellerId: session.user.id },
          },
          include: {
            product: { select: { name: true, images: true } },
          },
        },
        deliveryAddress: { select: { city: true } },
      },
    });

    // Best-selling products for this seller
    const bestSellingItems = await prisma.orderItem.groupBy({
      by: ["productId"],
      _sum: { quantity: true, price: true },
      where: {
        product: { sellerId: session.user.id },
      },
      orderBy: { _sum: { quantity: "desc" } },
      take: 10,
    });

    const bestSellingSellerProducts = await Promise.all(
      bestSellingItems.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: {
            id: true,
            name: true,
            price: true,
            images: true,
          },
        });
        return {
          ...product,
          quantitySold: item._sum.quantity || 0,
          totalRevenue: (item._sum.price || 0) * (item._sum.quantity || 0),
        };
      }),
    );

    return {
      success: true,
      stats: {
        myProductsCount,
        totalSales,
        ordersCount,
        salesData,
        lifetimeEarnings,
        availableBalance,
        pendingEarnings,
        recentSellerOrders,
        bestSellingSellerProducts,
      },
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
