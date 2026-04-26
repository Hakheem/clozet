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
                                    select: { shopName: true }
                                }
                            }
                        }
                    }
                },
                deliveryAddress: true,
            }
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
                            sellerId: session.user.id
                        }
                    }
                }
            },
            orderBy: { createdAt: "desc" },
            include: {
                buyer: {
                    select: { name: true, email: true, phoneNumber: true }
                },
                deliveryAddress: true,
                items: {
                    // Only include items that belong to THIS seller
                    where: {
                        product: {
                            sellerId: session.user.id
                        }
                    },
                    include: {
                        product: {
                            select: { name: true, images: true }
                        }
                    }
                }
            }
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
                    select: { name: true, email: true }
                },
                deliveryAddress: true,
                items: {
                    include: {
                        product: {
                            select: { name: true, images: true, seller: { select: { shopName: true } } }
                        }
                    }
                }
            }
        });

        return { success: true, orders };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
