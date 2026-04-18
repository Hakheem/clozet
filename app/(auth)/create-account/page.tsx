import { Metadata } from "next";
import SignUpForm from "@/components/auth/SignUpForm";

export const metadata: Metadata = {
  title: "Create Account — Lukuu",
  description: "Join Lukuu and discover exclusive fashion",
};

export default function CreateAccountPage() {
  return <SignUpForm />;
}
