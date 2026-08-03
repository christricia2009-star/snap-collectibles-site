"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import RequestAccessButton from "./RequestAccessButton";
import PlatformSwitcher from "./PlatformSwitcher";

/**
 * Sticky site header with logo, platform switcher, and request-access CTA.
 * Gains a frosted background after the user scrolls.
 */
export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`
        fixed inset-x-0 top-0 z-50 transition-all duration-300
        ${
          scrolled
            ? "border-b border-border/60 bg-bg/80 backdrop-blur-xl shadow-lg shadow-black/20"
            : "bg-transparent"
        }
      `}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:h-[4.25rem] sm:px-6 lg:px-8">
        {/* Logo / wordmark */}
        <a
          href="#top"
          className="group flex min-w-0 items-center gap-2.5"
          aria-label="Snap Collectibles home"
        >
          <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple to-pink shadow-md transition-transform duration-300 group-hover:scale-105">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.2"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <circle cx="12" cy="13" r="3" />
            </svg>
          </span>
          <span className="truncate text-[15px] font-bold tracking-tight text-text sm:text-base">
            Snap{" "}
            <span className="text-gradient">Collectibles</span>
          </span>
        </a>

        {/* Nav + platform switcher + CTA */}
        <nav className="flex items-center gap-2 sm:gap-4" aria-label="Primary">
          <a
            href="#features"
            className="hidden text-sm font-medium text-text-muted transition-colors hover:text-text md:inline"
          >
            Features
          </a>
          <a
            href="#gallery"
            className="hidden text-sm font-medium text-text-muted transition-colors hover:text-text lg:inline"
          >
            Screens
          </a>
          <a
            href="#faq"
            className="hidden text-sm font-medium text-text-muted transition-colors hover:text-text md:inline"
          >
            FAQ
          </a>
          <div className="hidden sm:block">
            <PlatformSwitcher size="sm" />
          </div>
          <RequestAccessButton size="sm" label="Request Access" />
        </nav>
      </div>
    </motion.header>
  );
}
