import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Snap Collectibles — Portfolio Value & AI Scan for iOS & Android",
  description:
    "The collectibles portfolio app for iOS and Android. Smart dashboard with market value, cost basis, and P/L. Multi-marketplace pricing, AI camera scanning, listing drafts, and full CSV/JSON import-export. Request free beta access.",
  keywords: [
    "collectibles",
    "collection app",
    "portfolio tracker",
    "Funko Pop scanner",
    "AI vision scan",
    "eBay comps",
    "market value",
    "cost basis",
    "wishlist",
    "iOS",
    "Android",
    "beta",
  ],
  authors: [{ name: "Snap Collectibles", url: "https://snapcollectibles.com" }],
  openGraph: {
    title: "Snap Collectibles — Know What Your Collection Is Worth",
    description:
      "Portfolio dashboard, multi-marketplace price intelligence, and AI scanning on iOS and Android. Request free beta access.",
    url: "https://snapcollectibles.com",
    siteName: "Snap Collectibles",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Snap Collectibles — Know What Your Collection Is Worth",
    description:
      "Portfolio dashboard, multi-marketplace price intelligence, and AI scanning on iOS and Android. Request free beta access.",
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
