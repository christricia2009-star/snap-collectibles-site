"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import SectionHeading from "./SectionHeading";

/**
 * Feature cards — aligned to Snap Collectibles B15 / v2.3 capabilities.
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
    title: "Smarter category scan",
    description:
      "Pick the category, snap a photo or barcode, then review before you save — rarity signals, packaging cues, live sold ranges, deal score, and coach Q&A so you decide with context.",
    accent: "from-pink/20 to-pink/5 text-pink-hot",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <circle cx="12" cy="13" r="3" />
      </svg>
    ),
  },
  {
    title: "Portfolio home",
    description:
      "See portfolio value with low / avg / high ranges, unrealized P/L, 7-day movers, health score, grails, favorites, goals, and activity — your vault at a glance, not a flat list.",
    accent: "from-gold/20 to-gold/5 text-gold",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22M2.25 18v-2.25A2.25 2.25 0 014.5 13.5h15A2.25 2.25 0 0121.75 15.75V18M2.25 18h19.5" />
      </svg>
    ),
  },
  {
    title: "Hunter Mode",
    description:
      "In-store deal radar: set a shelf price, snap or scan the peg, and get buy / pass style deal scores against sold comps — built for aisle decisions, not desk research later.",
    accent: "from-purple/20 to-purple/5 text-purple-bright",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        <circle cx="12" cy="12" r="2.5" />
      </svg>
    ),
  },
  {
    title: "Hunt sessions & walk-aways",
    description:
      "Track a store trip with edge reports, log passes with shelf prices, and grade walk-aways later against refreshed comps — close the loop competitors leave open.",
    accent: "from-pink/15 to-purple/10 text-pink-hot",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
  },
  {
    title: "Sold comps & pricing confidence",
    description:
      "Research sold comps and marketplace helpers with confidence bands, forecasts, defensive value for weaker data, and fee-aware flip math. Research tools — not appraisals or guarantees.",
    accent: "from-gold/15 to-purple/10 text-gold-soft",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Tools hub for the vault",
    description:
      "Search the vault, smart collections, goals, portfolio mix, compare items, offline hunt queue, series tracker, insurance inventory, exports, show/booth lists, and more — one Tools menu.",
    accent: "from-purple/20 to-pink/10 text-purple-bright",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
  },
  {
    title: "Collection, shelf & selling",
    description:
      "List, grid, and My Shelf views with category filters. Favorites, tags, wishlist, selling / sold with fees and P/L, plus where-to-list helpers and tax-friendly CSV export.",
    accent: "from-pink/20 to-gold/10 text-pink-hot",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
      </svg>
    ),
  },
  {
    title: "Trades, matches & fair equity",
    description:
      "Post offers, pick from inventory, browse the feed, chat in-app, surface trade matches, and check fair trade equity before you commit. Peer-to-peer — we don’t insure deals.",
    accent: "from-purple/15 to-gold/10 text-purple-bright",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
      </svg>
    ),
  },
  {
    title: "Vault DNA & Collector Academy",
    description:
      "See your hunter style and rarity bias, then learn field guides for tells, packaging, and comps strategy — short playbooks tied to how the app actually values pieces.",
    accent: "from-gold/20 to-pink/10 text-gold",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
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
          title="Built for how collectors actually hunt and hold"
          subtitle="From aisle decisions to portfolio health — scan review, deal scores, vault tools, and peer trades without overpromising on values or deals."
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
          <ul className="mt-3 grid gap-2 text-sm text-text-muted sm:grid-cols-2 lg:grid-cols-3">
            <li className="flex gap-2">
              <span className="text-purple-bright" aria-hidden="true">
                ·
              </span>
              Sign in with Apple · iCloud backup &amp; restore
            </li>
            <li className="flex gap-2">
              <span className="text-purple-bright" aria-hidden="true">
                ·
              </span>
              Check My Collection (photo, library, barcode, name)
            </li>
            <li className="flex gap-2">
              <span className="text-purple-bright" aria-hidden="true">
                ·
              </span>
              Duplicates &amp; identity merge · quiet price refresh
            </li>
            <li className="flex gap-2">
              <span className="text-purple-bright" aria-hidden="true">
                ·
              </span>
              Home Screen portfolio widgets snapshot
            </li>
            <li className="flex gap-2">
              <span className="text-purple-bright" aria-hidden="true">
                ·
              </span>
              Events, messages, app lock (Face ID), block / report
            </li>
            <li className="flex gap-2">
              <span className="text-purple-bright" aria-hidden="true">
                ·
              </span>
              Share shelf, print checklist, insurance inventory
            </li>
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
