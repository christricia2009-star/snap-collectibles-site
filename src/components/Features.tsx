"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import SectionHeading from "./SectionHeading";

/**
 * Feature cards — easy to edit copy and icons.
 * Replace icon SVGs or swap to image icons as needed.
 */

type Feature = {
  title: string;
  description: string;
  /** Tailwind classes for accent tint on the icon container */
  accent: string;
  icon: ReactNode;
};

const features: Feature[] = [
  {
    title: "Multi-item scanning in one photo",
    description:
      "Our flagship feature: detect and process multiple items from a single photo. Point at a shelf, stack, or display — catalog many pieces at once instead of endless one-by-one scans. Barcode scan included when you need a precise match.",
    accent: "from-purple/20 to-purple/5 text-purple-bright",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <circle cx="12" cy="13" r="3" />
      </svg>
    ),
  },
  {
    title: "Real-time market valuation",
    description:
      "After a multi-item scan, see what each piece actually sells for using eBay sold comps — not list prices. Stay current with live market data.",
    accent: "from-gold/20 to-gold/5 text-gold",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Built for all size collections",
    description:
      "From a starter shelf to thousands of pieces, multi-item scanning and smart search, tags, and filters keep cataloging fast — whether you have 50 or 5,000 items.",
    accent: "from-pink/20 to-pink/5 text-pink-hot",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
  },
  {
    title: "Wishlist & tracking",
    description:
      "Save items you’re hunting for and track price movement over time. Never miss a deal or a grail restock again.",
    accent: "from-purple/20 to-pink/10 text-purple-bright",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  {
    title: "Export & sharing",
    description:
      "Export your collection data or share highlights with friends, buyers, and insurance agents. Your data stays portable.",
    accent: "from-gold/15 to-purple/10 text-gold-soft",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
      </svg>
    ),
  },
  {
    title: "Fast, clean interface",
    description:
      "A polished, distraction-free UI designed for collectors who want speed — not clutter. Every tap feels intentional.",
    accent: "from-pink/15 to-purple/10 text-pink-hot",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function Features() {
  return (
    <section id="features" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Features"
          title="Everything collectors need — nothing they don’t"
          subtitle="Multi-item scanning first — then real market values and tools that keep every collection organized, from starter shelves to serious portfolios."
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5"
        >
          {features.map((feature) => (
            <motion.article
              key={feature.title}
              variants={cardVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="group rounded-2xl border border-border-subtle bg-bg-card p-6 transition-colors duration-300 hover:border-border hover:bg-bg-card-hover"
            >
              <div
                className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${feature.accent}`}
              >
                {feature.icon}
              </div>
              <h3 className="text-base font-semibold text-text sm:text-lg">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">
                {feature.description}
              </p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
