"use client";

import { motion } from "motion/react";
import SectionHeading from "./SectionHeading";

/**
 * Competitive positioning — Snap Collectibles vs ToyWorth-style scan apps
 * and generic collection trackers. Claims map to shipping B15 / v2.3 features.
 * Do not invent guarantees or fake competitor limitations beyond public positioning.
 */

type Moat = {
  title: string;
  punch: string;
  body: string;
  accent: string;
};

const moats: Moat[] = [
  {
    title: "Scan isn’t the finish line",
    punch: "Review → rarity → sold ranges → deal score → coach",
    body: "ToyWorth-style apps market snap-and-value. We treat the post-scan screen as a command center: multi-signal rarity, packaging, live sold comps, deal score, and Collector Coach Q&A — before the piece ever hits your vault.",
    accent: "from-pink/25 to-pink/5 border-pink/30",
  },
  {
    title: "Built for the aisle, not just the desk",
    punch: "Hunter Mode · hunt sessions · walk-away ledger",
    body: "Set a shelf price, snap or scan, get buy/pass-style edge in seconds. Track whole store trips, then grade the passes you walked away from later. Most scan apps never close that loop.",
    accent: "from-purple/25 to-purple/5 border-purple/30",
  },
  {
    title: "A real portfolio — not a photo dump",
    punch: "Ranges · P/L · 7d movers · health · grails · widgets",
    body: "Home is a vault dashboard: low/avg/high ranges, what you paid vs market, short-window movers, grails, goals, and portfolio snapshots. Scan apps that only list “what you own” can’t run your collection like a book.",
    accent: "from-gold/25 to-gold/5 border-gold/30",
  },
  {
    title: "Move product — sell, list, and trade",
    punch: "Fees & P/L · multi-marketplace drafts · in-app trades",
    body: "Mark sold with fees, tax-friendly CSV, where-to-list helpers, and a trade board with chat, matches, and fair equity checks. Scan-and-list apps stop when you save the photo. We help you actually move inventory.",
    accent: "from-purple/20 to-pink/15 border-purple/25",
  },
];

type Row = {
  capability: string;
  others: string;
  snap: string;
};

/** Column: ToyWorth-class scanners + generic trackers vs Snap */
const rows: Row[] = [
  {
    capability: "After you scan",
    others: "ID + a value estimate, then save",
    snap: "Full review: rarity signals, packaging, sold ranges, deal score, coach Q&A",
  },
  {
    capability: "Market data",
    others: "One estimated range (often opaque)",
    snap: "Sold comps you can re-check, multi-market stack, confidence & fee-aware flip math",
  },
  {
    capability: "In-store hunting",
    others: "Scan later at home if you remember",
    snap: "Hunter Mode: shelf price → Strong Buy / Buy / Hold / Pass with edge %",
  },
  {
    capability: "Hunt memory",
    others: "Notes app or nothing",
    snap: "Hunt sessions + trip edge reports + walk-away ledger that grades your passes",
  },
  {
    capability: "Portfolio",
    others: "A list (maybe a sum)",
    snap: "Live ranges, unrealized P/L, movers, health, grails, goals, Home Screen widgets",
  },
  {
    capability: "Avoid rebuying",
    others: "Hope you remember what you own",
    snap: "Check My Collection by photo, library, barcode, or name + duplicate warnings on snap",
  },
  {
    capability: "Selling",
    others: "You’re on your own after the scan",
    snap: "Listed/sold with fees & P/L, list drafts (eBay, Mercari, Whatnot, Depop), tax CSV",
  },
  {
    capability: "Trading",
    others: "Facebook groups and DMs",
    snap: "Trade board, inventory pick, in-app chat, matches, fair equity & checklist",
  },
  {
    capability: "Vault tools",
    others: "Basic collection list",
    snap: "Tools hub: search, smart collections, compare, series tracker, show mode, exports, insurance inventory",
  },
  {
    capability: "Learn while you collect",
    others: "Generic tips if any",
    snap: "Collector Academy playbooks (TH/STH, chase, comps, packaging) tied to the same engines",
  },
  {
    capability: "Your data",
    others: "Device-only or unclear",
    snap: "Sign in with Apple · iCloud backup & restore · JSON/CSV import & export",
  },
];

export default function WhyUs() {
  return (
    <section id="why-us" className="relative py-20 sm:py-28">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-gold/5 to-transparent"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Why we’re better"
          title={
            <>
              Why Snap beats{" "}
              <span className="text-gradient">ToyWorth</span> and every
              scan-and-forget app
            </>
          }
          subtitle="Scan apps identify toys. Trackers store lists. Snap Collectibles is a vault OS — identify with real sold comps, hunt at the pegs, run portfolio health, then sell and trade. Built for collectors who move product, not just take photos."
        />

        {/* Direct competitive framing */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-10 rounded-2xl border border-gold/25 bg-gradient-to-br from-gold/10 via-bg-card to-purple/10 px-5 py-5 sm:px-7 sm:py-6"
        >
          <p className="text-sm font-semibold text-gold-soft sm:text-base">
            The honest difference
          </p>
          <p className="mt-2 text-sm leading-relaxed text-text-muted sm:text-[15px]">
            <strong className="text-text">ToyWorth</strong> and similar apps are
            strong at{" "}
            <em className="text-text-muted not-italic">
              snap → estimate → save
            </em>
            . That’s table stakes. Snap Collectibles ships the same loop — then
            keeps going: multi-signal scan review, aisle-ready Hunter Mode, a
            portfolio that tracks P/L over time, full sell/trade rails, and tools
            so you never rebuy a duplicate at a con. If you only need a photo
            album with a price tag, any scanner works. If you{" "}
            <strong className="text-text">run a vault</strong>, you need Snap.
          </p>
        </motion.div>

        {/* Moat pillars */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {moats.map((m, i) => (
            <motion.article
              key={m.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className={`rounded-2xl border bg-gradient-to-br p-6 ${m.accent}`}
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-text-dim">
                {m.punch}
              </p>
              <h3 className="mt-2 text-lg font-semibold text-text">{m.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">
                {m.body}
              </p>
            </motion.article>
          ))}
        </div>

        {/* Comparison table */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mt-14"
        >
          <h3 className="mb-2 text-center text-lg font-semibold text-text sm:text-xl">
            Head-to-head: scanners &amp; trackers vs Snap
          </h3>
          <p className="mb-8 text-center text-sm text-text-muted">
            ToyWorth-class apps + typical collection trackers · vs · Snap
            Collectibles (B15 / v2.3)
          </p>

          <div className="hidden overflow-hidden rounded-2xl border border-border-subtle bg-bg-card md:block">
            <div className="grid grid-cols-3 border-b border-border-subtle bg-bg-elevated px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-muted">
              <span>Capability</span>
              <span>ToyWorth &amp; typical apps</span>
              <span className="text-purple-bright">Snap Collectibles</span>
            </div>
            {rows.map((row, i) => (
              <div
                key={row.capability}
                className={`grid grid-cols-3 gap-4 px-6 py-4 text-sm ${
                  i % 2 === 1 ? "bg-bg-elevated/40" : ""
                } ${i < rows.length - 1 ? "border-b border-border-subtle" : ""}`}
              >
                <span className="font-medium text-text">{row.capability}</span>
                <span className="text-text-muted">{row.others}</span>
                <span className="font-medium text-text">{row.snap}</span>
              </div>
            ))}
          </div>

          {/* Mobile stacked cards */}
          <div className="space-y-3 md:hidden">
            {rows.map((row, i) => (
              <motion.article
                key={row.capability}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.03 }}
                className="rounded-2xl border border-border-subtle bg-bg-card p-5"
              >
                <h4 className="text-sm font-semibold text-text">
                  {row.capability}
                </h4>
                <div className="mt-3 space-y-2 text-sm">
                  <p className="text-text-muted">
                    <span className="text-xs font-medium uppercase tracking-wide text-text-dim">
                      Others ·{" "}
                    </span>
                    {row.others}
                  </p>
                  <p className="text-text">
                    <span className="text-xs font-medium uppercase tracking-wide text-purple-bright">
                      Snap ·{" "}
                    </span>
                    {row.snap}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.div>

        {/* Bottom line CTA strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-12 rounded-2xl border border-border bg-bg-elevated px-5 py-6 text-center sm:px-8"
        >
          <p className="text-base font-semibold text-text sm:text-lg">
            Scan apps answer “what is this?”
          </p>
          <p className="mt-2 text-sm leading-relaxed text-text-muted sm:text-[15px]">
            Snap Collectibles answers{" "}
            <strong className="text-text">
              “should I buy it, what is my vault worth, how do I sell or trade
              it, and did I already own this?”
            </strong>{" "}
            — with sold comps as research tools, not appraisals, and peer trades
            we don’t insure.
          </p>
          <a
            href="#download"
            className="mt-5 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-purple to-pink px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple/25 transition hover:opacity-95"
          >
            Request early access
          </a>
        </motion.div>
      </div>
    </section>
  );
}
