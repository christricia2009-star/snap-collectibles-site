"use client";

import { AnimatePresence, motion } from "motion/react";
import RequestAccessButton from "./RequestAccessButton";
import PlatformSwitcher from "./PlatformSwitcher";
import PhoneMockup from "./PhoneMockup";
import { usePlatform } from "@/lib/platform";
import { getHeroScreenshot } from "@/lib/screenshots";
import { TESTING_EMAIL } from "@/lib/testing";

/**
 * Hero section — portfolio-first headline, platform switcher,
 * request-access CTA, and platform-specific screenshot.
 */
export default function Hero() {
  const { platform, label: platformLabel } = usePlatform();
  const heroShot = getHeroScreenshot(platform);

  return (
    <section
      id="top"
      className="relative overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-24 lg:pt-40 lg:pb-28"
    >
      {/* Background glow orbs */}
      <div
        className="pointer-events-none absolute -top-32 left-1/2 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-purple/20 blur-[120px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-0 right-0 h-[320px] w-[320px] rounded-full bg-pink/15 blur-[100px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-grid opacity-[0.35]"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        {/* Copy */}
        <div className="text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3.5 py-1.5 text-xs font-medium text-gold-soft backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
              iOS &amp; Android · Currently in testing
            </span>
          </motion.div>

          {/* Platform switcher — primary control */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.04, ease: [0.22, 1, 0.36, 1] }}
            className="mb-6 flex justify-center lg:justify-start"
          >
            <PlatformSwitcher size="md" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl font-bold tracking-tight text-text sm:text-5xl lg:text-[3.5rem] lg:leading-[1.1]"
          >
            Know what your collection is{" "}
            <span className="text-gradient">really worth</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-text-muted sm:text-lg lg:mx-0"
          >
            Snap Collectibles is the portfolio app for serious collectors on{" "}
            <AnimatePresence mode="wait">
              <motion.span
                key={platform}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="font-semibold text-text"
              >
                {platformLabel}
              </motion.span>
            </AnimatePresence>
            . AI camera scanning, multi-marketplace price intelligence, and a
            smart dashboard with market value, cost basis, and unrealized
            profit — so you catalog faster and sell smarter.
          </motion.p>

          {/* Testing callout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-6 max-w-lg rounded-2xl border border-purple/25 bg-purple/10 px-4 py-3.5 text-left sm:px-5 lg:mx-0"
          >
            <p className="text-sm font-medium text-text">
              Private beta on iOS &amp; Android — not on the App Store or Google
              Play yet.
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-text-muted">
              Email{" "}
              <a
                href={`mailto:${TESTING_EMAIL}`}
                className="font-medium text-purple-bright underline-offset-2 hover:underline"
              >
                {TESTING_EMAIL}
              </a>{" "}
              with your <strong className="text-text">name</strong>,{" "}
              <strong className="text-text">email</strong>,{" "}
              <strong className="text-text">platform</strong> (iOS or Android),
              and a short note about what you collect (e.g. Funko, sports cards,
              sneakers).
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center lg:justify-start"
          >
            <RequestAccessButton size="lg" label="Request Access to Test" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-5 text-xs text-text-dim"
          >
            Free beta invite · iOS &amp; Android · Portfolio value, scan &amp;
            sell tools
          </motion.p>
        </div>

        {/* Phone mockup — platform-specific collection overview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 32 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex flex-col items-center justify-center"
        >
          <div
            className="pointer-events-none absolute inset-0 m-auto h-64 w-64 rounded-full bg-purple/25 blur-[80px] sm:h-80 sm:w-80"
            aria-hidden="true"
          />
          <AnimatePresence mode="wait">
            <motion.div
              key={platform}
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.97 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <PhoneMockup
                label={heroShot.label}
                imageSrc={heroShot.src}
                imageAlt={heroShot.alt}
                accent="mixed"
              />
            </motion.div>
          </AnimatePresence>
          <AnimatePresence mode="wait">
            <motion.p
              key={`caption-${platform}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="mt-4 text-center text-xs font-medium text-text-dim"
            >
              {platformLabel} preview · {heroShot.label}
            </motion.p>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
