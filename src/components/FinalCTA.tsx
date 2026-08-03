"use client";

import { motion } from "motion/react";
import RequestAccessButton from "./RequestAccessButton";
import AppStoreButton from "./AppStoreButton";
import { TESTING_EMAIL } from "@/lib/testing";

/**
 * Final conversion-focused CTA — request TestFlight access.
 */
export default function FinalCTA() {
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
            Join the beta
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-text sm:text-4xl md:text-5xl">
            Help us build the best app for{" "}
            <span className="text-gradient">collectors</span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base text-text-muted sm:text-lg">
            Multi-item scanning, real market values, and organization built for
            all size collections — currently in private testing. Request a free
            TestFlight invite and get early access.
          </p>

          <div className="mx-auto mt-6 max-w-md rounded-2xl border border-border-subtle bg-bg/60 px-4 py-4 text-left text-sm text-text-muted sm:px-5">
            <p className="font-medium text-text">How to request access</p>
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
                Include your <strong className="text-text">name</strong> and{" "}
                <strong className="text-text">email</strong>
              </li>
              <li>
                Tell us a bit about what you collect (Funko, sports cards, etc.)
              </li>
            </ol>
          </div>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
            <RequestAccessButton size="lg" label="Join the TestFlight" />
            <AppStoreButton size="lg" disabled />
          </div>
          <p className="mt-5 text-xs text-text-dim">
            iPhone · Free TestFlight invite · Coming soon to the App Store
          </p>
        </motion.div>
      </div>
    </section>
  );
}
