"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import SectionHeading from "./SectionHeading";

/**
 * FAQ accordion.
 * Edit the faqs array to update questions and answers.
 */

type FAQItem = {
  question: string;
  answer: string;
};

const faqs: FAQItem[] = [
  {
    question: "Is Snap Collectibles on the App Store or Google Play?",
    answer:
      "Not yet — both the iOS and Android apps are currently in private testing. Email Testing@snapcollectibles.com with your name, email, platform (iOS or Android), and a short note about what you collect. We’ll send a free invite when spots are available.",
  },
  {
    question: "Does it work the same on iOS and Android?",
    answer:
      "Yes. Snap Collectibles is built for both platforms with the same core experience: portfolio dashboard, multi-marketplace pricing, AI scanning, bulk tools, import/export, and listing drafts. Use the platform switcher on this page to preview screens for each.",
  },
  {
    question: "How does the portfolio dashboard work?",
    answer:
      "Your dashboard shows estimated market value, cost basis, and unrealized profit/loss across your collection. It’s designed so you always know where you stand — not just how many items you own.",
  },
  {
    question: "Where do market valuations come from?",
    answer:
      "We use multi-marketplace price intelligence. eBay sold comps are prioritized first, then Amazon, StockX, TCGPlayer, and 130 Point — so values track what buyers actually pay, not inflated asking prices.",
  },
  {
    question: "Can I scan collectibles with the camera?",
    answer:
      "Yes. Snap Collectibles uses powerful camera + AI vision scanning for Funko Pops and other collectibles. Identify pieces faster and build your catalog with less manual typing.",
  },
  {
    question: "Can I list items to marketplaces from the app?",
    answer:
      "You can create one-tap listing drafts for eBay, Mercari, Whatnot, Depop, and Amazon — so moving from inventory to “ready to sell” takes far less busywork.",
  },
  {
    question: "Can I import or export my collection?",
    answer:
      "Yes. Full CSV and JSON import/export is supported, with automatic duplicate detection on import. Your data stays portable for backup, insurance, or spreadsheets.",
  },
  {
    question: "Is my collection data private?",
    answer:
      "Your collection is yours. Photos store locally on your device, with automatic stock image enrichment when helpful. We take privacy seriously and only use data to provide the product experience. See our Privacy Policy for full details.",
  },
  {
    question: "Is the beta free?",
    answer:
      "Yes. Beta access is free while we’re in testing on iOS and Android. Pricing for public store releases will be clear in-app before anything is charged.",
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
          subtitle="Everything you need to know about the iOS & Android beta. Still stuck? Email Testing@snapcollectibles.com or support."
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
