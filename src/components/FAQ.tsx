"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import SectionHeading from "./SectionHeading";

/**
 * FAQ accordion — accurate, privacy-minded, no overclaims.
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
      "Yes. The same app you’ve seen in TestFlight or earlier testing is now publicly named Snap Collectibles. Features and branding on this site refer to that product.",
  },
  {
    question: "Do I need Sign in with Apple?",
    answer:
      "Sign in with Apple is how you sign in for account features. Cloud backup and restore of your collection require being signed in. You can still explore local collection tools depending on the screen — backup needs a signed-in account.",
  },
  {
    question: "Where do prices and “values” come from?",
    answer:
      "Snap Collectibles offers sold comps and marketplace-style price helpers to support your research — for example eBay-style sold comps and other marketplace price info when available. These are research tools, not formal appraisals, and we do not guarantee values or sale prices.",
  },
  {
    question: "How do trades work?",
    answer:
      "Trades are peer-to-peer between collectors. You can post offers, pick an item from your inventory so less typing is needed, browse the trade feed, open trade detail, and chat in-app. You can also set contact helpers (username / Facebook) so other collectors know how to reach you. Snap Collectibles does not insure trades or guarantee outcomes between users.",
  },
  {
    question: "What can I do with my collection in the app?",
    answer:
      "Maintain personal inventory in list and grid views, display pieces on My Shelf (photo-only), keep a wishlist, and track selling / sold status. Swipe left on collection items to delete; swipe right to start a trade with that item pre-filled.",
  },
  {
    question: "Is my collection backed up in the cloud?",
    answer:
      "Yes — when you’re signed in, you can back up and restore your collection to the cloud. Sign-in is required for cloud backup. Camera and photo access is used for identification and collection photos you choose to add.",
  },
  {
    question: "How does Snap Collectibles use my camera and photos?",
    answer:
      "Camera and photos are used to help identify collectibles and to support your collection and shelf views. Trades use Sign in with Apple plus any optional contact info you choose to provide. See our Privacy Policy for full details.",
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
          subtitle="Straight answers about scanning, pricing research, trades, and backup. Still stuck? Email Testing@snapcollectibles.com."
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
