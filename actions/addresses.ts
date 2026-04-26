"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function getAddresses() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized" };
        }

        const addresses = await prisma.address.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: "asc" },
        });

        return { success: true, addresses };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function addAddress(data: {
    title: string;
    county: string;
    city: string;
    street: string;
    details?: string;
}) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized" };
        }

        const userId = session.user.id;

        // Check current count
        const count = await prisma.address.count({ where: { userId } });
        if (count >= 3) {
            return { success: false, error: "Maximum of 3 addresses allowed." };
        }

        // If it's the first address, make it default
        const isDefault = count === 0;

        const newAddress = await prisma.address.create({
            data: {
                ...data,
                userId,
                isDefault,
            },
        });

        revalidatePath("/profile/addresses");
        revalidatePath("/checkout");
        return { success: true, address: newAddress };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function updateAddress(id: string, data: {
    title?: string;
    county?: string;
    city?: string;
    street?: string;
    details?: string;
}) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized" };
        }

        const updatedAddress = await prisma.address.update({
            where: { id, userId: session.user.id },
            data,
        });

        revalidatePath("/profile/addresses");
        revalidatePath("/checkout");
        return { success: true, address: updatedAddress };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteAddress(id: string) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized" };
        }

        const userId = session.user.id;

        // Check if the address being deleted is the default
        const addressToDelete = await prisma.address.findUnique({
            where: { id, userId },
        });

        if (!addressToDelete) {
             return { success: false, error: "Address not found" };
        }

        await prisma.address.delete({
            where: { id, userId },
        });

        // If we deleted the default, set another one to default if it exists
        if (addressToDelete.isDefault) {
            const nextAddress = await prisma.address.findFirst({
                where: { userId },
                orderBy: { createdAt: "asc" },
            });

            if (nextAddress) {
                await prisma.address.update({
                    where: { id: nextAddress.id },
                    data: { isDefault: true },
                });
            }
        }

        revalidatePath("/profile/addresses");
        revalidatePath("/checkout");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function setDefaultAddress(id: string) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized" };
        }

        const userId = session.user.id;

        await prisma.$transaction(async (tx) => {
            // Unset current default
            await tx.address.updateMany({
                where: { userId, isDefault: true },
                data: { isDefault: false },
            });

            // Set new default
            await tx.address.update({
                where: { id, userId },
                data: { isDefault: true },
            });
        });

        revalidatePath("/profile/addresses");
        revalidatePath("/checkout");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
