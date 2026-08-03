"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import RequestAccessButton from "./RequestAccessButton";
import PlatformSwitcher from "./PlatformSwitcher";

/**
 * Sticky site header with app icon, platform switcher, and request-access CTA.
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
        {/* Logo / wordmark — app icon from /public/icon.jpg */}
        <a
          href="#top"
          className="group flex min-w-0 items-center gap-2.5"
          aria-label="Snap Collectibles home"
        >
          <Image
            src="/icon.jpg"
            alt="Snap Collectibles"
            width={36}
            height={36}
            className="h-9 w-9 flex-shrink-0 rounded-xl object-cover shadow-md ring-1 ring-white/10 transition-transform duration-300 group-hover:scale-105"
            priority
          />
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
