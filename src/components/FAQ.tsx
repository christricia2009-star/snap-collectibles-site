"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import SectionHeading from "./SectionHeading";

/**
 * FAQ accordion — accurate to B15, privacy-minded, no overclaims.
 */

type FAQItem = {
  question: string;
  answer: string;
};

const faqs: FAQItem[] = [
  {
    question: "Is Snap Collectibles on the App Store?",
    answer:
      "Not yet — it’s coming to the App Store. While we’re preparing for public release, you can request early access by emailing Testing@snapcollectibles.com with your name, email, platform, and what you collect.",
  },
  {
    question: "Is this the same app as Collection Vault?",
    answer:
      "Yes. The same app you’ve seen in TestFlight or earlier testing is now publicly named Snap Collectibles. Features and branding on this site refer to that product (currently around the v2.3 build).",
  },
  {
    question: "How is Snap Collectibles different from ToyWorth or other scan apps?",
    answer:
      "ToyWorth-class apps excel at snap → estimate → save. Snap Collectibles does that loop, then runs a full vault: multi-signal scan review with sold comps and coach Q&A, Hunter Mode for shelf-price buy/pass, hunt sessions and walk-away ledger, portfolio P/L and movers, Check My Collection so you don’t rebuy, sell rails with fees and multi-marketplace drafts, and peer trades with chat and fair equity. Scan apps answer “what is this?” — Snap answers buy, hold, sell, trade, and “do I already own this?” Market values remain research estimates, not appraisals.",
  },
  {
    question: "What’s new compared with earlier betas?",
    answer:
      "Recent builds add a portfolio-first Home, scan review with rarity and deal scores, Hunter Mode for in-store buy/pass, hunt sessions and walk-away ledger, a full Tools hub (search, smart collections, goals, exports, and more), pricing confidence and fee-aware flip math, Vault DNA, fair trade equity, Collector Academy guides, quieter market refresh, mark-as-sold with fees and P/L, and portfolio widget snapshots.",
  },
  {
    question: "What is Hunter Mode?",
    answer:
      "Hunter Mode is an in-store deal radar. You set a shelf price, snap or scan the item, and get deal-score style buy/pass context against sold comps — meant for aisle decisions. Results are research helpers, not a guarantee you’ll profit.",
  },
  {
    question: "Where do prices and “values” come from?",
    answer:
      "Snap Collectibles offers sold comps, marketplace-style helpers, ranges with confidence context, and optional forecasts. Quiet refresh can update stale items when you open the app. These are research tools, not formal appraisals, and we do not guarantee values or sale prices.",
  },
  {
    question: "How does portfolio value work?",
    answer:
      "Home shows portfolio low / average / high ranges from comps when available, unrealized P/L versus what you paid, short-window movers, health-style signals, grails, and goals. It’s a living dashboard for your vault — still estimates, not insurance appraisals (there is a separate insurance inventory export for records).",
  },
  {
    question: "How do trades work?",
    answer:
      "Trades are peer-to-peer between collectors. You can post offers, pick an item from inventory, browse the trade feed, open trade detail, chat in-app, surface trade matches, and use fair equity / checklist helpers. Contact helpers (username / Facebook) are optional. Snap Collectibles does not insure trades or guarantee outcomes.",
  },
  {
    question: "What kinds of collectibles does it support?",
    answer:
      "Category-based, not tied to one brand — including figures, Loungefly, Pokémon, sports cards, comics, LEGO, Hot Wheels, video games, shoes, and more. Scan chooses a category so identification matches what you’re holding; Collection filters by category across list, grid, and My Shelf.",
  },
  {
    question: "Do I need Sign in with Apple?",
    answer:
      "Sign in with Apple is how you sign in for account features. Cloud backup and restore, trading, chat, and events require being signed in. You can still explore local collection tools offline; backup and social features need a signed-in account.",
  },
  {
    question: "Is my collection backed up in the cloud?",
    answer:
      "Yes — when you’re signed in, you can back up and restore your collection to iCloud. Auto-backup can run after local changes. You can also export JSON/CSV and import data. Home surfaces backup status so you’re less likely to lose a beta vault.",
  },
  {
    question: "Is early access free?",
    answer:
      "Early testing access is free while we’re in private testing. We won’t invent pricing here — anything for a public App Store release will be clear in the app or store listing before you’re charged.",
  },
];

function FAQRow({
  item,
  isOpen,
  onToggle,
}: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-border-subtle last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 py-5 text-left transition-colors hover:text-purple-bright"
        aria-expanded={isOpen}
      >
        <span className="text-base font-medium text-text sm:text-[17px]">
          {item.question}
        </span>
        <span
          className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-border bg-bg-card text-text-muted transition-transform duration-300 ${
            isOpen ? "rotate-45 text-purple-bright" : ""
          }`}
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
            <path strokeLinecap="round" d="M12 5v14M5 12h14" />
          </svg>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-5 pr-12 text-sm leading-relaxed text-text-muted sm:text-[15px]">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="FAQ"
          title="Questions, answered"
          subtitle="Straight answers about scan review, portfolio, Hunter Mode, pricing research, trades, and backup. Still stuck? Email Testing@snapcollectibles.com."
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-12 rounded-2xl border border-border-subtle bg-bg-card px-5 sm:px-7"
        >
          {faqs.map((item, i) => (
            <FAQRow
              key={item.question}
              item={item}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
