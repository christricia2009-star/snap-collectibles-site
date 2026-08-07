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
    "The iOS app for collectors. Camera scan with category selection, sold comps and marketplace price helpers, personal inventory and My Shelf, wishlist, selling tools, peer-to-peer trades with in-app chat, and cloud backup when signed in with Apple. Coming to the App Store.",
  keywords: [
    "collectibles",
    "collection app",
    "Funko Pop scanner",
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
      "Identify collectibles with the camera, track your inventory and shelf, research sold comps, and trade with other collectors — all in one iOS app.",
    url: "https://snapcollectibles.com",
    siteName: "Snap Collectibles",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Snap Collectibles — Scan, Track, Value & Trade",
    description:
      "Identify collectibles with the camera, track your inventory and shelf, research sold comps, and trade with other collectors — all in one iOS app.",
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
