import { Metadata } from "next";
import SignInForm from "@/components/auth/SignInForm";

export const metadata: Metadata = {
  title: "Sign In — Lukuu",
  description: "Sign in to your Lukuu account",
};

export default function LoginPage() {
  return <SignInForm />;
}

