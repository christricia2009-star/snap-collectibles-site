/**
 * Primary CTA — request beta access via email.
 * Prefills subject + body: Name, Email, Platform, collecting interests.
 */

"use client";

import { usePlatform } from "@/lib/platform";
import { getTestingMailto } from "@/lib/testing";

type RequestAccessButtonProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
  /** Optional label override */
  label?: string;
  /**
   * When true, uses platform context for the mailto body.
   * Set false only if rendered outside PlatformProvider.
   */
  useSelectedPlatform?: boolean;
};

const sizeClasses = {
  sm: "px-4 py-2 text-sm gap-2",
  md: "px-5 py-2.5 text-sm gap-2.5",
  lg: "px-7 py-3.5 text-base gap-3",
};

export default function RequestAccessButton({
  size = "md",
  className = "",
  label = "Request Access to Test",
  useSelectedPlatform = true,
}: RequestAccessButtonProps) {
  const { platform, label: platformLabel } = usePlatform();
  const href = useSelectedPlatform
    ? getTestingMailto(platform)
    : getTestingMailto("ios");

  return (
    <a
      href={href}
      className={`
        group inline-flex items-center justify-center rounded-xl
        bg-gradient-to-r from-purple to-pink
        text-white font-semibold
        shadow-lg shadow-purple/25
        transition-all duration-300
        hover:scale-[1.03] hover:shadow-[0_0_32px_rgba(168,85,247,0.5)]
        active:scale-[0.98]
        ${sizeClasses[size]}
        ${className}
      `}
      aria-label={`Request access to test Snap Collectibles on ${platformLabel} via email`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className={size === "lg" ? "h-5 w-5" : "h-4 w-4"}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
      <span>{label}</span>
    </a>
  );
}
