import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Snap Collectibles — Scan, Value & Organize Your Collection",
  description:
    "Scan, value, and organize your collectibles with real-time eBay sold comps. Currently in private TestFlight testing — request free access at Testing@snapcollectibles.com.",
  keywords: [
    "collectibles",
    "collection app",
    "barcode scanner",
    "eBay comps",
    "market value",
    "wishlist",
    "iOS",
    "TestFlight",
  ],
  authors: [{ name: "Snap Collectibles", url: "https://snapcollectibles.com" }],
  openGraph: {
    title: "Snap Collectibles — Join the Beta",
    description:
      "Scan, value, and organize your collectibles. Currently in TestFlight testing — request free access.",
    url: "https://snapcollectibles.com",
    siteName: "Snap Collectibles",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Snap Collectibles — Join the Beta",
    description:
      "Scan, value, and organize your collectibles. Currently in TestFlight testing — request free access.",
  },
  metadataBase: new URL("https://snapcollectibles.com"),
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
