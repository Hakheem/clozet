"use client";

import { signIn } from "@/lib/auth-client";
import { useState } from "react";
import { Loader2, Eye, EyeOff, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import Link from "next/link";

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type SignInFormData = z.infer<typeof signInSchema>;

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function SignInForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: SignInFormData) => {
    try {
      const { error } = await signIn.email({
        email: data.email,
        password: data.password,
      });
      if (error) throw new Error(error.message);
      toast.success("Welcome back.");
      router.push("/");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in");
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signIn.social({ provider: "google", callbackURL: "/" });
    } catch {
      toast.error("Failed to sign in with Google.");
    }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="w-full space-y-7"
    >
      <motion.div variants={item} className="space-y-1">
        <p
          className="text-xs uppercase tracking-[0.2em] font-medium mb-3"
          style={{ color: "#BFA47A", fontFamily: "var(--font-dm-sans)" }}
        >
          — Welcome back
        </p>
        <h2
          className="text-5xl font-light leading-none title"
          style={{ color: "#EDE8DF" }}
        >
          Sign In
        </h2>
      </motion.div>

      <motion.button
        variants={item}
        type="button"
        onClick={signInWithGoogle}
        className="w-full flex items-center justify-center gap-3 h-11 rounded-lg transition-all duration-200 text-sm font-medium"
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <motion.div variants={item} className="space-y-1.5">
          <label
            htmlFor="email"
            className="block text-xs uppercase tracking-[0.15em]"
            style={{ color: "rgba(237,232,223,0.45)", fontFamily: "var(--font-dm-sans)" }}
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            {...register("email")}
            className="w-full h-11 px-4 rounded-lg text-sm outline-none transition-all duration-200"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: errors.email
                ? "1px solid rgba(255,100,100,0.5)"
                : "1px solid rgba(255,255,255,0.08)",
              color: "#EDE8DF",
              fontFamily: "var(--font-dm-sans)",
            }}
          />
          {errors.email && (
            <p className="text-xs" style={{ color: "#FF6B6B" }}>
              {errors.email.message}
            </p>
          )}
        </motion.div>

        <motion.div variants={item} className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="block text-xs uppercase tracking-[0.15em]"
              style={{ color: "rgba(237,232,223,0.45)", fontFamily: "var(--font-dm-sans)" }}
            >
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs transition-colors"
              style={{ color: "#BFA47A", fontFamily: "var(--font-dm-sans)" }}
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register("password")}
              className="w-full h-11 px-4 pr-10 rounded-lg text-sm outline-none transition-all duration-200"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: errors.password
                  ? "1px solid rgba(255,100,100,0.5)"
                  : "1px solid rgba(255,255,255,0.08)",
                color: "#EDE8DF",
                fontFamily: "var(--font-dm-sans)",
              }}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
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
        </motion.div>

        <motion.div variants={item}>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 rounded-lg flex items-center justify-center gap-2 text-sm font-semibold transition-all duration-200 mt-2 group"
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
                Sign In
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </button>
        </motion.div>
      </form>

      <motion.p
        variants={item}
        className="text-center text-sm"
        style={{ color: "rgba(237,232,223,0.35)", fontFamily: "var(--font-dm-sans)" }}
      >
        New to Lukuu?{" "}
        <Link
          href="/create-account"
          className="font-medium transition-colors"
          style={{ color: "#BFA47A" }}
        >
          Create an account
        </Link>
      </motion.p>

      <motion.p
        variants={item}
        className="text-center text-xs"
        style={{ color: "rgba(237,232,223,0.2)", fontFamily: "var(--font-dm-sans)" }}
      >
        By continuing, you agree to our{" "}
        <Link href="/terms" className="underline underline-offset-2">
          Terms
        </Link>{" "}
        &{" "}
        <Link href="/privacy" className="underline underline-offset-2">
          Privacy Policy
        </Link>
      </motion.p>
    </motion.div>
  );
}

