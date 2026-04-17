import type { Metadata } from "next";
import { Montserrat, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-title',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Kulture | Urban Streetwear & Contemporary Fashion",
  description: "Discover curated urban streetwear, contemporary clothing, and accessories at Kulture. Shop the latest trends in men's and women's fashion, from casual essentials to statement pieces. Quality styles for the modern culture.",
  keywords: ["streetwear", "urban fashion", "clothing", "apparel", "sneakers", "accessories", "menswear", "womenswear", "contemporary fashion", "Kulture"],
  authors: [{ name: "Kulture" }],
  creator: "Kulture",
  publisher: "Kulture",
  metadataBase: new URL("https://your-domain.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Kulture | Urban Streetwear & Contemporary Fashion",
    description: "Discover curated urban streetwear and contemporary fashion. Shop men's and women's clothing, shoes, and accessories.",
    url: "https://your-domain.com",
    siteName: "Kulture",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kulture | Urban Streetwear & Contemporary Fashion",
    description: "Discover curated urban streetwear and contemporary fashion. Shop the latest trends.",
    creator: "@your-handle",
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
        montserrat.variable,
        spaceGrotesk.variable,
        "font-sans"
      )}
    >
      <body className="min-h-screen flex flex-col">
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster />
      </body>
    </html>
  );
}

