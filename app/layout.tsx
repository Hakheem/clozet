import type { Metadata } from "next";
import { DM_Sans, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-title',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Lukuu | Urban Streetwear & Contemporary Fashion",
  description: "Discover curated urban streetwear, contemporary clothing, and accessories at Lukuu. Shop the latest trends in men's and women's fashion, from casual essentials to statement pieces. Quality styles for the modern culture.",
  keywords: ["streetwear", "urban fashion", "clothing", "apparel", "sneakers", "accessories", "menswear", "womenswear", "contemporary fashion", "Lukuu"],
  authors: [{ name: "Lukuu" }],
  creator: "Lukuu",
  publisher: "Lukuu",
  metadataBase: new URL("https://lukuu.onrender.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Lukuu | Urban Streetwear & Contemporary Fashion",
    description: "Discover curated urban streetwear and contemporary fashion. Shop men's and women's clothing, shoes, and accessories.",
    url: "https://lukuu.onrender.com",
    siteName: "Lukuu",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lukuu | Urban Streetwear & Contemporary Fashion",
    description: "Discover curated urban streetwear and contemporary fashion. Shop the latest trends.",
    creator: "@hakheem67",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        dmSans.variable,
        cormorant.variable,
      )}
    >
      <body className="min-h-screen flex flex-col font-sans">
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster />
      </body>
    </html>
  );
}

