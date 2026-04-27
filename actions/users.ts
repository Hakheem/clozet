"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function getAllUsers() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user?.id || session.user.role !== "ADMIN") {
            return { success: false, error: "Unauthorized" };
        }

        const users = await prisma.user.findMany({
            orderBy: { createdAt: "desc" },
        });

        return { success: true, users };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function updateUserRole(userId: string, role: string) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user?.id || session.user.role !== "ADMIN") {
            return { success: false, error: "Unauthorized" };
        }

        const user = await prisma.user.update({
            where: { id: userId },
            data: { role },
        });

        return { success: true, user };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteUser(userId: string) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user?.id || session.user.role !== "ADMIN") {
            return { success: false, error: "Unauthorized" };
        }

        await prisma.user.delete({
            where: { id: userId },
        });

        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
