"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function getUnreadNotificationCount() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user?.id) {
            return { success: true, count: 0 };
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
