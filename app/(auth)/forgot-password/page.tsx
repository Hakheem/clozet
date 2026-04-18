"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2, MailCheck } from "lucide-react";
import Link from "next/link";

const schema = z.object({
  email: z.string().email("Invalid email address"),
});
type FormData = z.infer<typeof schema>;

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function ForgotPasswordPage() {
  const [emailSent, setEmailSent] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const email = watch("email");

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to send email");
      setEmailSent(true);
      toast.success("Reset link sent.");
    } catch (error) {
      toast.error("Could not send reset link.");
    }
  };

  if (emailSent) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full space-y-8 text-center py-4"
      >
        <div className="space-y-6">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto"
            style={{ background: "rgba(191,164,122,0.08)", border: "1px solid rgba(191,164,122,0.2)" }}
          >
            <MailCheck className="w-7 h-7" style={{ color: "#BFA47A" }} />
          </div>
          <div className="space-y-2">
            <h3 className="text-4xl font-light title" style={{ color: "#EDE8DF" }}>
              Check your inbox
            </h3>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "rgba(237,232,223,0.45)", maxWidth: "28ch", margin: "0 auto" }}
            >
              We've sent a reset link to <span style={{ color: "#BFA47A" }}>{email}</span>. It expires in 15 minutes.
            </p>
          </div>
        </div>

        <Link href="/login">
          <button
            className="w-full h-11 rounded-lg flex items-center justify-center gap-2 text-sm font-semibold transition-all duration-200 group"
            style={{
              background: "linear-gradient(135deg, #EDE8DF 0%, #D4C9B5 100%)",
              color: "#080808",
              letterSpacing: "0.05em",
            }}
          >
            Return to sign in
          </button>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="w-full space-y-7">
      <motion.div variants={item}>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] transition-colors group"
          style={{ color: "rgba(237,232,223,0.35)" }}
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
          Back to sign in
        </Link>
      </motion.div>

      <motion.div variants={item} className="space-y-1">
        <p className="text-xs uppercase tracking-[0.2em] font-medium mb-2" style={{ color: "#BFA47A" }}>
          — Recovery
        </p>
        <h2 className="text-5xl font-light leading-none title" style={{ color: "#EDE8DF" }}>
          Reset<br />Password
        </h2>
        <p
          className="text-sm pt-3 leading-relaxed"
          style={{ color: "rgba(237,232,223,0.45)", maxWidth: "28ch" }}
        >
          Enter your email and we'll send you instructions to reset your password.
        </p>
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <motion.div variants={item} className="space-y-1.5">
          <label className="block text-xs uppercase tracking-[0.15em]" style={{ color: "rgba(237,232,223,0.45)" }}>
            Email Address
          </label>
          <input
            type="email"
            placeholder="name@example.com"
            {...register("email")}
            className="w-full h-11 px-4 rounded-lg text-sm outline-none transition-all duration-200"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: errors.email ? "1px solid rgba(255,100,100,0.5)" : "1px solid rgba(255,255,255,0.08)",
              color: "#EDE8DF",
            }}
          />
          {errors.email && (
            <p className="text-xs" style={{ color: "#FF6B6B" }}>
              {errors.email.message}
            </p>
          )}
        </motion.div>

        <motion.div variants={item}>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 rounded-lg flex items-center justify-center gap-2 text-sm font-semibold transition-all duration-200 group mt-1"
            style={{
              background: isSubmitting ? "rgba(191,164,122,0.4)" : "linear-gradient(135deg, #EDE8DF 0%, #D4C9B5 100%)",
              color: "#080808",
              letterSpacing: "0.05em",
            }}
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                Send Reset Link
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </button>
        </motion.div>
      </form>
    </motion.div>
  );
}

