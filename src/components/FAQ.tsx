"use client";

import { useState } from "react";
import { ANDROID_TEST_URL, TESTING_EMAIL } from "@/lib/testing";

type FAQItem = {
  question: string;
  answer: string;
};

const faqs: FAQItem[] = [
  {
    question: "Is Snap Collectibles on the App Store?",
    answer:
      "Not yet — iOS and Android are both in beta. Request a tester slot on this page. We take App name, phone OS, and your email. Nothing else.",
  },
  {
    question: "How does Android testing work?",
    answer: `Google Play does not auto-email testers. After you submit an Android request, this page shows the internal test URL. Copy and keep it. The URL is ${ANDROID_TEST_URL} — it becomes active once your email is added to the tester list. Please allow up to a few hours.`,
  },
  {
    question: "Is this the same app as Collection Vault?",
    answer:
      "Yes. The same app you’ve seen in TestFlight or earlier testing is now publicly named Snap Collectibles. Features and branding on this site refer to that product (currently around the v2.3 build).",
  },
  {
    question: "How is Snap Collectibles different from ToyWorth or other scan apps?",
    answer:
      "ToyWorth-class apps excel at snap → estimate → save. Snap Collectibles does that loop, then runs a full vault: multi-signal scan review, Hunter Mode for shelf-price buy/pass, hunt sessions, portfolio P/L, Check My Collection, sell rails, and peer trades. Scan apps answer “what is this?” — Snap answers buy, hold, sell, trade, and “do I already own this?” Market values remain research estimates, not appraisals.",
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
    question: "How do trades work?",
    answer:
      "Trades are peer-to-peer between collectors. You can post offers, pick an item from inventory, browse the trade feed, chat in-app, surface trade matches, and use fair equity / checklist helpers. Snap Collectibles does not insure trades or guarantee outcomes.",
  },
  {
    question: "What kinds of collectibles does it support?",
    answer:
      "Category-based, not tied to one brand — including figures, Loungefly, Pokémon, sports cards, comics, LEGO, Hot Wheels, video games, shoes, and more.",
  },
  {
    question: "Do I need Sign in with Apple?",
    answer:
      "Sign in with Apple is how you sign in for account features. Cloud backup and restore, trading, chat, and events require being signed in. You can still explore local collection tools offline.",
  },
  {
    question: "Is early access free?",
    answer:
      "Early testing access is free while we’re in private testing. Anything for a public store release will be clear in the app or store listing before you’re charged.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="section" id="faq">
      <div className="wrap wrap-narrow" style={{ width: "min(760px, calc(100% - 40px))" }}>
        <div className="section-head">
          <p className="kicker">FAQ</p>
          <h2 className="display">Questions, answered.</h2>
          <p className="lede muted">
            Straight answers about scan review, portfolio, Hunter Mode, Android
            testing, and backup. Still stuck? Email {TESTING_EMAIL}.
          </p>
        </div>
        <div className="faq-list">
          {faqs.map((item, i) => {
            const open = openIndex === i;
            return (
              <div className={`faq-item${open ? " is-open" : ""}`} key={item.question}>
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => setOpenIndex(open ? null : i)}
                >
                  <span>{item.question}</span>
                  <span className="plus" aria-hidden="true">
                    +
                  </span>
                </button>
                <p className="faq-a">{item.answer}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
