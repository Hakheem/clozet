import axios from "axios";

export const getMpesaToken = async (): Promise<string | null> => {
    const consumerKey = process.env.MPESA_CONSUMER_KEY;
    const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
    const environment = process.env.MPESA_ENVIRONMENT || "sandbox";

    if (!consumerKey || !consumerSecret) {
        console.error("Missing M-Pesa credentials in environment variables");
        return null;
    }

    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");
    const url =
        environment === "live"
            ? "https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
            : "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";

    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Basic ${auth}`,
            },
        });
        return response.data.access_token;
    } catch (error: any) {
        console.error("M-Pesa Access Token Error:", error?.response?.data || error.message);
        return null;
    }
};

export const formatPhoneNumber = (phone: string): string | null => {
    // Basic formatting to convert 07... to 2547...
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.startsWith("0")) {
        return `254${cleaned.slice(1)}`;
    }
    if (cleaned.startsWith("254")) {
        return cleaned;
    }
    return null;
};
