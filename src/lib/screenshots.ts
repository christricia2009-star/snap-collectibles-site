/**
 * App screenshot assets in /public/screenshots/
 * Paths match actual filenames on disk (case-sensitive on some hosts).
 */

export const screenshots = {
  collection: {
    src: "/screenshots/collection.png",
    label: "Collection overview",
    alt: "Snap Collectibles collection overview screen",
  },
  scan: {
    src: "/screenshots/Scan.png",
    label: "Scan an item",
    alt: "Snap Collectibles barcode and image scan screen",
  },
  marketValue: {
    // File on disk is MarketRates.png
    src: "/screenshots/MarketRates.png",
    label: "Market value",
    alt: "Snap Collectibles market value and eBay comps screen",
  },
  wishlist: {
    src: "/screenshots/Wishlist.png",
    label: "Wishlist",
    alt: "Snap Collectibles wishlist tracking screen",
  },
  settings: {
    src: "/screenshots/settings.png",
    label: "Settings",
    alt: "Snap Collectibles settings screen",
  },
  selling: {
    src: "/screenshots/Selling.png",
    label: "Selling",
    alt: "Snap Collectibles selling tools screen",
  },
} as const;

export type ScreenshotKey = keyof typeof screenshots;
