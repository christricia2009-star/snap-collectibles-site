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
    question: "Is Snap Collectibles available on the App Store?",
    answer:
      "Not yet — the app is currently in private TestFlight testing. Email Testing@snapcollectibles.com with your name, email, and a short note about what you collect (e.g. Funko, sports cards). We’ll send a free invite when spots are available.",
  },
  {
    question: "What kinds of collectibles does Snap Collectibles support?",
    answer:
      "Snap Collectibles is built for a wide range of physical collectibles — trading cards, figures, sneakers, comics, memorabilia, and more. If it has a barcode or a clear photo, you can add it. Support expands as we grow the catalog.",
  },
  {
    question: "How do market valuations work?",
    answer:
      "We analyze recent eBay sold listings (comps) for similar items so you see what the market is actually paying — not just asking prices. Values update as new sales data comes in, helping you stay current.",
  },
  {
    question: "Can it handle large collections?",
    answer:
      "Yes. The app is designed for collectors with hundreds or thousands of items. Search, tags, and filters stay fast so you can find anything quickly without spreadsheet chaos.",
  },
  {
    question: "Is my collection data private?",
    answer:
      "Your collection is yours. We take privacy seriously and only use data to provide the product experience (identification, valuation, sync). See our Privacy Policy for full details.",
  },
  {
    question: "Is the beta free?",
    answer:
      "Yes. TestFlight access is free while we’re in testing. Pricing for the public App Store release will be clear in-app before anything is charged.",
  },
  {
    question: "Which devices are supported?",
    answer:
      "Snap Collectibles is built for iPhone (iOS). A camera is recommended for scanning, but you can also add items manually. We’ll share OS requirements with your TestFlight invite.",
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
          subtitle="Everything you need to know about the beta. Still stuck? Email Testing@snapcollectibles.com or support."
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
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
