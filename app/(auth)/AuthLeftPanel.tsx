"use client";

import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

type PanelConfig = {
  image: string;
  eyebrow: string;
  headline: string;
  sub: string;
  tag: string;
};

const PANELS: Record<string, PanelConfig> = {
  "/login": {
    image: "/auth/login-bg.jpg",
    eyebrow: "Members Only",
    headline: "Your Style,\nContinued.",
    sub: "Step back into a world of curated fashion, exclusive drops, and independent voices.",
    tag: "Streetwear · Contemporary · Editorial",
  },
  "/create-account": {
    image: "/auth/signup-bg.jpg",
    eyebrow: "Join the Movement",
    headline: "Dress the\nWorld.",
    sub: "Connect with independent vendors redefining modern style — one piece at a time.",
    tag: "Apparels · Bags · Shoes · Accessories",
  },
  "/forgot-password": {
    image: "/auth/forgot-bg.jpg",
    eyebrow: "Account Recovery",
    headline: "Back in\nFashion.",
    sub: "Even the best collections need a reset. Let's get you back to your wardrobe.",
    tag: "We've got you covered",
  },
  "/reset-password": {
    image: "/auth/reset-bg.jpg",
    eyebrow: "New Chapter",
    headline: "Fresh\nStart.",
    sub: "A new password, a clean slate. Your style journey continues from here.",
    tag: "Almost there — keep going",
  },
};

const FALLBACK_GRADIENTS: Record<string, string> = {
  "/login":
    "linear-gradient(135deg, #1a0f00 0%, #2d1a05 35%, #0d0d0d 100%)",
  "/create-account":
    "linear-gradient(135deg, #0d1a0d 0%, #1a2d1a 35%, #0d0d0d 100%)",
  "/forgot-password":
    "linear-gradient(135deg, #0d0d1a 0%, #1a1a2d 35%, #0d0d0d 100%)",
  "/reset-password":
    "linear-gradient(135deg, #1a0d0d 0%, #2d1a1a 35%, #0d0d0d 100%)",
};

export default function AuthLeftPanel() {
  const pathname = usePathname();
  const config = PANELS[pathname] ?? PANELS["/login"];
  const fallbackGradient =
    FALLBACK_GRADIENTS[pathname] ?? FALLBACK_GRADIENTS["/login"];

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Background image with fallback gradient */}
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
          style={{
            backgroundImage: `url("${config.image}"), ${fallbackGradient}`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </AnimatePresence>

      {/* Multi-layer overlay for editorial depth */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0.55) 100%)",
        }}
      />
      {/* Warm tint */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background:
            "linear-gradient(135deg, rgba(191,164,122,0.2) 0%, transparent 60%)",
        }}
      />
      {/* Grain */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-between h-full p-12">
        {/* Brand mark */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <span
            className="text-2xl font-bold tracking-[0.25em] uppercase"
            style={{
              fontFamily: "var(--font-cormorant)",
              color: "#EDE8DF",
              letterSpacing: "0.3em",
            }}
          >
            Lukuu
          </span>
        </motion.div>

        {/* Editorial text block */}
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="space-y-5 max-w-sm"
          >
            {/* Eyebrow */}
            <div className="flex items-center gap-3">
              <span
                className="block w-8 h-px"
                style={{ background: "#BFA47A" }}
              />
              <span
                className="text-xs uppercase tracking-[0.2em] font-medium"
                style={{ color: "#BFA47A", fontFamily: "var(--font-dm-sans)" }}
              >
                {config.eyebrow}
              </span>
            </div>

            {/* Headline */}
            <h1
              className="text-6xl font-light leading-none"
              style={{
                fontFamily: "var(--font-cormorant)",
                color: "#EDE8DF",
                whiteSpace: "pre-line",
                lineHeight: "1.02",
              }}
            >
              {config.headline}
            </h1>

            {/* Divider */}
            <div
              className="w-12 h-px"
              style={{ background: "rgba(237,232,223,0.2)" }}
            />

            {/* Subtitle */}
            <p
              className="text-sm leading-relaxed font-light"
              style={{
                color: "rgba(237,232,223,0.6)",
                fontFamily: "var(--font-dm-sans)",
                maxWidth: "28ch",
              }}
            >
              {config.sub}
            </p>

            {/* Tag line */}
            <p
              className="text-xs uppercase tracking-[0.15em]"
              style={{
                color: "rgba(191,164,122,0.5)",
                fontFamily: "var(--font-dm-sans)",
              }}
            >
              {config.tag}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Decorative vertical text */}
      <div
        className="absolute right-8 top-1/2 -translate-y-1/2"
        style={{
          writingMode: "vertical-rl",
          color: "rgba(237,232,223,0.08)",
          fontFamily: "var(--font-cormorant)", 
          fontSize: "11rem",
          fontWeight: "700",
          letterSpacing: "-0.05em",
          userSelect: "none",
          lineHeight: 1,
        }} 
      >
        LUKUU
      </div>
    </div>
  );
}

