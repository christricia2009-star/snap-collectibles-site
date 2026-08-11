"use client";

import { motion } from "motion/react";
import SectionHeading from "./SectionHeading";

/**
 * Four-step “How it works” — Snap → Value → Vault → Hunt/Trade.
 * Aligned to B15 onboarding + product loop.
 */

const steps = [
  {
    step: "01",
    title: "Snap",
    description:
      "Open Scan, pick a category, capture a photo or barcode. Multi-item snaps and duplicate warnings keep the vault clean from the first add.",
    color: "text-purple-bright",
    ring: "ring-purple/30",
  },
  {
    step: "02",
    title: "Review value",
    description:
      "Before you save: rarity signals, packaging cues, sold ranges, and a deal score. Research helpers — not a formal appraisal.",
    color: "text-pink-hot",
    ring: "ring-pink/30",
  },
  {
    step: "03",
    title: "Run the vault",
    description:
      "Portfolio home tracks ranges, P/L, grails, and goals. Organize with list, grid, My Shelf, smart collections, and Tools hub exports.",
    color: "text-gold",
    ring: "ring-gold/30",
  },
  {
    step: "04",
    title: "Hunt & trade",
    description:
      "Hunter Mode and hunt sessions for the aisle; sell with fees & P/L; trade with matches, chat, and fair equity checks — peer-to-peer.",
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
          title="Snap → Review → Vault → Hunt"
          subtitle="A simple loop for collectors: identify with context, run portfolio health, decide at the pegs, and trade when you’re ready."
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
