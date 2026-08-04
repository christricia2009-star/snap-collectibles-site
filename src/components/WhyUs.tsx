"use client";

import { motion } from "motion/react";
import SectionHeading from "./SectionHeading";

/**
 * Comparison section — Snap Collectibles vs typical collectibles trackers.
 */

type Row = {
  capability: string;
  typical: string;
  snap: string;
};

const rows: Row[] = [
  {
    capability: "Portfolio view",
    typical: "Item count and a rough sum",
    snap: "Market value, cost basis & unrealized P/L",
  },
  {
    capability: "Pricing",
    typical: "Manual entry or a single estimate",
    snap: "eBay sold first, then Amazon, StockX, TCGPlayer, 130 Point",
  },
  {
    capability: "Scanning",
    typical: "Barcode only or one AI guess",
    snap: "Camera + AI vision for Funko & more",
  },
  {
    capability: "Selling",
    typical: "Copy-paste into marketplaces",
    snap: "One-tap drafts for eBay, Mercari, Whatnot, Depop, Amazon",
  },
  {
    capability: "Data control",
    typical: "Basic CSV or locked in-app",
    snap: "Full CSV & JSON import/export + duplicate detection",
  },
  {
    capability: "Scale",
    typical: "One item at a time",
    snap: "Bulk select, move to Selling/Wishlist, delete",
  },
  {
    capability: "Photos",
    typical: "Cloud-only or blank placeholders",
    snap: "Local storage + automatic stock image enrichment",
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
          eyebrow="Why Snap Collectibles"
          title="More than a collectibles tracker"
          subtitle="Typical apps stop at inventory. Snap Collectibles is built to value, organize, and sell — with the same power on iOS and Android."
        />

        {/* Desktop / tablet table */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mt-14 hidden overflow-hidden rounded-2xl border border-border-subtle bg-bg-card md:block"
        >
          <div className="grid grid-cols-3 border-b border-border-subtle bg-bg-elevated px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-muted">
            <span>Capability</span>
            <span>Typical trackers</span>
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
              <span className="text-text-muted">{row.typical}</span>
              <span className="font-medium text-text">{row.snap}</span>
            </div>
          ))}
        </motion.div>

        {/* Mobile stacked cards */}
        <div className="mt-12 space-y-3 md:hidden">
          {rows.map((row, i) => (
            <motion.article
              key={row.capability}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              className="rounded-2xl border border-border-subtle bg-bg-card p-5"
            >
              <h3 className="text-sm font-semibold text-text">{row.capability}</h3>
              <div className="mt-3 space-y-2 text-sm">
                <p className="text-text-muted">
                  <span className="text-xs font-medium uppercase tracking-wide text-text-dim">
                    Typical ·{" "}
                  </span>
                  {row.typical}
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
      </div>
    </section>
  );
}
