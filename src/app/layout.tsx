import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Snap Collectibles — Scan, Track, Value & Trade Collectibles",
  description:
    "The iOS app for collectors. Category-first camera scan, sold comps and marketplace price helpers, personal inventory with category filters and My Shelf, wishlist, selling tools, peer-to-peer trades with in-app chat, and cloud backup when signed in with Apple. Coming to the App Store.",
  keywords: [
    "collectibles",
    "collection app",
    "collectible scanner",
    "category scan",
    "camera scan",
    "sold comps",
    "eBay comps",
    "collection inventory",
    "wishlist",
    "trade collectibles",
    "Sign in with Apple",
    "iOS",
    "TestFlight",
  ],
  authors: [{ name: "Snap Collectibles", url: "https://snapcollectibles.com" }],
  openGraph: {
    title: "Snap Collectibles — Scan, Track, Value & Trade",
    description:
      "Pick a category, identify collectibles with the camera, track inventory and shelf, research sold comps, and trade with other collectors — all in one iOS app.",
    url: "https://snapcollectibles.com",
    siteName: "Snap Collectibles",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Snap Collectibles — Scan, Track, Value & Trade",
    description:
      "Pick a category, identify collectibles with the camera, track inventory and shelf, research sold comps, and trade with other collectors — all in one iOS app.",
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
