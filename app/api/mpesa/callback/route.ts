import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const text = await req.text();
        if (!text) {
            console.error("Empty callback received");
            return NextResponse.json({ success: true });
        }

        const body = JSON.parse(text);
        
        // Safaricom sends the payload inside Body.stkCallback
        const callbackData = body.Body.stkCallback;
        const checkoutRequestID = callbackData.CheckoutRequestID;
        const resultCode = callbackData.ResultCode;
        
        // Find the pending order 
        const order = await prisma.order.findUnique({
            where: { checkoutRequestID },
            include: { items: { include: { product: true } } },
        });

        if (!order) {
            console.error("Order not found for CheckoutRequestID:", checkoutRequestID);
            return NextResponse.json({ success: true }); 
        }

        if (resultCode === 0) {
            // Payment Successful
            const callbackMetadata = callbackData.CallbackMetadata.Item;
            const receiptItem = callbackMetadata.find((item: any) => item.Name === "MpesaReceiptNumber");
            const receiptNumber = receiptItem ? receiptItem.Value : "UNKNOWN";

            // Update Order and Deduct Stock in a transaction
            await prisma.$transaction(async (tx) => {
                // 1. Update Order
                await tx.order.update({
                    where: { id: order.id },
                    data: {
                        paymentStatus: "COMPLETED",
                        status: "CONFIRMED",
                        mpesaReceiptNumber: receiptNumber,
                    },
                });

                // 2. Deduct Stock
                for (const item of order.items) {
                    await tx.product.update({
                        where: { id: item.productId },
                        data: {
                            totalStock: {
                                decrement: item.quantity
                            }
                        }
                    });
                }

                // 3. Handle Seller Wallet Allocations
                const sellerEarnings = new Map<string, number>();
                for (const item of order.items) {
                    const sellerId = item.product.sellerId;
                    const itemTotal = item.price * item.quantity;
                    sellerEarnings.set(sellerId, (sellerEarnings.get(sellerId) || 0) + itemTotal);
                }

                for (const [sellerId, amount] of sellerEarnings.entries()) {
                    const wallet = await tx.sellerWallet.upsert({
                        where: { sellerId },
                        update: {
                            balance: { increment: amount },
                            lifetimeEarnings: { increment: amount },
                        },
                        create: {
                            sellerId,
                            balance: amount,
                            lifetimeEarnings: amount,
                        },
                    });

                    await tx.sellerWalletTransaction.create({
                        data: {
                            walletId: wallet.id,
                            amount: amount,
                            type: "EARNING",
                            description: `Earnings from Order #${order.id}`,
                            referenceId: order.id,
                        },
                    });
                }
            });

        } else {
            // Payment Failed or Cancelled
            await prisma.order.update({
                where: { id: order.id },
                data: {
                    paymentStatus: "FAILED",
                    status: "CANCELLED",
                    note: callbackData.ResultDesc,
                },
            });
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("M-Pesa Callback Error:", error);
        return NextResponse.json({ success: true });
    }
}
