"use client";

import { signIn } from "@/lib/auth-client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isRegistering) {
        // We will add custom signUp logic if needed, but for now Better Auth handles signups dynamically during signin if properly configured, or we explicitly use signUp
        const { data, error } = await signIn.email({
            email,
            password,
        });
        if (error) throw new Error(error.message);
        toast.success("Successfully logged in!");
        router.push("/");
        router.refresh();
      } else {
        const { data, error } = await signIn.email({
          email,
          password,
        });
        if (error) throw new Error(error.message);
        toast.success("Successfully logged in!");
        router.push("/");
        router.refresh();
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred during authentication.");
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch (error: any) {
      toast.error("Failed to sign in with Google.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="max-w-md w-full mx-auto bg-white border border-gray-200 shadow-[0px_4px_24px_rgba(0,0,0,0.04)] rounded-2xl p-8"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold font-title tracking-tight text-zinc-900">
          {isRegistering ? "Create Account" : "Welcome Back"}
        </h2>
        <p className="text-muted-foreground mt-2 text-sm">
          {isRegistering
            ? "Sign up to join Kulture"
            : "Enter your credentials to access your account"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-zinc-600">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="pl-10 h-12 bg-zinc-50 border-zinc-200 focus-visible:ring-zinc-900"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-zinc-600">Password</Label>
            {!isRegistering && (
              <a href="#" className="text-xs text-zinc-500 hover:text-zinc-900 transition-colors">
                Forgot password?
              </a>
            )}
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="pl-10 h-12 bg-zinc-50 border-zinc-200 focus-visible:ring-zinc-900"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-12 bg-zinc-900 hover:bg-zinc-800 text-white transition-all duration-300"
          disabled={isLoading}
        >
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Loader2 className="w-5 h-5 animate-spin" />
              </motion.div>
            ) : (
              <motion.span
                key="text"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {isRegistering ? "Create Account" : "Sign In"}
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </form>

      <div className="mt-8 relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-muted-foreground tracking-wider font-medium">Or continue with</span>
        </div>
      </div>

      <div className="mt-8">
        <Button
          variant="outline"
          className="w-full h-12 border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-900 transition-colors"
          onClick={signInWithGoogle}
        >
          <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Sign in with Google
        </Button>
      </div>

      <div className="mt-8 text-center text-sm text-zinc-600">
        {isRegistering ? "Already have an account?" : "Don't have an account?"}{" "}
        <button
          onClick={() => setIsRegistering(!isRegistering)}
          className="text-zinc-900 font-semibold hover:underline"
        >
          {isRegistering ? "Sign In" : "Sign Up"}
        </button>
      </div>
    </motion.div>
  );
}
