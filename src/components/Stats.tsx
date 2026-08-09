"use client";

import { motion } from "motion/react";

/**
 * Capability highlights band — no invented metrics or pricing claims.
 */

const highlights = [
  {
    label: "Category scan",
    detail: "Pick type, then camera",
  },
  {
    label: "Price research",
    detail: "Sold comps & helpers",
  },
  {
    label: "Collection views",
    detail: "List, grid, shelf & filters",
  },
  {
    label: "Trades",
    detail: "Offers, feed & chat",
  },
];

export default function Stats() {
  return (
    <section
      id="stats"
      className="relative border-y border-border-subtle bg-bg-elevated py-16 sm:py-20"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-purple/5 via-transparent to-pink/5"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-6"
        >
          {highlights.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="text-center"
            >
              <p className="text-xl font-bold tracking-tight text-text sm:text-2xl md:text-3xl">
                <span className="text-gradient">{item.label}</span>
              </p>
              <p className="mt-2 text-sm font-medium text-text-muted">
                {item.detail}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <p className="mt-8 text-center text-[11px] text-text-dim">
          Snap Collectibles · Coming to the App Store · Sign in with Apple ·
          Cloud backup when signed in
        </p>
      </div>
    </section>
  );
}
