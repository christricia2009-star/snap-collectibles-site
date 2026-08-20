/**
 * Shared beta / testing access details.
 * Requests go through FormSubmit (same automation as BassheadOS).
 * Android testers must copy the Play internal-test URL on-screen —
 * Google does not email them automatically.
 */

import type { Platform } from "./types";

export const APP_NAME = "Snap Collectibles";

/** Inbox FormSubmit is already confirmed against (BassheadOS beta form). */
export const BETA_INBOX = "admin@snapcollectibles.com";

export const BETA_ENDPOINT = `https://formsubmit.co/ajax/${BETA_INBOX}`;

export const TESTING_EMAIL = "Testing@snapcollectibles.com";

export const SUPPORT_EMAIL = "support@snapcollectibles.com";

/** Google Play internal testing link. Active after the email is added to the tester list. */
export const ANDROID_TEST_URL =
  "https://play.google.com/apps/internaltest/4701199050615340835";

export function getPlatformLabel(platform: Platform): string {
  return platform === "ios" ? "iOS" : "Android";
}

export function getTestingMailto(platform: Platform = "ios"): string {
  const platformLabel = getPlatformLabel(platform);
  const subject = `${APP_NAME} beta tester request`;
  const body = [
    `App Name: ${APP_NAME}`,
    `Phone OS: ${platformLabel}`,
    "Email: ",
  ].join("\n");

  return `mailto:${BETA_INBOX}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/** Default mailto (iOS) for static contexts without platform state */
export const TESTING_MAILTO = getTestingMailto("ios");
