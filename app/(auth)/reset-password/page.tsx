"use client";

import { useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Eye, EyeOff, Check, X, Loader2, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

const schema = z
  .object({
    password: z
      .string()
      .min(8, "At least 8 characters")
      .regex(/[a-z]/, "One lowercase letter")
      .regex(/[A-Z]/, "One uppercase letter")
      .regex(/[0-9]/, "One number"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const password = watch("password");

  const strengthChecks = [
    { test: (password ?? "").length >= 8, label: "8+ chars" },
    { test: /[a-z]/.test(password ?? ""), label: "Lowercase" },
    { test: /[A-Z]/.test(password ?? ""), label: "Uppercase" },
    { test: /[0-9]/.test(password ?? ""), label: "Number" },
  ];

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: data.password }),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Failed to reset password");
      }
      toast.success("Password reset. Welcome back.");
      router.push("/login");
    } catch (error: any) {
      toast.error(error.message || "Failed to reset password");
    }
  };

  // Invalid token state
  if (!token) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full space-y-6 text-center py-8"
      >
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto"
          style={{ background: "rgba(255,100,100,0.08)", border: "1px solid rgba(255,100,100,0.15)" }}
        >
          <X className="w-7 h-7" style={{ color: "rgba(255,100,100,0.7)" }} />
        </div>
        <div className="space-y-2">
          <h2
            className="text-4xl font-light"
            style={{color: "#EDE8DF" }}
          >
            Link Expired
          </h2>
          <p
            className="text-sm"
            style={{ color: "rgba(237,232,223,0.45)", fontFamily: "var(--font-dm-sans)" }}
          >
            This reset link is invalid or has already been used.
          </p>
        </div>
        <Link href="/forgot-password">
          <button
            className="w-full h-11 rounded-md text-sm font-semibold transition-all duration-200"
            style={{
              background: "linear-gradient(135deg, #EDE8DF 0%, #D4C9B5 100%)",
              color: "#080808",
              
            }}
          >
            Request a new link
          </button>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="w-full space-y-7"
    >
      {/* Back */}
      <motion.div variants={item}>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] transition-colors group"
          style={{ color: "rgba(237,232,223,0.35)", fontFamily: "var(--font-dm-sans)" }}
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
          Back to sign in
        </Link>
      </motion.div>

      {/* Header */}
      <motion.div variants={item} className="space-y-1">
        <p
          className="text-xs uppercase tracking-[0.2em] font-medium mb-2"
          style={{ color: "#BFA47A", fontFamily: "var(--font-dm-sans)" }}
        >
          — New Chapter
        </p>
        <h2
          className="text-5xl font-light leading-none"
          style={{ color: "#EDE8DF" }}
        >
          Set New<br />Password
        </h2>
        <p
          className="text-sm pt-3 leading-relaxed"
          style={{
            color: "rgba(237,232,223,0.45)",
            
            maxWidth: "30ch",
          }}
        >
          Choose a strong password to secure your Lukuu account.
        </p>
      </motion.div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <motion.div variants={item} className="space-y-1.5">
          <label
            className="block text-xs uppercase tracking-[0.15em]"
            style={{ color: "rgba(237,232,223,0.45)", fontFamily: "var(--font-dm-sans)" }}
          >
            New Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register("password")}
              className="w-full h-11 px-4 pr-10 rounded-md text-sm outline-none transition-all duration-200"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: errors.password
                  ? "1px solid rgba(255,100,100,0.5)"
                  : "1px solid rgba(255,255,255,0.08)",
                color: "#EDE8DF",
                
              }}
              onFocus={(e) => {
                if (!errors.password)
                  (e.target as HTMLInputElement).style.border =
                    "1px solid rgba(191,164,122,0.5)";
              }}
              onBlur={(e) => {
                if (!errors.password)
                  (e.target as HTMLInputElement).style.border =
                    "1px solid rgba(255,255,255,0.08)";
              }}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ color: "rgba(237,232,223,0.3)" }}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs" style={{ color: "#FF6B6B" }}>
              {errors.password.message}
            </p>
          )}
          {/* Strength bars */}
          {password && (
            <div className="grid grid-cols-4 gap-1.5 pt-1">
              {strengthChecks.map((check, i) => (
                <div key={i} className="space-y-1">
                  <div
                    className="h-0.5 rounded-full transition-all duration-300"
                    style={{ background: check.test ? "#BFA47A" : "rgba(255,255,255,0.1)" }}
                  />
                  <div className="flex items-center gap-1">
                    {check.test ? (
                      <Check className="h-2.5 w-2.5" style={{ color: "#BFA47A" }} />
                    ) : (
                      <X className="h-2.5 w-2.5" style={{ color: "rgba(255,100,100,0.4)" }} />
                    )}
                    <span
                      className="text-[10px]"
                      style={{
                        color: check.test ? "rgba(191,164,122,0.8)" : "rgba(237,232,223,0.3)",
                        
                      }}
                    >
                      {check.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div variants={item} className="space-y-1.5">
          <label
            className="block text-xs uppercase tracking-[0.15em]"
            style={{ color: "rgba(237,232,223,0.45)", fontFamily: "var(--font-dm-sans)" }}
          >
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="••••••••"
              {...register("confirmPassword")}
              className="w-full h-11 px-4 pr-10 rounded-md text-sm outline-none transition-all duration-200"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: errors.confirmPassword
                  ? "1px solid rgba(255,100,100,0.5)"
                  : "1px solid rgba(255,255,255,0.08)",
                color: "#EDE8DF",
                
              }}
              onFocus={(e) => {
                if (!errors.confirmPassword)
                  (e.target as HTMLInputElement).style.border =
                    "1px solid rgba(191,164,122,0.5)";
              }}
              onBlur={(e) => {
                if (!errors.confirmPassword)
                  (e.target as HTMLInputElement).style.border =
                    "1px solid rgba(255,255,255,0.08)";
              }}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ color: "rgba(237,232,223,0.3)" }}
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-xs" style={{ color: "#FF6B6B" }}>
              {errors.confirmPassword.message}
            </p>
          )}
        </motion.div>

        <motion.div variants={item}>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 rounded-md flex items-center justify-center gap-2 text-sm font-semibold transition-all duration-200 group mt-1"
            style={{
              background: isSubmitting
                ? "rgba(191,164,122,0.4)"
                : "linear-gradient(135deg, #EDE8DF 0%, #D4C9B5 100%)",
              color: "#080808",
              
              letterSpacing: "0.05em",
            }}
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                Reset Password
              </>
            )}
          </button>
        </motion.div> 
      </form>
 
      <motion.p
        variants={item}
        className="text-center text-sm"
        style={{ color: "rgba(237,232,223,0.3)" }}
      >
        Remember your password?{" "}
        <Link href="/login" style={{ color: "#BFA47A" }} className="font-medium">
          Sign in
        </Link>
      </motion.p>
    </motion.div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordContent />
    </Suspense>
  );
} 

