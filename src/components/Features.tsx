"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import SectionHeading from "./SectionHeading";

/**
 * Feature cards — aligned to current Snap Collectibles iOS app capabilities.
 * Keep claims modest: research helpers, not appraisals or guarantees.
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
    title: "Category-first camera scan",
    description:
      "Choose what you’re scanning — figures, cards, stickers, comics, sneakers, games, and more — then point the camera. Category selection guides identification so mixed collections work without brand lock-in.",
    accent: "from-pink/20 to-pink/5 text-pink-hot",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <circle cx="12" cy="13" r="3" />
      </svg>
    ),
  },
  {
    title: "Sold comps & price helpers",
    description:
      "Research what similar items have sold for and check marketplace-style price helpers when available. Tools for your research — not a formal appraisal or guaranteed value.",
    accent: "from-purple/20 to-purple/5 text-purple-bright",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Collection inventory by category",
    description:
      "Keep everything in one place with list, grid, and My Shelf views. Filter by category, swipe left to delete, swipe right to start a trade with the item pre-filled — less typing, faster actions.",
    accent: "from-gold/20 to-gold/5 text-gold",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
  },
  {
    title: "My Shelf",
    description:
      "Show off a photo-only shelf view of what you own. Clean display for browsing your collection the way it looks on the wall — not just as rows of data.",
    accent: "from-pink/15 to-purple/10 text-pink-hot",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
      </svg>
    ),
  },
  {
    title: "Wishlist, selling & sold",
    description:
      "Track what you want next and what you’re ready to sell. Keep selling and sold status organized so inventory stays honest as pieces move on.",
    accent: "from-gold/15 to-purple/10 text-gold-soft",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
  },
  {
    title: "Trades & in-app chat",
    description:
      "Post trade offers, pick items from your inventory, browse the trade feed, open trade detail, and chat in-app. Set contact helpers (username / Facebook) so peers can connect. Trades are peer-to-peer between collectors.",
    accent: "from-purple/20 to-pink/10 text-purple-bright",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
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
          title="Built for how collectors actually collect"
          subtitle="Category-first scan and inventory, sold comps research, shelf display, and peer trades — without overpromising on values or deals."
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

        {/* Extra capabilities — short, scannable */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-10 rounded-2xl border border-border-subtle bg-bg-card/60 px-5 py-5 sm:px-7 sm:py-6"
        >
          <p className="text-sm font-semibold text-text">Also included</p>
          <ul className="mt-3 grid gap-2 text-sm text-text-muted sm:grid-cols-2">
            <li className="flex gap-2">
              <span className="text-purple-bright" aria-hidden="true">
                ·
              </span>
              Sign in with Apple for account access
            </li>
            <li className="flex gap-2">
              <span className="text-purple-bright" aria-hidden="true">
                ·
              </span>
              Cloud backup &amp; restore of your collection while signed in
            </li>
            <li className="flex gap-2">
              <span className="text-purple-bright" aria-hidden="true">
                ·
              </span>
              Contact setup for trades (username / Facebook helpers)
            </li>
            <li className="flex gap-2">
              <span className="text-purple-bright" aria-hidden="true">
                ·
              </span>
              More section with stats and trade history–style extras
            </li>
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
