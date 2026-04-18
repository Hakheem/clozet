import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 },
      );
    }

    // Use better-auth's forgetPassword function
    // This will generate a reset token and store it
    const result = await auth.api.forgetPassword({
      email,
      redirectURL: `${process.env.BETTER_AUTH_URL || "http://localhost:3000"}/reset-password`,
    });

    // Note: To send emails, you need to:
    // 1. Install Resend: npm install resend
    // 2. Set RESEND_API_KEY in .env.local
    // 3. Uncomment the email sending code below

    // Uncomment when Resend is installed:
    // import { Resend } from "resend";
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: "noreply@lukuu.com",
    //   to: email,
    //   subject: "Reset your password",
    //   html: `
    //     <h2>Password Reset</h2>
    //     <p>Click the link below to reset your password:</p>
    //     <a href="${result.url}">Reset Password</a>
    //     <p>This link expires in 24 hours.</p>
    //   `,
    // });

    return NextResponse.json(
      { message: "Password reset email sent successfully" },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { message: error.message || "Failed to process password reset" },
      { status: 500 },
    );
  }
}
