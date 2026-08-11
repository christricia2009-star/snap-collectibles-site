import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Snap Collectibles — Scan · Catalog · Trade Collectibles",
  description:
    "The collector vault OS. Category-first scan with rarity and deal scores, portfolio value and P/L, Hunter Mode for in-store buy/pass, Tools hub, sold comps with confidence, selling with fees, peer trades with fair equity, and iCloud backup when signed in with Apple. Coming to the App Store.",
  keywords: [
    "collectibles",
    "collection app",
    "collectible scanner",
    "category scan",
    "camera scan",
    "sold comps",
    "eBay comps",
    "portfolio tracker",
    "hunter mode",
    "deal score",
    "collection inventory",
    "wishlist",
    "trade collectibles",
    "Sign in with Apple",
    "iOS",
    "TestFlight",
  ],
  authors: [{ name: "Snap Collectibles", url: "https://snapcollectibles.com" }],
  openGraph: {
    title: "Snap Collectibles — Scan · Catalog · Trade",
    description:
      "Scan with deal scores, run portfolio health, hunt in-store with Hunter Mode, and trade with other collectors — all in one app.",
    url: "https://snapcollectibles.com",
    siteName: "Snap Collectibles",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Snap Collectibles — Scan · Catalog · Trade",
    description:
      "Scan with deal scores, run portfolio health, hunt in-store with Hunter Mode, and trade with other collectors — all in one app.",
  },
  metadataBase: new URL("https://snapcollectibles.com"),
  icons: {
    icon: "/icon.jpg",
    apple: "/icon.jpg",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0c",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-bg font-sans text-text antialiased">
        {children}
      </body>
    </html>
  );
}
