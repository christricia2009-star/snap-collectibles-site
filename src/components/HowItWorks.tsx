"use client";

import { motion } from "motion/react";
import SectionHeading from "./SectionHeading";

/**
 * Three-step “How it works” section.
 * Edit steps array to change copy or order.
 */

const steps = [
  {
    step: "01",
    title: "Scan multiple items at once",
    description:
      "Snap one photo of a shelf or stack. We detect and process multiple items in a single shot so you build inventory faster — built for all size collections. Barcode scan and manual add are there when you want full control.",
    color: "text-purple-bright",
    ring: "ring-purple/30",
  },
  {
    step: "02",
    title: "Get real market value",
    description:
      "We pull recent eBay sold comps so you see what similar items actually sold for — not inflated asking prices.",
    color: "text-pink-hot",
    ring: "ring-pink/30",
  },
  {
    step: "03",
    title: "Organize & track",
    description:
      "Tag, search, wishlist, and export. Watch your portfolio grow as you build and refine your collection.",
    color: "text-gold",
    ring: "ring-gold/30",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="How it works"
          title="Three steps to a smarter collection"
          subtitle="No spreadsheets. No one-by-one drudgery. Multi-item scan, real values, and stay organized."
        />

        <div className="relative mt-16 grid gap-8 md:grid-cols-3 md:gap-6">
          {/* Connecting line (desktop) */}
          <div
            className="pointer-events-none absolute left-[16.5%] right-[16.5%] top-10 hidden h-px bg-gradient-to-r from-purple/40 via-pink/40 to-gold/40 md:block"
            aria-hidden="true"
          />

          {steps.map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.55,
                delay: i * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative flex flex-col items-center text-center"
            >
              <div
                className={`mb-5 flex h-20 w-20 items-center justify-center rounded-2xl border border-border bg-bg-card text-2xl font-bold ring-4 ${item.ring} ${item.color}`}
              >
                {item.step}
              </div>
              <h3 className="text-lg font-semibold text-text">{item.title}</h3>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-text-muted">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
