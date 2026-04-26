import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ checkoutRequestID: string }> }
) {
    try {
        const resolvedParams = await params;
        const checkoutRequestID = resolvedParams.checkoutRequestID;

        if (!checkoutRequestID) {
            return NextResponse.json({ error: "Missing checkoutRequestID" }, { status: 400 });
        }

        const order = await prisma.order.findUnique({
            where: { checkoutRequestID },
            select: { paymentStatus: true, status: true },
        });

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        return NextResponse.json({
            paymentStatus: order.paymentStatus,
            status: order.status,
        });
    } catch (error) {
        console.error("Error fetching order status:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
