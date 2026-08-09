"use client";

import { motion } from "motion/react";
import SectionHeading from "./SectionHeading";

/**
 * Four-step “How it works” — Scan → Save → Value → Trade.
 */

const steps = [
  {
    step: "01",
    title: "Scan",
    description:
      "Open Scan, pick a category for what you’re looking at, then capture a photo — identification follows the category you chose.",
    color: "text-purple-bright",
    ring: "ring-purple/30",
  },
  {
    step: "02",
    title: "Save",
    description:
      "Add pieces to your collection. Browse list, grid, or My Shelf, filter by category, and keep a wishlist as you grow.",
    color: "text-pink-hot",
    ring: "ring-pink/30",
  },
  {
    step: "03",
    title: "Value",
    description:
      "Use sold comps and marketplace price helpers as research tools. Check what the market has been paying — not a guaranteed appraisal.",
    color: "text-gold",
    ring: "ring-gold/30",
  },
  {
    step: "04",
    title: "Trade",
    description:
      "Post offers, pick items from inventory, follow the trade feed, and chat in-app. Peer-to-peer between collectors.",
    color: "text-purple-bright",
    ring: "ring-purple/30",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="How it works"
          title="Scan → Save → Value → Trade"
          subtitle="A simple loop for collectors: choose a category, identify pieces, keep them organized, research prices, and trade when you’re ready."
        />

        <div className="relative mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {/* Connecting line (desktop) */}
          <div
            className="pointer-events-none absolute left-[12%] right-[12%] top-10 hidden h-px bg-gradient-to-r from-purple/40 via-pink/40 to-gold/40 lg:block"
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
                delay: i * 0.1,
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
