/**
 * Shared beta / testing access details.
 * App is not publicly on the App Store or Google Play yet —
 * testers request access via email.
 */

import type { Platform } from "./types";

export const TESTING_EMAIL = "Testing@snapcollectibles.com";

export function getPlatformLabel(platform: Platform): string {
  return platform === "ios" ? "iOS" : "Android";
}

export function getTestingMailto(platform: Platform = "ios"): string {
  const platformLabel = getPlatformLabel(platform);
  const subject = `Beta Access Request — Snap Collectibles (${platformLabel})`;
  const body = [
    "Hi Snap Collectibles team,",
    "",
    "I'd like to join the beta and request access to test.",
    "",
    "Name: ",
    "Email: ",
    `Platform: ${platformLabel}`,
    "Collecting interests (e.g. figures, sports cards, sneakers, games): ",
    "",
    "Thanks!",
  ].join("\n");

  return `mailto:${TESTING_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/** Default mailto (iOS) for static contexts without platform state */
export const TESTING_MAILTO = getTestingMailto("ios");
