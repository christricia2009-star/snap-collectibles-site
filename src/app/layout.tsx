import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Snap Collectibles — Multi-Item Scan for iOS & Android",
  description:
    "Scan multiple items in a single photo on iOS and Android. Catalog faster with multi-item detection, real-time eBay sold comps, and tools built for all size collections. Request free beta access at Testing@snapcollectibles.com.",
  keywords: [
    "collectibles",
    "collection app",
    "multi-item scanning",
    "barcode scanner",
    "eBay comps",
    "market value",
    "wishlist",
    "iOS",
    "Android",
    "beta",
  ],
  authors: [{ name: "Snap Collectibles", url: "https://snapcollectibles.com" }],
  openGraph: {
    title: "Snap Collectibles — Multi-Item Scanning for iOS & Android",
    description:
      "Scan multiple items in one photo on iOS and Android. Catalog faster and know what your collection is worth. Request free beta access.",
    url: "https://snapcollectibles.com",
    siteName: "Snap Collectibles",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Snap Collectibles — Multi-Item Scanning for iOS & Android",
    description:
      "Scan multiple items in one photo on iOS and Android. Catalog faster and know what your collection is worth. Request free beta access.",
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
