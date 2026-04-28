"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NotificationType } from "@prisma/client";

export async function createNotification({
    userId,
    type,
    message,
    link,
}: {
    userId: string;
    type: NotificationType;
    message: string;
    link?: string;
}) {
    try {
        const notification = await prisma.notification.create({
            data: {
                userId,
                type,
                message,
                link,
            },
        });
        return { success: true, notification };
    } catch (error: any) {
        console.error("Error creating notification:", error);
        return { success: false, error: error.message };
    }
}

export async function getMyNotifications() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized" };
        }

        const notifications = await prisma.notification.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: "desc" },
        });

        return { success: true, notifications };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function getAllNotifications(roleFilter?: string) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user?.id || session.user.role !== "ADMIN") {
            return { success: false, error: "Unauthorized" };
        }

        const where: any = {};

        // Filter by user role if specified
        if (roleFilter && roleFilter !== "ALL") {
            where.user = { role: roleFilter };
        }

        const notifications = await prisma.notification.findMany({
            where,
            orderBy: { createdAt: "desc" },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                        image: true,
                    },
                },
            },
            take: 200, // Limit to last 200
        });

        return { success: true, notifications };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function markAsRead(notificationId: string) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized" };
        }

        await prisma.notification.update({
            where: { 
                id: notificationId,
                userId: session.user.id // Ensure they own it
            },
            data: { isRead: true },
        });

        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function markAllAsRead() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized" };
        }

        await prisma.notification.updateMany({
            where: { 
                userId: session.user.id,
                isRead: false
            },
            data: { isRead: true },
        });

        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function getUnreadCount() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user?.id) {
            return { success: false, count: 0 };
        }

        const count = await prisma.notification.count({
            where: { 
                userId: session.user.id,
                isRead: false
            },
        });

        return { success: true, count };
    } catch (error: any) {
        return { success: false, count: 0 };
    }
}
