"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function updateProfile(data: {
    name?: string;
    username?: string;
    bio?: string;
    location?: string;
    phoneNumber?: string;
    instagram?: string;
    facebook?: string;
    tiktok?: string;
}) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized" };
        }

        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: {
                ...data,
            },
        });

        revalidatePath("/profile");
        return { success: true, user: updatedUser };
    } catch (error: any) {
        console.error("Profile Update Error:", error);
        return { success: false, error: error.message || "Failed to update profile" };
    }
}

export async function getProfile() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized" };
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: {
                addresses: {
                    orderBy: { isDefault: 'desc' }
                }
            }
        });

        return { success: true, user };
    } catch (error: any) {
        console.error("Get Profile Error:", error);
        return { success: false, error: error.message || "Failed to get profile" };
    }
}
