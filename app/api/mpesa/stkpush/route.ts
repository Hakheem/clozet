import { NextResponse } from "next/server";
import { getMpesaToken, formatPhoneNumber } from "@/lib/mpesa";
import axios from "axios";
import { prisma } from "@/lib/prisma"; // Assuming you export prisma from here
import { auth } from "@/lib/auth"; // Better Auth
import { headers } from "next/headers";

export async function POST(req: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { phone, amount, cartItems, deliveryAddressId } = body;

        if (!phone || !amount || !cartItems || cartItems.length === 0) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const formattedPhone = formatPhoneNumber(phone);
        if (!formattedPhone) {
            return NextResponse.json({ error: "Invalid phone number format" }, { status: 400 });
        }

        const accessToken = await getMpesaToken();
        if (!accessToken) {
            return NextResponse.json({ error: "Failed to generate M-Pesa token" }, { status: 500 });
        }

        const environment = process.env.MPESA_ENVIRONMENT || "sandbox";
        const passkey = process.env.MPESA_PASSKEY!;
        const shortcode = process.env.MPESA_SHORTCODE!;
        const callbackUrl = process.env.MPESA_CALLBACK_URL!;

        // Timestamp format: YYYYMMDDHHmmss
        const date = new Date();
        const timestamp =
            date.getFullYear() +
            ("0" + (date.getMonth() + 1)).slice(-2) +
            ("0" + date.getDate()).slice(-2) +
            ("0" + date.getHours()).slice(-2) +
            ("0" + date.getMinutes()).slice(-2) +
            ("0" + date.getSeconds()).slice(-2);

        // Determine transaction type and PartyB based on configuration
        const isTill = process.env.MPESA_BUSINESS_TYPE === "TILL";
        const transactionType = isTill ? "CustomerBuyGoodsOnline" : "CustomerPayBillOnline";
        
        // For Till: BusinessShortCode is the Store Number, PartyB is the Till Number
        // For Paybill: BusinessShortCode and PartyB are both the Paybill Number
        const businessShortCode = process.env.MPESA_SHORTCODE!;
        const password = Buffer.from(`${businessShortCode}${passkey}${timestamp}`).toString("base64");
        const partyB = isTill ? process.env.MPESA_TILL_NUMBER! : businessShortCode;

        const url =
            environment === "live"
                ? "https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
                : "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";

        const response = await axios.post(url, {
            BusinessShortCode: businessShortCode,
            Password: password,
            Timestamp: timestamp,
            TransactionType: transactionType,
            Amount: Math.round(amount),
            PartyA: formattedPhone,
            PartyB: partyB,
            PhoneNumber: formattedPhone,
            CallBackURL: callbackUrl,
            AccountReference: "Lukuu Order",
            TransactionDesc: "Payment for Lukuu items",
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        // If Daraja accepts the request, we create a PENDING order in our DB
        if (response.data.ResponseCode === "0") {
            const checkoutRequestID = response.data.CheckoutRequestID;

            // Create Order
            const newOrder = await prisma.order.create({
                data: {
                    buyerId: session.user.id,
                    total: amount,
                    paymentStatus: "PENDING",
                    checkoutRequestID: checkoutRequestID,
                    phoneNumber: formattedPhone,
                    deliveryAddressId: deliveryAddressId || null,
                    items: {
                        create: cartItems.map((item: any) => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            price: item.discountPrice || item.price,
                        })),
                    },
                },
            });

            return NextResponse.json({
                success: true,
                message: "STK push initiated successfully. Please enter your PIN.",
                checkoutRequestID,
                orderId: newOrder.id,
            });
        }

        return NextResponse.json({ error: "Failed to initiate STK Push", details: response.data }, { status: 400 });
    } catch (error: any) {
        console.error("STK Push Error:", error?.response?.data || error.message);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
