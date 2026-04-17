import LoginForm from "@/components/auth/LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - Kulture",
  description: "Sign in to your Kulture account",
};

export default function LoginPage() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      {/* Left side Image Pane */}
      <div className="relative hidden w-1/2 lg:block">
        <div 
          className="absolute inset-0 bg-zinc-900 bg-cover bg-center"
          style={{ backgroundImage: 'url("/login-bg.jpg")' }}
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40" />
        
        {/* Text Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-12 text-white">
          <div className="space-y-4 max-w-lg mb-8">
            <h1 className="text-4xl font-bold font-title uppercase tracking-wide">
              Define Your Culture
            </h1>
            <p className="text-lg text-zinc-300">
              Join Kulture to discover exclusive streetwear, contemporary pieces, and independent vendors defining modern fashion.
            </p>
          </div>
        </div>
      </div>

      {/* Right side Form Pane */}
      <div className="flex w-full lg:w-1/2 flex-col items-center justify-center bg-zinc-50 relative">
        <div className="w-full max-w-md px-8 py-8 lg:p-0 h-full flex flex-col justify-center">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
