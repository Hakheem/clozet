"use client";

import { signUp, signIn } from "@/lib/auth-client";
import { useState } from "react";
import { Loader2, Eye, EyeOff, Check, X, ArrowRight, ShoppingBag, Store } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import Link from "next/link";

const signUpSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "At least 8 characters")
    .regex(/[a-z]/, "One lowercase letter")
    .regex(/[A-Z]/, "One uppercase letter")
    .regex(/[0-9]/, "One number"),
  role: z.enum(["USER", "SELLER"]),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

function AuthInput({
  id,
  type,
  placeholder,
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean }) {
  return (
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      {...props}
      className="w-full h-10 px-3.5 rounded-lg text-sm outline-none transition-all duration-200"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: error ? "1px solid rgba(255,100,100,0.5)" : "1px solid rgba(255,255,255,0.08)",
        color: "#EDE8DF",
        fontFamily: "var(--font-dm-sans)",
      }}
    />
  );
}

export default function SignUpForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: "", email: "", password: "", role: "USER" },
  });

  const password = watch("password");
  const role = watch("role");

  const strengthChecks = [
    { test: (password ?? "").length >= 8, label: "8+ characters" },
    { test: /[a-z]/.test(password ?? ""), label: "Lowercase" },
    { test: /[A-Z]/.test(password ?? ""), label: "Uppercase" },
    { test: /[0-9]/.test(password ?? ""), label: "Number" },
  ];

  const onSubmit = async (data: SignUpFormData) => {
    try {
      const { error } = await signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
      });
      if (error) throw new Error(error.message);

      if (data.role === "SELLER") {
        const roleRes = await fetch("/api/update-profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: "SELLER" }),
        });
        if (!roleRes.ok) throw new Error("Failed to set seller role");
        toast.success("Account created! Complete your seller profile.");
        router.push("/seller/onboarding");
      } else {
        toast.success("Welcome to Lukuu.");
        router.push("/");
      }
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to create account");
    }
  };

  const signUpWithGoogle = async () => {
    try {
      await signIn.social({
        provider: "google",
        callbackURL: role === "SELLER" ? "/seller/onboarding" : "/",
      });
    } catch {
      toast.error("Failed to sign up with Google.");
    }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="w-full space-y-5"
    >
      <motion.div variants={item} className="space-y-1">
        <p
          className="text-xs uppercase tracking-[0.2em] font-medium mb-2"
          style={{ color: "#BFA47A", fontFamily: "var(--font-dm-sans)" }}
        >
          — Join Lukuu
        </p>
        <h2
          className="text-5xl font-light leading-none title"
          style={{ color: "#EDE8DF" }}
        >
          Create Account
        </h2>
      </motion.div>

      <motion.div variants={item}>
        <p
          className="text-xs uppercase tracking-[0.15em] mb-2"
          style={{ color: "rgba(237,232,223,0.45)", fontFamily: "var(--font-dm-sans)" }}
        >
          I am joining as
        </p>
        <div className="grid grid-cols-2 gap-2">
          {(["USER", "SELLER"] as const).map((r) => {
            const isSelected = role === r;
            return (
              <label
                key={r}
                className="relative flex items-center gap-2.5 h-10 px-3.5 rounded-lg cursor-pointer transition-all duration-200"
                style={{
                  background: isSelected ? "rgba(191,164,122,0.12)" : "rgba(255,255,255,0.03)",
                  border: isSelected
                    ? "1px solid rgba(191,164,122,0.4)"
                    : "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <input
                  type="radio"
                  value={r}
                  {...register("role")}
                  className="sr-only"
                />
                {r === "USER" ? (
                  <ShoppingBag
                    className="w-3.5 h-3.5 flex-shrink-0"
                    style={{ color: isSelected ? "#BFA47A" : "rgba(237,232,223,0.35)" }}
                  />
                ) : (
                  <Store
                    className="w-3.5 h-3.5 flex-shrink-0"
                    style={{ color: isSelected ? "#BFA47A" : "rgba(237,232,223,0.35)" }}
                  />
                )}
                <span
                  className="text-sm font-medium"
                  style={{
                    color: isSelected ? "#EDE8DF" : "rgba(237,232,223,0.45)",
                    fontFamily: "var(--font-dm-sans)",
                  }}
                >
                  {r === "USER" ? "Buyer" : "Seller"}
                </span>
              </label>
            );
          })}
        </div>
      </motion.div>

      <motion.button
        variants={item}
        type="button"
        onClick={signUpWithGoogle}
        className="w-full flex items-center justify-center gap-3 h-10 rounded-lg transition-all duration-200 text-sm font-medium"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          color: "#EDE8DF",
          fontFamily: "var(--font-dm-sans)",
        }}
      >
        <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
        Continue with Google
      </motion.button>

      <motion.div variants={item} className="flex items-center gap-4">
        <span className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
        <span
          className="text-xs uppercase tracking-[0.15em]"
          style={{ color: "rgba(237,232,223,0.3)", fontFamily: "var(--font-dm-sans)" }}
        >
          or
        </span>
        <span className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <motion.div variants={item} className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label
              className="block text-xs uppercase tracking-[0.12em]"
              style={{ color: "rgba(237,232,223,0.45)", fontFamily: "var(--font-dm-sans)" }}
            >
              Full Name
            </label>
            <AuthInput
              id="name"
              type="text"
              placeholder="Your name"
              error={!!errors.name}
              {...register("name")}
            />
          </div>
          <div className="space-y-1.5">
            <label
              className="block text-xs uppercase tracking-[0.12em]"
              style={{ color: "rgba(237,232,223,0.45)", fontFamily: "var(--font-dm-sans)" }}
            >
              Email
            </label>
            <AuthInput
              id="email"
              type="email"
              placeholder="you@example.com"
              error={!!errors.email}
              {...register("email")}
            />
          </div>
        </motion.div>

        <motion.div variants={item} className="space-y-1.5">
          <label
            className="block text-xs uppercase tracking-[0.12em]"
            style={{ color: "rgba(237,232,223,0.45)", fontFamily: "var(--font-dm-sans)" }}
          >
            Password
          </label>
          <div className="relative">
            <AuthInput
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              error={!!errors.password}
              style={{ paddingRight: "2.5rem" }}
              {...register("password")}
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
          {password && (
            <div className="grid grid-cols-4 gap-1.5 pt-1">
              {strengthChecks.map((check, i) => (
                <div key={i} className="space-y-1">
                  <div
                    className="h-0.5 rounded-full transition-all duration-300"
                    style={{
                      background: check.test
                        ? "#BFA47A"
                        : "rgba(255,255,255,0.1)",
                    }}
                  />
                  <div className="flex items-center gap-1">
                    {check.test ? (
                      <Check className="h-2.5 w-2.5" style={{ color: "#BFA47A" }} />
                    ) : (
                      <X className="h-2.5 w-2.5" style={{ color: "rgba(255,100,100,0.5)" }} />
                    )}
                    <span
                      className="text-[10px]"
                      style={{
                        color: check.test
                          ? "rgba(191,164,122,0.8)"
                          : "rgba(237,232,223,0.3)",
                        fontFamily: "var(--font-dm-sans)",
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

        <motion.div variants={item}>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 rounded-lg flex items-center justify-center gap-2 text-sm font-semibold transition-all duration-200 group mt-1"
            style={{
              background: isSubmitting
                ? "rgba(191,164,122,0.5)"
                : "linear-gradient(135deg, #EDE8DF 0%, #D4C9B5 100%)",
              color: "#080808",
              fontFamily: "var(--font-dm-sans)",
              letterSpacing: "0.05em",
            }}
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                Create Account
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </button>
        </motion.div>
      </form>

      <motion.div variants={item} className="space-y-3">
        <p
          className="text-center text-sm"
          style={{ color: "rgba(237,232,223,0.35)", fontFamily: "var(--font-dm-sans)" }}
        >
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium"
            style={{ color: "#BFA47A" }}
          >
            Sign in
          </Link>
        </p>
        <p
          className="text-center text-xs"
          style={{ color: "rgba(237,232,223,0.2)", fontFamily: "var(--font-dm-sans)" }}
        >
          By creating an account, you agree to our{" "}
          <Link href="/terms" className="underline underline-offset-2">Terms</Link> &{" "}
          <Link href="/privacy" className="underline underline-offset-2">Privacy Policy</Link>
        </p>
      </motion.div>
    </motion.div>
  );
}

