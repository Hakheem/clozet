import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import AuthLeftPanel from "./AuthLeftPanel";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-dm-sans",
}); 

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${cormorant.variable} ${dmSans.variable} flex h-screen w-full overflow-hidden`}
      style={{ background: "#080808", fontFamily: "var(--font-dm-sans)" }}
    >
      {/* Left panel — hidden on mobile */}
      <div className="hidden lg:block lg:w-1/2 h-full relative flex-shrink-0">
        <AuthLeftPanel />
      </div>

      {/* Right panel — full width on mobile, half on lg */}
      <div className="w-full lg:w-1/2 h-full flex flex-col items-center justify-center relative overflow-y-auto">
        {/* Subtle radial glow */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(191,164,122,0.06) 0%, transparent 70%)",
          }}
        />
        {/* Grain overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "128px 128px",
          }}
        />
        <div className="relative z-10 w-full max-w-md px-8 py-10">{children}</div>
      </div>
    </div>
  );
}

