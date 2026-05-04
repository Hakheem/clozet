"use server";

import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

// Fetch orders for the currently logged in buyer
export async function getMyOrders() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const orders = await prisma.order.findMany({
      where: { buyerId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                images: true,
                seller: {
                  select: { shopName: true },
                },
              },
            },
          },
        },
        deliveryAddress: true,
      },
    });

    return { success: true, orders };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Fetch orders containing products sold by the currently logged in seller
export async function getMySellerOrders() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id || session.user.role !== "SELLER") {
      return { success: false, error: "Unauthorized" };
    }

    // We find orders that have AT LEAST ONE item belonging to this seller
    const orders = await prisma.order.findMany({
      where: {
        items: {
          some: {
            product: {
              sellerId: session.user.id,
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      include: {
        buyer: {
          select: { name: true, email: true, phoneNumber: true },
        },
        deliveryAddress: true,
        items: {
          // Only include items that belong to THIS seller
          where: {
            product: {
              sellerId: session.user.id,
            },
          },
          include: {
            product: {
              select: { name: true, images: true },
            },
          },
        },
      },
    });

    return { success: true, orders };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Fetch all orders for the admin
export async function getAllOrders() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        buyer: {
          select: { name: true, email: true },
        },
        deliveryAddress: true,
        items: {
          include: {
            product: {
              select: {
                name: true,
                images: true,
                seller: { select: { shopName: true } },
              },
            },
          },
        },
      },
    });

    return { success: true, orders };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Status hierarchy for revert lock
const STATUS_RANK: Record<string, number> = {
  PENDING: 0,
  CONFIRMED: 1,
  SHIPPED: 2,
  DELIVERED: 3,
};

export async function updateOrderItemStatus(orderItemId: string, status: any) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const orderItem = await prisma.orderItem.findUnique({
      where: { id: orderItemId },
      include: { product: true, order: true },
    });

    if (!orderItem) return { success: false, error: "Item not found" };

    // Authorization: Only the seller of this product or an ADMIN can update status
    const isSeller = orderItem.product.sellerId === session.user.id;
    const isAdmin = session.user.role === "ADMIN";

    if (!isSeller && !isAdmin) {
      return { success: false, error: "Unauthorized" };
    }

    // ── Seller revert restrictions ──
    if (isSeller && !isAdmin) {
      const currentRank = STATUS_RANK[orderItem.status] ?? 0;
      const newRank = STATUS_RANK[status] ?? 0;

      // Check if this is a revert (going backwards in status)
      if (newRank < currentRank) {
        // Sellers can NEVER revert once status has reached SHIPPED or DELIVERED
        if (currentRank >= 2) {
          // SHIPPED or higher
          return {
            success: false,
            error: `Cannot revert status once order has been ${orderItem.status.toLowerCase()}. Only admins can modify locked statuses.`,
          };
        }

        // For PENDING and CONFIRMED (ranks 0-1), enforce 30-minute lock
        const lastUpdated =
          orderItem.statusUpdatedAt || orderItem.order.createdAt;
        const minutesSinceUpdate =
          (Date.now() - new Date(lastUpdated).getTime()) / (1000 * 60);

        if (minutesSinceUpdate > 30) {
          return {
            success: false,
            error: `Cannot revert status after 30 minutes. Status was last updated ${Math.round(minutesSinceUpdate)} minutes ago.`,
          };
        }
      }
    }

    const data: any = { status, statusUpdatedAt: new Date() };
    if (status === "DELIVERED") {
      data.deliveredAt = new Date();
    }

    const updated = await prisma.orderItem.update({
      where: { id: orderItemId },
      data,
    });

    // Notify Buyer
    await createNotification({
      userId: orderItem.order.buyerId,
      type: "ORDER_STATUS_UPDATE",
      message: `Your item '${orderItem.product.name}' is now ${status.toLowerCase()}.`,
      link: `/profile/orders`,
    });

    return { success: true, updated };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function toggleDispute(orderItemId: string, isDisputed: boolean) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const orderItem = await prisma.orderItem.findUnique({
      where: { id: orderItemId },
      include: { order: true, product: true },
    });

    if (!orderItem) return { success: false, error: "Item not found" };

    // Only buyer can dispute, or Admin
    const isBuyer = orderItem.order.buyerId === session.user.id;
    const isAdmin = session.user.role === "ADMIN";

    if (!isBuyer && !isAdmin) {
      return { success: false, error: "Unauthorized" };
    }

    await prisma.orderItem.update({
      where: { id: orderItemId },
      data: {
        isDisputed,
        status: isDisputed ? "DISPUTED" : orderItem.status,
      },
    });

    // Notify Seller and Admin
    const notificationMsg = isDisputed
      ? `Order item for '${orderItem.product.name}' has been disputed by the buyer.`
      : `Dispute for '${orderItem.product.name}' has been resolved.`;

    await createNotification({
      userId: orderItem.product.sellerId,
      type: "ORDER_STATUS_UPDATE",
      message: notificationMsg,
      link: `/seller/orders`,
    });

    const admins = await prisma.user.findMany({ where: { role: "ADMIN" } });
    for (const admin of admins) {
      await createNotification({
        userId: admin.id,
        type: "SYSTEM",
        message: `DISPUTE ALERT: ${notificationMsg}`,
        link: `/admin/orders`,
      });
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

import { createNotification } from "./notifications";
