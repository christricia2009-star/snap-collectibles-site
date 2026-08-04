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
    title: "Smart Portfolio Dashboard",
    description:
      "See estimated market value, cost basis, and unrealized profit/loss in one glance. Your collection stops being a list — it becomes a portfolio.",
    accent: "from-gold/20 to-gold/5 text-gold",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
  {
    title: "Multi-marketplace price intelligence",
    description:
      "Sold comps first. eBay prioritized, then Amazon, StockX, TCGPlayer, and 130 Point — so values reflect what the market actually pays.",
    accent: "from-purple/20 to-purple/5 text-purple-bright",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "AI vision scanning",
    description:
      "Powerful camera + AI for Funko Pops and other collectibles. Scan shelves or single pieces — identify faster, catalog with less typing.",
    accent: "from-pink/20 to-pink/5 text-pink-hot",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <circle cx="12" cy="13" r="3" />
      </svg>
    ),
  },
  {
    title: "One-tap listing drafts",
    description:
      "Turn inventory into sell-ready drafts for eBay, Mercari, Whatnot, Depop, and Amazon. Less busywork between “I own it” and “it’s listed.”",
    accent: "from-purple/20 to-pink/10 text-purple-bright",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
      </svg>
    ),
  },
  {
    title: "CSV & JSON import/export",
    description:
      "Full data portability with automatic duplicate detection. Bring collections in cleanly. Export for backup, insurance, or spreadsheets.",
    accent: "from-gold/15 to-purple/10 text-gold-soft",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>
    ),
  },
  {
    title: "Bulk select & organize",
    description:
      "Select many items at once. Move to Selling or Wishlist. Delete in batch. Manage large collections without the endless one-by-one taps.",
    accent: "from-pink/15 to-purple/10 text-pink-hot",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Fast search & category filters",
    description:
      "Find any piece instantly. Filter by category, list, and more — so shelves of hundreds stay as usable as a starter collection.",
    accent: "from-purple/20 to-purple/5 text-purple-bright",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
    ),
  },
  {
    title: "Local photos + stock enrichment",
    description:
      "Your photos stay on-device. Automatic stock image enrichment fills gaps so every item looks complete — without cloud lock-in.",
    accent: "from-gold/20 to-gold/5 text-gold",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
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
          title="Built for collectors who mean business"
          subtitle="Portfolio intelligence, real market prices, AI scanning, and sell-ready tools — on both iOS and Android. Not another barcode notepad."
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5"
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
