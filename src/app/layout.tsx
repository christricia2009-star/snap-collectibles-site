import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const plex = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-plex",
});

export const metadata: Metadata = {
  title: "Snap Collectibles — Scan · Catalog · Trade",
  description:
    "The collector vault OS. Category-first scan with rarity and deal scores, portfolio value and P/L, Hunter Mode for in-store buy/pass, Tools hub, sold comps, selling with fees, and peer trades. iOS and Android beta.",
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
    "Android",
    "TestFlight",
  ],
  authors: [{ name: "Snap Collectibles", url: "https://snapcollectibles.com" }],
  openGraph: {
    title: "Snap Collectibles — Scan · Catalog · Trade",
    description:
      "Scan with deal scores, run portfolio health, hunt in-store with Hunter Mode, and trade with other collectors — all in one app. iOS and Android beta.",
    url: "https://snapcollectibles.com",
    siteName: "Snap Collectibles",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Snap Collectibles — Scan · Catalog · Trade",
    description:
      "Scan with deal scores, run portfolio health, hunt in-store with Hunter Mode, and trade with other collectors. iOS and Android beta.",
  },
  metadataBase: new URL("https://snapcollectibles.com"),
  icons: {
    icon: "/icon.jpg",
    apple: "/icon.jpg",
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Snap Collectibles",
    applicationCategory: "LifestyleApplication",
    operatingSystem: "iOS, Android",
    description:
      "Scan collectibles with deal scores, run portfolio health, hunt in-store with Hunter Mode, and trade with other collectors. Offline-capable vault with iCloud backup when signed in.",
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/PreOrder",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <html lang="en" className={`${inter.variable} ${plex.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
