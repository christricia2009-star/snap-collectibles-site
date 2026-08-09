"use client";

import { motion } from "motion/react";
import RequestAccessButton from "./RequestAccessButton";
import PlatformSwitcher from "./PlatformSwitcher";
import AppStoreButton from "./AppStoreButton";
import { usePlatform } from "@/lib/platform";
import { TESTING_EMAIL } from "@/lib/testing";

/**
 * Final conversion-focused CTA — soft App Store + early access request.
 */
export default function FinalCTA() {
  const { label: platformLabel } = usePlatform();

  return (
    <section id="download" className="relative overflow-hidden py-20 sm:py-28">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-purple/10 to-pink/5"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple/20 blur-[120px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-3xl border border-border bg-bg-card/80 px-6 py-12 shadow-2xl backdrop-blur-sm sm:px-12 sm:py-16"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold-soft">
            Coming to the App Store
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-text sm:text-4xl md:text-5xl">
            Ready to{" "}
            <span className="text-gradient">scan, save, and trade</span>?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base text-text-muted sm:text-lg">
            Snap Collectibles helps you identify collectibles, keep inventory and
            a photo shelf, research sold comps, and trade with peers. Request
            early access while we prepare for the App Store.
          </p>

          <div className="mt-6 flex justify-center">
            <PlatformSwitcher size="sm" />
          </div>

          <div className="mx-auto mt-6 max-w-md rounded-2xl border border-border-subtle bg-bg/60 px-4 py-4 text-left text-sm text-text-muted sm:px-5">
            <p className="font-medium text-text">How to request early access</p>
            <ol className="mt-2 list-decimal space-y-1.5 pl-5 leading-relaxed">
              <li>
                Email{" "}
                <a
                  href={`mailto:${TESTING_EMAIL}`}
                  className="font-medium text-purple-bright underline-offset-2 hover:underline"
                >
                  {TESTING_EMAIL}
                </a>
              </li>
              <li>
                Include your <strong className="text-text">name</strong>,{" "}
                <strong className="text-text">email</strong>, and{" "}
                <strong className="text-text">platform</strong>
              </li>
              <li>
                Tell us a bit about what you collect (figures, cards, sneakers, etc.)
              </li>
            </ol>
            <p className="mt-3 text-xs text-text-dim">
              Selected platform for the form:{" "}
              <span className="font-medium text-text">{platformLabel}</span>
            </p>
          </div>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <RequestAccessButton size="lg" label="Request Early Access" />
            <AppStoreButton size="lg" disabled />
          </div>
          <p className="mt-5 text-xs text-text-dim">
            Coming to the App Store · Free early testing while available
          </p>
        </motion.div>
      </div>
    </section>
  );
}
