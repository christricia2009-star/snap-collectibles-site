/**
 * App screenshot assets by platform.
 * iOS:     /public/screenshots/
 * Android: /public/screenshots/android/
 * Paths match filenames on disk (case-sensitive on Linux hosts like Vercel).
 */

import type { Platform } from "./types";

export type Screenshot = {
  src: string;
  label: string;
  alt: string;
};

export type ScreenshotKey =
  | "collection"
  | "scan"
  | "marketValue"
  | "wishlist"
  | "selling"
  | "settings"
  | "filter"
  | "sharing";

export type MockupAccent = "purple" | "pink" | "gold" | "mixed";

type ScreenshotMap = Partial<Record<ScreenshotKey, Screenshot>> &
  Record<
    "collection" | "scan" | "marketValue" | "wishlist" | "selling" | "settings",
    Screenshot
  >;

const iosScreenshots: ScreenshotMap = {
  collection: {
    src: "/screenshots/collection.png",
    label: "Collection & vault",
    alt: "Snap Collectibles iOS collection overview and vault screen",
  },
  scan: {
    src: "/screenshots/Scan.png",
    label: "Category scan",
    alt: "Snap Collectibles iOS category selection and camera scan screen",
  },
  marketValue: {
    src: "/screenshots/MarketRates.png",
    label: "Market & portfolio",
    alt: "Snap Collectibles iOS market value, sold comps, and portfolio research screen",
  },
  wishlist: {
    src: "/screenshots/Wishlist.png",
    label: "Wishlist",
    alt: "Snap Collectibles iOS wishlist tracking screen",
  },
  selling: {
    src: "/screenshots/Selling.png",
    label: "Selling",
    alt: "Snap Collectibles iOS selling tools screen",
  },
  settings: {
    src: "/screenshots/settings.png",
    label: "Settings",
    alt: "Snap Collectibles iOS settings screen",
  },
  // Optional iOS extras (used if referenced in gallery)
  filter: {
    src: "/screenshots/ItemInfo.png",
    label: "Item details",
    alt: "Snap Collectibles iOS item details screen",
  },
  sharing: {
    src: "/screenshots/WishlistDetail.png",
    label: "Wishlist detail",
    alt: "Snap Collectibles iOS wishlist detail screen",
  },
};

/**
 * Android assets — exact filenames under /public/screenshots/android/
 */
const androidScreenshots: ScreenshotMap = {
  collection: {
    src: "/screenshots/android/Collection.png",
    label: "Collection overview",
    alt: "Snap Collectibles Android collection overview screen",
  },
  scan: {
    src: "/screenshots/android/Scan.png",
    label: "Category scan",
    alt: "Snap Collectibles Android category selection and camera scan screen",
  },
  marketValue: {
    src: "/screenshots/android/CollectionStats.png",
    label: "Collection stats",
    alt: "Snap Collectibles Android collection stats and value screen",
  },
  wishlist: {
    src: "/screenshots/android/Wishlist.png",
    label: "Wishlist",
    alt: "Snap Collectibles Android wishlist tracking screen",
  },
  selling: {
    src: "/screenshots/android/Selling.png",
    label: "Selling",
    alt: "Snap Collectibles Android selling tools screen",
  },
  settings: {
    src: "/screenshots/android/Settings.png",
    label: "Settings",
    alt: "Snap Collectibles Android settings screen",
  },
  filter: {
    src: "/screenshots/android/FilterScreen.png",
    label: "Filters & search",
    alt: "Snap Collectibles Android filter and search screen",
  },
  sharing: {
    src: "/screenshots/android/Sharing.png",
    label: "Sharing",
    alt: "Snap Collectibles Android sharing screen",
  },
};

export const screenshotsByPlatform: Record<Platform, ScreenshotMap> = {
  ios: iosScreenshots,
  android: androidScreenshots,
};

/** Hero mockup always uses the collection overview for the selected platform */
export const heroScreenshotKey: ScreenshotKey = "collection";

/**
 * Gallery order per platform so each OS can show its full set.
 * Android includes all 8 available screenshots.
 */
export const galleryShotKeysByPlatform: Record<
  Platform,
  { key: ScreenshotKey; accent: MockupAccent }[]
> = {
  ios: [
    { key: "scan", accent: "purple" },
    { key: "marketValue", accent: "gold" },
    { key: "collection", accent: "pink" },
    { key: "wishlist", accent: "mixed" },
    { key: "selling", accent: "gold" },
    { key: "settings", accent: "purple" },
  ],
  android: [
    { key: "scan", accent: "purple" },
    { key: "collection", accent: "pink" },
    { key: "marketValue", accent: "gold" },
    { key: "filter", accent: "mixed" },
    { key: "wishlist", accent: "mixed" },
    { key: "selling", accent: "gold" },
    { key: "sharing", accent: "pink" },
    { key: "settings", accent: "purple" },
  ],
};

/** @deprecated Use galleryShotKeysByPlatform[platform] */
export const galleryShotKeys = galleryShotKeysByPlatform.ios;

export function getScreenshots(platform: Platform): ScreenshotMap {
  return screenshotsByPlatform[platform];
}

export function getHeroScreenshot(platform: Platform): Screenshot {
  return screenshotsByPlatform[platform].collection;
}

export function getGalleryShots(platform: Platform): {
  src: string;
  label: string;
  alt: string;
  accent: MockupAccent;
}[] {
  const map = screenshotsByPlatform[platform];
  return galleryShotKeysByPlatform[platform]
    .map(({ key, accent }) => {
      const shot = map[key];
      if (!shot) return null;
      return { ...shot, accent };
    })
    .filter((s): s is NonNullable<typeof s> => s !== null);
}

/** @deprecated Prefer getScreenshots(platform) — defaults to iOS for legacy imports */
export const screenshots = iosScreenshots;
