import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        
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
            return NextResponse.json({ success: true }); // Always return 200 to Safaricom to acknowledge receipt
        }

        if (resultCode === 0) {
            // Payment Successful
            const callbackMetadata = callbackData.CallbackMetadata.Item;
            const receiptItem = callbackMetadata.find((item: any) => item.Name === "MpesaReceiptNumber");
            const receiptNumber = receiptItem ? receiptItem.Value : "UNKNOWN";

            // Update Order
            await prisma.order.update({
                where: { id: order.id },
                data: {
                    paymentStatus: "COMPLETED",
                    status: "CONFIRMED",
                    mpesaReceiptNumber: receiptNumber,
                },
            });

            // Handle Seller Wallet Allocations
            // We group items by sellerId and update their wallets
            const sellerEarnings = new Map<string, number>();
            for (const item of order.items) {
                const sellerId = item.product.sellerId;
                const itemTotal = item.price * item.quantity;
                sellerEarnings.set(sellerId, (sellerEarnings.get(sellerId) || 0) + itemTotal);
            }

            for (const [sellerId, amount] of sellerEarnings.entries()) {
                // Upsert wallet (create if doesn't exist)
                const wallet = await prisma.sellerWallet.upsert({
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

                // Create transaction record
                await prisma.sellerWalletTransaction.create({
                    data: {
                        walletId: wallet.id,
                        amount: amount,
                        type: "EARNING",
                        description: `Earnings from Order #${order.id}`,
                        referenceId: order.id,
                    },
                });
            }

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
        return NextResponse.json({ success: true }); // Still return 200 so Daraja doesn't retry endlessly
    }
}
