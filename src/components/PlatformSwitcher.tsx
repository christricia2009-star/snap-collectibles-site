"use client";

import { motion } from "motion/react";
import { usePlatform, type Platform } from "@/lib/platform";

type PlatformSwitcherProps = {
  /** Visual size of the control */
  size?: "sm" | "md";
  className?: string;
  /** Center or left-align the switcher */
  align?: "center" | "start";
};

const options: { id: Platform; label: string; icon: "apple" | "android" }[] = [
  { id: "ios", label: "iOS", icon: "apple" },
  { id: "android", label: "Android", icon: "android" },
];

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

function AndroidIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.6 9.48l1.84-3.18c.16-.31.04-.69-.26-.85a.637.637 0 00-.83.22l-1.88 3.24a11.43 11.43 0 00-8.94 0L5.65 5.67a.643.643 0 00-.87-.2c-.28.18-.37.54-.22.83L6.4 9.48A10.81 10.81 0 003 18.15h18a10.81 10.81 0 00-3.4-8.67zM7.75 15.35a1.2 1.2 0 110-2.4 1.2 1.2 0 010 2.4zm8.5 0a1.2 1.2 0 110-2.4 1.2 1.2 0 010 2.4z" />
    </svg>
  );
}

/**
 * Segmented iOS / Android platform control.
 * Syncs selection via PlatformProvider so Hero, Gallery, and CTAs stay in sync.
 */
export default function PlatformSwitcher({
  size = "md",
  className = "",
  align = "center",
}: PlatformSwitcherProps) {
  const { platform, setPlatform } = usePlatform();
  const isSm = size === "sm";

  return (
    <div
      className={`
        relative inline-flex rounded-full border border-border bg-bg-card/80 p-1
        shadow-inner shadow-black/20 backdrop-blur
        ${align === "start" ? "" : ""}
        ${className}
      `}
      role="tablist"
      aria-label="Choose platform"
    >
      {options.map((option) => {
        const active = platform === option.id;
        return (
          <button
            key={option.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => setPlatform(option.id)}
            className={`
              relative z-10 inline-flex items-center justify-center gap-1.5 rounded-full
              font-semibold transition-colors duration-200
              ${isSm ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm sm:px-5 sm:py-2.5"}
              ${active ? "text-white" : "text-text-muted hover:text-text"}
            `}
          >
            {active && (
              <motion.span
                layoutId="platform-switcher-pill"
                className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-purple to-pink shadow-md shadow-purple/30"
                transition={{ type: "spring", stiffness: 420, damping: 32 }}
              />
            )}
            {option.icon === "apple" ? (
              <AppleIcon className={isSm ? "h-3.5 w-3.5" : "h-4 w-4"} />
            ) : (
              <AndroidIcon className={isSm ? "h-3.5 w-3.5" : "h-4 w-4"} />
            )}
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
